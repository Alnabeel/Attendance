import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import {
  Box,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography
} from '@mui/material';
import { Client, Databases } from 'appwrite';
import React, { useEffect, useState } from 'react';

function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [editingEmployee, setEditingEmployee] = useState(null);
  // const [qrVisible, setQrVisible] = useState({});

  useEffect(() => {
    const client = new Client();
    client
      .setEndpoint('https://cloud.appwrite.io/v1') // Your Appwrite endpoint
      .setProject('66d2bfe6002a8bb432b3'); // Your project ID

    const databases = new Databases(client);

    const fetchEmployees = async () => {
      try {
        const response = await databases.listDocuments(
          '66d2c2610028fa44c5aa', // Your database ID
          '66d2c62e000481c93cc4' // Your collection ID
        );

        const reversedEmployees = response.documents.reverse();
        setEmployees(reversedEmployees);
      } catch (err) {
        console.error('Failed to fetch employees:', err);
      }
    };

    fetchEmployees();
  }, []);

  // Delete employee
  const deleteEmployee = async (employeeId) => {
    const client = new Client();
    client
      .setEndpoint('https://cloud.appwrite.io/v1')
      .setProject('66d2bfe6002a8bb432b3');
    const databases = new Databases(client);

    try {
      await databases.deleteDocument(
        '66d2c2610028fa44c5aa', // Your database ID
        '66d2c62e000481c93cc4', // Your collection ID
        employeeId
      );
      setEmployees((prev) => prev.filter((emp) => emp.$id !== employeeId));
    } catch (err) {
      console.error('Failed to delete employee:', err);
    }
  };

  // Edit employee
  const handleEdit = (employee) => {
    setEditingEmployee(employee.$id);
  };

  const handleSave = async (employeeId, updatedData) => {
    const client = new Client();
    client
      .setEndpoint('https://cloud.appwrite.io/v1')
      .setProject('66d2bfe6002a8bb432b3');
    const databases = new Databases(client);
  
    try {
      // Fetch the current list of employees to check for duplicate emails
      const response = await databases.listDocuments(
        '66d2c2610028fa44c5aa', // Your database ID
        '66d2c62e000481c93cc4' // Your collection ID
      );
      const employees = response.documents;
  
      // Check if the email already exists (excluding the current employee being edited)
      const emailExists = employees.some(
        (emp) => emp.email === updatedData.email && emp.$id !== employeeId
      );
  
      if (emailExists) {
        alert('This email is already in use. Please choose a different email.');
        return; // Stop the save process
      }
  
      // Filter out system attributes like $databaseId, $collectionId, etc.
      const { $id, $databaseId, $collectionId, $permissions, $createdAt, ...cleanData } = updatedData;
  
      // Proceed with the update if email is unique
      await databases.updateDocument(
        '66d2c2610028fa44c5aa', // Your database ID
        '66d2c62e000481c93cc4', // Your collection ID
        employeeId,
        cleanData // Only send the necessary fields
      );
  
      // Update the state
      setEmployees((prev) =>
        prev.map((emp) => (emp.$id === employeeId ? { ...emp, ...cleanData } : emp))
      );
      setEditingEmployee(null); // Exit edit mode
  
    } catch (err) {
      console.error('Failed to save employee:', err);
    }
  };
  
  // Toggle QR visibility
  // const toggleQrVisibility = (employeeId) => {
  //   setQrVisible((prev) => ({
  //     ...prev,
  //     [employeeId]: !prev[employeeId],
  //   }));
  // };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Employee List
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              {/* <TableCell>QR Code</TableCell> */}
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {employees.map((employee) => (
              <TableRow key={employee.$id}>
                <TableCell>
                  {editingEmployee === employee.$id ? (
                    <TextField
                      defaultValue={employee.name}
                      onChange={(e) =>
                        setEmployees((prev) =>
                          prev.map((emp) =>
                            emp.$id === employee.$id ? { ...emp, name: e.target.value } : emp
                          )
                        )
                      }
                    />
                  ) : (
                    employee.name
                  )}
                </TableCell>
                <TableCell>
                  {editingEmployee === employee.$id ? (
                    <TextField
                      defaultValue={employee.email}
                      onChange={(e) =>
                        setEmployees((prev) =>
                          prev.map((emp) =>
                            emp.$id === employee.$id ? { ...emp, email: e.target.value } : emp
                          )
                        )
                      }
                    />
                  ) : (
                    employee.email
                  )}
                </TableCell>
                <TableCell>
                  {editingEmployee === employee.$id ? (
                    <TextField
                      defaultValue={employee.role}
                      onChange={(e) =>
                        setEmployees((prev) =>
                          prev.map((emp) =>
                            emp.$id === employee.$id ? { ...emp, role: e.target.value } : emp
                          )
                        )
                      }
                    />
                  ) : (
                    employee.role
                  )}
                </TableCell>
                {/* <TableCell onClick={() => toggleQrVisibility(employee.$id)}>
                  {qrVisible[employee.$id] ? (
                    <QRCodeSVG value={employee.$id} size={64} />
                  ) : (
                    <Button variant="text">Show QR Code</Button>
                  )}
                </TableCell> */}
                <TableCell>
                  {editingEmployee === employee.$id ? (
                    <IconButton onClick={() => handleSave(employee.$id, employee)}>
                      <SaveIcon />
                    </IconButton>
                  ) : (
                    <IconButton onClick={() => handleEdit(employee)}>
                      <EditIcon />
                    </IconButton>
                  )}
                  <IconButton onClick={() => deleteEmployee(employee.$id)}>
                    <DeleteIcon />
                  </IconButton>
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
