import React, { useEffect, useState } from "react";
import {
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  CircularProgress,
  Typography,
  Paper,
  Box,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import MemberReport from "./Reports Components/MemberReport";
import AdminReport from "./Reports Components/AdminReport";

const Reports = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTable, setSelectedTable] = useState("members");

  const baseUrl = "https://library-database-backend.onrender.com/api/";
  const apiEndpoints = {
    members: baseUrl + "member/",
    admins: baseUrl + "admin/",
    books: baseUrl + "books/",
    music: baseUrl + "music/",
    technology: baseUrl + "technology/",
    events: baseUrl + "event/",
    fines: baseUrl + "fines/",
    waitlist: baseUrl + "waitlist/",
    libraryCards: baseUrl + "libraryCard/",
    checkoutBooks: baseUrl + "checkoutbook/",
    checkoutMusic: baseUrl + "checkoutmusic/",
    checkoutTech: baseUrl + "checkouttech/",
    bookInstances: baseUrl + "bookInstance/",
    musicInstances: baseUrl + "musicInstance/",
    techInstances: baseUrl + "techInstance/",
    employeeLogs: baseUrl + "employeeLog/",
    eventSignups: baseUrl + "eventSignUp/",
    reserves: baseUrl + "reserve/",
  };

  const tableOptions = Object.keys(apiEndpoints).map((key) => ({
    value: key,
    label: key
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase()), // Converts camelCase to Title Case
  }));

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(apiEndpoints[selectedTable]);
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedTable]);

  const handleChange = (event) => {
    setSelectedTable(event.target.value);
  };

  // Dynamically generate columns from the first row of data
  const columns =
    data.length > 0
      ? Object.keys(data[0]).map((key) => ({
          field: key,
          headerName: key.charAt(0).toUpperCase() + key.slice(1),
          flex: 1,
        }))
      : [];

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">Error: {error}</Typography>;

  return (
    <div>
      <FormControl fullWidth margin="normal">
        <InputLabel id="table-select-label">Select Table</InputLabel>
        <Select
          labelId="table-select-label"
          value={selectedTable}
          onChange={handleChange}
        >
          {tableOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Paper style={{ height: 500, width: "100%", marginTop: "16px" }}>
        <DataGrid
          rows={data.map((row, index) => ({ id: index, ...row }))}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[5, 10, 20]}
          disableSelectionOnClick
          loading={loading}
        />
      </Paper>
      <br />
      {selectedTable === "members" ? (
        <MemberReport data={data} />
      ) : selectedTable === "admins" ? (
        <AdminReport data={data} />
      ) : null}
    </div>
  );
};

export default Reports;
