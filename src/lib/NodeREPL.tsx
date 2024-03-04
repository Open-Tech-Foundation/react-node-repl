import { useEffect, useRef } from "react";
import Editor from "./Editor";
import SplitPanel from "./SplitPanel";
import LogsContainer from "./LogsContainer";
import { files } from "./nodeFiles";
import getDeps from "./utils/getDeps";
import { setAppState, useAppState } from "./store";
import { WebContainer, WebContainerProcess } from "@webcontainer/api";
import { NODE_INDEX_FILE, WC_STATUS } from "./constants";
import { sleep } from "@opentf/utils";
import { IDisposable } from "xterm";
import merge from "lodash.merge";
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
      webContainer: { current: webContainer },
      wcStatus: WC_STATUS.STARTED,
    });
  };

  useEffect(() => {
    if (wcStatus === WC_STATUS.UNKNOWN) {
      bootWC();
    }
  }, []);

  useEffect(() => {
    return () => {
      if (shellProcessRef?.current) {
        shellProcessRef?.current.kill();
        shellProcessRef.current = null;
        dispOjbRef.current?.dispose();
        dispOjbRef.current = null;
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
      shellProcessRef.current === null &&
      terminalRef.current
    ) {
      startShell();
    }
  }, [wcStatus, wcSetup, shellProcessRef.current, terminalRef.current]);

  async function startShell() {
    if (!terminalRef.current) {
      return;
    }

    shellProcessRef.current = (await webContainer.current?.spawn("jsh", {
      terminal: {
        cols: terminalRef.current.cols,
        rows: terminalRef.current.rows,
      },
    })) as WebContainerProcess;
    shellProcessRef.current?.output.pipeTo(
      new WritableStream({
        write(data) {
          terminalRef.current?.write(data);
        },
      })
    );

    const input = shellProcessRef?.current.input.getWriter();
    dispOjbRef.current = terminalRef.current?.onData((data) => {
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
    if (webContainer.current) {
      await webContainer.current.mount(files);
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
    if (shellProcessRef?.current) {
      shellProcessRef?.current.kill();
      shellProcessRef.current = null;
      dispOjbRef.current?.dispose();
      dispOjbRef.current = null;
    }

    terminalRef.current?.writeln("");

    if (webContainer.current && terminalRef) {
      runProcessRef.current = await webContainer.current.spawn(
        prog,
        [...args],
        { output }
      );
      runProcessRef.current.output.pipeTo(
        new WritableStream({
          write(data) {
            terminalRef.current?.write(data);
            setAppState((s) => ({ logs: [...s.logs, data] }));
          },
        })
      );

      const input = runProcessRef?.current.input.getWriter();
      const disposeObj = terminalRef.current?.onData((data) => {
        input?.write(data);
      });

      await runProcessRef.current.exit;
      terminalRef.current?.writeln("");
      runProcessRef.current = null;
      disposeObj?.dispose();
    }
  };

  const handleStop = async () => {
    runProcessRef.current?.kill();
  };

  async function writeFile(path: string, content: string) {
    if (webContainer.current) {
      await webContainer.current.fs.writeFile(path, content);
    }
  }

  const handleRun = async () => {
    if (wcSetup && wcStatus === WC_STATUS.READY) {
      setAppState((s) => ({ ...s, wcStatus: WC_STATUS.RUNNING }));
      await runCmd("node", [NODE_INDEX_FILE]);
      setAppState((s) => ({ ...s, wcStatus: WC_STATUS.READY }));
    }
  };

  const handleClear = () => {
    if (terminalRef) {
      terminalRef.current?.clear();
    }
    setAppState({ logs: [] });
  };

  const renderDefaultLayout = () => {
    return (
      <div style={{ display: "flex", flexDirection: "column" }}>
        <Editor
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
