import stripAnsi from "strip-ansi";

type Props = {
  logs: string[];
};

function isError(str: string) {
  const errPattern = [
    "Error:",
    "SyntaxError:",
    "TypeError",
    "ReferenceError:",
    "RangeError:",
  ];
  return errPattern.some((s) => str.startsWith(s));
}

const baseLogStyles = {
  padding: "3px",
  paddingLeft: "10px",
  borderBottom: "1px solid rgb(44, 44, 44)",
};

export default function Console({ logs }: Props) {
  const renderErrLog = (txt: string, key: number) => {
    const [line1, ...otherLines] = txt.split("\n");

    return (
      <details
        key={key}
        style={{
          ...baseLogStyles,
          color: "#f7dcda",
          backgroundColor: "#4e3534",
          cursor: "pointer",
        }}
      >
        <summary>{line1}</summary>
        <pre style={{ margin: 0, whiteSpace: "pre-wrap", paddingLeft: "5px" }}>
          {otherLines}
        </pre>
      </details>
    );
  };
  const renderLogs = () => {
    return logs.map((l, i) => {
      const err = isError(l);
      const txt = stripAnsi(l);

      if (err) {
        return renderErrLog(txt, i);
      }

      return (
        <div
          key={i}
          style={{
            ...baseLogStyles,
            color: "white",
          }}
        >
          {txt}
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
        wordBreak: "break-word",
      }}
    >
      {renderLogs()}
    </div>
  );
}
