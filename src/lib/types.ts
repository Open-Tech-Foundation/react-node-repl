import { CSSProperties } from "react";

export type WcStatus =
  | "unknown"
  | "booting"
  | "started"
  | "mounting-files"
  | "installing"
  | "ready"
  | "running";

export type EditorProps = {
  header: boolean;
  darkMode: boolean;
  style: CSSProperties;
};

export type TerminalProps = {
  show: boolean;
  style: CSSProperties;
};

export type ConsoleProps = {
  show: boolean;
  style: CSSProperties;
};

export type Props = {
  code?: string;
  deps?: string[];
  setupCode?: string;
  layout?: "DEFAULT" | "SPLIT_PANEL";
  style?: CSSProperties;
  editor?: Partial<EditorProps>;
  terminal?: Partial<TerminalProps>;
  console?: Partial<ConsoleProps>;
};

export type Options = {
  code: string;
  deps: string[];
  setupCode: string;
  layout: "DEFAULT" | "SPLIT_PANEL";
  style: CSSProperties;
  editor: EditorProps;
  terminal: TerminalProps;
  console: ConsoleProps;
};
