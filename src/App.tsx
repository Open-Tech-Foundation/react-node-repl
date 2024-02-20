import { NodeREPL } from "./lib";

function App() {
  return (
    <div>
      <h1>React Node REPL</h1>
      <div style={{ marginTop: "25px" }}>
        <NodeREPL style={{ height: "250px" }} />
      </div>
    </div>
  );
}

export default App;
