import { CSSProperties, useEffect, useRef, useState } from "react";
import Editor from "./Editor";
import SplitPanel from "./SplitPanel";
import LogsContainer from "./LogsContainer";
import { files } from "./nodeFiles";
import getDeps from "./utils/getDeps";
import { setAppState, useAppState } from "./store";
import { WebContainerProcess } from "@webcontainer/api";
import { NODE_INPUT_FILE, NODE_MAIN_FILE, WC_STATUS } from "./constants";
import { WcStatus } from "./types";

export type Props = {
  deps: string[];
  style?: CSSProperties;
};

export default function NodeREPL({ deps, style }: Props) {
  const userCmdRef = useRef<string>("");
  const [logs, setLogs] = useState<string[]>([]);
  const runProcessRef = useRef<WebContainerProcess | null>(null);
  const { webContainer, wcStatus, wcSetup, terminalRef, editorRef } =
    useAppState((s) => s);

  useEffect(() => {
    if (wcStatus === "Ready" && !wcSetup) {
      installPkgs();
    }
  }, [wcStatus, wcSetup]);

  useEffect(() => {
    if (webContainer && terminalRef.current) {
      terminalRef.current.onData((data: string) => {
        terminalRef.current?.write(data);
        userCmdRef.current += data;
      });
      terminalRef.current.onKey(async ({ key }: { key: string }) => {
        if (key.charCodeAt(0) === 13) {
          const [prog, ...args] = userCmdRef.current.split(" ");
          await runCmd(prog, args);
          userCmdRef.current = "";
        }
      });
    }
  }, [webContainer, terminalRef.current]);

  const installPkgs = async () => {
    setAppState({ wcStatus: WC_STATUS.INSTALLING as WcStatus });
    const pkgFile = JSON.parse(files["package.json"].file.contents);
    pkgFile.dependencies = getDeps(deps);
    files["package.json"].file.contents = JSON.stringify(pkgFile);
    if (webContainer) {
      await webContainer.mount(files);
    }
    await runCmd("npm", ["install"]);
    setAppState({ wcStatus: WC_STATUS.READY as WcStatus, wcSetup: true });
  };

  const runCmd = async (prog: string, args: string[]) => {
    terminalRef.current?.writeln("");

    if (webContainer && terminalRef) {
      runProcessRef.current = await webContainer.spawn(prog, [...args], {});
      runProcessRef.current.output.pipeTo(
        new WritableStream({
          write(data) {
            terminalRef.current?.write(data);
            setLogs((logs) => [...logs, data]);
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
    if (webContainer) {
      await webContainer.fs.writeFile(path, content);
    }
  }

  const handleRun = async () => {
    if (editorRef.current && webContainer) {
      setAppState((s) => ({ ...s, wcStatus: WC_STATUS.RUNNING as WcStatus }));
      const doc = editorRef.current?.state.doc.toString();
      await writeFile(NODE_INPUT_FILE, doc);
      await runCmd("node", [NODE_MAIN_FILE]);
      setAppState((s) => ({ ...s, wcStatus: WC_STATUS.READY as WcStatus }));
    }
  };

  const handleClear = () => {
    if (terminalRef) {
      terminalRef.current?.clear();
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
