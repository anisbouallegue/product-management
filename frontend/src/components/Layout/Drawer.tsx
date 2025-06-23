import React, { useState } from 'react';
import { Drawer, List, ListItemIcon, ListItemText, useTheme, useMediaQuery, ListItemButton } from '@mui/material';
import { Link } from 'react-router-dom';
import {
  Dashboard as DashboardIcon,
  ShoppingBasket as ProductsIcon,
  AddCircle as AddProductIcon,
  Person2 as ProfileIcon,
} from '@mui/icons-material';

const drawerWidth = 200;

const CustomDrawer = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [open, setOpen] = useState(!isMobile);

  React.useEffect(() => {
    setOpen(!isMobile);
  }, [isMobile]);

  const handleItemClick = () => {
    if (isMobile) setOpen(false);
  };

  const drawerContent = (
    <List>
      <ListItemButton component={Link} to="/dashboard" onClick={handleItemClick}>
        <ListItemIcon><DashboardIcon /></ListItemIcon>
        <ListItemText primary="Dashboard" />
      </ListItemButton>
      <ListItemButton component={Link} to="/products" onClick={handleItemClick}>
        <ListItemIcon><ProductsIcon /></ListItemIcon>
        <ListItemText primary="Products" />
      </ListItemButton>
      <ListItemButton component={Link} to="/products/create" onClick={handleItemClick}>
        <ListItemIcon><AddProductIcon /></ListItemIcon>
        <ListItemText primary="Add Product" />
      </ListItemButton>
       <ListItemButton component={Link} to="/profile" onClick={handleItemClick}>
        <ListItemIcon><ProfileIcon /></ListItemIcon>
        <ListItemText primary="Profile" />
      </ListItemButton>
    </List>
  );

  return (
    <Drawer
      variant={isMobile ? 'temporary' : 'permanent'}
      open={open}
      onClose={() => setOpen(false)}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
        },
        display: { xs: 'block', sm: 'block' },
      }}
      ModalProps={{
        keepMounted: true,
      }}
    >
      {drawerContent}
    </Drawer>
  );
};

export default CustomDrawer;