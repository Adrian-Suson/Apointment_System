// src/components/StatCard.jsx

import { Paper, Box, Typography } from "@mui/material";
import PropTypes from "prop-types";

const StatCard = ({ title, value, icon, color }) => (
  <Paper
    elevation={3}
    sx={{
      p: { xs: 2, sm: 3 }, // Reduced padding on small screens
      borderRadius: 2,
      height: "100%",
      background: `linear-gradient(135deg, ${color}15 0%, #ffffff 100%)`,
    }}
  >
    <Box
      display="flex"
      flexDirection={{ xs: "column", sm: "row" }} // Stack on small screens, row on larger screens
      justifyContent="space-between"
      alignItems="center"
    >
      <Box sx={{ mb: { xs: 1, sm: 0 } }}>
        <Typography
          variant="h6"
          color="text.secondary"
          sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }} // Smaller font size for title on small screens
        >
          {title}
        </Typography>
        <Typography
          variant="h4"
          fontWeight="bold"
          color={color}
          sx={{
            fontSize: { xs: "1.25rem", sm: "1.75rem" }, // Smaller font size for value on small screens
          }}
        >
          {value}
        </Typography>
      </Box>
      <Box
        sx={{
          backgroundColor: `${color}25`,
          borderRadius: "50%",
          p: 1,
          width: { xs: "35px", sm: "45px" }, // Smaller icon size for small screens
          height: { xs: "35px", sm: "45px" },
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {icon}
      </Box>
    </Box>
  </Paper>
);

StatCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.node]).isRequired,
  icon: PropTypes.element.isRequired,
  color: PropTypes.string.isRequired,
};

export default StatCard;
