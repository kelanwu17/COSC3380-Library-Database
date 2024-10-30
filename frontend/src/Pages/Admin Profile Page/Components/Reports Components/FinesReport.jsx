import React, { useEffect, useState } from "react";
import { Paper, Typography, Box } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

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

  // Calculate totals
  const totalFines = data.length;
  const currentFines = data.filter(row => !row.paid).length;
  const totalFineAmount = data.reduce((sum, row) => sum + row.fineAmount, 0);
  const totalUnpaidAmount = data.reduce(
    (sum, row) => sum + (row.paid ? 0 : row.fineAmount),
    0
  );

  return (
    <div>
      {error && <div>Error: {error}</div>}
      <Paper sx={{ height: 500, width: "100%", marginTop: 2 }}>
        <DataGrid
          rows={data.map((row, index) => ({ id: index, ...row }))}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[5, 10, 20]}
          loading={loading}
        />
      </Paper>
      
      {/* Summary Section */}
      <Box sx={{ marginTop: 3, padding: 2, borderTop: "1px solid #ccc" }}>
        <Typography variant="h6">Fines Summary</Typography>
        <Typography>Total Fines Issued: {totalFines}</Typography>
        <Typography>Current Fines Issued: {currentFines}</Typography>
        <Typography>Total Fines Owed: ${totalFineAmount.toFixed(2)}</Typography>
        <Typography>Current Fines Owed: ${totalUnpaidAmount.toFixed(2)}</Typography>
      </Box>
    </div>
  );
};

export default FinesReport;

