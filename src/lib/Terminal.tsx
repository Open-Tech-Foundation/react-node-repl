import { forwardRef, useEffect, useRef } from "react";
import { Terminal as XTerminal } from "xterm";
import { FitAddon } from "@xterm/addon-fit";

const Terminal = forwardRef(function Terminal(_props, ref) {
  const terminalRef = useRef(null);

  useEffect(() => {
    if (terminalRef.current && ref?.current === null) {
      ref.current = new XTerminal({
        cursorBlink: true,
        fontSize: 16,
        lineHeight: 1.2,
        // rows: 5,
      });
      const fitAddon = new FitAddon();
      ref.current.loadAddon(fitAddon);
      ref.current.open(terminalRef.current);
      fitAddon.fit();
    }
  }, []);

  return (
    <div
      style={{ height: "100%", paddingLeft: "8px", backgroundColor: "black" }}
      ref={terminalRef}
    ></div>
  );
});

export default Terminal;
