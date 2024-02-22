import { create } from "@opentf/react-state";
import { WebContainer } from "@webcontainer/api";

type State = {
  webContainer: WebContainer;
  wcStatus: "Loaded" | "Installing" | "Ready" | "Running";
};

const webContainer = await WebContainer.boot();
const [useAppState, setAppState] = create<State>({
  webContainer,
  wcStatus: "Loaded",
});

export { useAppState, setAppState };
