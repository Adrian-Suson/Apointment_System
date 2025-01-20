import { Outlet } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { Box } from "@mui/material";
import { useState } from "react";

const Layout = () => {
  // Retrieve the initial state from localStorage, or default to false if not set
  const savedSidebarState = localStorage.getItem("isSidebarMinimized");
  const initialSidebarState = savedSidebarState ? JSON.parse(savedSidebarState) : false;

  const [isSidebarMinimized, setSidebarMinimized] = useState(initialSidebarState);

  // Toggle Sidebar and save state to localStorage
  const toggleSidebar = () => {
    const newState = !isSidebarMinimized;
    setSidebarMinimized(newState);
    localStorage.setItem("isSidebarMinimized", JSON.stringify(newState)); // Save the new state to localStorage
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      {/* Header with Sidebar toggle button */}
      <Header toggleSidebar={toggleSidebar} />

      <Box sx={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* Sidebar */}
        <Sidebar isMinimized={isSidebarMinimized} />

        {/* Main Content */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            padding: 2,
            overflowY: "auto",
            backgroundColor: "#f4f7fa",
            height: "100%",
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;
