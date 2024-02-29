import {
  Alert,
  Box,
  Link,
  Tab,
  TabList,
  TabPanel,
  Table,
  Tabs,
  Typography,
} from "@mui/joy";
import SyntaxHighlighter from "react-syntax-highlighter";
import { gruvboxDark } from "react-syntax-highlighter/dist/esm/styles/hljs";
import InfoIcon from "@mui/icons-material/Info";
import { useEffect } from "react";

export default function Docs() {
  useEffect(() => {
    window.document.title = "Docs - React Node REPL";
  }, []);

  return (
    <Box sx={{ boxSizing: "border-box" }}>
      <Box>
        <Typography id="Section_Introduction" level="h1">
          React Node REPL
        </Typography>
        <Typography
          level="body-lg"
          sx={{
            borderLeft: (t) => `5px solid ${t.palette.success.softActiveBg}`,
            pl: 1,
            mt: 2,
          }}
        >
          The Node.js{" "}
          <Link href="https://en.wikipedia.org/wiki/Read%E2%80%93eval%E2%80%93print_loop">
            REPL
          </Link>{" "}
          in a React component.
        </Typography>
        <Typography sx={{ mt: 2 }} level="h3">
          Features
        </Typography>
        <ul>
          <li>
            <Typography level="body-md">Simple API</Typography>
          </li>
          <li>
            <Typography level="body-md">
              Powered by{" "}
              <Link href="https://webcontainers.io/">WebContainer</Link>
            </Typography>
          </li>
          <li>
            <Typography level="body-md">
              Install npm packages locally, directly in the terminal.
            </Typography>
          </li>
          <li>
            <Typography level="body-md">
              Switch between <strong>Terminal</strong> or{" "}
              <strong>Console</strong> View
            </Typography>
          </li>
          <li>
            <Typography level="body-md">Keyboard shortcuts</Typography>
          </li>
          <li>
            <Typography level="body-md">TypeScript support</Typography>
          </li>
        </ul>
        <Typography sx={{ mt: 2 }} level="h3">
          Upcoming
        </Typography>
        <ul>
          <li>
            <Typography level="body-md">
              Serialization of objects for better console view
            </Typography>
          </li>
          <li>
            <Typography level="body-md">Code formating</Typography>
          </li>
          <li>
            <Typography level="body-md">Syntax errors highlighting</Typography>
          </li>
          <li>
            <Typography level="body-md">TypeScript errors</Typography>
          </li>
        </ul>
      </Box>

      <Box sx={{ mt: 5 }}>
        <Typography id="Section_Requirements" level="h2">
          Requirements
        </Typography>
        <Typography component="ul" level="body-md" sx={{ mt: 2 }}>
          <li>
            Your site must be served over <strong>HTTPS</strong>.
          </li>
          <li>
            The following headers must be set in your deployed page.
            <Link
              sx={{ ml: 1 }}
              href="https://webcontainers.io/guides/configuring-headers"
            >
              Learn more.
            </Link>
          </li>
        </Typography>
        <SyntaxHighlighter language="text" style={gruvboxDark}>
          {`Cross-Origin-Embedder-Policy: require-corp
Cross-Origin-Opener-Policy: same-origin`}
        </SyntaxHighlighter>
        <Alert variant="outlined" startDecorator={<InfoIcon />}>
          localhost is exempt from serving over HTTPS.
        </Alert>
      </Box>

      <Box sx={{ mt: 5 }}>
        <Typography id="Section_Installation" level="h2">
          Installation
        </Typography>
        <Typography level="body-md">
          Install it using your favourite package manager.
        </Typography>
        <Tabs defaultValue={0} sx={{ mt: 2 }}>
          <TabList>
            <Tab>Npm</Tab>
            <Tab>Pnpm</Tab>
            <Tab>Yarn</Tab>
            <Tab>Bun</Tab>
          </TabList>
          <TabPanel value={0}>
            <SyntaxHighlighter language="shell" style={gruvboxDark}>
              {`npm install @opentf/react-node-repl`}
            </SyntaxHighlighter>
          </TabPanel>
          <TabPanel value={1}>
            <SyntaxHighlighter language="shell" style={gruvboxDark}>
              {`pnpm add @opentf/react-node-repl`}
            </SyntaxHighlighter>
          </TabPanel>
          <TabPanel value={2}>
            <SyntaxHighlighter language="shell" style={gruvboxDark}>
              {`yarn add @opentf/react-node-repl`}
            </SyntaxHighlighter>
          </TabPanel>
          <TabPanel value={3}>
            <SyntaxHighlighter language="shell" style={gruvboxDark}>
              {`bun add @opentf/react-node-repl`}
            </SyntaxHighlighter>
          </TabPanel>
        </Tabs>
      </Box>

      <Box sx={{ mt: 5 }}>
        <Typography id="Section_Usage" level="h2">
          Usage
        </Typography>
        <SyntaxHighlighter language="javascript" style={gruvboxDark}>
          {`import { NodeREPL } from "@opentf/react-node-repl";

const code = \`console.log("Hello World")\`;
const deps = ['pkg1', 'pkg2@1.2.3', 'pkg3@beta'];

<NodeREPL code={code} deps={deps} />`}
        </SyntaxHighlighter>
      </Box>

      <Box sx={{ mt: 5 }}>
        <Typography id="Section_API" level="h2">
          API
        </Typography>

        <Table aria-label="basic table">
          <thead>
            <tr>
              <th>Prop</th>
              <th>Type</th>
              <th>Required</th>
              <th>Default</th>
              <th style={{ width: "40%" }}>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>code</td>
              <td>string</td>
              <td>No</td>
              <td>""</td>
              <td>The main code to execute</td>
            </tr>
            <tr>
              <td>deps</td>
              <td>string[]</td>
              <td>No</td>
              <td>[]</td>
              <td>
                The npm dependencies.
                <br /> Eg: ['lodash', 'chalk@4.1.2']
              </td>
            </tr>
            <tr>
              <td>setupCode</td>
              <td>string</td>
              <td>No</td>
              <td>""</td>
              <td>
                The setup code, used to init some values.
                <br />
                Eg:
                <br />
                <code>const log = console.log</code>
              </td>
            </tr>
            <tr>
              <td>layout</td>
              <td>string</td>
              <td>No</td>
              <td>"DEFAULT"</td>
              <td>
                The predefined layouts for the components.
                <br />
                There are two types of layout:
                <ol>
                  <li>DEFAULT</li>
                  <li>SPLIT_PANEL</li>
                </ol>
              </td>
            </tr>
          </tbody>
        </Table>
      </Box>

      <Box sx={{ mt: 5 }}>
        <Typography id="Section_Limitations" level="h2">
          Limitations
        </Typography>
        <Typography level="body-md" component="ul" sx={{ mt: 2 }}>
          <li>Currently, it runs only Node.js v18</li>
          <li>
            By default, in REPL mode, you cannot use import statements. You need
            to fallback to require().
          </li>
          <li>
            You can run ESM modules manually in the terminal with the ESM switch
            on. Eg: <strong>$ node main.js</strong>
          </li>
          <li>
            It is not possible to run{" "}
            <Link href="https://nodejs.org/api/addons.html">native addons</Link>
            .
          </li>
        </Typography>
      </Box>
    </Box>
  );
}