import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Button,
  Stack,
  Menu,
  MenuItem,
  Drawer,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { useMediaQuery } from '@mui/material'; // Import useMediaQuery

const Navbar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const userId = sessionStorage.getItem('username');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const role = sessionStorage.getItem("roles");
  const [isAdmin, setAdmin] = useState(false);

  const isSmallScreen = useMediaQuery('(max-width:600px)'); // Define small screen breakpoint

  useEffect(() => {
    setIsLoggedIn(!!userId);
    setAdmin(role === 'member');
  }, [userId, role]);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    console.log('User has logged out');
    sessionStorage.clear();
    window.location.href = '/login';
  };

  const toggleDrawer = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <AppBar position="static" color="transparent" sx={{ boxShadow: 'none', height: '57px' }}>
        <Toolbar sx={{ minHeight: '64px', display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h6" component="div" sx={{ flexGrow: 0 }}>
            <a href="/" style={{ textDecoration: 'none', color: '#001F5B', fontWeight: 'bold', fontSize:'1.5rem' }}>
              Lumina Archives
            </a>
          </Typography>

          <Stack
            direction="row"
            spacing={7}
            sx={{
              flexGrow: 1,
              justifyContent: 'center',
              alignItems: 'center',
              typography: 'body1',
              color: '#001F5B',
              fontWeight: 'bold',
              display: { xs: 'none', md: 'flex' }
            }}
          >
            <Button
              sx={{
                textTransform: 'none',
                fontWeight: 'bold',
                fontSize: '.92rem' // Slightly larger
              }}
              color="inherit"
              href={isAdmin ? "/Events" : "/AdminEvent"}
            >
              Events
            </Button>
            <Button
              sx={{
                textTransform: 'none',
                fontWeight: 'bold',
                fontSize: '.92rem' // Slightly larger
              }}
              color="inherit"
              href="/Books"
            >
              Browse & Borrow
            </Button>
            <Button
              sx={{
                textTransform: 'none',
                fontWeight: 'bold',
                fontSize: '.92rem' // Slightly larger
              }}
              color="inherit"
              href="/Music"
            >
              Music
            </Button>
            <Button
              sx={{
                textTransform: 'none',
                fontWeight: 'bold',
                fontSize: '.92rem' // Slightly larger
              }}
              color="inherit"
              href="/Technology"
            >
              Get Connected
            </Button>
            <Button
              sx={{
                textTransform: 'none',
                fontWeight: 'bold',
                fontSize: '.95rem' // Slightly larger
              }}
              color="inherit"
              href="/contact"
            >
              Contact
            </Button>
          </Stack>

      
          {!isMenuOpen && !isSmallScreen && (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {isLoggedIn && (
                <IconButton
                  onClick={handleMenuClick}
                  sx={{
                    color: '#001F5B',
                    mr: '60px',
                    minWidth: '40px',
                    maxWidth: '40px',
                  }}
                >
                  <PersonIcon sx={{ width: '30px', height: '30px' }} />
                </IconButton>
              )}

              {!isLoggedIn && (
                <Button
                  variant="contained"
                  color="primary"
                  href="/login"
                  sx={{
                    fontWeight: 'bold',
                    textTransform: 'none',
                    textDecoration: 'none',
                    color: 'white',
                    backgroundColor: '#001F5B',
                    borderRadius: '20px',
                    padding: '6px 32px',
                    minWidth: '120px', 
                    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
                    '&:hover': {
                      backgroundColor: '#001F5B',
                      boxShadow: '0px 6px 12px rgba(0, 0, 0, 0.3)',
                    }
                  }}
                >
                  Login
                </Button>
              )}
            </div>
          )}

          <IconButton
            color="inherit"
            onClick={toggleDrawer}
            sx={{ display: { xs: 'flex', md: 'none' } }} 
          >
            <MenuIcon />
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleCloseMenu}
            sx={{
              '& .MuiMenu-paper': {
                borderRadius: '12px', 
                boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)', 
              }
            }}
          >
            <MenuItem
              onClick={handleCloseMenu}
              component="a"
              href={isAdmin ? "/Profile" : "/AdminProfile"}
              sx={{ borderRadius: '8px', '&:hover': { backgroundColor: '#f5f5f5' } }}
            >
              {isAdmin ? "User Profile" : "Admin Profile"}
            </MenuItem>
            <MenuItem
              onClick={() => { handleCloseMenu(); handleLogout(); }}
              sx={{ borderRadius: '8px', '&:hover': { backgroundColor: '#f5f5f5' } }} 
            >
              Logout
            </MenuItem>
          </Menu>

        </Toolbar>
      </AppBar>

      {/* Drawer for Mobile Menu */}
      <Drawer anchor="right" open={isMenuOpen} onClose={toggleDrawer}>
        <div style={{ width: 250 }}>
          <IconButton onClick={toggleDrawer} sx={{ justifyContent: 'flex-end' }}>
            <CloseIcon />
          </IconButton>
          <List>
            <ListItem button component="a" href={isAdmin ? "/Events" : "/AdminEvent"} sx={{ padding: '10px 16px' }}>
              <ListItemText primary="Events" />
            </ListItem>
            <ListItem button component="a" href="/Books" sx={{ padding: '10px 16px' }}>
              <ListItemText primary="Browse & Borrow" />
            </ListItem>
            <ListItem button component="a" href="/Music" sx={{ padding: '10px 16px' }}>
              <ListItemText primary="Music" />
            </ListItem>
            <ListItem button component="a" href="/Technology" sx={{ padding: '10px 16px' }}>
              <ListItemText primary="Get Connected" />
            </ListItem>
            <ListItem button component="a" href="/contact" sx={{ padding: '10px 16px' }}>
              <ListItemText primary="Contact" />
            </ListItem>
            {!isLoggedIn ? (
              <ListItem button component="a" href="/login" sx={{ padding: '10px 16px' }}>
                <ListItemText primary="Login" />
              </ListItem>
            ) : (
              <ListItem button onClick={() => { handleCloseMenu(); handleLogout(); }} sx={{ padding: '10px 16px' }}>
                <ListItemText primary="Logout" />
              </ListItem>
            )}
          </List>
        </div>
      </Drawer>
    </>
  );
};

export default Navbar;
