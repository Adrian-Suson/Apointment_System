import {
  Box,
  List,
  ListItemIcon,
  ListItemText,
  Divider,
  Button,
  ListItemButton,
  Tooltip,
  useTheme,
  Typography,
} from "@mui/material";
import {
  MdEvent,
  MdDashboard,
  MdAnnouncement,
} from "react-icons/md";
import { FaPeopleGroup, FaUserDoctor } from "react-icons/fa6";
import { GiExitDoor } from "react-icons/gi";
import PropTypes from "prop-types";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Sidebar = ({ isMinimized }) => {
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    if (location.pathname.includes("/admin")) {
      navigate("/admin"); // Redirect to admin login
    } else if (location.pathname.includes("/doctor")) {
      navigate("/doctor"); // Redirect to doctor login
    } else {
      navigate("/"); // Default redirect to home
    }
  };

  // Define menu items for Admin and Doctor
  const adminMenuItems = [
    {
      text: "Dashboard",
      icon: <MdDashboard size="25px" />,
      path: "/admin/dashboard",
    },
    {
      text: "Announcement",
      icon: <MdAnnouncement size="25px" />,
      path: "/admin/announcement",
    },
    {
      text: "Waitlist & Appointments",
      icon: <MdEvent size="25px" />,
      path: "/admin/waitlist&appointments",
    },
    {
      text: "Doctors",
      icon: <FaUserDoctor size="25px" />,
      path: "/admin/doctors",
    },
    {
      text: "Users",
      icon: <FaPeopleGroup size="25px" />,
      path: "/admin/users",
    },
  ];

  const doctorMenuItems = [
    {
      text: "Dashboard",
      icon: <MdDashboard size="25px" />,
      path: "/doctor/dashboard",
    },
    {
      text: "Waitlist & Appointments",
      icon: <MdEvent size="25px" />,
      path: "/doctor/waitlist&appointments",
    },
    {
      text: "Schedules",
      icon: <MdEvent size="25px" />,
      path: "/doctor/schedules",
    },
  ];

  // Choose menu items based on the current path
  const menuItems = location.pathname.includes("/admin")
    ? adminMenuItems
    : location.pathname.includes("/doctor")
    ? doctorMenuItems
    : [];

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.primary.main,
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: isMinimized ? theme.spacing(1) : theme.spacing(2),
        width: isMinimized ? "60px" : "250px",
        transition: "width 0.3s ease, padding 0.3s ease",
        boxSizing: "border-box",
        height: "calc(100vh - 50px)",
        boxShadow: "none",
      }}
    >
      {/* Menu Section */}
      <Box>
        <Typography
          variant="body1"
          sx={{ color: theme.palette.primary.contrastText, fontWeight: "bold" }}
        >
          Menu
        </Typography>
        <List
          component="nav"
          sx={{
            gap: 1,
            marginTop: isMinimized ? theme.spacing(3) : theme.spacing(1),
          }}
        >
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
                  justifyContent: isMinimized ? "center" : "flex-start",
                  alignItems: "center",
                  backgroundColor:
                    location.pathname === item.path
                      ? theme.palette.secondary.main
                      : "transparent",
                  borderRadius: theme.shape.borderRadius,
                  marginBottom: theme.spacing(1),
                  padding: isMinimized ? theme.spacing(0.5) : theme.spacing(1),
                  transition: "background-color 0.3s ease, padding 0.3s ease",
                  "&:hover": {
                    backgroundColor:
                      location.pathname === item.path
                        ? theme.palette.secondary.light
                        : theme.palette.primary.dark,
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    ml: isMinimized ? 1 : 0,
                    color: location.pathname === item.path ? "#fff" : "#fff",
                    minWidth: theme.spacing(4.5),
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                {!isMinimized && (
                  <ListItemText
                    primary={item.text}
                    sx={{
                      color: location.pathname === item.path ? "#fff" : "#fff",
                      fontWeight:
                        location.pathname === item.path ? "bold" : "normal",
                      "& .MuiTypography-root": {
                        color:
                          location.pathname === item.path ? "#fff" : "#fff", // Explicitly target the text element
                        fontWeight:
                          location.pathname === item.path ? "bold" : "normal",
                      },
                    }}
                  />
                )}
              </ListItemButton>
            </Tooltip>
          ))}
        </List>
      </Box>

      {/* Footer Section */}
      <Box>
        <Divider
          sx={{
            marginBottom: theme.spacing(2),
            backgroundColor: theme.palette.secondary.main,
          }}
        />
        <Box
          sx={{
            backgroundColor: theme.palette.error.main,
            padding: isMinimized ? theme.spacing(1) : theme.spacing(1.25),
            borderRadius: theme.shape.borderRadius,
            display: "flex",
            justifyContent: isMinimized ? "center" : "flex-start",
            alignItems: "center",
            height: isMinimized ? theme.spacing(4) : theme.spacing(5),
            "&:hover": {
              backgroundColor: theme.palette.error.dark,
            },
          }}
        >
          <Button
            onClick={handleLogout}
            startIcon={<GiExitDoor />}
            sx={{
              ml: isMinimized ? 1.5 : 0,
              color: theme.palette.error.contrastText,
              fontSize: theme.typography.body1.fontSize,
              fontWeight: "bold",
              width: "100%",
              justifyContent: isMinimized ? "center" : "flex-start",
            }}
          >
            {!isMinimized && "Sign Out"}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

Sidebar.propTypes = {
  isMinimized: PropTypes.bool.isRequired,
};

export default Sidebar;
