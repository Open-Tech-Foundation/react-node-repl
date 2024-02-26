import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Box,
  Button,
  Divider,
  Link,
  Typography,
} from "@mui/joy";
import WarningIcon from "@mui/icons-material/Warning";
import InfoIcon from "@mui/icons-material/Info";
import Launch from "@mui/icons-material/Launch";
import VerifiedIcon from "@mui/icons-material/Verified";
import SyntaxHighlighter from "react-syntax-highlighter";
import { gruvboxDark } from "react-syntax-highlighter/dist/esm/styles/hljs";

import { NodeREPL } from "./lib";

const REPL_DEPS = [
  "lodash",
  "@opentf/utils",
  "@opentf/cli-styles",
  "@opentf/cli-pbar",
];

const demoSource = `import { NodeREPL } from "@opentf/react-node-repl";

<NodeREPL
  code={code}
  setupCode={setupCode}
  deps={['lodash']}
  style={{ height: "50vh" }}
  layout="SPLIT_PANEL"
/>
`;

function App() {
  const code = `const { style } = require('@opentf/cli-styles')

style(\`$g.bol{Hello World 👋}
  $gr{-> Node.js \${process.version}}\`)`;

  const setupCode = `const _ = require('lodash');
const log = console.log;`;

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
        <NodeREPL
          code={code}
          setupCode={setupCode}
          deps={REPL_DEPS}
          style={{ height: "50vh" }}
          layout="SPLIT_PANEL"
        />
        <Box mt={1}>
          <Accordion>
            <AccordionSummary
              variant="outlined"
              color="primary"
              sx={{
                ml: "auto",
                fontSize: "sm",
                borderRadius: "5px",
                fontWeight: "bold",
              }}
            >
              <Box sx={{ px: 1 }}>Expand Code</Box>
            </AccordionSummary>
            <AccordionDetails>
              <SyntaxHighlighter language="javascript" style={gruvboxDark}>
                {demoSource}
              </SyntaxHighlighter>
            </AccordionDetails>
          </Accordion>
        </Box>
        <div style={{ marginTop: "25px" }}>
          <Alert
            variant="soft"
            color="warning"
            startDecorator={<WarningIcon />}
          >
            By default, in REPL mode, you cannot use <strong>import</strong>{" "}
            statements. Fallback to <strong>require</strong>.
          </Alert>

          <Alert
            variant="soft"
            color="success"
            sx={{ mt: 2 }}
            startDecorator={<VerifiedIcon />}
          >
            You can run <strong>ESM</strong> modules manually in the terminal
            with the ESM switch on. Eg: `$ node main.js`
          </Alert>

          <Alert
            startDecorator={<InfoIcon />}
            variant="soft"
            color="primary"
            sx={{ mt: 2 }}
          >
            <ul>
              <li>You can directly install npm packages in the terminal.</li>
              <li>
                You can use <strong>log()</strong> instead of{" "}
                <strong>console.log()</strong>.
              </li>
              <li>
                The lodash methods were preloaded, you can use it like{" "}
                <strong>_.isEmpty(value)</strong>.
              </li>
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
