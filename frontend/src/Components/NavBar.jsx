import React, { useState, useEffect } from 'react';
import './NavBar.css';
import PersonIcon from '@mui/icons-material/Person';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu'; 
import { IconButton } from '@mui/material';

const Navbar = () => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false); // State for mobile menu
    const userId = sessionStorage.getItem('username'); 
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const role = sessionStorage.getItem("roles");
    const [userRole, setRole] = useState('');
    const [isAdmin, setAdmin] = useState(false);

    useEffect(() => {
        if (userId) {
            setIsLoggedIn(true);
        } else {
            setIsLoggedIn(false);
        }
        if (role === 'member') {
            setRole('member');
            setAdmin(true);
        } else {
            setRole('admin');
            setAdmin(false);
        }
    }, [userId, role]);

    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
        setIsMenuOpen(false); // Close mobile menu
    };

    const openMenu = Boolean(anchorEl);

    const handleLogout = () => {
        console.log('User has logged out');
        sessionStorage.clear(); 
        window.location.href = '/login'; 
    };

    const toggleMenu = () => {
        setIsMenuOpen((prev) => !prev);
    };

    return (
        <nav className="navbar">
            <div className="navbar-left">
                <a href="/" className="logo">
                    Lumina Archives
                </a>
            </div>
            <div className="navbar-center">
                <ul className={`nav-links ${isMenuOpen ? 'open' : ''}`}>
                    <li>
                        {isAdmin ? (<a href="/Events">Events</a>) : (<a href="/AdminEvent">Events</a>)}
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
                                sx: { backgroundColor: '#ECECEC', borderRadius: '20px' },
                            }}
                        >
                            <MenuItem onClick={handleClose}>{isAdmin ? (<a href='/Profile'>User Profile</a>) : (<a href='/AdminProfile'>Admin Profile</a>)}</MenuItem>
                            <MenuItem onClick={() => { handleClose(); handleLogout(); }}>Logout</MenuItem>
                        </Menu>
                    </div>
                ) : (
                    <a className='login-button font-bold' href='/login'>Login</a>
                )}
                <IconButton
                    onClick={toggleMenu}
                    className="hamburger-button"
                    sx={{ display: { xs: 'block', md: 'none' } }} // Show on mobile
                >
                    {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
                </IconButton>
            </div>
        </nav>
    );
};

export default Navbar;