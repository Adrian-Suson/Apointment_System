import { useState, useEffect } from "react";
import {
  Typography,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  AppBar,
  Toolbar,
  Box,
  Avatar,
  TextField,
  IconButton,
  useTheme,
} from "@mui/material";
import PropTypes from "prop-types";
import { IoMdMenu } from "react-icons/io";
import { AccountCircle, ExitToApp } from "@mui/icons-material";
import ProfileDialog from "./ProfileDialog";
import config from "../config/config";
import defaultAvatar from "../assets/Profile.jpg";

const Header = ({ toggleSidebar }) => {
  const userId = localStorage.getItem("userId"); // Get the user ID from localStorage
  const [user, setUser] = useState(null); // State to store user data
  const theme = useTheme();

  // State to control the dialog visibility
  const [openDialog, setOpenDialog] = useState(false);
  const [openProfileDialog, setOpenProfileDialog] = useState(false); // New state for profile dialog

  // Fetch user data by ID
  useEffect(() => {
    if (userId) {
      // Fetch user data from the server
      fetch(`${config.API_URL}/user/${userId}`)
        .then((response) => response.json())
        .then((data) => {
          setUser(data); // Set user data
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
        });
    }
  }, [userId]);

  // Handle dialog open/close
  const handleDialogOpen = () => {
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  // Handle View Profile Dialog
  const handleViewProfileDialogOpen = () => {
    setOpenProfileDialog(true); // Open profile dialog
    handleDialogClose(); // Close the avatar menu dialog
  };

  const handleProfileDialogClose = () => {
    setOpenProfileDialog(false); // Close the profile dialog

    // Refetch user data
    if (userId) {
      fetch(`${config.API_URL}/user/${userId}`)
        .then((response) => response.json())
        .then((data) => {
          setUser(data); // Update user state with the latest data
        })
        .catch((error) => {
          console.error(
            "Error fetching user data after closing profile dialog:",
            error
          );
        });
    }
  };

  // Handle Logout
  const handleLogout = () => {
    // Clear localStorage
    localStorage.clear();
    // Redirect to login page (or home page)
    window.location.href = "/login";
  };

  if (!user) {
    return null;
  }

  return (
    <>
      <AppBar
        position="static"
        sx={{
          height: 60,
          backgroundColor: "transparent",
          boxShadow: "none",
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between", // Space between the left and right items
            alignItems: "center",
            width: "100%",
            paddingX: 2,
          }}
        >
          {/* Search Bar (centered) */}
          <Box
            sx={{
              mb: 4,
              flexGrow: 1,
              marginLeft: "auto",
              marginRight: "auto",
              display: "flex",
            }}
          >
            <TextField
              variant="outlined"
              size="small"
              fullWidth
              placeholder="Search..."
              sx={{
                backgroundColor: "#fff", // White background for the input
                borderRadius: "20px",
                boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)", // Subtle shadow
                "& .MuiOutlinedInput-root": {
                  borderRadius: "20px", // Round the corners
                },
              }}
              InputProps={{
                startAdornment: (
                  <IconButton onClick={toggleSidebar} sx={{ padding: "10px" }}>
                    <IoMdMenu />
                  </IconButton>
                ),
                endAdornment: (
                  <Avatar
                    alt={user.name}
                    src={
                      `${config.API_URL}/profile_pictures/${user.avatar}` ||
                      defaultAvatar
                    } // Use default avatar if no avatar URL is provided
                    sx={{
                      width: 35,
                      height: 35,
                      mr: 1,
                      backgroundColor: theme.palette.secondary.main, // Background color for avatar
                      cursor: "pointer",
                      "&:hover": {
                        backgroundColor: theme.palette.secondary.light, // Hover effect
                      },
                    }}
                    onClick={handleDialogOpen} // Open dialog when clicked
                  />
                ),
              }}
            />
          </Box>
        </Toolbar>
      </AppBar>

      {/* Dialog for Avatar Menu */}
      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: 2,
            backgroundColor: theme.palette.background.default,
            color: theme.palette.text.primary,
          }}
        >
          <Avatar
            alt={user.name}
            src={
              `${config.API_URL}/profile_pictures/${user.avatar}` ||
              defaultAvatar
            } // Display the default avatar if no avatar is available
            sx={{
              width: 80,
              height: 80,
              border: `2px solid ${theme.palette.primary.main}`, // Border around the avatar
            }}
          />
        </DialogTitle>
        <DialogContent
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center", // Center everything
            gap: 2,
            paddingTop: 2,
            paddingBottom: 3,
            backgroundColor: theme.palette.background.paper,
            color: theme.palette.text.primary,
            minWidth: "300px", // Set a minimum width to keep layout consistent
          }}
        >
          <Typography
            variant="h6"
            sx={{ fontWeight: "bold", textAlign: "center" }}
          >
            {user.name}
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: theme.palette.text.secondary }}
          >
            {user.email}
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              width: "100%",
            }}
          >
            <Button
              startIcon={<AccountCircle />}
              onClick={handleViewProfileDialogOpen} // Open Profile Dialog
              fullWidth
              sx={{
                textTransform: "none",
                justifyContent: "flex-start",
                backgroundColor: theme.palette.action.hover,
                "&:hover": {
                  backgroundColor: theme.palette.action.selected,
                },
              }}
            >
              View Profile
            </Button>
            <Button
              startIcon={<ExitToApp />}
              onClick={handleLogout} // Handle Logout
              fullWidth
              sx={{
                textTransform: "none",
                justifyContent: "flex-start",
                backgroundColor: theme.palette.error.light,
                color: "white", // Make the text color white
                "&:hover": {
                  backgroundColor: theme.palette.error.dark, // Darker background color on hover
                },
              }}
            >
              Logout
            </Button>
          </Box>
        </DialogContent>
        <DialogActions
          sx={{
            padding: "10px 20px",
            backgroundColor: theme.palette.background.default,
            justifyContent: "center", // Center the close button
          }}
        >
          <Button
            onClick={handleDialogClose}
            color="primary"
            sx={{ textTransform: "none" }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Profile Dialog */}
      <ProfileDialog
        open={openProfileDialog}
        onClose={handleProfileDialogClose}
        user={user}
      />
    </>
  );
};

// Define PropTypes for the props
Header.propTypes = {
  toggleSidebar: PropTypes.func.isRequired,
};

export default Header;
