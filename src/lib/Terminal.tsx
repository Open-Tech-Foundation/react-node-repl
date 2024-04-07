import { CSSProperties, useEffect, useRef } from "react";
import { Terminal as XTerminal } from "xterm";
import { FitAddon } from "@xterm/addon-fit";
import { setAppState, useAppState } from "./store";
import { merge } from "@opentf/std";

type Props = {
  style: CSSProperties;
};

const baseStyles: CSSProperties = {
  paddingLeft: "8px",
  backgroundColor: "black",
  height: "100%",
};

export default function Terminal({ style }: Props) {
  const fitAddonRef = useRef<FitAddon | null>(null);
  const terminalContRef = useRef<HTMLDivElement>(null);
  const { terminalRef, shellProcessRef } = useAppState((s) => ({
    terminalRef: s.terminalRef,
    shellProcessRef: s.shellProcessRef,
  }));

  useEffect(() => {
    return () => {
      shellProcessRef?.kill();
      terminalRef?.dispose();
      setAppState({ terminalRef: null, shellProcessRef: null });
    };
  }, []);

  useEffect(() => {
    if (terminalContRef.current) {
      const terminal = new XTerminal({
        fontSize: 15,
        lineHeight: 1,
      });
      fitAddonRef.current = new FitAddon();
      terminal.loadAddon(fitAddonRef.current);
      terminal.open(terminalContRef.current);
      fitAddonRef.current.fit();
      setAppState({ terminalRef: terminal });
    }
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (shellProcessRef && terminalRef && fitAddonRef.current) {
        fitAddonRef.current.fit();
        shellProcessRef.resize({
          cols: terminalRef.cols,
          rows: terminalRef.rows,
        });
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [shellProcessRef, terminalRef, fitAddonRef.current]);

  return <div style={merge({}, baseStyles, style)} ref={terminalContRef}></div>;
}
