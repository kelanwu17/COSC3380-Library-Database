import { Box, Grid2, Paper, TextField, Typography } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Navbar from "../../Components/NavBar";

function BookCatalog() {
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get(
          "https://library-database-backend.onrender.com/api/books/"
        );
        console.log("Good");
        setBooks(response.data);
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    };

    fetchBooks();
  }, []);

  // Handle search term change
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // Filter books based on search term
  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{backgroundColor: "#7D7162", height:"100vh"}} >
      <Navbar/>
     <Grid2 container sx={{height: "75px"}}>
        <Grid2 size={12} style={{ textAlign: "center" }}>
            <h1 style={{fontSize:"50px", color:"white"}}>BROWSE & BORROW BOOKS</h1>
        </Grid2>
     </Grid2>
      
        
      <Grid2
        container
        rowSpacing={4}
        sx={{ backgroundColor: "#E9E5DF", width: "80%", margin: "0 auto", borderRadius:"25px" }}
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
        {filteredBooks.map((book, index) => (
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
            <a href={"/books/" + book.bookId}>
              <Paper sx={{ borderRadius: "20px" }}>
                <img
                  src={book.imgUrl}
                  alt={book.title}
                  style={{
                    width: "200px",
                    height: "250px",
                    borderRadius: "20px",
                  }}
                />
              </Paper>
              <Typography variant="h6">{book.title}</Typography>
              <Typography variant="subtitle1" sx={{ fontStyle: "italic" }}>
                {book.author}
              </Typography>
            </a>
          </Grid2>
        ))}
      </Grid2>
    
    </div>
  );
}

export default BookCatalog;
