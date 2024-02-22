import { MutableRefObject, forwardRef } from "react";

import { EditorView, basicSetup } from "codemirror";
import { keymap } from "@codemirror/view";
import { indentWithTab } from "@codemirror/commands";
import { javascript } from "@codemirror/lang-javascript";
import { useEffect, useRef } from "react";
import { files } from "./nodeFiles";

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
        border: "1px solid lightgray",
        height: "100%",
        boxSizing: "border-box",
        overflow: "auto",
      }}
      ref={containerRef}
    />
  );
});

export default Editor;
