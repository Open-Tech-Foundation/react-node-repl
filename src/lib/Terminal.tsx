import { CSSProperties, forwardRef, useEffect, useRef } from "react";
import { Terminal as XTerminal } from "xterm";
import { FitAddon } from "@xterm/addon-fit";

type Props = {
  style: CSSProperties;
};

const Terminal = forwardRef(function Terminal(props: Props, ref) {
  const terminalRef = useRef(null);

  useEffect(() => {
    if (terminalRef.current && ref?.current === null) {
      ref.current = new XTerminal({
        cursorBlink: true,
        fontSize: 15,
        lineHeight: 1.2,
      });
      const fitAddon = new FitAddon();
      ref.current.loadAddon(fitAddon);
      ref.current.open(terminalRef.current);
      fitAddon.fit();
    }
  }, []);

  return (
    <div
      style={{
        ...props.style,
        height: "100%",
        paddingLeft: "8px",
        backgroundColor: "black",
      }}
      ref={terminalRef}
    ></div>
  );
});

export default Terminal;
