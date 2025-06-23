import React from 'react';
import { Box, CssBaseline } from '@mui/material';
import CustomAppBar from './AppBar';
import CustomDrawer from './Drawer';
import { Outlet } from 'react-router-dom';

const drawerWidth = 240;

const Layout: React.FC = () => {
  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <CustomAppBar />
      <CustomDrawer />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          marginTop: '64px',
          marginLeft: { xs: 0, sm: `${drawerWidth}px` },
          width: { xs: '100%', sm: `calc(100% - ${drawerWidth}px)` },
          transition: 'margin-left 0.3s, width 0.3s',
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;