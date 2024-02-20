import { WebContainer } from "@webcontainer/api";
import Editor from "./Editor";
import { useEffect, useRef } from "react";
import { EditorView } from "codemirror";
import Terminal from "./Terminal";
import PlayIcon from "./PlayIcon";

const files = {
  "index.js": {
    file: {
      contents: `'use strict';
      const vm = require('node:vm');
      const {readFileSync} = require('node:fs');
      const code = readFileSync('./input.js');
      global.require = require
      const result = vm.runInThisContext(code); 
      console.log(result)`,
    },
  },
  "input.js": {
    file: {
      contents: "",
    },
  },
  "package.json": {
    file: {
      contents: `
{
  "name": "react-node-repl",
  "type": "commonjs",
  "dependencies": {
    "lodash": "latest",
    "@opentf/cli-styles": "latest",
    "@opentf/cli-pbar": "latest"
  },
  "scripts": {
    "start": "node index.js"
  }
}`,
    },
  },
};

export default function NodeREPL() {
  const editorViewRef = useRef<EditorView | null>(null);
  const terminalRef = useRef(null);
  const webcontainerRef = useRef<WebContainer | null>(null);

  const runCmd = async (prog: string, args: string[]) => {
    if (webcontainerRef.current && terminalRef.current) {
      const runProcess = await webcontainerRef.current.spawn(prog, [...args]);

      runProcess.output.pipeTo(
        new WritableStream({
          write(data) {
            terminalRef.current.write(data);
          },
        })
      );
    }
  };

  useEffect(() => {
    const windowLoadHandler = async () => {
      // Call only once
      webcontainerRef.current = await WebContainer.boot();
      await webcontainerRef.current.mount(files);
      runCmd("npm", ["install"]);
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

  return (
    <div style={{ display: "grid", gridTemplateColumns: "50fr 50fr" }}>
      <div style={{ position: "relative", border: '1px solid lightgray' }}>
        <Editor ref={editorViewRef} />
        <button
          style={{
            paddingRight: "12px",
            backgroundColor: "#3e7a38",
            color: "white",
            fontWeight: "bold",
            fontSize: "16px",
            borderRadius: "5px",
            display: "flex",
            alignItems: "center",
            position: "absolute",
            bottom: "10px",
            right: "10px",
          }}
          onClick={handleRun}
        >
          <PlayIcon /> Run
        </button>
      </div>
      <div>
        <Terminal ref={terminalRef} />
      </div>
    </div>
  );
}
