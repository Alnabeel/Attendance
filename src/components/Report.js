import React, { useEffect, useState } from 'react';
import { Client, Databases } from 'appwrite';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, TextField, Typography } from '@mui/material';
import { format } from 'date-fns';

const DataTable = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterDate, setFilterDate] = useState(format(new Date(), 'yyyy-MM-dd')); // Set initial date to today
    const [nameFilter, setNameFilter] = useState('');
    const [emailFilter, setEmailFilter] = useState('');
    const [roleFilter, setRoleFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    useEffect(() => {
        const client = new Client()
            .setEndpoint('https://cloud.appwrite.io/v1') // Your Appwrite endpoint
            .setProject('66d2bfe6002a8bb432b3'); // Your project ID
        const databases = new Databases(client);
        
        const fetchData = async () => {
            try {
                const response = await databases.listDocuments('66d2c2610028fa44c5aa', '66d2c62e000481c93cc4');
                setData(response.documents);
                console.log(response.documents);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Filter data based on the selected date and other filters
    const filteredData = data.filter(row => {
        const checkInDate = format(new Date(row.attendance.check_in), 'yyyy-MM-dd');
        const matchesDate = checkInDate === filterDate;
        const matchesName = row.name.toLowerCase().includes(nameFilter.toLowerCase());
        const matchesEmail = row.email.toLowerCase().includes(emailFilter.toLowerCase());
        const matchesRole = row.role.toLowerCase().includes(roleFilter.toLowerCase());
        const matchesStatus = row.attendance.status.toLowerCase().includes(statusFilter.toLowerCase());

        return matchesDate && matchesName && matchesEmail && matchesRole && matchesStatus;
    });

    if (loading) {
        return <CircularProgress />;
    }

    return (
        <div>
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
            <TableContainer component={Paper} sx={{ backgroundColor: '#f5f5f5' }}>
                <Table>
                    <TableHead sx={{ backgroundColor: '#3f51b5' }}>
                        <TableRow>
                            <TableCell sx={{ color: '#fff' }}>Name</TableCell>
                            <TableCell sx={{ color: '#fff' }}>Email</TableCell>
                            <TableCell sx={{ color: '#fff' }}>Role</TableCell>
                            <TableCell sx={{ color: '#fff' }}>Status</TableCell>
                            <TableCell sx={{ color: '#fff' }}>Check-In</TableCell>
                            <TableCell sx={{ color: '#fff' }}>Location</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredData.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} align="center">
                                    <Typography variant="h6" color="textSecondary">
                                        No data to display for {format(new Date(filterDate), 'dd MMM EEE')}
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredData.map((row) => (
                                <TableRow key={row.$id}>
                                    <TableCell>{row.name}</TableCell>
                                    <TableCell>{row.email}</TableCell>
                                    <TableCell>{row.role}</TableCell>
                                    <TableCell>{row.attendance.status}</TableCell>
                                    <TableCell>{format(new Date(row.attendance.check_in), 'dd MMM EEE')}</TableCell>
                                    <TableCell>{row.attendance.location}</TableCell>
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