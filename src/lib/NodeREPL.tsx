import { CSSProperties, useEffect, useRef, useState } from "react";
import { EditorView } from "codemirror";
import { Terminal as XTerm } from "xterm";
import Editor from "./Editor";
import SplitPanel from "./SplitPanel";
import LogsContainer from "./LogsContainer";
import { files } from "./nodeFiles";
import getDeps from "./utils/getDeps";
import { setAppState, useAppState } from "./store";

export type Props = {
  deps: string[];
  style?: CSSProperties;
};

export default function NodeREPL({ deps, style }: Props) {
  const [logs, setLogs] = useState<string[]>([]);
  const editorRef = useRef<EditorView | null>(null);
  const terminalRef = useRef<XTerm | null>(null);
  const { webContainer, wcStatus } = useAppState((s) => s);

  const runCmd = async (prog: string, args: string[]) => {
    if (webContainer && terminalRef.current) {
      const runProcess = await webContainer.spawn(prog, [...args]);
      runProcess.output.pipeTo(
        new WritableStream({
          write(data) {
            if (terminalRef.current) {
              terminalRef.current.write(data);
              setLogs((logs) => [...logs, data]);
            }
          },
        })
      );

      const exitCode = await runProcess.exit;

      if (exitCode === 0) {
        terminalRef.current.write("\r\n");
      }
    }
  };

  useEffect(() => {
    const installPkgs = async () => {
      setAppState((s) => ({ ...s, wcStatus: "Installing" }));
      setTimeout(() => {}, 100);
      const pkgFile = JSON.parse(files["package.json"].file.contents);
      pkgFile.dependencies = getDeps(deps);
      files["package.json"].file.contents = JSON.stringify(pkgFile);
      await webContainer.mount(files);
      await runCmd("npm", ["install"]);
      setAppState((s) => ({ ...s, wcStatus: "Ready" }));
    };

    if (wcStatus === "Loaded") {
      installPkgs();
    }
  }, []);

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
    terminalRef.current?.write("\x1B[2J\x1B[3J\x1B[H");
    setLogs([]);
  };

  return (
    <div style={style}>
      <SplitPanel
        left={<Editor ref={editorRef} />}
        right={
          <LogsContainer
            onRun={handleRun}
            onClear={handleClear}
            terminalRef={terminalRef as unknown as XTerm}
            logs={logs}
          />
        }
      />
    </div>
  );
}
