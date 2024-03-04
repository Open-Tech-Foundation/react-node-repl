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
import { ConsoleProps, TerminalProps } from "./types";

type Props = {
  onRun: () => void;
  onStop: () => void;
  onClear: () => void;
  terminalProps: TerminalProps;
  consoleProps: ConsoleProps;
};

function LogsContainer({
  onRun,
  onClear,
  onStop,
  terminalProps,
  consoleProps,
}: Props) {
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

  const renderLoading = () => {
    if (wcStatus === WC_STATUS.BOOTING || wcStatus === WC_STATUS.INSTALLING) {
      return (
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
              display: "flex",
              alignItems: "center",
            }}
          >
            <SpinnersRingResize stroke="#2ECC40" />
            <span style={{ color: "white", marginLeft: "10px" }}>
              {wcStatus === WC_STATUS.BOOTING && "Booting WebContainer"}
              {wcStatus === WC_STATUS.INSTALLING && "Installing npm packages"}
            </span>
          </div>
        </div>
      );
    }
  };

  const renderTerminalOrConsole = () => {
    if (terminalProps.show && consoleProps.show) {
      return logView === "terminal" ? (
        <Terminal style={terminalProps.style} />
      ) : (
        <Console style={consoleProps.style} />
      );
    }

    if (consoleProps.show) {
      return <Console style={consoleProps.style} />;
    }

    if (terminalProps.show) {
      return <Terminal style={terminalProps.style} />;
    }
  };

  const renderSelectOrTitle = () => {
    const styles = {
      color: "#FF851B",
      fontWeight: "bold",
      backgroundColor: "inherit",
      marginLeft: "5px",
    };
    if (terminalProps.show && consoleProps.show) {
      return (
        <select
          style={styles}
          onChange={(e) => setLogView(e.target.value)}
          value={logView}
        >
          <option value="terminal">Terminal</option>
          <option value="console">Console</option>
        </select>
      );
    }

    if (terminalProps.show) {
      return <span style={styles}>Terminal</span>;
    }

    if (consoleProps.show) {
      return <span style={styles}>Console</span>;
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
          boxSizing: "content-box",
          fontSize: "14px",
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
          {renderSelectOrTitle()}

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
        {renderTerminalOrConsole()}
        {renderLoading()}
      </div>
    </div>
  );
}

export default LogsContainer;
