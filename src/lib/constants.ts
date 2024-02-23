import { WcStatus } from "./types";

export const CLEAR_SCREEN_CMD = "\x1B[2J\x1B[3J\x1B[H";

export const WC_STATUS: {[K: string]: WcStatus} = {
  UNKNOWN: "Unknown",
  BOOTING: "Booting",
  INSTALLING: "Installing",
  READY: "Ready",
  RUNNING: "Running",
};
