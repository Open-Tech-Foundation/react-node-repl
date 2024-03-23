import Launch from "@mui/icons-material/Launch";
import { Link, useLocation } from "react-router-dom";
import { Box, Chip, Link as MUILink, Sheet, Typography } from "@mui/joy";
import pkg from "../../package.json";
import ColorThemeSwitch from "../components/ColorSchemeSwitch";

export default function Header() {
  const location = useLocation();
  return (
    <Box
      component="header"
      sx={{
        height: "60px",
        boxSizing: "border-box",
        position: "sticky",
        left: 0,
        top: 0,
        backgroundColor: "white",
        zIndex: 5,
        borderBottom: "1px solid lightgrey",
      }}
    >
      <Sheet
        variant="plain"
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          p: "10px 25px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <img src="/Logo.svg" alt="Logo" height={35} />
          <Typography
            component={Link}
            to="/"
            level="h3"
            sx={{ ml: 2, textDecoration: "none" }}
          >
            React Node REPL
          </Typography>
        </div>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <MUILink
            component={Link}
            to="/"
            fontSize="sm"
            sx={{ mr: 2 }}
            underline={location.pathname === "/" ? "always" : "hover"}
            variant={location.pathname === "/" ? "soft" : "plain"}
          >
            Home
          </MUILink>
          <MUILink
            component={Link}
            to="/docs"
            fontSize="sm"
            sx={{ mr: 2 }}
            underline={location.pathname === "/docs" ? "always" : "hover"}
            variant={location.pathname === "/docs" ? "soft" : "plain"}
          >
            Docs
          </MUILink>
          <MUILink
            href="https://github.com/Open-Tech-Foundation/react-node-repl"
            endDecorator={<Launch fontSize="inherit" />}
            target="_blank"
            rel="noopener"
            fontSize="sm"
          >
            Github
          </MUILink>
          <MUILink
            href="https://www.npmjs.com/package/@opentf/react-node-repl"
            fontSize="sm"
            sx={{ ml: 2 }}
          >
            <Chip color="warning" size="md" variant="outlined">
              v{pkg.version}
            </Chip>
          </MUILink>
          <ColorThemeSwitch />
        </Box>
      </Sheet>
    </Box>
  );
}
