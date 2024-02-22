import { NodeREPL } from "./lib";

const REPL_DEPS = [
  "lodash",
  "@opentf/utils",
  "@opentf/cli-styles",
  "@opentf/cli-pbar",
];

function App() {
  return (
    <div>
      <h1>React Node REPL</h1>
      <div style={{ marginTop: "25px" }}>
        <NodeREPL deps={REPL_DEPS} style={{ height: "250px" }} />
      </div>
    </div>
  );
}

export default App;
