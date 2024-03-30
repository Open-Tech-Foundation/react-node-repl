<img align="left" src="https://open-tech-foundation.pages.dev/img/Logo.svg" width="50" height="50">

&nbsp;[OPEN TECH FOUNDATION](https://open-tech-foundation.pages.dev/)

<div align="center">

# React Node REPL

![Demo](./assets/Demo.png)

</div>

> The Node.js [REPL](https://en.wikipedia.org/wiki/Read%E2%80%93eval%E2%80%93print_loop) in a React component.

<div align="center">

# [Live Demo](https://node-repl.pages.dev/) | [Documentation](https://node-repl.pages.dev/docs)

</div>

## Features

- Simple API
- Powered by [WebContainers](https://webcontainers.io/)
- Install npm packages locally, directly in the terminal
- Switch between `Terminal` or `Console` View
- Keyboard shortcuts
- TypeScript support

## Upcoming

- Serialization of objects for better console view
- Code formating
- Syntax errors highlighting
- TypeScript errors

## Requirements

- Your site must be served over <strong>HTTPS</strong>.
- The following headers must be set in your deployed page.

```text
Cross-Origin-Embedder-Policy: require-corp
Cross-Origin-Opener-Policy: same-origin
```

<a href="https://webcontainers.io/guides/configuring-headers">
Learn more.
</a>

## Installation

```shell
npm install @opentf/react-node-repl
```

```shell
yarn add @opentf/react-node-repl
```

```shell
pnpm add @opentf/react-node-repl
```

```shell
bun add @opentf/react-node-repl
```

## Usage

```jsx
import { NodeREPL } from "@opentf/react-node-repl";
import "@opentf/react-node-repl/lib/style.css";

export default function App() {
  const code = `console.log("Hello World")`;
  const deps = ["pkg1", "pkg2@1.2.3", "pkg3@beta"];

  return <NodeREPL code={code} deps={deps} layout="SPLIT_PANEL" />;
}
```

## API

### Props

| Prop      | Type                | Required | Default   | Description                                                                                                      |
| --------- | ------------------- | -------- | --------- | ---------------------------------------------------------------------------------------------------------------- |
| code      | string              | No       | ""        | The main code to execute                                                                                         |
| deps      | string[]            | No       | []        | The npm dependencies.Eg: ['lodash', 'chalk@4.1.2']                                                               |
| setupCode | string              | No       | ""        | The setup code, used to init some values. <br/>Eg: const log = console.log                                       |
| layout    | string              | No       | "DEFAULT" | The predefined layouts for the components.<br/>There are two types of layout: <br/>1. DEFAULT<br/>2. SPLIT_PANEL |
| editor    | EditorProps         | No       | undefined | The editor component config.                                                                                     |
| terminal  | TerminalProps       | No       | undefined | The terminal component config.                                                                                   |
| console   | ConsoleProps        | No       | undefined | The console component config.                                                                                    |
| style     | React.CSSProperties | No       | {}        | It is used to style the component container.                                                                     |

### EditorProps

| Prop     | Type                | Required | Default | Description                               |
| -------- | ------------------- | -------- | ------- | ----------------------------------------- |
| header   | boolean             | No       | true    | Show / Hide the editor header component.  |
| darkMode | boolean             | No       | false   | The editor dark mode toggle.              |
| style    | React.CSSProperties | No       | {}      | It is used to style the editor container. |

### TerminalProps

| Prop  | Type                | Required | Default | Description                                 |
| ----- | ------------------- | -------- | ------- | ------------------------------------------- |
| show  | boolean             | No       | true    | Show / Hide the terminal component.         |
| style | React.CSSProperties | No       | {}      | It is used to style the terminal container. |

### ConsoleProps

| Prop  | Type                | Required | Default | Description                                |
| ----- | ------------------- | -------- | ------- | ------------------------------------------ |
| show  | boolean             | No       | true    | Show / Hide the console component.         |
| style | React.CSSProperties | No       | {}      | It is used to style the console container. |

## Limitations

- Currently, it runs only Node.js v18
- By default, in REPL mode, you cannot use import statements. You need to fallback to require().
- You can run ESM modules manually in the terminal with the ESM switch on. Eg: `$ node main.js`
- It is not possible to run [native addons](https://nodejs.org/api/addons.html).

## Related

- [@opentf/react-sandbox](https://github.com/Open-Tech-Foundation/react-sandbox) - The CodeSandbox sandpack wrapper with additional features.

- [@opentf/react-state](https://react-app-state.pages.dev/) - A global state manager for React.

- [@opentf/react-form](https://react-form.pages.dev/) - A simple form state manager for React.

- [@opentf/std](https://js-std.pages.dev/) - An Extensive JavaScript Standard Library.

## License

Copyright (c) 2021, [Thanga Ganapathy](https://github.com/Thanga-Ganapathy) ([MIT License](./LICENSE)).
