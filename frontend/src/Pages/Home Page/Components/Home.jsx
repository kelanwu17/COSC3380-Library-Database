import * as React from 'react';
import { useState, useEffect } from 'react';
import { Box, Container } from '@mui/material';
import Navbar from '../../../Components/NavBar';
import LandingPageImage from '../../../Assets/LandingPage.png';
import { useNavigate } from 'react-router-dom';
function Home() {
    const [openMenu, setOpenMenu] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null); 
    const [category, setCategory] = useState('');
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        document.body.style.overflow = 'hidden'; 
        return () => {
            document.body.style.overflow = ''; 
        };
    }, []);

    useEffect(() => {
        // Trigger the fade-in effect after component mounts
        setIsVisible(true);
    }, []);

    const navigate = useNavigate();
    const handleBooks = () => {
        navigate('/books');
    };
    const handleMusic = () => {
        navigate('/music');
    };
    const handleTech = () => {
        navigate('/technology');
    };

    return (
        <div className="h-screen">
            <Navbar />
            <Container 
                maxWidth={false} 
                sx={{
                    height: "100vh", 
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    margin: "0",
                    padding: "0",
                    width: "100vw",
                    overflow: "hidden",
                    position: "relative"
                    
                }}
            >
                {/* Blurred background */}
                <Box 
                    sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100vw",
                        height: "100vh",
                        backgroundImage: `url(${LandingPageImage})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        zIndex: 0,
                         
                    }} 
                >
                    <Box 
                        sx={{
                            background: "rgba(101, 80, 60, 0.7)",
                            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)", 
                            borderRadius: "25px",
                            width: "100%",
                            height: "100%",
                            zIndex: 1,
                            display: "flex",
                            flexDirection: "column",
                            overflow: "hidden",
                            justifyContent: "flex-start",
                            alignItems: "center",
                            paddingTop: "200px" // Adjust this value to raise components higher
                            
                        }}
                    >
                        {/* Title Text */}
                        <p className={`text-purple-200 text-5xl md:text-6xl lg:text-7xl font-bold mt-[-10px]`}>
                            Discover the Future of
                        </p>
                        <p className={`text-purple-200 text-5xl md:text-6xl lg:text-7xl font-bold mt-[-10px] `}>
                            Knowledge
                        </p>

                        {/* Responsive Buttons */}
                        <Box sx={{ 
                            display: 'flex', 
                            gap: { xs: 2, md: 4, lg: 6 },  
                            flexDirection: { xs: 'column', sm: 'row' },  
                            mt: 4,
                            justifyContent: 'center', 
                            alignItems: 'center' 
                        }}>
                            <button onClick={handleBooks} className='px-6 py-3 bg-purple-500 text-white rounded rounded-lg text-lg md:text-xl lg:text-2xl '>
                                Books
                            </button>
                            <button onClick={handleMusic} className='px-6 py-3 bg-purple-500 text-white rounded-lg rounded text-lg md:text-xl lg:text-2xl' >
                                Music
                            </button>
                            <button onClick={handleTech} className='px-6 py-3 bg-purple-500 rounded-lg text-white rounded text-lg md:text-xl lg:text-2xl'>
                                Technology
                            </button>
                        </Box>
                    </Box>
                </Box>
            </Container>
        </div>
    );
}

export default Home;
