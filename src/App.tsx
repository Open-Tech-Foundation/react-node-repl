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
          height: "50px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <img src="/Logo.svg" alt="Logo" height={35} />
          <h3 style={{ marginLeft: "10px" }}>React Node REPL</h3>
        </div>
        <div>
          <a href="https://github.com/Open-Tech-Foundation/react-node-repl">
            Github
          </a>
        </div>
      </header>
      <hr />
      <main
        style={{
          padding: "50px",
          minHeight: "calc(100vh - 118px)",
          boxSizing: "border-box",
        }}
      >
        <NodeREPL deps={REPL_DEPS} style={{ height: "300px" }} />
        <div style={{ marginTop: "25px" }}>
        </div>
      </main>
      <footer
        style={{
          backgroundColor: "black",
          color: "white",
          padding: "15px",
          textAlign: "center",
          height: "50px",
          boxSizing: "border-box",
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
