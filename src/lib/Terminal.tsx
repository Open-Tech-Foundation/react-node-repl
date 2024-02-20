import { Terminal as XTerminal } from "xterm";
import { forwardRef, useEffect, useRef } from "react";

const Terminal = forwardRef(function Terminal(props, ref) {
  const terminalRef = useRef(null);

  useEffect(() => {
    if (terminalRef.current && !ref.current) {
      ref.current = new XTerminal();
      ref.current.open(terminalRef.current);
    }
  }, []);

  return <div ref={terminalRef}></div>;
});

export default Terminal;
