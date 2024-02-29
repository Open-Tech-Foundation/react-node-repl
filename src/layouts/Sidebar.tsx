import { Box, List, ListItem, ListItemButton, ListItemContent } from "@mui/joy";
import { useState } from "react";

const sections = [
  "Introduction",
  "Requirements",
  "Installation",
  "Usage",
  "API",
  "Limitations"
];

export default function Sidebar() {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const renderItems = () => {
    return sections.map((s, i) => (
      <ListItem
        key={i}
        component="a"
        href={`#Section_${s}`}
        sx={{
          textDecoration: "none",
          borderLeft:
            selectedIndex === i
              ? (t) => `3px solid ${t.palette.primary.solidActiveBg}`
              : "",
        }}
      >
        <ListItemButton
          color="primary"
          selected={selectedIndex === i}
          onClick={() => setSelectedIndex(i)}
        >
          <ListItemContent>{s}</ListItemContent>
        </ListItemButton>
      </ListItem>
    ));
  };

  return (
    <Box
      component="aside"
      sx={{
        alignSelf: "start",
        position: "sticky",
        top: "60px",
        borderRight: "1px solid lightgrey",
        boxSizing: "border-box",
      }}
    >
      <Box
        sx={{
          overflow: "auto",
          height: "calc(100vh - 60px)",
          minWidth: "250px",
        }}
      >
        <List>{renderItems()}</List>
      </Box>
    </Box>
  );
}
