import { EditorView, basicSetup } from "codemirror";
import { keymap } from "@codemirror/view";
import { indentWithTab } from "@codemirror/commands";
import { javascript } from "@codemirror/lang-javascript";
import { useEffect, useRef } from "react";
import { files } from "./nodeFiles";
import { useAppState } from "./store";

export default function Editor() {
  const containerRef = useRef(null);
  const editorRef = useAppState((s) => s.editorRef);

  useEffect(() => {
    if (containerRef.current && editorRef.current === null) {
      editorRef.current = new EditorView({
        doc: files["input.js"].file.contents,
        extensions: [basicSetup, keymap.of([indentWithTab]), javascript()],
        parent: containerRef.current,
      });
    }
  }, []);

  return (
    <div
      style={{
        height: "100%",
        boxSizing: "border-box",
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
          style={{ display: "flex", alignItems: "center", padding: "0 10px" }}
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
