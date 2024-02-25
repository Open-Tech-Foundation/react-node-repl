import { create } from "@opentf/react-state";
import { WebContainer } from "@webcontainer/api";
import { Terminal } from "xterm";
import { WcStatus } from "./types";
import { WC_STATUS } from "./constants";
import { EditorView } from "codemirror";

type State = {
  webContainer: { current: WebContainer | null };
  terminalRef: { current: Terminal | null };
  editorRef: { current: EditorView | null };
  wcStatus: WcStatus;
  wcSetup: boolean;
  logs: string[];
};

const [useAppState, setAppState, api] = create<State>({
  webContainer: { current: null },
  wcStatus: WC_STATUS.UNKNOWN as WcStatus,
  terminalRef: { current: null },
  editorRef: { current: null },
  wcSetup: false,
  logs: [],
});

window.addEventListener("load", async () => {
  // Call only once
  api.set({ wcStatus: WC_STATUS.BOOTING as WcStatus });
  const webContainer = await WebContainer.boot();
  api.set({
    webContainer: { current: webContainer },
    wcStatus: WC_STATUS.READY as WcStatus,
  });
});

export { useAppState, setAppState };
