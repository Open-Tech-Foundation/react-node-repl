import stripAnsi from "strip-ansi";

type Props = {
  logs: string[];
};

function isError(str: string) {
  const errPattern = [
    "Error:",
    "SyntaxError:",
    "TypeError:",
    "ReferenceError:",
    "RangeError:",
  ];
  return errPattern.some((s) => str.startsWith(s));
}

export default function Console({ logs }: Props) {
  const renderLogs = () => {
    return logs.map((l, i) => {
      const err = isError(l);
      const txt = stripAnsi(l);
      return (
        <div
          key={i}
          style={{
            color: err ? "rgb(255, 128, 128)" : "white",
            padding: "3px",
            paddingLeft: "10px",
            borderBottom: "1px solid rgb(44, 44, 44)",
            backgroundColor: err ? "rgb(41, 0, 0)" : "initial",
          }}
        >
          {err ? (
            <pre style={{ margin: 0, whiteSpace: "pre-wrap" }}>{txt}</pre>
          ) : (
            txt
          )}
        </div>
      );
    });
  };

  return (
    <div
      style={{
        height: "100%",
        overflowY: "auto",
        backgroundColor: "#242424",
        padding: "10px",
        boxSizing: "border-box",
      }}
    >
      {renderLogs()}
    </div>
  );
}
