import { Box, Grid2, Paper, TextField, Typography } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Navbar from "../../Components/NavBar";

function MusicCatalog() {
  const [musics, setMusics] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchMusics = async () => {
      try {
        const response = await axios.get(
          "https://library-database-backend.onrender.com/api/music/"
        );
        console.log("Good");
        setMusics(response.data);
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    };

    fetchMusics();
  }, []);

  // Handle search term change
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };


  const filteredMusic= musics.filter((book) =>
    book.albumName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{backgroundColor: "#7D7162", height:"100vh"}} >
         <Navbar/>
     <Grid2 container sx={{height: "75px"}}>
        <Grid2 size={12} style={{ textAlign: "center" }}>
            <h1 style={{fontSize:"50px", color:"white"}}>AMPLIFY YOUR SOUND</h1>
        </Grid2>
     </Grid2>
      
        
      <Grid2
        container
        rowSpacing={4}
        sx={{ backgroundColor: "#E9E5DF", width: "80%", margin: "0 auto" , borderRadius:"25px"}}
      >
        <Grid2 item size={12} style={{ textAlign: "center" }}></Grid2>
        <Grid2 size={12} style={{ textAlign: "center" }}>
          <TextField
            id="outlined-basic"
            label="Search..."
            variant="outlined"
            sx={{ width: "500px", backgroundColor: "white" }}
            value={searchTerm} // Controlled input
            onChange={handleSearchChange} // Update state on change
          />
        </Grid2>
        {filteredMusic.map((music, index) => (
          <Grid2
            size={2}
            key={index}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
            }}
          >
            <a href={"/music/" + music.musicId}>
              <Paper sx={{ borderRadius: "20px" }}>
                <img
                  src={music.imgUrl}
                  alt={music.albumName}
                  style={{
                    width: "250px",
                    height: "250px",
                    borderRadius: "20px",
                  }}
                />
              </Paper>
              <Typography variant="h6">{music.albumName}</Typography>
              <Typography variant="subtitle1" sx={{ fontStyle: "italic" }}>
                {music.artist}
              </Typography>
            </a>
          </Grid2>
        ))}
      </Grid2>
    
    </div>
  );
}

export default MusicCatalog;
