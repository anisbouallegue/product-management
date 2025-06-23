import { Box, Typography, Paper } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Paper elevation={3} sx={{ p: { xs: 2, sm: 4 }, mt: 2 }}>
        <Typography variant="h6" gutterBottom>
          Welcome, {user?.name}
        </Typography>
        <Typography variant="body1" sx={{ mt: 1 }}>
         You can manage your products from here
        </Typography>
      </Paper>
    </Box>
  );
};

export default Dashboard;