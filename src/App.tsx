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
        <NodeREPL deps={REPL_DEPS} style={{ height: "calc(100vh - 250px)" }} />
      </div>
      <details>
        <summary>
          List of pre-installed npm packages
        </summary>
        <ul>
          <li>lodash</li>
          <li>@opentf/utils</li>
        </ul>
      </details>
    </div>
  );
}

export default App;
