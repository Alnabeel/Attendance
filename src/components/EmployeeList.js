import React from 'react';
import { QRCodeSVG } from 'qrcode.react'; // Using QRCodeSVG
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Box } from '@mui/material';

function EmployeeList() {
  const employees = JSON.parse(localStorage.getItem('employees')) || [];

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>Employee List</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>QR Code</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {employees.map((employee) => (
              <TableRow key={employee.id}>
                <TableCell>{employee.name}</TableCell>
                <TableCell>{employee.email}</TableCell>
                <TableCell>
                  <QRCodeSVG value={employee.email} size={64} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default EmployeeList;
