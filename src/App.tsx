import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Box,
  Button,
  Tab,
  TabList,
  TabPanel,
  Tabs,
  Typography,
} from "@mui/joy";
import WarningIcon from "@mui/icons-material/Warning";
import InfoIcon from "@mui/icons-material/Info";
import VerifiedIcon from "@mui/icons-material/Verified";
import SyntaxHighlighter from "react-syntax-highlighter";
import { gruvboxDark } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { NodeREPL } from "./lib";
import { Link } from "react-router-dom";
import { useState } from "react";

const REPL_DEPS = [
  "lodash",
  "@opentf/utils",
  "@opentf/cli-styles",
  "@opentf/cli-pbar",
];

const demoSource = `<NodeREPL
  code={code}
  setupCode={setupCode}
  deps={deps}
  style={{ height: "50vh" }}
  layout="SPLIT_PANEL"
/>
`;

const defaultDemoSource = `<NodeREPL
  code={code}
  setupCode={setupCode}
  deps={deps}
  terminal={{ style: { height: "200px" } }}
/>
`;

const codeConsoleDemoSource = `<NodeREPL
code={code}
setupCode={setupCode}
deps={deps}
editor={{
  header: false,
  style: { minHeight: "150px", maxHeight: "300px" },
}}
terminal={{
  show: false,
  style: { minHeight: "150px", maxHeight: "300px" },
}}
console={{ style: { minHeight: "150px", maxHeight: "300px" } }}
/>
`;

const code = `const { style } = require('@opentf/cli-styles')

style(\`$g.bol{Hello World 👋}
  $gr{-> Node.js \${process.version}}\`)`;

const setupCode = `const _ = require('lodash');
const log = console.log;`;

const codeConsoleTabCode = `const { groupBy } = require('@opentf/utils');

groupBy(
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], 
  (v) => (v % 2 === 0 ? "Even" : "Odd")
)
`;

function App() {
  const [index, setIndex] = useState(0);
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
      <Box sx={{ px: 5 }}>
        <Tabs
          aria-label="Outlined tabs"
          value={index}
          onChange={(event, value) => setIndex(value as number)}
          size="sm"
        >
          <TabList
            variant="plain"
            disableUnderline
            sx={{ display: "flex", justifyContent: "center" }}
          >
            <Tab variant="soft" color="neutral">
              Split Panel
            </Tab>
            <Tab variant="soft" color="neutral">
              Default
            </Tab>
            <Tab variant="soft" color="neutral">
              Code + Console
            </Tab>
          </TabList>
          <TabPanel value={0}>
            <NodeREPL
              code={code}
              setupCode={setupCode}
              deps={REPL_DEPS}
              style={{ height: "50vh" }}
              editor={{ darkMode: false }}
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
          </TabPanel>

          <TabPanel value={1}>
            <NodeREPL
              code={code}
              setupCode={setupCode}
              terminal={{ style: { height: "200px" } }}
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
                    {defaultDemoSource}
                  </SyntaxHighlighter>
                </AccordionDetails>
              </Accordion>
            </Box>
          </TabPanel>

          <TabPanel value={2}>
            <NodeREPL
              code={codeConsoleTabCode}
              editor={{
                header: false,
                style: { minHeight: "150px", maxHeight: "300px" },
              }}
              terminal={{
                show: false,
                style: { minHeight: "150px", maxHeight: "300px" },
              }}
              console={{ style: { minHeight: "150px", maxHeight: "300px" } }}
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
                    {codeConsoleDemoSource}
                  </SyntaxHighlighter>
                </AccordionDetails>
              </Accordion>
            </Box>
          </TabPanel>
        </Tabs>
      </Box>
      <div style={{ marginTop: "25px" }}>
        <Alert
          variant="soft"
          color="success"
          sx={{ mt: 2 }}
          startDecorator={<VerifiedIcon />}
        >
          Press `CTRL + Enter` in the editor to run the code.
        </Alert>

        <Alert
          variant="soft"
          color="warning"
          startDecorator={<WarningIcon />}
          sx={{ mt: 2 }}
        >
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
