import { Alert, Box, Button, Typography } from "@mui/joy";
import WarningIcon from "@mui/icons-material/Warning";
import InfoIcon from "@mui/icons-material/Info";
import VerifiedIcon from "@mui/icons-material/Verified";
import { Link } from "react-router-dom";
import Demo from "./components/Demo";

function App() {
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
        <Demo />
      </Box>
      <div style={{ marginTop: "15px" }}>
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
