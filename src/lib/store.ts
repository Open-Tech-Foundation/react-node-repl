import { create } from "@opentf/react-state";
import { WebContainer, WebContainerProcess } from "@webcontainer/api";
import { Terminal } from "xterm";
import { WcStatus } from "./types";
import { WC_STATUS } from "./constants";
import { EditorView } from "codemirror";

type State = {
  webContainer: WebContainer | null;
  shellProcessRef: WebContainerProcess | null;
  terminalRef: Terminal | null;
  editorRef: EditorView | null;
  wcStatus: WcStatus;
  wcSetup: boolean;
  logs: string[];
};

const { useAppState, setAppState } = create<State>({
  webContainer: null,
  shellProcessRef: null,
  wcStatus: WC_STATUS.UNKNOWN,
  terminalRef: null,
  editorRef: null,
  wcSetup: false,
  logs: [],
});

export { useAppState, setAppState };
