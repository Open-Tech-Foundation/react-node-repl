import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Tab,
  TabList,
  TabPanel,
  Tabs,
  useColorScheme,
} from "@mui/joy";
import SyntaxHighlighter from "react-syntax-highlighter";
import { gruvboxDark } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { NodeREPL } from "../lib";
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

export default function Demo() {
  const [index, setIndex] = useState(0);
  const { mode } = useColorScheme();

  return (
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
          editor={{ darkMode: mode === "dark" }}
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
          editor={{ darkMode: mode === "dark" }}
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
            darkMode: mode === "dark",
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
  );
}
