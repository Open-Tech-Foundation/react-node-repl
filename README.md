<img align="left" src="https://open-tech-foundation.pages.dev/img/Logo.svg" width="50" height="50">

&nbsp;[OPEN TECH FOUNDATION](https://open-tech-foundation.pages.dev/)

<div align="center">

# React Node REPL

![Demo](./assets/Screenshot%20from%202024-02-24%2005-20-39.png)

</div>

> The Node.js REPL in a React component.

# [Live Demo](https://node-repl.pages.dev/)

## Features

- Simple API
- Uses WebContainer from [https://webcontainers.io/](https://webcontainers.io/)
- Switch between `Terminal` or `Console` View
- TypeScript support

## Upcoming

- Serialization of objects for better console view
- Code formating
- Syntax errors highlighting
- TypeScript errors
- Keyboard shortcuts

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

<NodeREPL deps={[]} style={{ height: "50vh" }} />;
```

## API

WIP

## License

Copyright (c) 2021, [Thanga Ganapathy](https://github.com/Thanga-Ganapathy) ([MIT License](./LICENSE)).
