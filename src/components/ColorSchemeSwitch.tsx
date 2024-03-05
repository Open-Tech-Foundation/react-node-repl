import { IconButton, Tooltip, useColorScheme } from "@mui/joy";
import LightToggle from "../icons/lightToggle";

export default function ColorThemeSwitch() {
  const { mode, setMode } = useColorScheme();

  return (
    <Tooltip arrow variant="solid" title="Toggle Mode" size="sm">
      <IconButton
        variant="plain"
        sx={{ ml: 2 }}
        onClick={() => setMode(mode === "light" ? "dark" : "light")}
      >
        <LightToggle />
      </IconButton>
    </Tooltip>
  );
}
