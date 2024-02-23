import ClearIcon from "./icons/ClearIcon";
import PlayIcon from "./icons/PlayIcon";
import Terminal from "./Terminal";
import TerminalIcon from "./icons/Terminal";
import { MutableRefObject, ReactNode, useState } from "react";
import Console from "./Console";
import { Terminal as XTerm } from "xterm";
import { useAppState } from "./store";
import StopIcon from "./icons/Stop";

type Props = {
  onRun: () => void;
  onStop: () => void;
  onClear: () => void;
  terminalRef: MutableRefObject<XTerm>;
  logs: string[];
};

function LogsContainer({ onRun, onClear, onStop, terminalRef, logs }: Props) {
  const [logView, setLogView] = useState("terminal");
  const wcStatus = useAppState((s) => s.wcStatus);

  const getRunBtn = () => {
    switch (wcStatus) {
      case "Installing":
        return "Installing...";
      case "Ready":
        return (
          <button
            title="CTRL + Enter"
            style={{
              paddingRight: "10px",
              backgroundColor: "#3e7a38",
              color: "white",
              fontWeight: "bold",
              borderRadius: "5px",
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
              marginRight: "5px",
            }}
            onClick={onRun}
            disabled={wcStatus !== "Ready"}
          >
            <PlayIcon /> Run
          </button>
        );
      case "Running":
        return (
          <button
            title="Stop"
            style={{
              backgroundColor: "#FF4136",
              color: "white",
              fontWeight: "bold",
              marginRight: "5px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
            }}
            onClick={onStop}
          >
            <StopIcon /> <span style={{ marginLeft: "3px" }}>Stop</span>
          </button>
        );
    }
  };

  return (
    <div style={{ height: "100%" }}>
      <div
        style={{
          backgroundColor: "#151515",
          padding: "5px",
          height: "25px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontFamily: "monospace",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            backgroundColor: "inherit",
          }}
        >
          <TerminalIcon />
          <select
            style={{
              color: "#FF851B",
              fontWeight: "bold",
              backgroundColor: "inherit",
              marginLeft: "5px",
            }}
            onChange={(e) => setLogView(e.target.value)}
            value={logView}
          >
            <option value="terminal">Terminal</option>
            <option value="console">Console</option>
          </select>
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
          {getRunBtn()}
          <button
            title="Clear"
            style={{
              fontWeight: "bold",
              borderRadius: "5px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
            }}
            onClick={onClear}
          >
            <ClearIcon />
          </button>
        </div>
      </div>
      <div style={{ height: "calc(100% - 35px)" }}>
        <Terminal
          ref={terminalRef}
          style={{ display: `${logView === "terminal" ? "block" : "none"}` }}
        />
        {logView === "console" && <Console logs={logs} />}
      </div>
    </div>
  );
}

export default LogsContainer;
