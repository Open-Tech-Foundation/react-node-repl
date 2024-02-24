import { CSSProperties, useEffect, useRef, useState } from "react";
import { Terminal as XTerminal } from "xterm";
import { FitAddon } from "@xterm/addon-fit";
import { setAppState, useAppState } from "./store";

type Props = {
  style: CSSProperties;
};

export default function Terminal({ style }: Props) {
  const [userCmd, setUserCmd] = useState<string>("");
  const terminalContRef = useRef(null);
  const terminalRef = useAppState((s) => s.terminalRef);

  const handleTerminalKey = ({ key }) => {
    if (key.charCodeAt(0) == 13) {
      console.log("enter", userCmd);
    }
  };

  useEffect(() => {
    if (terminalContRef.current && terminalRef.current === null) {
      const terminal = new XTerminal({
        fontSize: 15,
        lineHeight: 1,
      });
      const fitAddon = new FitAddon();
      terminal.loadAddon(fitAddon);
      terminal.open(terminalContRef.current);
      fitAddon.fit();
      terminal.onData((data: string) => {
        terminal.write(data);
        setUserCmd((cmd) => cmd + data);
      });
      terminal.onKey(handleTerminalKey);
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
