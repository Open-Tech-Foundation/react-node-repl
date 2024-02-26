import { EditorView, basicSetup } from "codemirror";
import { ViewUpdate, keymap } from "@codemirror/view";
import { indentWithTab } from "@codemirror/commands";
import { javascript } from "@codemirror/lang-javascript";
import { useEffect, useRef, useState } from "react";
import { files } from "./nodeFiles";
import { useAppState } from "./store";
import { NODE_MAIN_FILE, PACKAGE_JSON_FILE, WC_STATUS } from "./constants";
import { Prec } from "@codemirror/state";
import Switch from "./Switch";

type Props = {
  onRun: () => void;
};

export default function Editor({ onRun }: Props) {
  const [esm, setESM] = useState<boolean>(false);
  const containerRef = useRef(null);
  const { editorRef, wcStatus, wcSetup, webcontainer } = useAppState((s) => ({
    editorRef: s.editorRef,
    wcStatus: s.wcStatus,
    wcSetup: s.wcSetup,
    webcontainer: s.webContainer,
  }));
  const handleRun = () => {
    onRun();
    return true;
  };

  useEffect(() => {
    if (
      wcSetup &&
      wcStatus === WC_STATUS.READY &&
      containerRef.current &&
      editorRef.current === null
    ) {
      const runCmdExt = Prec.highest(
        keymap.of([
          {
            key: "Ctrl-Enter",
            run: handleRun,
          },
        ])
      );
      editorRef.current = new EditorView({
        doc: files[NODE_MAIN_FILE].file.contents,
        extensions: [
          basicSetup,
          runCmdExt,
          keymap.of([indentWithTab]),
          javascript(),
          EditorView.updateListener.of(async (update: ViewUpdate) => {
            if (update.docChanged && webcontainer.current) {
              await webcontainer.current.fs.writeFile(
                NODE_MAIN_FILE,
                update.state.doc.toString()
              );
            }
          }),
        ],
        parent: containerRef.current,
      });
    }
  }, [wcStatus, wcSetup]);

  return (
    <div
      style={{
        height: "100%",
        boxSizing: "border-box",
        borderRight: "1px solid lightgray",
      }}
    >
      <div
        style={{
          backgroundColor: "#151515",
          padding: "5px",
          height: "25px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          color: "white",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "0 10px",
          }}
        >
          <div style={{ display: "flex", gap: "5px" }}>
            <div
              style={{
                backgroundColor: "#ed695e",
                borderRadius: "9999px",
                height: ".75rem",
                width: ".75rem",
              }}
            />
            <div
              style={{
                backgroundColor: "#f4be4f",
                borderRadius: "9999px",
                height: ".75rem",
                width: ".75rem",
              }}
            />
            <div
              style={{
                backgroundColor: "#61c454",
                borderRadius: "9999px",
                height: ".75rem",
                width: ".75rem",
              }}
            />
          </div>
          <span style={{ marginLeft: "15px" }}>main.js</span>
        </div>
        <div style={{ paddingRight: "5px" }}>
          <Switch
            label="ESM"
            onChange={async (e) => {
              setESM(e.target.checked);
              if (webcontainer.current) {
                const content = await webcontainer.current.fs.readFile(
                  PACKAGE_JSON_FILE,
                  "utf-8"
                );
                const obj = JSON.parse(content);
                obj.type = e.target.checked ? "module" : "commonjs";
                await webcontainer.current.fs.writeFile(
                  PACKAGE_JSON_FILE,
                  JSON.stringify(obj, null, 2)
                );
              }
            }}
            value={esm}
          />
        </div>
      </div>
      <div
        style={{
          border: "1px solid lightgray",
          height: "calc(100% - 35px)",
          boxSizing: "border-box",
          overflowY: "auto",
        }}
        ref={containerRef}
      />
    </div>
  );
}
