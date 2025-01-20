import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, TextField, Typography, Paper } from "@mui/material";
import axios from "axios";
import config from "../../config/config"; // assuming you have an API config file

function Login() {
  const navigate = useNavigate();

  // States to hold the input values and error messages
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleNavigateToRegistration = () => {
    navigate("/registration");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage(""); // Reset error message before submitting

    // Basic validation
    if (!email || !password) {
      setErrorMessage("Please fill in all fields.");
      return;
    }

    try {
      const response = await axios.post(`${config.API_URL}/login`, {
        email,
        password,
      });

      // Handle successful login
      if (response.data.token) {
        // Store the response data in localStorage
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("userId", response.data.user.id);
        localStorage.setItem("email", response.data.user.email);
        localStorage.setItem("avatar", response.data.user.avatar);
        localStorage.setItem("name", response.data.user.name);

        console.log("User registered:", response.data);

        // Redirect to dashboard or home page after successful login
        navigate("/announcement");
      }
    } catch (error) {
      // Handle login errors
      console.error(
        "Login failed:",
        error.response?.data?.msg || error.message
      );
      setErrorMessage(
        error.response?.data?.msg || "Login failed. Please try again."
      );
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      bgcolor="#f5f5f5"
    >
      <Paper elevation={3} style={{ padding: "2rem", width: "400px" }}>
        <Typography variant="h5" gutterBottom align="center">
          User Login
        </Typography>
        {errorMessage && (
          <Typography color="error" variant="body2" align="center" gutterBottom>
            {errorMessage}
          </Typography>
        )}
        <form onSubmit={handleLogin}>
          <TextField
            fullWidth
            label="Email"
            type="email"
            variant="outlined"
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            variant="outlined"
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Box mt={2}>
            <Button fullWidth variant="contained" color="primary" type="submit">
              Login
            </Button>
          </Box>
          <Box mt={2} textAlign="center">
            <Typography variant="body2">
              Don&apos;t have an account?{" "}
              <Button
                variant="text"
                color="primary"
                onClick={handleNavigateToRegistration}
              >
                Register
              </Button>
            </Typography>
          </Box>
        </form>
      </Paper>
    </Box>
  );
}

export default Login;
