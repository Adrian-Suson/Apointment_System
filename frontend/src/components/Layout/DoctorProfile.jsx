import PropTypes from "prop-types"; // Import PropTypes for type checking
import { useState } from "react";
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
  Grid,
} from "@mui/material";
import { BsPersonCircle } from "react-icons/bs";
import { Formik, Field, Form } from "formik";
import * as Yup from "yup"; // Import Yup for validation
import axios from "axios"; // Ensure axios is imported
import config from "../../config/config";

const DoctorProfile = ({ profileData, url, doctorId }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newAvatar, setNewAvatar] = useState(url); // State to manage avatar image change

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCloseDialog = () => {
    setIsEditing(false);
    setNewAvatar(url); // Reset avatar to original if dialog is closed
  };

  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    birthdate: Yup.string(),
    address: Yup.string(),
    specialty_name: Yup.string(),
    phone_number: Yup.string(),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .optional(),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .optional(),
  });

  const handleSubmit = async (values) => {
    const formData = new FormData();
    // Append form data fields
    formData.append("name", values.name);
    formData.append("email", values.email);
    formData.append("birthdate", values.birthdate);
    formData.append("address", values.address);
    formData.append("specialty_name", values.specialty_name);
    formData.append("phone_number", values.phone_number);
    formData.append("password", values.password);
    formData.append("confirmPassword", values.confirmPassword);

    // If new avatar is selected, append it to the formData
    if (newAvatar instanceof File) {
      formData.append("avatar", newAvatar);
    }

    try {
      const response = await axios.put(
        `${config.API_URL}/doctor/profile/${doctorId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Important for file uploads
          },
        }
      );

      if (response.status === 200) {
        setIsEditing(false); // Close dialog after saving
      } else {
        console.error("Error updating profile:", response.data.msg);
      }
    } catch (error) {
      console.error("Error submitting profile:", error);
    }
  };

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

      <Box>
        <Typography variant="body1">
          <strong>Birthdate:</strong> {profileData.birthdate || "Not Provided"}
        </Typography>
        <Typography variant="body1">
          <strong>Address:</strong> {profileData.address || "Not Provided"}
        </Typography>
        <Typography variant="body1">
          <strong>Specialization:</strong>{" "}
          {profileData.specialty_name || "Not Provided"}
        </Typography>
        <Typography variant="body1">
          <strong>Phone Number:</strong>{" "}
          {profileData.phone_number || "Not Provided"}
        </Typography>
      </Box>

      <Button variant="outlined" color="primary" onClick={handleEditClick}>
        Edit
      </Button>

      {/* Edit Dialog with Formik */}
      <Dialog open={isEditing} onClose={handleCloseDialog}>
        <DialogTitle>Edit Doctor Profile</DialogTitle>
        <DialogContent>
          <Formik
            initialValues={{
              name: profileData.name,
              email: profileData.email,
              birthdate: profileData.birthdate || "",
              address: profileData.address || "",
              specialty_name: profileData.specialty_name || "",
              phone_number: profileData.phone_number || "",
              password: "",
              confirmPassword: "",
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ setFieldValue, errors, touched }) => (
              <Form>
                <Grid container spacing={2}>
                  {/* Name */}
                  <Grid item xs={12} sm={6}>
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
                  </Grid>

                  {/* Email */}
                  <Grid item xs={12} sm={6}>
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
                  </Grid>

                  {/* Birthdate */}
                  <Grid item xs={12} sm={6}>
                    <Field
                      as={TextField}
                      label="Birthdate"
                      type="date"
                      variant="outlined"
                      fullWidth
                      margin="normal"
                      name="birthdate"
                      error={touched.birthdate && !!errors.birthdate}
                      helperText={touched.birthdate && errors.birthdate}
                    />
                  </Grid>

                  {/* Address */}
                  <Grid item xs={12} sm={6}>
                    <Field
                      as={TextField}
                      label="Address"
                      variant="outlined"
                      fullWidth
                      margin="normal"
                      name="address"
                      error={touched.address && !!errors.address}
                      helperText={touched.address && errors.address}
                    />
                  </Grid>

                  {/* Specialization */}
                  <Grid item xs={12} sm={6}>
                    <Field
                      as={TextField}
                      label="Specialization"
                      variant="outlined"
                      fullWidth
                      margin="normal"
                      name="specialty_name"
                      error={touched.specialty_name && !!errors.specialty_name}
                      helperText={
                        touched.specialty_name && errors.specialty_name
                      }
                    />
                  </Grid>

                  {/* Phone Number */}
                  <Grid item xs={12} sm={6}>
                    <Field
                      as={TextField}
                      label="Phone Number"
                      variant="outlined"
                      fullWidth
                      margin="normal"
                      name="phone_number"
                      error={touched.phone_number && !!errors.phone_number}
                      helperText={touched.phone_number && errors.phone_number}
                    />
                  </Grid>

                  {/* Password */}
                  <Grid item xs={12} sm={6}>
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
                  </Grid>

                  {/* Confirm Password */}
                  <Grid item xs={12} sm={6}>
                    <Field
                      as={TextField}
                      label="Confirm Password"
                      type="password"
                      variant="outlined"
                      fullWidth
                      margin="normal"
                      name="confirmPassword"
                      error={
                        touched.confirmPassword && !!errors.confirmPassword
                      }
                      helperText={
                        touched.confirmPassword && errors.confirmPassword
                      }
                    />
                  </Grid>

                  {/* Avatar input inside the dialog */}
                  <Grid item xs={12}>
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
                  </Grid>
                </Grid>

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

DoctorProfile.propTypes = {
  profileData: PropTypes.shape({
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    birthdate: PropTypes.string,
    address: PropTypes.string,
    specialty_name: PropTypes.string,
    phone_number: PropTypes.string,
  }).isRequired,
  url: PropTypes.string, // Avatar URL is optional
  doctorId: PropTypes.number.isRequired, // The doctorId is required for the API call
};

export default DoctorProfile;
