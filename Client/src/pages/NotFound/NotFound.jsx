import { Box, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  const handleBackHome = () => {
    navigate('/');
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
        textAlign: 'center',
        padding: 2,
      }}
    >
      <Typography variant="h2" sx={{ fontWeight: 'bold', color: '#d32f2f' }}>
        404
      </Typography>
      <Typography variant="h5" sx={{ color: '#757575', marginBottom: 2 }}>
        Oops! The page you are looking for does not exist.
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={handleBackHome}
        sx={{
          marginTop: 2,
          padding: '10px 20px',
          fontSize: '16px',
          borderRadius: '8px',
          '&:hover': {
            backgroundColor: '#1976d2',
          },
        }}
      >
        Go to Home
      </Button>
    </Box>
  );
};

export default NotFound;
