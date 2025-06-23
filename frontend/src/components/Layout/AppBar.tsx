import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Container } from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';

const CustomAppBar = () => {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <AppBar >
      <Container maxWidth="lg" disableGutters>
        <Toolbar
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', sm: 'center' },
            gap: 1,
            py: { xs: 1, sm: 0 },
          }}
        >
        
          {isAuthenticated && (
            <Box
              display="flex"
              alignItems="center"
              sx={{
                flexDirection: { xs: 'column', sm: 'row' },
                width: '100%',
                justifyContent: { xs: 'flex-start', sm: 'flex-end' },
                gap: 1,
              }}
            >
              <Typography
                variant="subtitle1"
                sx={{
                  mr: { xs: 0, sm: 2 },
                  mb: { xs: 0.5, sm: 0 },
                  maxWidth: { xs: 160, sm: 200 },
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                Welcome, {user?.name}
              </Typography>
              <Button color="inherit" onClick={logout}>
                Logout
              </Button>
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default CustomAppBar;