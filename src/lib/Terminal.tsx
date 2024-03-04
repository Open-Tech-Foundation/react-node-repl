import { CSSProperties, useEffect, useRef } from "react";
import { Terminal as XTerminal } from "xterm";
import { FitAddon } from "@xterm/addon-fit";
import { setAppState, useAppState } from "./store";
import merge from "lodash.merge";

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
  const { terminalRef, shellProcessRef } = useAppState(
    (s) => ({
      terminalRef: s.terminalRef,
      shellProcessRef: s.shellProcessRef,
    }),
    { shallow: true }
  );

  useEffect(() => {
    return () => {
      terminalRef.current = null;
      shellProcessRef.current?.kill();
      shellProcessRef.current = null;
    };
  }, [terminalRef.current]);

  useEffect(() => {
    if (terminalContRef.current && terminalRef.current === null) {
      const terminal = new XTerminal({
        fontSize: 15,
        lineHeight: 1,
      });
      fitAddonRef.current = new FitAddon();
      terminal.loadAddon(fitAddonRef.current);
      terminal.open(terminalContRef.current);
      fitAddonRef.current.fit();
      setAppState({ terminalRef: { current: terminal } });
    }
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (
        shellProcessRef.current &&
        terminalRef.current &&
        fitAddonRef.current
      ) {
        fitAddonRef.current.fit();
        shellProcessRef.current.resize({
          cols: terminalRef.current.cols,
          rows: terminalRef.current.rows,
        });
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [shellProcessRef.current, terminalRef.current, fitAddonRef.current]);

  return <div style={merge({}, baseStyles, style)} ref={terminalContRef}></div>;
}
