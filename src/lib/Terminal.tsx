import { CSSProperties, MutableRefObject, useEffect, useRef } from "react";
import { Terminal as XTerminal } from "xterm";
import { FitAddon } from "@xterm/addon-fit";
import { setAppState, useAppState } from "./store";
import { BACKSPACE_CODE } from "./constants";

type Props = {
  style: CSSProperties;
  runCmd: (p: string, args: string[]) => Promise<void>;
};

function handleKey(
  ev: KeyboardEvent,
  term: XTerminal,
  userCmd: MutableRefObject<string>
) {
  if (ev.type === "keydown" && ev.key === "Backspace") {
    if (userCmd.current.length > 0) {
      term.write(BACKSPACE_CODE);
      userCmd.current = userCmd.current.slice(0, -1);
    }
    return false;
  }

  if (ev.type === "keydown" && ev.ctrlKey && ev.key === "l") {
    term.clear();
    ev.stopPropagation();
    ev.preventDefault();
    return false;
  }
  return true;
}

export default function Terminal({ style, runCmd }: Props) {
  const userCmdRef = useRef<string>("");
  const terminalContRef = useRef(null);
  const { terminalRef, webContainer } = useAppState((s) => ({
    terminalRef: s.terminalRef,
    webContainer: s.webContainer,
  }));

  useEffect(() => {
    if (webContainer && terminalRef.current) {
      terminalRef.current.onKey(
        async ({ key }: { key: string; domEvent: KeyboardEvent }) => {
          if (key.charCodeAt(0) === 13) {
            const [prog, ...args] = userCmdRef.current.split(" ");
            await runCmd(prog, args);
            userCmdRef.current = "";
          }
        }
      );
      terminalRef.current.onData((data: string) => {
        terminalRef.current?.write(data);
        userCmdRef.current += data;
      });
    }
  }, [webContainer, terminalRef.current]);

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
      terminal.attachCustomKeyEventHandler((e) =>
        handleKey(e, terminal, userCmdRef)
      );
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
