import React, { useState, useEffect } from 'react';
import { TextField, Button, Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, addDays } from 'date-fns';

function Dashboard() {
  const [employees, setEmployees] = useState(JSON.parse(localStorage.getItem('employees')) || []);
  const [startDate, setStartDate] = useState(format(startOfMonth(new Date()), 'yyyy-MM-dd'));
  const [endDate, setEndDate] = useState(format(addDays(startOfMonth(new Date()), 14), 'yyyy-MM-dd')); // Show first 15 days initially
  const [filteredEmployees, setFilteredEmployees] = useState([]);

  useEffect(() => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = eachDayOfInterval({ start, end });
    const presenceData = employees.map(employee => {
      const presence = days.map(day => {
        const dateString = format(day, 'yyyy-MM-dd');
        // Simulate presence check. Replace with actual data retrieval if needed
        return { date: dateString, present: Math.random() > 0.5 }; // Random presence
      });
      return { ...employee, presence };
    });
    setFilteredEmployees(presenceData);
  }, [startDate, endDate, employees]);

  const handleDateChange = () => {
    setStartDate(startDate);
    setEndDate(endDate);
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>Dashboard</Typography>
      <Box sx={{ mb: 3 }}>
        <TextField
          label="Start Date"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
          sx={{ mr: 2 }}
        />
        <TextField
          label="End Date"
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
          sx={{ mr: 2 }}
        />
        <Button variant="contained" onClick={handleDateChange}>Filter</Button>
      </Box>
      <Box sx={{ maxWidth: '100%', overflowX: 'auto' }}>
        <TableContainer component={Paper} sx={{ minWidth: 800 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                {eachDayOfInterval({ start: new Date(startDate), end: new Date(endDate) }).map(day => (
                  <TableCell key={day} style={{ minWidth: 120 }}>{format(day, 'MMM d')}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredEmployees.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell>{employee.name}</TableCell>
                  {eachDayOfInterval({ start: new Date(startDate), end: new Date(endDate) }).map(day => {
                    const dateString = format(day, 'yyyy-MM-dd');
                    const presence = employee.presence.find(p => p.date === dateString);
                    return <TableCell key={dateString} style={{ backgroundColor: presence?.present ? 'lightgreen' : 'lightcoral', minWidth: 120 }} />;
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
}

export default Dashboard;
