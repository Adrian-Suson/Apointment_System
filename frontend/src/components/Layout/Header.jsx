import { useState, useEffect, useCallback, useRef } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  useTheme,
  Box,
  Avatar,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
} from "@mui/material";
import PropTypes from "prop-types";
import MenuIcon from "@mui/icons-material/Menu";
import { BsPersonCircle } from "react-icons/bs";
import axios from "axios";
import config from "../../config/config";
import DoctorProfile from "./DoctorProfile";
import AdminProfile from "./AdminProfile";

const Header = ({ toggleSidebar }) => {
  const theme = useTheme();

  const [openDialog, setOpenDialog] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  const doctorData = window.location.pathname.includes("doctor")
    ? JSON.parse(localStorage.getItem("doctorData"))
    : null;

  const adminData = window.location.pathname.includes("admin")
    ? JSON.parse(localStorage.getItem("adminData"))
    : null;

  // To track if the data has been fetched already
  const dataFetchedRef = useRef(false);

  // Fetch profile data when component mounts or doctorData/adminData changes
  const fetchProfileData = useCallback(async (id, type) => {
    if (dataFetchedRef.current) return; // Prevent refetching if already fetched
    dataFetchedRef.current = true; // Mark data as fetched

    setLoading(true);
    try {
      const response = await axios.get(
        `${config.API_URL}/${type}/profile/${id}`
      );
      setProfileData(response.data);
      console.log("Profile data:", response.data);
    } catch (error) {
      console.error("Error fetching profile data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Only fetch data when dialog is opened
  useEffect(() => {
    if (openDialog && !profileData) {
      if (doctorData) {
        fetchProfileData(doctorData.id, "doctor");
      } else if (adminData) {
        fetchProfileData(adminData.id, "admin");
      }
    }
    if (doctorData) {
      fetchProfileData(doctorData.id, "doctor");
    } else if (adminData) {
      fetchProfileData(adminData.id, "admin");
    }
  }, [openDialog, doctorData, adminData, fetchProfileData, profileData]);

  const handleAvatarClick = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  // If profileData exists, use it for the avatar, name, and email
  const avatarUrl = profileData?.avatar
    ? `${config.API_URL}/profile_pictures/${profileData.avatar}`
    : null;

  const name = profileData?.name || "User";
  const email = profileData?.email || "No Email";

  return (
    <>
      <AppBar
        position="static"
        sx={{
          backgroundColor: theme.palette.primary.main,
          borderRadius: 0,
          height: "60px",
          boxShadow: "none", // Ensure no shadow
        }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2, mb: 4 }}
            onClick={toggleSidebar}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1, mb: 4 }}>
            Health Management System
          </Typography>
          <Box
            sx={{ display: "flex", alignItems: "center", gap: 2, mb: 4 }}
            onClick={handleAvatarClick}
          >
            {avatarUrl ? (
              <Avatar src={avatarUrl} alt={`${name}'s avatar`} />
            ) : (
              <Avatar>
                <BsPersonCircle />
              </Avatar>
            )}
            <Box>
              <Typography sx={{ color: "white", fontWeight: "bold" }}>
                {name}
              </Typography>
              <Typography sx={{ color: "white", fontSize: "0.875rem" }}>
                {email}
              </Typography>
            </Box>
          </Box>
        </Toolbar>
      </AppBar>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{`${name}'s Profile`}</DialogTitle>
        <DialogContent>
          {loading ? (
            <Typography variant="body1">Loading...</Typography>
          ) : profileData ? (
            doctorData ? (
              <DoctorProfile
                profileData={profileData}
                url={avatarUrl}
                doctorId={doctorData.id}
              />
            ) : adminData ? (
              <AdminProfile profileData={profileData} url={avatarUrl} />
            ) : (
              <Typography variant="body1">No profile data available</Typography>
            )
          ) : (
            <Typography variant="body1">No profile data available</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

Header.propTypes = {
  toggleSidebar: PropTypes.func.isRequired,
};

export default Header;
