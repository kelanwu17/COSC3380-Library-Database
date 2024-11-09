import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  ButtonGroup,
  Paper,
  Typography,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { PieChart } from "@mui/x-charts";

const groupByDate = (data) =>
  data.reduce((acc, fine) => {
    const date = fine.createdAt.split("T")[0]; //use split for some reason?
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});

const getDateRange = (days) => {
  const dates = [];
  const today = new Date();
  for (let i = 0; i < days; i++) {
    const currentDate = new Date(today);
    currentDate.setDate(today.getDate() - i);
    dates.push(currentDate.toISOString().split("T")[0]);
  }
  return dates.reverse();
};

function FinesReport({ api }) {
  const [data, setData] = useState([]);
  const [allData, setAllData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(null);
  const [pieData, setPieData] = useState([]);
  const [signUpData, setSignUpData] = useState([]);

  const last7days = getDateRange(7);
  const lastMonth = getDateRange(30);
  const lastQuarter = getDateRange(90);

  const filterDataByRange = (range) =>
    allData.filter((fine) => {
      const date = fine.createdAt?.split("T")[0];
      return range.includes(date);
    });

  const handleClick = (index) => {
    let filteredData;
    switch (index) {
      case 0:
        filteredData = filterDataByRange(last7days);
        break;
      case 1:
        filteredData = filterDataByRange(lastMonth);
        break;
      case 2:
        filteredData = filterDataByRange(lastQuarter);
        break;
      default:
        filteredData = allData;
    }
    setData(filteredData);
    setSelected(index);

    // Update the pie chart for filter data
    const currentFines = filteredData.filter((row) => !row.paid).length;
    setPieData([
      { label: "Paid", value: filteredData.filter((row) => row.paid).length },
      { label: "Unpaid", value: currentFines },
    ]);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(api);
        if (!response.ok) throw new Error("Failed to fetch data");

        const result = await response.json();
        setAllData(result);
        setData(result); // Initialize with all data

        // Group data by date for signups or fines report
        const grouped = groupByDate(result);
        const formattedData = Object.entries(grouped).map(([date, fines]) => ({
          date,
          fines,
        }));
        setSignUpData(formattedData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [api]);

  const totalFines = data.length;
  const currentFines = data.filter((row) => !row.paid).length;
  const totalFineAmount = data.reduce((sum, row) => sum + row.fineAmount, 0);
  const totalUnpaidAmount = data.reduce(
    (sum, row) => sum + (row.paid ? 0 : row.fineAmount),
    0
  );

  const columns = [
    { field: "itemId", headerName: "Item ID", type: "number", flex: 1 },
    { field: "itemType", headerName: "Item Type", type: "string", flex: 1 },
    { field: "itemName", headerName: "Item Name", type: "string", flex: 1 },
    { field: "memberId", headerName: "Member ID", type: "number", flex: 1 },
    { field: "firstName", headerName: "First Name", type: "string", flex: 1 },
    { field: "lastName", headerName: "Last Name", type: "string", flex: 1 },
    { field: "fineAmount", headerName: "Fine Amount", type: "number", flex: 1 },
    {
      field: "paid",
      headerName: "Paid",
      type: "boolean",
      flex: 1,
      valueFormatter: (params) => (params.value ? "Yes" : "No"),
    },
    { field: "createdAt", headerName: "Created At", type: "string", flex: 1 },
  ];

  return (
    <div>
      {error && <div>Error: {error}</div>}

      {/* Date Filter Buttons */}
      <Box sx={{ marginBottom: 2 }}>
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
      </Box>

      {/* Fines Summary and Pie Chart */}
      <Box sx={{ display: "flex", justifyContent: "space-between", marginTop: 3 }}>
        {/* Fines Summary Section */}
        <Box sx={{ width: "48%" }}>
          <Typography variant="h6">Fines Summary</Typography>
          <Typography>Total Fines Issued: {totalFines}</Typography>
          <Typography>Current Fines Issued: {currentFines}</Typography>
          <Typography>Total Fines Owed: ${totalFineAmount.toFixed(2)}</Typography>
          <Typography>Current Fines Owed: ${totalUnpaidAmount.toFixed(2)}</Typography>
        </Box>

        {/* Pie Chart Section */}
        <Box sx={{ width: "48%" }}>
          <Typography variant="h6">Paid vs. Unpaid Fines</Typography>
          <PieChart
            series={[{ data: pieData }]}
            width={400}
            height={200}
          />
        </Box>
      </Box>

      {/* DataGrid Table */}
      <Paper sx={{ height: 500, width: "100%", marginTop: 2 }}>
        <DataGrid
          rows={data.map((row, index) => ({ id: index, ...row }))}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[5, 10, 20]}
          loading={loading}
        />
      </Paper>
    </div>
  );
}

export default FinesReport;
