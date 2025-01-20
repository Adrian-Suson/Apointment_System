import { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  InputAdornment,
  Avatar,
  IconButton,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Email, Lock, Visibility, VisibilityOff } from "@mui/icons-material";
import axios from "axios";
import config from "../../../config/config";
import logo from "../../../assets/1736246305876.png"; // Adjust path according to your project structure

const AdminLoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${config.API_URL}/admin/login`, {
        email,
        password,
      });

      if (response.data.token) {
        console.log("Login successful");
        console.log("Data", response.data);

        // Create a user object with all the info
        const adminData = {
          token: response.data.token,
          id: response.data.admin.id,
          email: response.data.admin.email,
          name: response.data.admin.name,
          avatar: response.data.admin.avatar,
        };

        // Store the token in localStorage
        localStorage.setItem("token", response.data.token);
        // Store the user data as a JSON string
        localStorage.setItem("adminData", JSON.stringify(adminData));

        navigate("/admin/dashboard");
      } else {
        setError(response.data.msg);
      }
    } catch (error) {
      console.error("Login error:", error);
      if (error.response && error.response.data && error.response.data.msg) {
        setError(error.response.data.msg);
      } else {
        setError("An error occurred during login. Please try again.");
      }
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#f5f5f5",
      }}
    >
      <Paper
        elevation={3}
        style={{
          padding: "40px 30px",
          borderRadius: "20px",
          backgroundColor: "#ffffff",
          textAlign: "center",
          maxWidth: "400px",
          width: "100%",
        }}
      >
        <Box display="flex" justifyContent="center" mb={3}>
          <Avatar
            alt="Logo"
            src={logo} // Replace with your actual logo path
            sx={{ width: 150, height: 150 }}
          />
        </Box>
        <Typography variant="h4" color="primary" gutterBottom>
          Admin Login
        </Typography>
        <Box
          component="form"
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
          noValidate
          autoComplete="off"
          onSubmit={handleLogin}
        >
          <TextField
            label="Email"
            variant="outlined"
            size="small"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              marginBottom: "20px",
              backgroundColor: "#ffffff",
              borderRadius: "8px",
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email />
                </InputAdornment>
              ),
              style: {
                borderRadius: "8px",
                color: "#000000",
              },
            }}
          />
          <TextField
            label="Password"
            variant="outlined"
            type={showPassword ? "text" : "password"} // Toggle between 'text' and 'password'
            size="small"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              marginBottom: "20px",
              backgroundColor: "#ffffff",
              borderRadius: "8px",
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock />
                </InputAdornment>
              ),
              endAdornment: (
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={() => setShowPassword((prev) => !prev)} // Toggle visibility
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              ),
              style: {
                borderRadius: "8px",
                color: "#000000",
              },
            }}
          />
          {error && (
            <Typography variant="body2" color="error" mb={2}>
              {error}
            </Typography>
          )}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            style={{
              width: "100%",
              fontSize: "16px",
              fontWeight: "bold",
              borderRadius: "25px",
              padding: "10px",
              marginBottom: "15px",
            }}
          >
            Log In
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default AdminLoginPage;
