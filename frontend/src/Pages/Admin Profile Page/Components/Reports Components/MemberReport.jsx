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
  Grid2,
} from "@mui/material";
import { LineChart } from "@mui/x-charts/LineChart";
import { PieChart } from "@mui/x-charts";
import { DataGrid } from "@mui/x-data-grid";


const groupByDate = (data) =>
  data.reduce((acc, member) => {
    const date = member.createdAt.split("T")[0];
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});

function MemberReport({ api }) {
  const [data, setData] = useState([]);
  const [allData, setAllData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(null);
  const [signUpData, setSignUpData] = useState([]);

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

  const last7days = getDateRange(7);
  const lastMonth = getDateRange(30);
  const lastQuarter = getDateRange(90);

  const filterDataByRange = (range) =>
    allData.filter((member) => {
      const date = member.createdAt?.split("T")[0];
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

        const grouped = groupByDate(result);
        const formattedData = Object.entries(grouped).map(([date, signups]) => ({
          date,
          signups,
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

  const activeAccounts = data.filter((member) => member.accountStatus === 1).length;
  const inactiveAccounts = data.length - activeAccounts;

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
      <Grid2 container spacing={2}>
        <Grid2 item size={12}>
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
        </Grid2>

        <Grid2 item size={2}>
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>
                    <Box sx={{ fontWeight: "bold" }}>Member Report</Box>
                  </TableCell>
                  <TableCell />
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>Active Accounts</TableCell>
                  <TableCell>{activeAccounts}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Inactive Accounts</TableCell>
                  <TableCell>{inactiveAccounts}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Grid2>

        <Grid2 item size={5}>
          <Paper>
            <Typography variant="overline">New Members Registered (7 days)</Typography>
            <Typography variant="h4">{signUpData.length}</Typography>
            <LineChart
              xAxis={[{ dataKey: "date", scaleType: "band" }]}
              series={[{ dataKey: "signups", label: "Signups" }]}
              dataset={signUpData}
              width={500}
              height={300}
            />
          </Paper>
        </Grid2>

        <Grid2 item size={5}>
          <Paper>
            <Typography variant="overline">Age Groups</Typography>
            <PieChart
              series={[
                {
                  data: [
                    { id: 0, value: 10, label: "Kid" },
                    { id: 1, value: 15, label: "Teen" },
                    { id: 2, value: 20, label: "Adult" },
                  ],
                },
              ]}
              width={400}
              height={200}
            />
          </Paper>
        </Grid2>
      </Grid2>
    </div>
  );
}

export default MemberReport;
