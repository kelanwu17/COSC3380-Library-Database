import {
  Box,
  CircularProgress,
  FormControl,
  Grid2,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  styled,
  TextField,
  Tooltip,
  tooltipClasses,
  Typography,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Navbar from "../../Components/NavBar";
import { hatch } from "ldrs";
hatch.register();

const LightTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.common.white,
    color: "rgba(0, 0, 0, 0.87)",
    boxShadow: theme.shadows[1],
    fontSize: 11,
  },
}));

function BookCatalog() {
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

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
      } finally {
        setLoading(false);
      }
    };
    const timeoutId = setTimeout(fetchBooks, 1000);
    return () => clearTimeout(timeoutId);
    // fetchBooks();
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
    <div style={{ backgroundColor: "white", height: "100%" }}>
      <Navbar />
      <br />
      <br />
      <Grid2 container sx={{ minHeight: "100px" }}>
        <Grid2 size={12} style={{ textAlign: "center" }}>
          <Typography
            variant="h2"
            gutterBottom
            sx={{ fontWeight: "bold", color: "#051650" }}
          >
            Browse & Borrow <span style={{ color: "#7D7162" }}>Books</span>
          </Typography>
        </Grid2>
      </Grid2>

      <Grid2
        container
        rowSpacing={4}
        sx={{
          backgroundColor: "#E9E5DF",
          width: "80%",
          margin: "0 auto",
          borderRadius: "25px",

          overflow: "hidden",
        }}
      >
        <Grid2 item size={12} style={{ textAlign: "center" }}></Grid2>
        <Grid2 container size={16} spacing={2}justifyContent="center">
          <Grid2 size={{ xs: 12, md: 6 }} style={{ textAlign: "center" }}>
            <TextField
              fullWidth
              id="outlined-basic"
              label="Search..."
              variant="outlined"
              sx={{ backgroundColor: "white" }}
              value={searchTerm} // Controlled input
              onChange={handleSearchChange} // Update state on change
            />
          </Grid2>
          <Grid2 size={{ xs: 12, md: 3 }}>
            <FormControl fullwidth>
              <InputLabel>Category</InputLabel>
              <Select label="category" fullwidth sx={{minWidth:"200px", backgroundColor:"white"}}>
                <MenuItem value="fiction">Fiction</MenuItem>
                <MenuItem value="nonFiction">Non-Fiction</MenuItem>
              </Select>
            </FormControl>
          </Grid2>
        </Grid2>
        <Grid2
          container
          size={16}
          sx={{ minHeight: "100vh" }}
          justifyContent={loading ? "center" : "flex-start"}
        >
          {loading ? (
            <Grid2>
              <l-hatch size="35" stoke="4" speed="3.5" color="brown" />
            </Grid2>
          ) : (
            filteredBooks.map((book, index) => (
              <Grid2
                size={{ xs: 12, sm: 6, md: 3, lg: 2 }}
                key={index}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                }}
              >
                <a href={"/books/" + book.bookId}>
                  <LightTooltip
                    title="More Details"
                    placement="top"
                    slotProps={{
                      popper: {
                        modifiers: [
                          {
                            name: "offset",
                            options: {
                              offset: [0, -120],
                            },
                          },
                        ],
                      },
                    }}
                  >
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
                    <Typography variant="button" sx={{}}>
                      {book.author}
                    </Typography>
                  </LightTooltip>
                </a>
              </Grid2>
            ))
          )}
        </Grid2>
      </Grid2>
    </div>
  );
}

export default BookCatalog;
