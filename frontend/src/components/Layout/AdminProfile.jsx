import { useState } from "react";
import PropTypes from "prop-types";
import {
  Box,
  Typography,
  Avatar,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { BsPersonCircle } from "react-icons/bs";
import axios from "axios";
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";
import config from "../../config/config";

const AdminProfile = ({ profileData, url }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newAvatar, setNewAvatar] = useState(url);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCloseDialog = () => {
    setIsEditing(false);
    setNewAvatar(url); // Reset avatar to original
  };

  const handleSaveChanges = async (values) => {
    try {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("email", values.email);
      formData.append("password", values.password);

      // Check if the avatar file is selected and append it to FormData
      if (newAvatar instanceof File) {
        formData.append("avatar", newAvatar);
      }

      // Make sure the request URL is correct and API is expecting the right headers
      const response = await axios.put(
        `${config.API_URL}/admin/profile/${profileData.id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data", // This is necessary for file uploads
          },
        }
      );

      console.log("Profile updated:", response.data);
      setIsEditing(false); // Close the dialog after successful update
    } catch (err) {
      console.error("Error updating profile:", err);
    }
  };

  // Validation Schema using Yup
  const validationSchema = Yup.object({
    name: Yup.string(),
    email: Yup.string().email("Invalid email address"),
    password: Yup.string(),
  });

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        {newAvatar ? (
          <Avatar
            src={
              newAvatar instanceof File
                ? URL.createObjectURL(newAvatar)
                : newAvatar
            }
            alt={`${profileData.name}'s avatar`}
            sx={{ width: 80, height: 80 }}
          />
        ) : (
          <Avatar sx={{ width: 80, height: 80 }}>
            <BsPersonCircle />
          </Avatar>
        )}
        <Box>
          <Typography variant="h6">{profileData.name}</Typography>
          <Typography variant="body2">{profileData.email}</Typography>
        </Box>
      </Box>
      <Button variant="outlined" color="primary" onClick={handleEditClick}>
        Edit
      </Button>

      {/* Edit Dialog with Formik */}
      <Dialog open={isEditing} onClose={handleCloseDialog}>
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogContent>
          <Formik
            initialValues={{
              name: profileData.name,
              email: profileData.email,
              password: "",
            }}
            validationSchema={validationSchema}
            onSubmit={handleSaveChanges}
          >
            {({ setFieldValue, errors, touched }) => (
              <Form>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <Field
                    as={TextField}
                    label="Name"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    name="name"
                    error={touched.name && !!errors.name}
                    helperText={touched.name && errors.name}
                  />
                  <Field
                    as={TextField}
                    label="Email"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    name="email"
                    error={touched.email && !!errors.email}
                    helperText={touched.email && errors.email}
                  />
                  <Field
                    as={TextField}
                    label="Password"
                    type="password"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    name="password"
                    error={touched.password && !!errors.password}
                    helperText={touched.password && errors.password}
                  />

                  {/* Avatar input inside the dialog */}
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body1">Change Avatar</Typography>
                    <input
                      id="avatar-input"
                      type="file"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          setNewAvatar(file);
                          setFieldValue("avatar", file); // Set avatar file for Formik
                        }
                      }}
                    />
                    <Button
                      variant="outlined"
                      component="span"
                      onClick={() =>
                        document.getElementById("avatar-input").click()
                      }
                    >
                      Choose Avatar
                    </Button>

                    {/* Display chosen avatar */}
                    {newAvatar && newAvatar instanceof File && (
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="body2">
                          Selected Avatar:
                        </Typography>
                        <Avatar
                          src={URL.createObjectURL(newAvatar)}
                          alt="New Avatar"
                          sx={{ width: 60, height: 60 }}
                        />
                      </Box>
                    )}
                  </Box>
                </Box>
                <DialogActions>
                  <Button onClick={handleCloseDialog} color="secondary">
                    Cancel
                  </Button>
                  <Button type="submit" color="primary">
                    Save Changes
                  </Button>
                </DialogActions>
              </Form>
            )}
          </Formik>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

AdminProfile.propTypes = {
  profileData: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    role: PropTypes.string,
    phone: PropTypes.string,
  }).isRequired,
  url: PropTypes.string,
};

export default AdminProfile;
