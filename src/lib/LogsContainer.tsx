import ClearIcon from "./icons/ClearIcon";
import PlayIcon from "./icons/PlayIcon";
import Terminal from "./Terminal";
import TerminalIcon from "./icons/Terminal";
import { useState } from "react";
import Console from "./Console";
import { useAppState } from "./store";
import StopIcon from "./icons/Stop";
import SpinnersRingResize from "./icons/SpinnersRingResize";
import { WC_STATUS } from "./constants";

type Props = {
  onRun: () => void;
  onStop: () => void;
  onClear: () => void;
};

function LogsContainer({ onRun, onClear, onStop }: Props) {
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
      case WC_STATUS.READY:
        return (
          <button
            title="CTRL + Enter"
            style={{
              ...baseStyles,
              backgroundColor: "#3e7a38",
            }}
            onClick={onRun}
          >
            <PlayIcon /> <span style={{ marginLeft: "5px" }}>Run</span>
          </button>
        );
      case WC_STATUS.RUNNING:
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
          <button
            title="Clear"
            style={{
              cursor: "pointer",
              border: 0,
              background: "inherit",
              marginLeft: "10px",
            }}
            onClick={onClear}
          >
            <ClearIcon fill="#c7c7c7" width={20} height={20} />
          </button>
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
          {getRunBtn()}
        </div>
      </div>
      <div style={{ height: "calc(100% - 35px)", position: "relative" }}>
        <Terminal
          style={{
            display: `${logView === "terminal" ? "block" : "none"}`,
          }}
        />
        {logView === "console" && <Console />}
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
              display: wcStatus === WC_STATUS.BOOTING ? "flex" : "none",
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
