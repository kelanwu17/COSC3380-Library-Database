import React, { useEffect, useState } from "react";
import { Paper, Typography, Box } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { PieChart } from "@mui/x-charts";  // Import PieChart component

const FinesReport = ({ api }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(api);
        if (!response.ok) throw new Error("Failed to fetch data");

        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [api]);

  const columns = [
    { field: "itemId", headerName: "Item ID", type: "number", flex: 1 },
    { field: "itemType", headerName: "Item Type", type: "string", flex: 1 },
    { field: "memberId", headerName: "Member ID", type: "number", flex: 1 },
    { field: "fineAmount", headerName: "Fine Amount", type: "number", flex: 1 },
    { 
      field: "paid", 
      headerName: "Paid", 
      type: "boolean", 
      flex: 1,
      valueFormatter: (params) => (params.value ? "Yes" : "No"),
    }
  ];

  // Calculate totals and paid/unpaid distribution
  const totalFines = data.length;
  const currentFines = data.filter(row => !row.paid).length;
  const totalFineAmount = data.reduce((sum, row) => sum + row.fineAmount, 0);
  const totalUnpaidAmount = data.reduce(
    (sum, row) => sum + (row.paid ? 0 : row.fineAmount),
    0
  );

  // Pie chart data for paid/unpaid fines
  const pieData = [
    { label: "Paid", value: data.filter(row => row.paid).length },
    { label: "Unpaid", value: currentFines },
  ];

  return (
    <div>
      {error && <div>Error: {error}</div>}

      {/* Summary and Pie Chart Side by Side */}
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
            series={[{
              data: pieData.map((item, index) => ({
                id: index,
                value: item.value,
                label: item.label,
              })),
            }]}
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
};

export default FinesReport;
