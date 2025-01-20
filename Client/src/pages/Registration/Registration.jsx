import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Button,
  TextField,
  Grid,
  Paper,
  Avatar,
  Typography,
  Box,
} from "@mui/material";
import axios from "axios";
import config from "../../config/config";
import { useNavigate } from "react-router-dom";

const Registration = () => {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      fullName: "",
      avatar: null,
      address: "",
      phone: "",
      email: "",
      birthday: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      fullName: Yup.string().required("Full Name is required"),
      address: Yup.string().required("Address is required"),
      phone: Yup.string()
        .required("Phone number is required")
        .matches(/^[0-9]{11}$/, "Phone number must be 10 digits"),
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      birthday: Yup.date().required("Birthday is required"),
      password: Yup.string()
        .required("Password is required")
        .min(8, "Password must be at least 8 characters"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password"), null], "Passwords must match")
        .required("Password confirmation is required"),
    }),
    onSubmit: async (values) => {
      const formData = new FormData();
      formData.append("fullName", values.fullName);
      formData.append("email", values.email);
      formData.append("avatar", values.avatar);
      formData.append("address", values.address);
      formData.append("phone", values.phone);
      formData.append("birthday", values.birthday);
      formData.append("password", values.password);

      try {
        const response = await axios.post(
          `${config.API_URL}/register`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        // Store the response data in localStorage
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("userId", response.data.user.id);
        localStorage.setItem("email", response.data.user.email);
        localStorage.setItem("avatar", response.data.user.avatar);
        localStorage.setItem("name", response.data.user.name);

        console.log("User registered:", response.data);

        navigate("/login");
      } catch (error) {
        console.error(
          "Registration failed:",
          error.response?.data || error.message
        );

        if (
          error.response &&
          error.response.status === 400 && // Replace with the actual status code if different
          error.response.data.message === "Email already in use"
        ) {
          // Display error message in formik
          formik.setFieldError("email", "This email is already registered.");
        } else {
          alert("Registration failed. This email is already registered!");
        }
      }
    },
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    formik.setFieldValue("avatar", file);
  };

  // Navigate to the login page
  const handleNavigateToLogin = () => {
    navigate("/login");
  };

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      sx={{
        minHeight: "100vh",
        backgroundColor: "#f5f5f5",
        padding: { xs: "1rem", sm: "2rem" },
        overflow: "auto", // Prevents overflow on larger screens
      }}
    >
      <Grid
        item
        xs={12}
        sm={10}
        md={8}
        lg={6}
        sx={{
          width: "100%",
          maxWidth: "500px",
          padding: "2rem",
          boxSizing: "border-box",
        }}
      >
        <Typography
          variant="h5"
          gutterBottom
          align="center"
          sx={{ fontSize: { xs: "1.5rem", sm: "2rem" } }}
        >
          User Registration
        </Typography>
        <Paper
          elevation={3}
          sx={{
            padding: "2rem",
            width: "100%",
            maxHeight: "80vh", // Limit the height to 90% of the viewport
            overflowY: "auto", // Allow scrolling if content exceeds maxHeight
          }}
        >
          <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={2}>
              {/* Avatar upload section */}
              <Grid
                item
                xs={12}
                container
                alignItems="center"
                justifyContent="center"
              >
                <Avatar
                  src={
                    formik.values.avatar
                      ? URL.createObjectURL(formik.values.avatar)
                      : ""
                  }
                  alt="Avatar"
                  sx={{
                    marginBottom: "1rem",
                    width: { xs: "60px", sm: "80px" },
                    height: { xs: "60px", sm: "80px" },
                  }}
                />
                <Button
                  variant="contained"
                  component="label"
                  sx={{ width: "100%" }}
                >
                  Upload Avatar
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={handleFileChange}
                  />
                </Button>
              </Grid>

              {/* Full Name field */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Full Name"
                  name="fullName"
                  variant="outlined"
                  margin="normal"
                  value={formik.values.fullName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.fullName && Boolean(formik.errors.fullName)
                  }
                  helperText={formik.touched.fullName && formik.errors.fullName}
                />
              </Grid>

              {/* Address field */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Address"
                  name="address"
                  variant="outlined"
                  margin="normal"
                  value={formik.values.address}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.address && Boolean(formik.errors.address)
                  }
                  helperText={formik.touched.address && formik.errors.address}
                />
              </Grid>

              {/* Phone field */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Phone"
                  name="phone"
                  variant="outlined"
                  margin="normal"
                  value={formik.values.phone}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.phone && Boolean(formik.errors.phone)}
                  helperText={formik.touched.phone && formik.errors.phone}
                />
              </Grid>

              {/* Email field */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email Address"
                  name="email"
                  type="email"
                  variant="outlined"
                  margin="normal"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
                />
              </Grid>

              {/* Birthday field */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Birthday"
                  name="birthday"
                  type="date"
                  variant="outlined"
                  margin="normal"
                  value={formik.values.birthday}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  InputLabelProps={{ shrink: true }}
                  error={
                    formik.touched.birthday && Boolean(formik.errors.birthday)
                  }
                  helperText={formik.touched.birthday && formik.errors.birthday}
                />
              </Grid>

              {/* Password field */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Password"
                  name="password"
                  type="password"
                  variant="outlined"
                  margin="normal"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.password && Boolean(formik.errors.password)
                  }
                  helperText={formik.touched.password && formik.errors.password}
                />
              </Grid>

              {/* Confirm Password field */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Confirm Password"
                  name="confirmPassword"
                  type="password"
                  variant="outlined"
                  margin="normal"
                  value={formik.values.confirmPassword}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.confirmPassword &&
                    Boolean(formik.errors.confirmPassword)
                  }
                  helperText={
                    formik.touched.confirmPassword &&
                    formik.errors.confirmPassword
                  }
                />
              </Grid>

              {/* Submit Button */}
              <Grid item xs={12}>
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  type="submit"
                >
                  Register
                </Button>
              </Grid>

              {/* Back to Login Section */}
              <Box ml={2} mt={2} textAlign="center">
                <Typography variant="body2">
                  Already have an account?{" "}
                  <Button
                    variant="text"
                    color="primary"
                    onClick={handleNavigateToLogin}
                  >
                    Login
                  </Button>
                </Typography>
              </Box>
            </Grid>
          </form>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Registration;
