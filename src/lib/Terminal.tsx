import { CSSProperties, useEffect, useRef } from "react";
import { Terminal as XTerminal } from "xterm";
import { FitAddon } from "@xterm/addon-fit";
import { setAppState, useAppState } from "./store";

type Props = {
  style: CSSProperties;
};

export default function Terminal({ style }: Props) {
  const terminalContRef = useRef(null);
  const terminalRef = useAppState((s) => s.terminalRef);

  useEffect(() => {
    if (terminalContRef.current && terminalRef.current === null) {
      const terminal = new XTerminal({
        cursorBlink: true,
        fontSize: 15,
        lineHeight: 1.2,
      });
      const fitAddon = new FitAddon();
      terminal.loadAddon(fitAddon);
      terminal.open(terminalContRef.current);
      fitAddon.fit();
      setAppState({ terminalRef: { current: terminal } });
    }
  }, []);

  return (
    <div
      style={{
        ...style,
        height: "100%",
        paddingLeft: "8px",
        backgroundColor: "black",
      }}
      ref={terminalContRef}
    ></div>
  );
}
