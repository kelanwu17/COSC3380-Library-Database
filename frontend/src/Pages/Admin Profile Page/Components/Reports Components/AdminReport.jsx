import React from 'react'
import {
    Box,
  Grid2,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
function AdminReport({data}) {
    const activeAccounts = data.filter(
        (member) => member.active === 1
      ).length;
    
      const inactiveAccounts = data.filter((member) => member.active === 0);
    
      return (
        <div>
          <Grid2 container spacing={2}>
            <Grid2 item size={6}>
              <TableContainer component={Paper}>
                <Table
                  sx={{ minWidth: 650 }}
                  size="small"
                  aria-label="a dense table"
                >
                  <TableHead>
                    <TableRow>
                      <TableCell><Box sx={{fontWeight: 'bold'}}>Admin Report</Box></TableCell>
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
                      <TableCell>{inactiveAccounts.length}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid2>
            <Grid2 item size={6}>
                {/* <Paper>
                <Typography variant="overline">New Members</Typography>
                <br/>
                <Box sx={{ fontWeight: 'bold' }}>50</Box>
                <LineChart
                xAxis={[{ data: [1, 2, 3, 5, 8, 10] }]}
                series={[
                  {
                    data: [2, 5.5, 2, 8.5, 1.5, 5],
                  },
                ]}
                width={500}
                height={300}
              />
                </Paper> */}
              
            </Grid2>
          </Grid2>
        </div>
      );
}

export default AdminReport