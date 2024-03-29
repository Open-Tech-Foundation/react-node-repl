import Sidebar from "./Sidebar";
import Header from "./Header";
import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import { Box, Sheet } from "@mui/joy";

export default function DocsLayout() {
  return (
    <>
      <Header />
      <Box sx={{ display: "flex" }}>
        <Sidebar />
        <Sheet component="main" sx={{ flexGrow: 1, padding: 5 }}>
          <Outlet />
        </Sheet>
      </Box>
      <Footer />
    </>
  );
}
