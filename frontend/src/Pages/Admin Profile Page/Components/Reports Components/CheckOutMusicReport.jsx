import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  ButtonGroup,
  Paper,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Checkbox,
  ListItemText,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { BarChart } from "@mui/x-charts/BarChart";
import { PieChart } from "@mui/x-charts/PieChart";


const groupByBookTitle = (data) => {
  const grouped = {};

  data.forEach((item) => {
    const title = item.musicAlbumName;
    grouped[title] = (grouped[title] || 0) + 1;
  });

  return Object.entries(grouped).map(([title, count]) => ({ title, count }));
};

const groupByGenreAndUser = (data) => {
  const genreCounts = {};

  data.forEach((item) => {
    const genre = item.musicGenre;
    const user = item.memberUsername;

    if (!genreCounts[genre]) genreCounts[genre] = {};
    genreCounts[genre][user] = (genreCounts[genre][user] || 0) + 1;
  });

  return Object.entries(genreCounts).flatMap(([genre, users]) =>
    Object.entries(users).map(([user, count]) => ({ genre, user, count }))
  );
};

function CheckOutMusicReport({ api }) {

  const [data, setData] = useState([]);
  const [allData, setAllData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(0);
  const [signUpData, setSignUpData] = useState([]);
  const [genreData, setGenreData] = useState([]);
  const [genreFilter, setGenreFilter] = useState("");
  const [userFilter, setUserFilter] = useState([]);

  const getDateRange = (days) => {
    const today = new Date();
    return Array.from({ length: days }, (_, i) => {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      return date.toISOString().split("T")[0];
    }).reverse();
  };

  const dateRanges = {
    last7days: getDateRange(7),
    lastMonth: getDateRange(30),
    lastQuarter: getDateRange(90),
  };

  const filterData = () => {
    const range = dateRanges[["last7days", "lastMonth", "lastQuarter"][selected]];
    return allData.filter((item) => {
      const date = item.timeStampCheckedOut.split("T")[0];
      return range.includes(date) &&
             (genreFilter ? item.musicGenre === genreFilter : true) &&
             (userFilter.length === 0 || userFilter.includes(item.memberUsername));
    });
  };

  const updateFilteredData = () => {
    const filteredData = filterData();
    setData(filteredData);
    setSignUpData(groupByBookTitle(filteredData));

    let filteredGenreData = groupByGenreAndUser(filteredData);

    // If no users are selected, combine counts for all users
    if (userFilter.length === 0) {
      const genreSummary = filteredGenreData.reduce((acc, item) => {
        if (!acc[item.genre]) {
          acc[item.genre] = 0;
        }
        acc[item.genre] += item.count;
        return acc;
      }, {});

      filteredGenreData = Object.keys(genreSummary).map((genre) => ({
        genre,
        user: "All Users",  // Label to indicate all users
        count: genreSummary[genre],
      }));
    }

    setGenreData(filteredGenreData);
  };

  const handleDateRangeClick = (index) => {
    setSelected(index);
    updateFilteredData();
  };

  const handleGenreFilterChange = (event) => {
    setGenreFilter(event.target.value);
  };

  const handleUserFilterChange = (event) => {
    const selectedUsers = event.target.value;
    setUserFilter(selectedUsers);
  };

  useEffect(() => {
   
    updateFilteredData();
    
  }, [selected, genreFilter, userFilter, genreData]);

  useEffect(() => {

    const fetchData = async () => {
        
      setLoading(true);
      try {
        const response = await fetch(api);
        console.log(response)
        if (!response.ok) throw new Error("Failed to fetch data");

        const result = await response.json();
        setAllData(result);
        setData(result);

        setSignUpData(groupByBookTitle(result));
        setGenreData(groupByGenreAndUser(result));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [api]);

  const columns = data.length > 0
    ? Object.keys(data[0]).map((key) => ({
        field: key,
        headerName: key.charAt(0).toUpperCase() + key.slice(1),
        flex: 1,
      }))
    : [];
    

  return (
    <div>
      <ButtonGroup variant="contained">
        {["7 Days", "30 Days", "90 Days", "All"].map((label, index) => (
          <Button
            key={index}
            onClick={() => handleDateRangeClick(index)}
            color={selected === index ? "primary" : "inherit"}
          >
            {label}
          </Button>
        ))}
      </ButtonGroup>

      <FormControl sx={{ m: 1, minWidth: 120 }}>
        <InputLabel>Genre</InputLabel>
        <Select
          value={genreFilter}
          onChange={handleGenreFilterChange}
          label="Genre"
        >
          <MenuItem value=""><em>None</em></MenuItem>
          {[...new Set(allData.map((item) => item.musicGenre))].map((genre) => (
            <MenuItem key={genre} value={genre}>{genre}</MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl sx={{ m: 1, minWidth: 120 }}>
        <InputLabel>User</InputLabel>
        <Select
          multiple
          value={userFilter}
          onChange={handleUserFilterChange}
          label="User"
          renderValue={() => ''} 
        >
          {[...new Set(allData.map((item) => item.memberUsername))].map((user) => (
            <MenuItem key={user} value={user}>
              <Checkbox checked={userFilter.includes(user)} />
              <ListItemText primary={user} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Paper sx={{ height: 500, width: "100%", marginTop: 2 }}>
        <DataGrid
          rows={data.map((row, index) => ({ id: index, ...row }))}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[5, 10, 20]}
          loading={loading}
        />
      </Paper>

      <Paper>
        <Typography variant="overline">
          Most Checked Out Books ({["7 days", "30 days", "90 days"][selected]})
        </Typography>
        <BarChart
          xAxis={[{ dataKey: "title", scaleType: "band" }]}
          series={[{ dataKey: "count", label: "Checkouts" }]}
          dataset={signUpData}
          width={900}
          height={300}
        />
      </Paper>

      <Paper>
        <Typography variant="overline">
          Genre Distribution ({["7 days", "30 days", "90 days"][selected]})
        </Typography>
        <PieChart
          series={[{
            data: genreData.map((item, index) => ({
              id: `${item.genre}-${item.user}`,
              value: item.count,
              label: item.user === "All Users"
                ? `${item.genre}`  // Label with genre only if no user filter is applied
                : `${item.genre} - ${item.user}`,  // Show both genre and user if user filter is applied
            })),
          }]}
          width={600}
          height={200}
        />
      </Paper>
    </div>
  );
}

export default CheckOutMusicReport;
