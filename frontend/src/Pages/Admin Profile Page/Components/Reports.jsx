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



  const handleChange = (event) => {
    setSelectedTable(event.target.value);
  };


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

   
      <br />
      {selectedTable === "members" ? (
        <MemberReport api={apiEndpoints[selectedTable]} />
      ) : selectedTable === "admins" ? (
        <AdminReport data={data} />
      ) : null}
    </div>
  );
};

export default Reports;
