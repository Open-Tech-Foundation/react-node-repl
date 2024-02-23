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
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0px 15px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <img src="/Logo.svg" alt="Logo" height={35} />
          <h1>React Node REPL</h1>
        </div>
        <div>
          <a href="https://github.com/Open-Tech-Foundation/react-node-repl">
            Github
          </a>
        </div>
      </header>
      <main style={{ padding: "50px" }}>
        <NodeREPL deps={REPL_DEPS} style={{ height: "50vh" }} />
        <div style={{ marginTop: "25px" }}>
          <details>
            <summary>List of pre-installed npm packages</summary>
            <ul>
              {REPL_DEPS.map((p, i) => (
                <li key={i}>{p}</li>
              ))}
            </ul>
          </details>
        </div>
      </main>
      <footer
        style={{
          backgroundColor: "black",
          color: "white",
          padding: "15px",
          textAlign: "center",
        }}
      >
        Copyright © {new Date().getFullYear()}{" "}
        <a
          style={{ color: "inherit" }}
          href="https://open-tech-foundation.pages.dev/"
        >
          Open Tech Foundation
        </a>
        .
      </footer>
    </div>
  );
}

export default App;
