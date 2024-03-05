import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import App from "./App.tsx";
import "./index.css";
import "@fontsource/inter";
import Docs from "./docs.tsx";
import DefaultLayout from "./layouts/Default.tsx";
import DocsLayout from "./layouts/Docs.tsx";
import { CssVarsProvider } from "@mui/joy";

const router = createBrowserRouter([
  {
    path: "/",
    element: <DefaultLayout />,
    children: [{ element: <App />, index: true }],
  },

  {
    path: "/docs",
    element: <DocsLayout />,
    children: [{ element: <Docs />, index: true }],
  },

  {
    path: "*",
    element: "Not found...",
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <CssVarsProvider>
    <RouterProvider router={router} />
  </CssVarsProvider>
);
