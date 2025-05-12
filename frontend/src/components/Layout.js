import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  AppBar, Box, CssBaseline, Drawer, Toolbar,
  Typography, List, ListItem, ListItemButton,
  ListItemIcon, ListItemText, useTheme
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import TimelineIcon from '@mui/icons-material/Timeline';

// Drawer width for the sidebar
const drawerWidth = 240;

/**
 * Layout component with navigation drawer and app bar
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render in main content area
 */
const Layout = ({ children }) => {
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Menu items for navigation
  const menuItems = [
    { text: 'Home', path: '/', icon: <HomeIcon /> },
    { text: 'Stock Chart', path: '/stock', icon: <ShowChartIcon /> },
    { text: 'Correlation Heatmap', path: '/correlation', icon: <TimelineIcon /> }
  ];
  
  // Check if a menu item is active
  const isActive = (path) => location.pathname === path;
  
  // Handle menu item click
  const handleMenuClick = (path) => {
    navigate(path);
  };
  
  // Drawer content
  const drawer = (
    <div>
      <Toolbar />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              selected={isActive(item.path)}
              onClick={() => handleMenuClick(item.path)}
              sx={{
                '&.Mui-selected': {
                  backgroundColor: theme.palette.primary.light,
                  color: theme.palette.primary.main,
                  '&:hover': {
                    backgroundColor: theme.palette.primary.light,
                  },
                  '& .MuiListItemIcon-root': {
                    color: theme.palette.primary.main,
                  },
                },
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  );
  
  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      
      {/* App Bar */}
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            Stock Price Aggregation
          </Typography>
        </Toolbar>
      </AppBar>
      
      {/* Navigation Drawer */}
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      
      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          mt: { xs: 8, sm: 8 }, // Add margin for the app bar
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default Layout; 