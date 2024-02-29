import { CSSProperties, useEffect, useRef } from "react";
import Editor from "./Editor";
import SplitPanel from "./SplitPanel";
import LogsContainer from "./LogsContainer";
import { files } from "./nodeFiles";
import getDeps from "./utils/getDeps";
import { setAppState, useAppState } from "./store";
import { WebContainerProcess } from "@webcontainer/api";
import { NODE_INDEX_FILE, WC_STATUS } from "./constants";
import { sleep } from "@opentf/utils";

export type Props = {
  code?: string;
  deps?: string[];
  setupCode?: string;
  layout?: "DEFAULT" | "SPLIT_PANEL";
  style?: CSSProperties;
};

export default function NodeREPL({
  deps,
  code,
  setupCode,
  style,
  layout,
}: Props) {
  const runProcessRef = useRef<WebContainerProcess | null>(null);
  const { webContainer, wcStatus, wcSetup, terminalRef, editorRef } =
    useAppState((s) => s);
  const options = {
    layout: layout ?? "DEFAULT",
  };

  useEffect(() => {
    if (wcStatus === WC_STATUS.STARTED && !wcSetup) {
      installPkgs();
    }
  }, [wcStatus, wcSetup]);

  const installPkgs = async () => {
    setAppState({ wcStatus: WC_STATUS.MOUNTING_FILES });
    files["setup.js"].file.contents = setupCode || "";
    files["main.js"].file.contents = code || "";
    if (deps) {
      const pkgFile = JSON.parse(files["package.json"].file.contents);
      pkgFile.dependencies = getDeps(deps);
      files["package.json"].file.contents = JSON.stringify(pkgFile);
    }
    if (webContainer.current) {
      await webContainer.current.mount(files);
      setAppState({ wcStatus: WC_STATUS.READY });
      await sleep(100);
    }
    setAppState({ wcStatus: WC_STATUS.INSTALLING });
    await runCmd("npm", ["install"]);
    setAppState({ wcStatus: WC_STATUS.READY, wcSetup: true });
  };

  const runCmd = async (prog: string, args: string[]) => {
    terminalRef.current?.writeln("");

    if (webContainer.current && terminalRef) {
      runProcessRef.current = await webContainer.current.spawn(prog, [...args]);
      runProcessRef.current.output.pipeTo(
        new WritableStream({
          write(data) {
            terminalRef.current?.write(data);
            setAppState((s) => ({ logs: [...s.logs, data] }));
          },
        })
      );

      await runProcessRef.current.exit;
      terminalRef.current?.writeln("");
      terminalRef.current?.write("$ ");
      runProcessRef.current = null;
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
    if (editorRef.current && webContainer.current) {
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
        <Editor writeFile={writeFile} onRun={handleRun} />
        <LogsContainer
          onStop={handleStop}
          onRun={handleRun}
          onClear={handleClear}
          runCmd={runCmd}
        />
      </div>
    );
  };

  const renderSplitLayout = () => {
    return (
      <SplitPanel
        left={<Editor writeFile={writeFile} onRun={handleRun} />}
        right={
          <LogsContainer
            onStop={handleStop}
            onRun={handleRun}
            onClear={handleClear}
            runCmd={runCmd}
          />
        }
      />
    );
  };

  return (
    <div style={style}>
      {options.layout === "DEFAULT"
        ? renderDefaultLayout()
        : renderSplitLayout()}
    </div>
  );
}
