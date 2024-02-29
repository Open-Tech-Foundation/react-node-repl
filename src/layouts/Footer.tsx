import { Link } from "@mui/joy";

export default function Footer() {
  return (
    <footer
      style={{
        backgroundColor: "black",
        color: "white",
        padding: "15px",
        textAlign: "center",
        height: "50px",
        boxSizing: "border-box",
      }}
    >
      © {new Date().getFullYear()}{" "}
      <Link href="https://open-tech-foundation.pages.dev/">
        Open Tech Foundation
      </Link>
      .
    </footer>
  );
}
