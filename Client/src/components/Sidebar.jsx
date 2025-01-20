import {
  Box,
  List,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Tooltip,
  Typography,
  Avatar,
  Divider,
} from "@mui/material";
import {
  MdAssignment,
  MdAnnouncement,
} from "react-icons/md";
//import { FaMessage } from "react-icons/fa6";
import { FaUserDoctor } from "react-icons/fa6";
import PropTypes from "prop-types";
import { Link, useLocation } from "react-router-dom";
import config from "../config/config";

const Sidebar = ({ isMinimized, user }) => {
  const location = useLocation();
  const menuItems = [
    {
      text: "Announcement",
      icon: <MdAnnouncement size="25px" />,
      path: "/announcement",
    },
    { text: "Doctors", icon: <FaUserDoctor size="25px" />, path: "/doctors" },
    { text: "Appointments", icon: <MdAssignment size="25px" />, path: "/appointments" },
  ];

  return (
    <Box
      sx={{
        backgroundColor: "#fff",
        color: "black",
        display: "flex",
        flexDirection: "column",
        padding: isMinimized ? 0 : 2,
        width: isMinimized ? 0 : 250,
        overflow: "hidden",
        transition: "width 0.3s ease, padding 0.3s ease",
        boxSizing: "border-box",
        boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)",
      }}
    >
      {/* User Profile Section */}
      {!isMinimized && user && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginBottom: 2,
            padding: 2,
            backgroundColor: "#f5f5f5", // Light background for profile
            borderRadius: 2,
            boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Avatar
            alt={user.name}
            src={`${config.API_URL}/profile_pictures/${user.avatar}`}
            sx={{ width: 80, height: 80, marginBottom: 1 }} // Larger avatar
          />
          <Box sx={{ textAlign: "center" }}>
            {" "}
            {/* Centered text */}
            <Typography variant="body1" sx={{ fontWeight: "bold" }}>
              {user.name}
            </Typography>
            <Typography variant="body2" sx={{ color: "gray" }}>
              {user.email}
            </Typography>
          </Box>
        </Box>
      )}

      {/* Menu Section */}
      {!isMinimized && (
        <Box sx={{ marginTop: 1 }}>
          <Divider sx={{ marginBottom: 2 }} />{" "}
          {/* Add divider for separation */}
          <List component="nav">
            {menuItems.map((item, index) => (
              <Tooltip
                key={index}
                title={isMinimized ? item.text : ""}
                placement="right"
                arrow
                disableInteractive
              >
                <ListItemButton
                  component={Link}
                  to={item.path}
                  sx={{
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    backgroundColor:
                      location.pathname === item.path
                        ? "rgba(0, 0, 0, 0.1)"
                        : "transparent",
                    borderRadius: 2,
                    marginBottom: 1,
                    padding: 1.5,
                    transition: "background-color 0.3s ease, padding 0.3s ease",
                    "&:hover": {
                      backgroundColor:
                        location.pathname === item.path
                          ? "rgba(0, 0, 0, 0.2)"
                          : "rgba(0, 0, 0, 0.05)",
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: location.pathname === item.path ? "black" : "gray",
                      minWidth: 36,
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>

                  {/* Conditionally render text based on sidebar state */}
                  {!isMinimized && (
                    <ListItemText
                      primary={item.text}
                      sx={{
                        color:
                          location.pathname === item.path ? "black" : "gray",
                        fontWeight:
                          location.pathname === item.path ? "bold" : "normal",
                      }}
                    />
                  )}
                </ListItemButton>
              </Tooltip>
            ))}
          </List>
        </Box>
      )}
    </Box>
  );
};

Sidebar.propTypes = {
  isMinimized: PropTypes.bool,
  user: PropTypes.shape({
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    avatar: PropTypes.string,
  }),
};

export default Sidebar;
