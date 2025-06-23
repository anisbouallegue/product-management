
import { Box, Typography, TextField, Button, Paper } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

const Profile = () => {
  const { user } = useAuth();
 

  return (
    <Box sx={{ maxWidth: 500, mx: 'auto', mt: 4 }}>
      <Paper sx={{ p: { xs: 2, sm: 4 } }}>
        <Typography variant="h5" gutterBottom>Profile</Typography>
        <TextField
          label="Name"
          value={user?.name || ''}
          fullWidth
          margin="normal"
          disabled
        />
        <TextField
          label="Email"
          value={user?.email || ''}
          fullWidth
          margin="normal"
          disabled
        />
      </Paper>
    </Box>
  );
};

export default Profile;