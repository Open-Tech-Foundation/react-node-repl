import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import Header from "./Header";
import { Sheet } from "@mui/joy";

export default function DefaultLayout() {
  return (
    <>
      <Header />
      <main>
        <Sheet variant="plain">
          <Outlet />
        </Sheet>
      </main>
      <Footer />
    </>
  );
}
