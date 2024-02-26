import { WcStatus } from "./types";

export const CLEAR_SCREEN_CMD = "\x1B[2J\x1B[3J\x1B[H";

export const WC_STATUS: {[k: string]: WcStatus} = {
  UNKNOWN: "unknown",
  BOOTING: "booting",
  STARTED: "started",
  MOUNTING_FILES: 'mounting-files',
  INSTALLING: "installing",
  READY: "ready",
  RUNNING: "running",
} as const;

export const NODE_MAIN_FILE = "main.js";

export const NODE_INDEX_FILE = "index.js";

export const PACKAGE_JSON_FILE = "package.json";

export const BACKSPACE_CODE = "\b \b";
