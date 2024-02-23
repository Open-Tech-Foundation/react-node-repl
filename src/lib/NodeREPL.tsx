import { CSSProperties, useEffect, useRef, useState } from "react";
import Editor from "./Editor";
import SplitPanel from "./SplitPanel";
import LogsContainer from "./LogsContainer";
import { files } from "./nodeFiles";
import getDeps from "./utils/getDeps";
import { setAppState, useAppState } from "./store";
import { WebContainerProcess } from "@webcontainer/api";
import { CLEAR_SCREEN_CMD, WC_STATUS } from "./constants";

export type Props = {
  deps: string[];
  style?: CSSProperties;
};

export default function NodeREPL({ deps, style }: Props) {
  const [logs, setLogs] = useState<string[]>([]);
  const runProcessRef = useRef<WebContainerProcess | null>(null);
  const { webContainer, wcStatus, wcSetup, terminalRef, editorRef } = useAppState(
    (s) => s
  );

  useEffect(() => {
    if (wcStatus === "Ready" && !wcSetup) {
      installPkgs();
    }
  }, [wcStatus, wcSetup]);

  const installPkgs = async () => {
    setAppState({ wcStatus: "Installing" });
    const pkgFile = JSON.parse(files["package.json"].file.contents);
    pkgFile.dependencies = getDeps(deps);
    files["package.json"].file.contents = JSON.stringify(pkgFile);
    if (webContainer) {
      await webContainer.mount(files);
    }
    await runCmd("npm", ["install"]);
    setAppState({ wcStatus: WC_STATUS.READY, wcSetup: true });
  };

  const runCmd = async (prog: string, args: string[]) => {
    if (webContainer && terminalRef) {
      runProcessRef.current = await webContainer.spawn(prog, [...args]);
      runProcessRef.current.output.pipeTo(
        new WritableStream({
          write(data) {
            terminalRef.current?.write(data);
            setLogs((logs) => [...logs, data]);
          },
        })
      );

      const exitCode = await runProcessRef.current.exit;

      if (exitCode === 0) {
        terminalRef.current?.write("\r\n");
      }
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
    if (editorRef.current && webContainer) {
      setAppState((s) => ({ ...s, wcStatus: "Running" }));
      const doc = editorRef.current?.state.doc.toString();
      await writeFile("/input.js", doc);
      await runCmd("node", ["index.js"]);
      setAppState((s) => ({ ...s, wcStatus: "Ready" }));
    }
  };

  const handleClear = () => {
    if (terminalRef) {
      terminalRef.current?.write(CLEAR_SCREEN_CMD);
    }
    setLogs([]);
  };

  return (
    <div style={style}>
      <SplitPanel
        left={<Editor />}
        right={
          <LogsContainer
            onStop={handleStop}
            onRun={handleRun}
            onClear={handleClear}
            logs={logs}
          />
        }
      />
    </div>
  );
}
