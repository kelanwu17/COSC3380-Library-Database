import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  ButtonGroup,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { LineChart } from "@mui/x-charts/LineChart";
import { PieChart } from "@mui/x-charts";
import { DataGrid } from "@mui/x-data-grid";
import { BarChart } from "@mui/x-charts/BarChart";
import axios from "axios";

const groupByBookTitle = async (data, dateRange) => {
  const grouped = {};
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  console.log(data, 'date')
  await Promise.all(
    data.map(async (item) => {
      const date = item.timeStampCheckedOut.split("T")[0];
      const bookId = item.bookId;
      console.log('allbookids', bookId)
      if (dateRange.includes(date)) {
        try {
          const response = await axios.get(`https://library-database-backend.onrender.com/api/books/${bookId}`);
          const title = response.data[0].title;
          console.log(`Processing book ID: ${bookId}`);

          grouped[title] = (grouped[title] || 0) + 1;
        } catch (error) {
          console.error(`Error fetching title for book ID ${bookId}:`, error);
        }
        await sleep(500);
      }
    })
  );
  
  return Object.entries(grouped).map(([title, count]) => ({ title, count }));
};

const groupByGenre = async (data, dateRange) => {
  const genreCounts = {};
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  await Promise.all(
    data.map(async (item) => {
      const date = item.timeStampCheckedOut.split("T")[0];
      const bookId = item.bookId;

      if (dateRange.includes(date)) {
        try {
          const response = await axios.get(`https://library-database-backend.onrender.com/api/books/${bookId}`);
          const genre = response.data[0].genre;

          genreCounts[genre] = (genreCounts[genre] || 0) + 1;
        } catch (error) {
          console.error(`Error fetching genre for book ID ${bookId}:`, error);
        }
        await sleep(500);
      }
    })
  );

  return Object.entries(genreCounts).map(([genre, count]) => ({ genre, count }));
};

function CheckoutItemReport({ api }) {
  const [data, setData] = useState([]);
  const [allData, setAllData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(0);
  const [signUpData, setSignUpData] = useState([]);
  const [genreData, setGenreData] = useState([]);

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

  const filterDataByRange = (range) =>
    allData.filter((member) => {
      const date = member.timeStampCheckedOut?.split("T")[0];
      
      return range.includes(date);
    });

  const handleClick = async (index) => {
    let selectedRange;

    switch (index) {
      case 0:
        selectedRange = dateRanges.last7days;
        break;
      case 1:
        selectedRange = dateRanges.lastMonth;
        break;
      case 2:
        selectedRange = dateRanges.lastQuarter;
        break;
      default:
        selectedRange = [];
    }

    const filteredData = filterDataByRange(selectedRange);
    setData(filteredData);
    console.log(filteredData)
    setSelected(index);

    const grouped = await groupByBookTitle(filteredData, selectedRange);
    setSignUpData(grouped);

    const genreGrouped = await groupByGenre(filteredData, selectedRange);
    setGenreData(genreGrouped);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(api);
        if (!response.ok) throw new Error("Failed to fetch data");

        const result = await response.json();
        setAllData(result);
        
        setData(result);

        const initialGrouped = await groupByBookTitle(result, dateRanges.last7days);
        setSignUpData(initialGrouped);

        const initialGenreGrouped = await groupByGenre(result, dateRanges.last7days);
        setGenreData(initialGenreGrouped);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [api]);

  
  const columns =
    data.length > 0
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
            onClick={() => handleClick(index)}
            color={selected === index ? "primary" : "inherit"}
          >
            {label}
          </Button>
        ))}
      </ButtonGroup>

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
              id: index,
              value: item.count,
              label: item.genre,
            })),
          }]}
          width={400}
          height={200}
        />
      </Paper>
    </div>
  );
}

export default CheckoutItemReport;
