import { MutableRefObject, forwardRef } from "react";

import { EditorView, basicSetup } from "codemirror";
import { keymap } from "@codemirror/view";
import { indentWithTab } from "@codemirror/commands";
import { javascript } from "@codemirror/lang-javascript";
import { useEffect, useRef } from "react";

const Editor = forwardRef(function Editor(
  props,
  ref: MutableRefObject<EditorView | null>
) {
  const containerRef = useRef(null);
  // const editorViewRef = useRef<EditorView | null>(null);

  useEffect(() => {
    if (containerRef.current && !ref?.current) {
      const minHeightEditor = EditorView.theme({
        ".cm-content, .cm-gutter": { minHeight: "150px" },
      });
      ref.current = new EditorView({
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

  return <div ref={containerRef} />;
});

export default Editor;
