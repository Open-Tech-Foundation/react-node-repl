import { CSSProperties, useEffect, useRef } from "react";
import Editor from "./Editor";
import SplitPanel from "./SplitPanel";
import LogsContainer from "./LogsContainer";
import { files } from "./nodeFiles";
import getDeps from "./utils/getDeps";
import { setAppState, useAppState } from "./store";
import { WebContainerProcess } from "@webcontainer/api";
import { NODE_INDEX_FILE, NODE_MAIN_FILE, WC_STATUS } from "./constants";
import { WcStatus } from "./types";

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
    if (wcStatus === WC_STATUS.READY && !wcSetup) {
      installPkgs();
    }
  }, [wcStatus, wcSetup]);

  const installPkgs = async () => {
    setAppState({ wcStatus: WC_STATUS.INSTALLING as WcStatus });
    files["setup.js"].file.contents = setupCode || "";
    files["main.js"].file.contents = code || "";
    if (deps) {
      const pkgFile = JSON.parse(files["package.json"].file.contents);
      pkgFile.dependencies = getDeps(deps);
      files["package.json"].file.contents = JSON.stringify(pkgFile);
    }
    if (webContainer.current) {
      await webContainer.current.mount(files);
    }
    await runCmd("npm", ["install"]);
    setAppState({ wcStatus: WC_STATUS.READY as WcStatus, wcSetup: true });
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
      setAppState((s) => ({ ...s, wcStatus: WC_STATUS.RUNNING as WcStatus }));
      const doc = editorRef.current?.state.doc.toString();
      await writeFile(NODE_MAIN_FILE, doc);
      await runCmd("node", [NODE_INDEX_FILE]);
      setAppState((s) => ({ ...s, wcStatus: WC_STATUS.READY as WcStatus }));
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
      <>
        <Editor onRun={handleRun} />
        <LogsContainer
          onStop={handleStop}
          onRun={handleRun}
          onClear={handleClear}
          runCmd={runCmd}
        />
      </>
    );
  };

  const renderSplitLayout = () => {
    return (
      <SplitPanel
        left={<Editor onRun={handleRun} />}
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
