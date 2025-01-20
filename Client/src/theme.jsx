import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#0866ff", // Bright Blue
    },
    secondary: {
      main: "#FFA000", // Gold
    },
    background: {
      default: "#F0F4FF", // Light Blueish Gray (matches the primary theme)
      paper: "#FFFFFF", // White (for cards, dialogs, etc.)
    },
    text: {
      primary: "#000000", // Black
      secondary: "#0866ff", // Bright Blue (accented text)
    },
  },
  typography: {
    fontFamily: "'Source Sans Pro', sans-serif",
    h1: {
      fontWeight: 700,
      fontSize: "2.5rem",
      color: "#0866ff",
    },
    h5: {
      fontWeight: 700, // Bold for h5
    },
    h6: {
      fontWeight: 600, // Semi-Bold for h6
    },
    body1: {
      fontSize: "1rem",
      color: "#333333", // Dark Gray
    },
    button: {
      textTransform: "none", // Avoid uppercase for buttons
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "8px", // Slightly rounded corners for buttons
          padding: "8px 16px",
          fontWeight: "bold",
        },
        containedPrimary: {
          backgroundColor: "#0866ff",
          color: "#ffffff",
          "&:hover": {
            backgroundColor: "#0056d4", // Slightly darker blue for hover
          },
        },
        containedSecondary: {
          backgroundColor: "#FFA000",
          color: "#ffffff",
          "&:hover": {
            backgroundColor: "#FFC233", // Lighter gold for hover
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          backgroundColor: "#FFFFFF", // White background for text fields
          borderRadius: "8px",
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: "#0866ff", // Blue border for input fields
            },
            "&:hover fieldset": {
              borderColor: "#0056d4", // Darker blue on hover
            },
            "&.Mui-focused fieldset": {
              borderColor: "#0866ff", // Bright blue on focus
            },
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: "12px",
          padding: "16px",
          backgroundColor: "#FFFFFF", // Clean white for cards and surfaces
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)", // Subtle shadow
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#0866ff",
          color: "#ffffff",
          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)", // Subtle shadow for AppBar
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
          "&:hover": {
            backgroundColor: "#F0F4FF", // Light background on hover
          },
          "&.Mui-selected": {
            backgroundColor: "#0866ff",
            color: "#ffffff",
            "&:hover": {
              backgroundColor: "#0056d4", // Darker blue when selected and hovered
            },
          },
        },
      },
    },
  },
});

export default theme;
