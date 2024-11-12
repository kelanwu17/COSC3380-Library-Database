import {
    FormControl,
    Grid2,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Typography,
  } from "@mui/material";
  import axios from "axios";
  import React, { useEffect, useState } from "react";
  import Navbar from "../../Components/NavBar";
  import { hatch } from "ldrs";
  import Item from "./Components/Item";
  hatch.register();
  
  function Catalog({ type }) {
    const [data, setData] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [filteredData, setFilteredData] = useState([]);
  
    const handleSelectedCategoryChange = (e) => {
      const selected = e.target.value;
      setSelectedCategory(selected);
  
      if (selected === "all") {
        setFilteredData(data);
      } else {
        const filtered = data.filter((item) =>
          type === "books"
            ? item.genre === selected
            : type === "music"
            ? item.musicGenre === selected
            : false
        );
        setFilteredData(filtered);
      }
    };
  
    useEffect(() => {
      const fetchData = async () => {
        let apiUrl = "https://library-database-backend.onrender.com/api/";
        if (type === "books") {
          apiUrl += "books/";
          setCategories(["all", "romance", "science", "mystery", "adventure","action","history","horror"]);
        } else if (type === "music") {
          apiUrl += "music/";
          setCategories(["all", "pop", "hip-hop", "rock", "electronic", "other"]);
        } else if (type === "tech") {
          apiUrl += "technology/";
        }
  
        try {
          const response = await axios.get(apiUrl);
          setData(response.data);
          setFilteredData(response.data); // Initialize filtered data with full dataset
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          setLoading(false);
        }
      };
  
      const timeoutId = setTimeout(fetchData, 1000);
      return () => clearTimeout(timeoutId);
    }, [type]);
  
    const handleSearchChange = (event) => {
      setSearchTerm(event.target.value);
    };
  
    const searchedData = filteredData.filter((subData) =>
      type === "books"
        ? subData.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          subData.author.toLowerCase().includes(searchTerm.toLowerCase())
        : type === "music"
        ? subData.albumName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          subData.artist.toLowerCase().includes(searchTerm.toLowerCase())
        : type === "tech"
        ? subData.deviceName.toLowerCase().includes(searchTerm.toLowerCase())
        : false
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
              {type === "books" ? (
                <div>
                  Browse & Borrow <span style={{ color: "#7D7162" }}>Books</span>
                </div>
              ) : type === "music" ? (
                <div>
                  Amplify <span style={{ color: "#7D7162" }}>Your Sound</span>
                </div>
              ) : type === "tech" ? (
                <div>
                  <span style={{ color: "#7D7162" }}>Get</span> Connected
                </div>
              ) : (
                "None"
              )}
            </Typography>
          </Grid2>
        </Grid2>
  
        <Grid2
          container
          rowSpacing={4}
          sx={{
            backgroundColor: "#E9E5DF",
            width: {xs:"100%", lg:"80%"},
            margin: "0 auto",
            borderRadius: "25px",
            overflow: "hidden",
          }}
        >
          <Grid2 item size={12} style={{ textAlign: "center" }}></Grid2>
          <Grid2 container size={16} spacing={2} justifyContent="center">
            <Grid2 size={{ xs: 12, md: 6 }} style={{ textAlign: "center" }}>
              <TextField
                fullWidth
                id="outlined-basic"
                label="Search..."
                variant="outlined"
                sx={{ backgroundColor: "white" }}
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </Grid2>
            <Grid2 size={{ xs: 12, md: 3 }}>
              {type === "books" || type === "music" ? (
                <FormControl fullWidth>
                  <InputLabel>Genres</InputLabel>
                  <Select
                    label="category"
                    value={selectedCategory}
                    onChange={handleSelectedCategoryChange}
                    sx={{ minWidth: "200px", backgroundColor: "white" }}
                  >
                    {categories.map((category) => (
                      <MenuItem key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              ) : null}
            </Grid2>
          </Grid2>
          <Grid2 size={{ xs: 12 }} sx={{ paddingLeft: "60px" }}>
            <Typography
              variant="button"
              sx={{ color: "#051650", fontWeight: "bold" }}
            >
              {selectedCategory + " " + type}
            </Typography>
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
              searchedData.map((subData, index) => (
                <Grid2
                  size={{ xs: 12, sm: 6, md: 3, lg: 2.4 }}
                  key={index}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                  }}
                >
                  <Item subData={subData} type={type} />
                </Grid2>
              ))
            )}
            {
                (searchedData.length === 0 || filteredData.length === 0) && loading === false ?  (
                    <Typography>No Results Found</Typography>
                ):(null)
            }
          </Grid2>
        </Grid2>
      </div>
    );
  }
  
  export default Catalog;
  