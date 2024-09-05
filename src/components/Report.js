import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography
} from "@mui/material";
import { Client, Databases } from "appwrite";
import { format, isValid } from "date-fns";
import React, { useEffect, useState } from "react";

const DataTable = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterDate, setFilterDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [nameFilter, setNameFilter] = useState("");
  const [emailFilter, setEmailFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    const client = new Client()
      .setEndpoint("https://cloud.appwrite.io/v1")
      .setProject("66d2bfe6002a8bb432b3");
    const databases = new Databases(client);

    const fetchData = async () => {
      try {
        const response = await databases.listDocuments("66d2c2610028fa44c5aa", "66d2d1fb00154ceaa29b");
        setData(response.documents);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredData = data.filter((row) => {
    try {
      const checkInDate = new Date(row.$createdAt);
      if (!isValid(checkInDate)) {
        console.warn("Invalid check-in date:", row.$createdAt);
        return false;
      }
      const formattedCheckInDate = format(checkInDate, "yyyy-MM-dd");
      const matchesDate = formattedCheckInDate === filterDate;
      const matchesName = row.employee?.name?.toLowerCase().includes(nameFilter.toLowerCase()) || false;
      const matchesEmail = row.employee?.email?.toLowerCase().includes(emailFilter.toLowerCase()) || false;
      const matchesRole = row.employee?.role?.toLowerCase().includes(roleFilter.toLowerCase()) || false;
      const matchesStatus = row.status?.toLowerCase().includes(statusFilter.toLowerCase()) || false;

      return matchesDate && matchesName && matchesEmail && matchesRole && matchesStatus;
    } catch (error) {
      console.error("Error filtering data:", error, "Row data:", row);
      return false;
    }
  });

  // Calculate totals
  const totalEmployees = filteredData.length;
  const totalLate = filteredData.filter(row => row.status === "late").length;

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh" // Full viewport height
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <div>
      <Grid container spacing={2} sx={{ marginBottom: 2 }}>
        <Grid item xs={6}>
          <Card>
            <CardContent>
              <Typography variant="h6">Total Employees</Typography>
              <Typography variant="h4">{totalEmployees}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6}>
          <Card>
            <CardContent>
              <Typography variant="h6">Late Employees</Typography>
              <Typography variant="h4">{totalLate}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <TextField
        type="date"
        label="Filter by Check-In Date"
        variant="outlined"
        value={filterDate}
        onChange={(e) => setFilterDate(e.target.value)}
        sx={{ marginBottom: 2, marginRight: 2 }}
      />
      <TextField
        label="Filter by Name"
        variant="outlined"
        value={nameFilter}
        onChange={(e) => setNameFilter(e.target.value)}
        sx={{ marginBottom: 2, marginRight: 2 }}
      />
      <TextField
        label="Filter by Email"
        variant="outlined"
        value={emailFilter}
        onChange={(e) => setEmailFilter(e.target.value)}
        sx={{ marginBottom: 2, marginRight: 2 }}
      />
      <TextField
        label="Filter by Role"
        variant="outlined"
        value={roleFilter}
        onChange={(e) => setRoleFilter(e.target.value)}
        sx={{ marginBottom: 2, marginRight: 2 }}
      />
      <TextField
        label="Filter by Status"
        variant="outlined"
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
        sx={{ marginBottom: 2, marginRight: 2 }}
      />
      <TableContainer component={Paper} sx={{ backgroundColor: "#f5f5f5" }}>
        <Table>
          <TableHead sx={{ backgroundColor: "#3f51b5" }}>
            <TableRow>
              <TableCell sx={{ color: "#fff" }}>Name</TableCell>
              <TableCell sx={{ color: "#fff" }}>Email</TableCell>
              <TableCell sx={{ color: "#fff" }}>Role</TableCell>
              <TableCell sx={{ color: "#fff" }}>Status</TableCell>
              <TableCell sx={{ color: "#fff" }}>Check-In</TableCell>
              <TableCell sx={{ color: "#fff" }}>Place</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Typography variant="h6" color="textSecondary">
                    No data to display for {format(new Date(filterDate), "dd MMM EEE")}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredData.map((row) => (
                <TableRow key={row.$id}>
                  <TableCell>{row.employee?.name || "N/A"}</TableCell>
                  <TableCell>{row.employee?.email || "N/A"}</TableCell>
                  <TableCell>{row.employee?.role || "N/A"}</TableCell>
                  <TableCell sx={{ color: row.status === "late" ? "red" : "inherit" }}>
                    {row.status || "N/A"}
                  </TableCell>
                  <TableCell>
                    {row.$createdAt ? format(new Date(row.$createdAt), "dd MMM EEE HH:mm:ss") : "N/A"}
                  </TableCell>
                  <TableCell>{row.place || "N/A"}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default DataTable;
