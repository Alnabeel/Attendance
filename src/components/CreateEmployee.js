import { Box, Button, TextField, Typography } from '@mui/material';
import { Client, Databases, Query } from 'appwrite';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
 
function CreateEmployee() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const client = new Client();
  client
    .setEndpoint('https://cloud.appwrite.io/v1') // Your Appwrite endpoint
    .setProject('66d2bfe6002a8bb432b3'); // Your project ID

  const databases = new Databases(client);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Reset any previous errors

    try {
      // Query the database to check if an employee with the same email already exists
      const existingEmployees = await databases.listDocuments(
        '66d2c2610028fa44c5aa', // Your database ID
        '66d2c62e000481c93cc4', // Your collection ID
        [Query.equal('email', email)]
      );

      if (existingEmployees.total > 0) {
        setError('This employee email already exists.');
        return;
      }

      const newEmployee = {
        name,
        email,
        role,
      };

      await databases.createDocument(
        '66d2c2610028fa44c5aa', // Your database ID
        '66d2c62e000481c93cc4', // Your collection ID
        'unique()', // Document ID (Appwrite will generate a unique ID)
        newEmployee
      );

      navigate('/');
    } catch (err) {
      setError('Failed to create employee. Please try again.');
      console.error(err); // Log the error for debugging purposes
    }
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>Create Employee</Typography>
      <form onSubmit={handleSubmit}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <TextField
            label="Role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          />
          {error && (
            <Typography color="error">
              {error}
            </Typography>
          )}
          <Button variant="contained" type="submit">Create</Button>
        </Box>
      </form>
    </Box>
  );
}

export default CreateEmployee;
