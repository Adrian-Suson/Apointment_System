import { useState, useEffect } from "react";
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Grid,
  CircularProgress,
  Alert,
  InputAdornment,
  Autocomplete,
} from "@mui/material";
import {
  AccountCircle,
  Email,
  Lock,
  CalendarToday,
  Home,
  Phone,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import axios from "axios";
import config from "../../../config/config";

// Validation Schema using Yup
const validationSchema = Yup.object({
  name: Yup.string().required("Full Name is required"),
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Confirm password is required"),
  birthdate: Yup.date().required("Birthdate is required"),
  address: Yup.string().required("Address is required"),
  specialization: Yup.string().required("Specialization is required"),
  phone_number: Yup.string()
    .matches(/^[0-9]+$/, "Phone number must be digits only")
    .required("Phone number is required"),
});

const DoctorRegister = () => {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [specializations, setSpecializations] = useState([]);

  const navigate = useNavigate();

  // Fetch specializations when the component is mounted
  useEffect(() => {
    const fetchSpecializations = async () => {
      try {
        const response = await axios.get(`${config.API_URL}/doctor-specialties`);
        setSpecializations(response.data);
      } catch (err) {
        setError("Failed to fetch specializations");
      }
    };

    fetchSpecializations();
  }, []);

  const initialValues = {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    birthdate: "",
    address: "",
    specialization: "",
    phone_number: "",
  };

  const handleSubmit = async (values) => {
    setLoading(true);
    setError("");
    setSuccess("");

    // Map 'specialization' to 'specialization_id'
    const formData = {
      ...values,
      specialization_id: values.specialization, // Set the specialization_id field
    };

    console.log("Sending data to backend:", values);

    try {
      const response = await axios.post(
        `${config.API_URL}/doctor/register`,
        formData
      );
      setSuccess(response.data.msg);
      setTimeout(() => navigate("/doctor/login"), 2000); // Redirect after success
    } catch (err) {
      setError(err.response?.data?.msg || "Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        backgroundColor: "#f5f5f5",
      }}
    >
      <Box
        sx={{
          width: "100%",
          padding: 4,
          boxShadow: 4,
          borderRadius: 4,
          backgroundColor: "#ffffff",
        }}
      >
        <Typography
          variant="h4"
          align="center"
          gutterBottom
          sx={{
            fontWeight: 700,
            color: "#1976d2",
          }}
        >
          Doctor Registration
        </Typography>

        {error && (
          <Alert severity="error" sx={{ marginBottom: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ marginBottom: 2 }}>
            {success}
          </Alert>
        )}

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, handleChange, handleBlur }) => (
            <Form>
              <Field
                as={TextField}
                label="Full Name"
                name="name"
                variant="outlined"
                fullWidth
                margin="normal"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AccountCircle />
                    </InputAdornment>
                  ),
                }}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.name && Boolean(errors.name)}
                helperText={touched.name && errors.name}
              />
              <Field
                as={TextField}
                label="Email"
                name="email"
                type="email"
                variant="outlined"
                fullWidth
                margin="normal"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email />
                    </InputAdornment>
                  ),
                }}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.email && Boolean(errors.email)}
                helperText={touched.email && errors.email}
              />
              <Field
                as={TextField}
                label="Password"
                name="password"
                type="password"
                variant="outlined"
                fullWidth
                margin="normal"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock />
                    </InputAdornment>
                  ),
                }}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.password && Boolean(errors.password)}
                helperText={touched.password && errors.password}
              />
              <Field
                as={TextField}
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                variant="outlined"
                fullWidth
                margin="normal"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock />
                    </InputAdornment>
                  ),
                }}
                onChange={handleChange}
                onBlur={handleBlur}
                error={
                  touched.confirmPassword && Boolean(errors.confirmPassword)
                }
                helperText={touched.confirmPassword && errors.confirmPassword}
              />
              <Field
                as={TextField}
                label="Birthdate"
                name="birthdate"
                type="date"
                variant="outlined"
                fullWidth
                margin="normal"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CalendarToday />
                    </InputAdornment>
                  ),
                }}
                onChange={handleChange}
                onBlur={handleBlur}
                InputLabelProps={{
                  shrink: true,
                }}
                error={touched.birthdate && Boolean(errors.birthdate)}
                helperText={touched.birthdate && errors.birthdate}
              />
              <Field
                as={TextField}
                label="Address"
                name="address"
                variant="outlined"
                fullWidth
                margin="normal"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Home />
                    </InputAdornment>
                  ),
                }}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.address && Boolean(errors.address)}
                helperText={touched.address && errors.address}
              />
              <Field
                name="specialization"
                variant="outlined"
                fullWidth
                margin="normal"
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.specialization && Boolean(errors.specialization)}
                helperText={touched.specialization && errors.specialization}
                render={({ field, form: { setFieldValue } }) => (
                  <Autocomplete
                    {...field}
                    options={specializations}
                    getOptionLabel={(option) => option?.specialty_name || ""}
                    value={
                      specializations.find(
                        (specialization) =>
                          specialization.specialty_name === field.value
                      ) || null
                    } // Bind the selected value here based on the specialization_id
                    onChange={(_, value) => {
                      setFieldValue("specialization", value?.id || ""); // Use specialization_id
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Specialization"
                        variant="outlined"
                        error={
                          touched.specialization &&
                          Boolean(errors.specialization)
                        }
                        helperText={
                          touched.specialization && errors.specialization
                        }
                      />
                    )}
                  />
                )}
              />

              <Field
                as={TextField}
                label="Phone Number"
                name="phone_number"
                variant="outlined"
                fullWidth
                margin="normal"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Phone />
                    </InputAdornment>
                  ),
                }}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.phone_number && Boolean(errors.phone_number)}
                helperText={touched.phone_number && errors.phone_number}
              />
              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={loading}
                sx={{
                  marginTop: 3,
                  padding: 1.5,
                  backgroundColor: "#1976d2",
                  fontWeight: 600,
                  textTransform: "capitalize",
                  "&:hover": {
                    backgroundColor: "#155fa0",
                  },
                }}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Register"
                )}
              </Button>
            </Form>
          )}
        </Formik>

        <Grid container justifyContent="center" sx={{ marginTop: 3 }}>
          <Grid item>
            <Button
              onClick={() => navigate("/doctor/login")}
              sx={{
                textTransform: "capitalize",
                fontWeight: 600,
                color: "#1976d2",
              }}
            >
              Already have an account? Log In
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default DoctorRegister;
