import { Outlet } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { Box, CircularProgress, Typography, useMediaQuery, useTheme, Drawer } from "@mui/material";
import { useState, useEffect } from "react";
import axios from "axios";
import config from "../config/config";

const Layout = () => {
  const savedSidebarState = localStorage.getItem("isSidebarMinimized");
  const initialSidebarState = savedSidebarState ? JSON.parse(savedSidebarState) : false;
  const userId = localStorage.getItem("userId");
  const [isSidebarMinimized, setSidebarMinimized] = useState(initialSidebarState);
  const [user, setUser] = useState(null); // To store user details
  const [loading, setLoading] = useState(true); // To manage loading state
  const [error, setError] = useState(null); // To store error state
  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false); // Mobile sidebar toggle

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // Check if screen size is mobile

  const toggleSidebar = () => {
    if (isMobile) {
      setMobileSidebarOpen(!isMobileSidebarOpen); // Toggle the mobile sidebar
    } else {
      const newState = !isSidebarMinimized;
      setSidebarMinimized(newState);
      localStorage.setItem("isSidebarMinimized", JSON.stringify(newState)); // Save the new state to localStorage
    }
  };

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        if (userId) {
          const response = await axios.get(`${config.API_URL}/user/${userId}`);
          setUser(response.data); // Set user details in state
        }
      } catch (error) {
        setError("Error fetching user details");
        console.error(error);
      } finally {
        setLoading(false); // Set loading to false once the data is fetched
      }
    };

    fetchUserDetails();
  }, [userId]);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      {/* Header */}
      <Header toggleSidebar={toggleSidebar} user={user} />

      <Box sx={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* Sidebar for Desktop & Drawer for Mobile */}
        {isMobile ? (
          <Drawer
            anchor="left"
            open={isMobileSidebarOpen}
            onClose={() => setMobileSidebarOpen(false)}
            sx={{ zIndex: theme.zIndex.drawer + 2 }}
          >
            <Sidebar user={user} />
          </Drawer>
        ) : (
          <Box
            sx={{
              flexShrink: 0,
              width: isSidebarMinimized ? "80px" : "240px",
              transition: "width 0.3s ease",
            }}
          >
            <Sidebar isMinimized={isSidebarMinimized} user={user} />
          </Box>
        )}

        {/* Main Content */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            padding: 2,
            overflowY: "auto",
            backgroundColor: "#f4f7fa",
          }}
        >
          {/* Loading State */}
          {loading ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
              }}
            >
              <CircularProgress />
            </Box>
          ) : error ? (
            <Typography color="error">{error}</Typography>
          ) : (
            <Outlet />
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;
