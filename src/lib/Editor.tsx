import { EditorView, basicSetup } from "codemirror";
import { ViewUpdate, keymap } from "@codemirror/view";
import { indentWithTab } from "@codemirror/commands";
import { javascript } from "@codemirror/lang-javascript";
import { useEffect, useRef, useState } from "react";
import { setAppState, useAppState } from "./store";
import { NODE_MAIN_FILE, PACKAGE_JSON_FILE, WC_STATUS } from "./constants";
import { Prec, StateEffect } from "@codemirror/state";
import Switch from "./Switch";

type Props = {
  writeFile: (path: string, content: string) => Promise<void>;
  onRun: () => void;
};

export default function Editor({ writeFile, onRun }: Props) {
  const [esm, setESM] = useState<boolean>(false);
  const containerRef = useRef(null);
  const { editorRef, wcStatus, webcontainer, wcSetup } = useAppState(
    (s) => ({
      editorRef: s.editorRef,
      wcStatus: s.wcStatus,
      webcontainer: s.webContainer,
      wcSetup: s.wcSetup,
    }),
    { shallow: true }
  );

  const init = async () => {
    if (containerRef.current) {
      const content = await webcontainer.current?.fs.readFile(
        NODE_MAIN_FILE,
        "utf-8"
      );
      const editor = new EditorView({
        doc: content,
        extensions: [
          basicSetup,
          keymap.of([indentWithTab]),
          javascript(),
          EditorView.updateListener.of(async (update: ViewUpdate) => {
            if (update.docChanged && webcontainer.current) {
              await writeFile(NODE_MAIN_FILE, update.state.doc.toString());
            }
          }),
        ],
        parent: containerRef.current,
      });

      setAppState({ editorRef: { current: editor } });
    }
  };

  useEffect(() => {
    return () => {
      editorRef.current?.destroy();
      editorRef.current = null;
    };
  }, [editorRef.current]);

  useEffect(() => {
    if (wcStatus === WC_STATUS.READY && editorRef.current === null) {
      init();
    }
  }, [wcStatus]);

  useEffect(() => {
    if (wcSetup && wcStatus === WC_STATUS.READY && editorRef.current) {
      const runCmdExt = Prec.highest(
        keymap.of([
          {
            key: "Ctrl-Enter",
            run: () => {
              onRun();
              return true;
            },
          },
        ])
      );

      const trans = editorRef.current.state.update({
        effects: [StateEffect.appendConfig.of(runCmdExt)],
      });
      editorRef.current.dispatch(trans);
    }
  }, [editorRef.current, onRun, wcSetup, wcStatus]);

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
          boxSizing: "content-box",
          fontSize: "14px",
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
