import stripAnsi from "strip-ansi";

type Props = {
  logs: string[];
};

export default function Console({ logs }: Props) {
  const renderLogs = () => {
    return logs.map((l, i) => (
      <div
        key={i}
        style={{
          color: "white",
          padding: "3px",
          paddingLeft: "10px",
          borderBottom: "1px solid rgb(44, 44, 44)",
        }}
      >
        {stripAnsi(l)}
      </div>
    ));
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
