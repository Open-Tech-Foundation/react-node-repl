import { Alert, Box, Button, Divider, Link, Typography } from "@mui/joy";
import WarningIcon from "@mui/icons-material/Warning";
import InfoIcon from "@mui/icons-material/Info";
import Launch from "@mui/icons-material/Launch";

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
          <Typography level="h3" sx={{ ml: 2 }}>
            React Node REPL
          </Typography>
        </div>
        <div>
          <Link
            href="https://github.com/Open-Tech-Foundation/react-node-repl"
            endDecorator={<Launch fontSize="inherit" />}
            target="_blank"
            rel="noopener"
            fontSize="sm"
          >
            Github
          </Link>
        </div>
      </header>
      <Divider orientation="horizontal" />
      <main
        style={{
          padding: "25px",
          minHeight: "100vh",
          boxSizing: "border-box",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Alert sx={{ mb: 2 }} color="success">
            <Typography level="body-lg">
              The Node.js REPL in a React component.
            </Typography>
            <Button variant="solid" size="md">
              Get Started
            </Button>
          </Alert>
        </Box>
        <NodeREPL deps={REPL_DEPS} style={{ height: "calc(50vh)" }} />
        <div style={{ marginTop: "25px" }}>
          <Alert
            variant="soft"
            color="warning"
            startDecorator={<WarningIcon />}
          >
            Currently it does not support importing modules using `import`
            statements. Fallback to `require`.
          </Alert>

          <Alert
            startDecorator={<InfoIcon />}
            variant="soft"
            color="primary"
            sx={{ mt: 2 }}
          >
            <ul>
              <li>You can directly install npm packages in the terminal.</li>
              <li>You can use log() instead of console.log().</li>
            </ul>
          </Alert>
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
