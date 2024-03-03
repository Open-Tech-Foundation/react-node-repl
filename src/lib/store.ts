import { create } from "@opentf/react-state";
import { WebContainer, WebContainerProcess } from "@webcontainer/api";
import { Terminal } from "xterm";
import { WcStatus } from "./types";
import { WC_STATUS } from "./constants";
import { EditorView } from "codemirror";

type State = {
  webContainer: { current: WebContainer | null };
  shellProcessRef: {current: WebContainerProcess | null}
  terminalRef: { current: Terminal | null };
  editorRef: { current: EditorView | null };
  wcStatus: WcStatus;
  wcSetup: boolean;
  logs: string[];
};

const [useAppState, setAppState] = create<State>({
  webContainer: { current: null },
  shellProcessRef: {current: null},
  wcStatus: WC_STATUS.UNKNOWN,
  terminalRef: { current: null },
  editorRef: { current: null },
  wcSetup: false,
  logs: [],
});

export { useAppState, setAppState };
