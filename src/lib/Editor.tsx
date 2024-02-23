import { MutableRefObject, forwardRef } from "react";

import { EditorView, basicSetup } from "codemirror";
import { keymap } from "@codemirror/view";
import { indentWithTab } from "@codemirror/commands";
import { javascript } from "@codemirror/lang-javascript";
import { useEffect, useRef } from "react";
import { files } from "./nodeFiles";
import CodeIcon from "./icons/Code";

const Editor = forwardRef(function Editor(
  props,
  ref: MutableRefObject<EditorView | null>
) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current && !ref?.current) {
      const minHeightEditor = EditorView.theme({
        ".cm-content, .cm-gutter": { minHeight: "150px" },
      });
      ref.current = new EditorView({
        doc: files["input.js"].file.contents,
        extensions: [
          minHeightEditor,
          basicSetup,
          keymap.of([indentWithTab]),
          javascript(),
        ],

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
        <div style={{ display: "flex", alignItems: "center" }}>
          <CodeIcon /> <span style={{ marginLeft: "5px" }}>main.js</span>
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
});

export default Editor;
