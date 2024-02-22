import { WebContainer } from "@webcontainer/api";
import Editor from "./Editor";
import { CSSProperties, useEffect, useRef, useState } from "react";
import { EditorView } from "codemirror";
import SplitPanel from "./SplitPanel";
import LogsContainer from "./LogsContainer";
import { Terminal as XTerm } from "xterm";
import { files } from "./nodeFiles";
import getDeps from "./utils/getDeps";

export type Props = {
  deps: string[];
  style: CSSProperties;
};

export default function NodeREPL({ deps, style }: Props) {
  const [logs, setLogs] = useState([]);
  const editorViewRef = useRef<EditorView | null>(null);
  const terminalRef = useRef<XTerm | null>(null);
  const webcontainerRef = useRef<WebContainer | null>(null);

  const runCmd = async (prog: string, args: string[]) => {
    if (webcontainerRef.current && terminalRef.current) {
      const runProcess = await webcontainerRef.current.spawn(prog, [...args]);
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
    const windowLoadHandler = async () => {
      // Call only once
      webcontainerRef.current = await WebContainer.boot();
      const pkgFile = JSON.parse(files["package.json"].file.contents);
      pkgFile.dependencies = getDeps(deps);
      files["package.json"].file.contents = JSON.stringify(pkgFile);
      await webcontainerRef.current.mount(files);
      runCmd("pnpm", ["install"]);
    };
    window.addEventListener("load", windowLoadHandler);

    return () => {
      window.removeEventListener("load", windowLoadHandler);
    };
  }, []);

  async function writeFile(path: string, content: string) {
    if (webcontainerRef.current) {
      await webcontainerRef.current.fs.writeFile(path, content);
    }
  }

  const handleRun = async () => {
    if (editorViewRef.current && webcontainerRef.current) {
      const doc = editorViewRef.current?.state.doc.toString();
      await writeFile("/input.js", doc);
      runCmd("node", ["index.js"]);
    }
  };

  const handleClear = () => {
    terminalRef.current?.write("\x1B[2J\x1B[3J\x1B[H");
    setLogs([]);
  };

  return (
    <div style={style}>
      <SplitPanel
        left={<Editor ref={editorViewRef} />}
        right={
          <LogsContainer
            onRun={handleRun}
            onClear={handleClear}
            terminalRef={terminalRef}
            logs={logs}
          />
        }
      />
    </div>
  );
}
