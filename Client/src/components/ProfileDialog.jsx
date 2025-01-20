import PropTypes from "prop-types"; // Import PropTypes
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Typography,
  Box,
  Avatar,
  TextField,
  Grid,
} from "@mui/material";
import { Email, Phone, Home, Cake, Edit } from "@mui/icons-material"; // Importing icons
import defaultAvatar from "../assets/Profile.jpg";
import config from "../config/config";
import { useState } from "react";

const ProfileDialog = ({ open, onClose, user }) => {
  const [isEditMode, setIsEditMode] = useState(false); // State to toggle between view and edit mode
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone,
    address: user.address,
    birthday: user.birthday,
    avatar: null, // To store the selected file
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      avatar: e.target.files[0], // Store the file
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("name", formData.name);
    data.append("email", formData.email);
    data.append("phone", formData.phone);
    data.append("address", formData.address);
    data.append("birthday", formData.birthday);
    if (formData.avatar) {
      data.append("avatar", formData.avatar); // Append the avatar file
    }

    try {
      const response = await fetch(`${config.API_URL}/user/${user.id}`, {
        method: "PUT",
        body: data,
      });

      if (response.ok) {
        const updatedUser = await response.json();
        onClose(updatedUser); // Pass the updated user back to the parent to refresh data
        setIsEditMode(false); // Switch to view mode
      } else {
        const errorData = await response.json();
        console.error(errorData);
      }
    } catch (err) {
      console.error("Error updating profile:", err);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullScreen>
      <DialogTitle
        sx={{ textAlign: "center", fontWeight: "bold", fontSize: "1.25rem" }}
      >
        {isEditMode ? "Edit Profile" : "Profile Details"}
      </DialogTitle>
      <DialogContent
        sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        {/* Avatar Section */}
        <Box
          sx={{
            mb: 3,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <Avatar
            alt={user.name}
            src={
              formData.avatar
                ? URL.createObjectURL(formData.avatar)
                : `${config.API_URL}/profile_pictures/${user.avatar}` ||
                  defaultAvatar
            }
            sx={{ width: 100, height: 100, mb: 2 }}
          />
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            {user.name}
          </Typography>
        </Box>

        {/* Profile Display or Edit Form */}
        {isEditMode ? (
          // Edit Mode: Form fields to edit the profile
          <form onSubmit={handleSubmit} style={{ width: "100%" }}>
            <TextField
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              label="Phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              label="Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              label="Birthday"
              name="birthday"
              type="date"
              value={formData.birthday}
              onChange={handleChange}
              fullWidth
              sx={{ mb: 2 }}
            />

            {/* Avatar File Upload */}
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{ marginBottom: "1rem" }}
            />

            {/* Dialog Actions */}
            <DialogActions
              sx={{ justifyContent: "center", paddingBottom: "20px" }}
            >
              <Button
                type="submit" // Submit the form (no need for onClick handler)
                color="primary"
                variant="outlined"
                sx={{ marginRight: 2 }}
              >
                Save
              </Button>
              <Button
                onClick={() => setIsEditMode(false)}
                color="secondary"
                variant="contained"
              >
                Cancel
              </Button>
            </DialogActions>
          </form>
        ) : (
          // View Mode: Display the user's profile details with icons
          <Box sx={{ textAlign: "center", width: "100%" }}>
            <Grid
              container
              spacing={2}
              direction="column"
              alignItems="flex-start"
            >
              <Grid item>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Edit sx={{ mr: 1 }} />
                  <Typography
                    variant="body1"
                    sx={{ mb: 1, textAlign: "start" }}
                  >
                    <strong>Name:</strong> {user.name}
                  </Typography>
                </Box>
              </Grid>
              <Grid item>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Email sx={{ mr: 1 }} />
                  <Typography
                    variant="body1"
                    sx={{ mb: 1, textAlign: "start" }}
                  >
                    <strong>Email:</strong> {user.email}
                  </Typography>
                </Box>
              </Grid>
              <Grid item>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Phone sx={{ mr: 1 }} />
                  <Typography
                    variant="body1"
                    sx={{ mb: 1, textAlign: "start" }}
                  >
                    <strong>Phone:</strong> {user.phone}
                  </Typography>
                </Box>
              </Grid>
              <Grid item>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Typography
                    variant="body1"
                    sx={{
                      mb: 1,
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <Home sx={{ mr: 1 }} /> <strong>Address:</strong>
                    {user.address}
                  </Typography>
                </Box>
              </Grid>
              <Grid item>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Cake sx={{ mr: 1 }} />
                  <Typography
                    variant="body1"
                    sx={{ mb: 1, textAlign: "start" }}
                  >
                    <strong>Birthday:</strong> {user.birthday}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
        )}
      </DialogContent>

      {/* Dialog Actions */}
      <DialogActions sx={{ justifyContent: "center", paddingBottom: "20px" }}>
        <Button
          onClick={onClose} // Close the dialog without saving
          color="secondary"
          variant="contained"
        >
          Close
        </Button>
        {!isEditMode && (
          <Button
            onClick={() => setIsEditMode(true)} // Switch to edit mode
            color="primary"
            variant="outlined"
          >
            Edit
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

// PropTypes for the ProfileDialog component
ProfileDialog.propTypes = {
  open: PropTypes.bool.isRequired, // The open state for the dialog
  onClose: PropTypes.func.isRequired, // Function to close the dialog
  user: PropTypes.shape({
    id: PropTypes.number.isRequired, // User ID
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    birthday: PropTypes.string.isRequired,
    address: PropTypes.string.isRequired,
    phone: PropTypes.string.isRequired,
    avatar: PropTypes.string, // Avatar URL (optional)
  }).isRequired, // user prop must contain user details
};

export default ProfileDialog;
