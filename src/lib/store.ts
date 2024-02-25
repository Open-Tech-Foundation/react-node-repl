import { create } from "@opentf/react-state";
import { WebContainer } from "@webcontainer/api";
import { Terminal } from "xterm";
import { WcStatus } from "./types";
import { WC_STATUS } from "./constants";
import { EditorView } from "codemirror";

type State = {
  webContainer: WebContainer | null;
  wcStatus: WcStatus;
  terminalRef: { current: Terminal | null };
  editorRef: { current: EditorView | null };
  wcSetup: boolean;
};

const [useAppState, setAppState, api] = create<State>({
  webContainer: null,
  wcStatus: WC_STATUS.UNKNOWN as WcStatus,
  terminalRef: { current: null },
  editorRef: { current: null },
  wcSetup: false,
});

window.addEventListener("load", async () => {
  // Call only once
  api.set({ wcStatus: WC_STATUS.BOOTING as WcStatus });
  const webContainer = await WebContainer.boot();
  api.set({ webContainer, wcStatus: WC_STATUS.READY as WcStatus });
});

export { useAppState, setAppState };
