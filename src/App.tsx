import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Box,
  Button,
  Typography,
} from "@mui/joy";
import WarningIcon from "@mui/icons-material/Warning";
import InfoIcon from "@mui/icons-material/Info";
import VerifiedIcon from "@mui/icons-material/Verified";
import SyntaxHighlighter from "react-syntax-highlighter";
import { gruvboxDark } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { NodeREPL } from "./lib";
import { Link } from "react-router-dom";

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
          <Button component={Link} to="/docs" variant="solid" size="md">
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
        <Alert variant="soft" color="warning" startDecorator={<WarningIcon />}>
          By default, in REPL mode, you cannot use <strong>import</strong>{" "}
          statements. Fallback to <strong>require()</strong>.
        </Alert>

        <Alert
          variant="soft"
          color="success"
          sx={{ mt: 2 }}
          startDecorator={<VerifiedIcon />}
        >
          You can run <strong>ESM</strong> modules manually in the terminal with
          the ESM switch on. Eg: <strong>$ node main.js</strong>
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
  );
}

export default App;
