import * as React from 'react';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu'; 
import LandingPageImage from '../../../Assets/LandingPage.png';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import NavBar from '../../../Components/NavBar';

function Home() {
 
    const [openMenu, setOpenMenu] = React.useState(false);
    const [anchorEl, setAnchorEl] = React.useState(null); 

    const handleMenuToggle = (event) => {
        setAnchorEl(event.currentTarget);
        setOpenMenu((prevOpen) => !prevOpen);
    };

    const handleClose = () => {
        setOpenMenu(false);
        setAnchorEl(null);
    };

    return (
      <div className="home-container h-screen flex flex-col">
          <NavBar />
          <div
              className="flex-grow flex items-center justify-center bg-cover bg-center"
              style={{
                  backgroundImage: `url(${LandingPageImage})`,
              }}
          >
              <div className="flex flex-col items-center "style={{ marginTop: '-125px' }}>
                  <p className="mt-{-10px} text-purple-200 text-7xl font-bold" > {/* Reduced margin top for the first text */}
                      Discover the Future of
                  </p>
                  <p className="mt-{-10px} text-purple-200 text-7xl font-bold"> {/* Reduced margin top for the second text */}
                      Knowledge
                  </p>
                  <Paper
                      component="form"
                      sx={{
                          p: '2px 4px',
                          display: 'flex',
                          alignItems: 'center',
                          width: 700,
                          mt: 4, // Increased margin top to push the search bar further down
                          borderRadius: '20px',
                      }}
                  >
                      <InputBase
                          sx={{ ml: 2, flex: 1 }}
                          placeholder="Search..."
                      />
                      <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
                          <SearchIcon />
                      </IconButton>
                      <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
                      <IconButton
                          color="primary"
                          sx={{
                              p: '10px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                          }}
                          tabIndex={-1}
                          aria-label="directions"
                          onClick={handleMenuToggle}
                      >
                          <ArrowDropDownIcon sx={{ color: 'black' }} />
                      </IconButton>
                  </Paper>
                  <Menu
                      anchorEl={anchorEl}
                      open={openMenu}
                      onClose={handleClose}
                      PaperProps={{
                          sx: {
                              borderRadius: '20px', // Make the menu items rounded
                          },
                      }}
                  >
                      <MenuItem onClick={handleClose}>Books</MenuItem>
                      <MenuItem onClick={handleClose}>Music</MenuItem>
                      <MenuItem onClick={handleClose}>Technology</MenuItem>
                  </Menu>
              </div>
          </div>
      </div>
  );
}  

export default Home;
