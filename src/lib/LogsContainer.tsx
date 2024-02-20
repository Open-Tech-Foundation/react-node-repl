import ClearIcon from "./icons/ClearIcon";
import PlayIcon from "./icons/PlayIcon";
import Terminal from "./Terminal";
import TerminalIcon from "./icons/Terminal";

function LogsContainer({ onRun, onClear, terminalRef }) {
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
          >
            <option>Terminal</option>
            <option>Console</option>
          </select>
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
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
              marginRight: "2px",
            }}
            onClick={onRun}
          >
            <PlayIcon /> Run
          </button>
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
        <Terminal ref={terminalRef} />
      </div>
    </div>
  );
}

export default LogsContainer;
