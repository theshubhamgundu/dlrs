import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
  Menu,
  MenuItem,
  Avatar,
  IconButton,
  Chip,
} from '@mui/material';
import {
  Home,
  Search,
  Business,
  SwapHoriz,
  Assignment,
  AdminPanelSettings,
  VerifiedUser,
  Dashboard,
  Logout,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const Layout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'error';
      case 'INSPECTOR':
        return 'warning';
      case 'SELLER':
        return 'info';
      case 'BUYER':
        return 'success';
      default:
        return 'default';
    }
  };

  const getNavLinks = () => {
    if (!user) return [];
    
    const links: { label: string; path: string; icon: React.ReactElement; roles: string[] }[] = [
      { label: 'Home', path: '/', icon: <Home />, roles: ['SELLER', 'BUYER', 'INSPECTOR', 'ADMIN'] },
      { label: 'Properties', path: '/properties', icon: <Search />, roles: ['SELLER', 'BUYER', 'INSPECTOR', 'ADMIN'] },
      { label: 'My Properties', path: '/my-properties', icon: <Business />, roles: ['SELLER', 'ADMIN'] },
      { label: 'Transactions', path: '/my-transactions', icon: <SwapHoriz />, roles: ['BUYER', 'ADMIN'] },
      { label: 'Pending Transfers', path: '/pending-transfers', icon: <Assignment />, roles: ['INSPECTOR', 'ADMIN'] },
      { label: 'Audit Tools', path: '/audit-tools', icon: <VerifiedUser />, roles: ['INSPECTOR', 'ADMIN'] },
      { label: 'Admin', path: '/admin/users', icon: <AdminPanelSettings />, roles: ['ADMIN'] },
    ];

    return links.filter(link => link.roles.includes(user.role));
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 0, mr: 4 }}>
            DLRS
          </Typography>
          <Box sx={{ flexGrow: 1, display: 'flex', gap: 2 }}>
            {getNavLinks().map((link) => (
              <Button
                key={link.path}
                color="inherit"
                startIcon={link.icon}
                onClick={() => navigate(link.path)}
                sx={{
                  backgroundColor: location.pathname === link.path ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                }}
              >
                {link.label}
              </Button>
            ))}
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Chip
              label={user?.role}
              color={getRoleColor(user?.role || '')}
              size="small"
            />
            <IconButton onClick={handleMenuOpen} sx={{ p: 0 }}>
              <Avatar sx={{ width: 32, height: 32 }}>
                {user?.fullName?.charAt(0).toUpperCase()}
              </Avatar>
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem onClick={handleMenuClose}>
                <Typography variant="body2">{user?.fullName}</Typography>
              </MenuItem>
              <MenuItem onClick={handleMenuClose}>
                <Typography variant="body2">{user?.email}</Typography>
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                <Logout sx={{ mr: 1 }} />
                Logout
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ flexGrow: 1, py: 4 }}>
        <Outlet />
      </Container>
      <Box
        component="footer"
        sx={{
          py: 2,
          px: 2,
          mt: 'auto',
          backgroundColor: (theme) =>
            theme.palette.mode === 'light' ? theme.palette.grey[200] : theme.palette.grey[800],
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="body2" color="text.secondary" align="center">
            © 2025 DLRS - Decentralized Land Registry System v1.0.0
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default Layout;

