import { useEffect, useRef } from "react";
import Editor from "./Editor";
import SplitPanel from "./SplitPanel";
import LogsContainer from "./LogsContainer";
import { files } from "./nodeFiles";
import getDeps from "./utils/getDeps";
import { setAppState, useAppState } from "./store";
import { WebContainer, WebContainerProcess } from "@webcontainer/api";
import { NODE_INDEX_FILE, WC_STATUS } from "./constants";
import { sleep } from "@opentf/std";
import { IDisposable } from "xterm";
import { merge } from "@opentf/std";
import { Options, Props } from "./types";

export default function NodeREPL(props: Props) {
  const dispOjbRef = useRef<IDisposable | null>(null);
  const runProcessRef = useRef<WebContainerProcess | null>(null);
  const { webContainer, wcStatus, wcSetup, terminalRef, shellProcessRef } =
    useAppState((s) => s);
  const defaultOptions: Options = {
    deps: [],
    code: "",
    setupCode: "",
    style: {},
    layout: "DEFAULT",
    editor: { darkMode: false, header: true, style: {} },
    terminal: { show: true, style: {} },
    console: { show: true, style: {} },
  };
  const options = merge({}, defaultOptions, props) as Options;

  const bootWC = async () => {
    setAppState({ wcStatus: WC_STATUS.BOOTING });
    const webContainer = await WebContainer.boot();
    setAppState({
      webContainer: webContainer,
      wcStatus: WC_STATUS.STARTED,
    });
  };

  useEffect(() => {
    if (wcStatus === WC_STATUS.UNKNOWN) {
      bootWC();
    }
  }, []);

  useEffect(() => {
    if (wcStatus === WC_STATUS.READY && wcSetup) {
      mountFiles();
      setAppState({ logs: [] });
    }
  }, []);

  useEffect(() => {
    return () => {
      if (shellProcessRef) {
        shellProcessRef.kill();
        dispOjbRef.current?.dispose();
        dispOjbRef.current = null;
        setAppState({ shellProcessRef: null, terminalRef: null });
      }
    };
  }, []);

  useEffect(() => {
    if (wcStatus === WC_STATUS.STARTED && !wcSetup) {
      installPkgs();
    }
  }, [wcStatus, wcSetup]);

  useEffect(() => {
    if (
      wcSetup &&
      wcStatus === WC_STATUS.READY &&
      shellProcessRef === null &&
      terminalRef
    ) {
      if (dispOjbRef.current) {
        dispOjbRef.current.dispose();
        dispOjbRef.current = null;
      }
      startShell();
    }
  }, [wcStatus, wcSetup, shellProcessRef, terminalRef]);

  async function startShell() {
    if (!terminalRef || !webContainer) {
      return;
    }

    const shellProcessRef = (await webContainer.spawn("jsh", {
      terminal: {
        cols: terminalRef.cols,
        rows: terminalRef.rows,
      },
    })) as WebContainerProcess;

    shellProcessRef.output.pipeTo(
      new WritableStream({
        write(data) {
          terminalRef.write(data);
        },
      })
    );

    setAppState({ shellProcessRef });

    const input = shellProcessRef?.input.getWriter();
    dispOjbRef.current = terminalRef.onData((data) => {
      input?.write(data);
    });
  }

  const mountFiles = async () => {
    setAppState({ wcStatus: WC_STATUS.MOUNTING_FILES });
    files["setup.js"].file.contents = options.setupCode;
    files["main.js"].file.contents = options.code;
    const pkgFile = JSON.parse(files["package.json"].file.contents);
    pkgFile.dependencies = getDeps(options.deps);
    files["package.json"].file.contents = JSON.stringify(pkgFile);
    if (webContainer) {
      await webContainer.mount(files);
      setAppState({ wcStatus: WC_STATUS.READY });
      await sleep(100);
    }
  };

  const installPkgs = async () => {
    await mountFiles();
    setAppState({ wcStatus: WC_STATUS.INSTALLING });
    await runCmd("npm", ["install"], false);
    setAppState({ wcStatus: WC_STATUS.READY, wcSetup: true });
  };

  const runCmd = async (prog: string, args: string[], output = true) => {
    if (shellProcessRef) {
      shellProcessRef?.kill();
      setAppState({ shellProcessRef: null });
      dispOjbRef.current?.dispose();
      dispOjbRef.current = null;
    }

    if (terminalRef) {
      terminalRef.writeln("");
    }

    if (webContainer) {
      runProcessRef.current = await webContainer.spawn(prog, [...args], {
        output,
      });
      runProcessRef.current.output.pipeTo(
        new WritableStream({
          write(data) {
            if (terminalRef) {
              terminalRef.write(data);
            }
            setAppState((s) => {
              s.logs.push(data);
            });
          },
        })
      );

      let disposeObj;
      if (terminalRef) {
        const input = runProcessRef?.current.input.getWriter();
        disposeObj = terminalRef.onData((data) => {
          input?.write(data);
        });
      }

      await runProcessRef.current.exit;
      terminalRef?.writeln("");
      runProcessRef.current = null;
      disposeObj?.dispose();
    }
  };

  const handleStop = async () => {
    runProcessRef.current?.kill();
  };

  async function writeFile(path: string, content: string) {
    if (webContainer) {
      await webContainer.fs.writeFile(path, content);
    }
  }

  const handleRun = async () => {
    if (wcSetup && wcStatus === WC_STATUS.READY) {
      setAppState({ wcStatus: WC_STATUS.RUNNING });
      await runCmd("node", [NODE_INDEX_FILE]);
      setAppState({ wcStatus: WC_STATUS.READY });
    }
  };

  const handleClear = () => {
    if (terminalRef) {
      terminalRef.clear();
    }
    setAppState({ logs: [] });
  };

  const renderDefaultLayout = () => {
    return (
      <div style={{ display: "flex", flexDirection: "column" }}>
        <Editor
          doc={options.code}
          editorProps={options.editor}
          writeFile={writeFile}
          onRun={handleRun}
          style={options.editor.style}
        />
        <LogsContainer
          consoleProps={options.console}
          terminalProps={options.terminal}
          onStop={handleStop}
          onRun={handleRun}
          onClear={handleClear}
        />
      </div>
    );
  };

  const renderSplitLayout = () => {
    return (
      <SplitPanel
        left={
          <Editor
            doc={options.code}
            editorProps={options.editor}
            writeFile={writeFile}
            onRun={handleRun}
            style={options.editor.style}
          />
        }
        right={
          <LogsContainer
            consoleProps={options.console}
            terminalProps={options.terminal}
            onStop={handleStop}
            onRun={handleRun}
            onClear={handleClear}
          />
        }
      />
    );
  };

  return (
    <div style={options.style}>
      {options.layout === "DEFAULT"
        ? renderDefaultLayout()
        : renderSplitLayout()}
    </div>
  );
}
