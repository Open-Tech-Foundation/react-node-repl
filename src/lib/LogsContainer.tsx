import ClearIcon from "./icons/ClearIcon";
import PlayIcon from "./icons/PlayIcon";
import Terminal from "./Terminal";
import TerminalIcon from "./icons/Terminal";
import { useState } from "react";
import Console from "./Console";
import { useAppState } from "./store";
import StopIcon from "./icons/Stop";
import SpinnersRingResize from "./icons/SpinnersRingResize";

type Props = {
  onRun: () => void;
  onStop: () => void;
  onClear: () => void;
  logs: string[];
};

function LogsContainer({ onRun, onClear, onStop, logs }: Props) {
  const [logView, setLogView] = useState("terminal");
  const wcStatus = useAppState((s) => s.wcStatus);

  const getRunBtn = () => {
    const baseStyles = {
      paddingRight: "10px",
      color: "white",
      fontWeight: "bold",
      borderRadius: "5px",
      display: "flex",
      alignItems: "center",
      cursor: "pointer",
      marginRight: "5px",
    };
    switch (wcStatus) {
      case "Ready":
        return (
          <button
            title="CTRL + Enter"
            style={{
              ...baseStyles,
              backgroundColor: "#3e7a38",
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
              ...baseStyles,
              backgroundColor: "#FF4136",
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
      <div style={{ height: "calc(100% - 35px)", position: "relative" }}>
        <Terminal
          style={{
            display: `${logView === "terminal" ? "block" : "none"}`,
          }}
        />
        {logView === "console" && <Console logs={logs} />}
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%,-50%)",
          }}
        >
          <div
            style={{
              display: wcStatus === "Booting" ? "flex" : "none",
              alignItems: "center",
            }}
          >
            <SpinnersRingResize stroke="#2ECC40" />
            <span style={{ color: "white", marginLeft: "10px" }}>
              Booting WebContainer
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LogsContainer;
