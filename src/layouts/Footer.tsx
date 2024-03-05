import { Link, Sheet } from "@mui/joy";

export default function Footer() {
  return (
    <Sheet
      component="footer"
      color="neutral"
      variant="solid"
      sx={{
        padding: "15px",
        textAlign: "center",
        height: "50px",
        boxSizing: "border-box",
      }}
    >
      © {new Date().getFullYear()}{" "}
      <Link
        href="https://open-tech-foundation.pages.dev/"
        sx={{ color: "white" }}
      >
        Open Tech Foundation
      </Link>
      .
    </Sheet>
  );
}
