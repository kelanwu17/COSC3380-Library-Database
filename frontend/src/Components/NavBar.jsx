import React, { useState } from 'react';
import './NavBar.css';
import PersonIcon from '@mui/icons-material/Person';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu'; 
import { IconButton } from '@mui/material';

const Navbar = () => {
    const [anchorEl, setAnchorEl] = useState(null);
    const isLoggedIn = false;

    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const openMenu = Boolean(anchorEl);

    function handleLogout()
    {
        console.log('User has logged out');
    };

    return (
        <nav className="navbar">
            <div className="navbar-left">
                <a href="/" className="logo">
                    Lumina Archives
                </a>
            </div>
            <div className="navbar-center">
                <ul className="nav-links flex-row font-bold">
                    <li>
                        <a href="/">Home</a>
                    </li>
                    <li>
                        <a href="/Books">Browse & Borrow</a>
                    </li>
                    <li>
                        <a href="/Music">Music</a>
                    </li>
                    <li>
                        <a href="/Technology">Get Connected</a>
                    </li>
                    <li>
                        <a href="/contact">Contact</a>
                    </li>
                </ul>
            </div>
            <div className="navbar-right">
                {isLoggedIn ? (
                    <div className="loggedin-button">
                        <IconButton
                            sx={{ width: '50px', height: '50px', padding: 0 }}
                            onClick={handleMenuClick}
                        >
                            <PersonIcon sx={{ width: '30px', height: '30px', color: '#051650' }} />
                        </IconButton>
                        <Menu
                            anchorEl={anchorEl}
                            open={openMenu}
                            onClose={handleClose}
                            PaperProps={{
                                sx: {backgroundColor:'#ECECEC',
                                    borderRadius: '20px', // Make the menu items rounded
                                },
                            }}
                        >
                            <MenuItem onClick={handleClose}><a href='/Profile'>User Profile </a></MenuItem>
                            <MenuItem onClick={()=> {handleClose(); handleLogout();}}>Logout</MenuItem>
                        </Menu>
                    </div>
                ) : (
                    <a className='login-button font-bold' href='/login'>Login</a>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
