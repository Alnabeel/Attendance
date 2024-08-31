import React, { useEffect, useState } from 'react';
import { Client, Databases } from 'appwrite';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress } from '@mui/material';

const DataTable = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const client = new Client()
        .setEndpoint('https://cloud.appwrite.io/v1') // Your Appwrite endpoint
        .setProject('66d2bfe6002a8bb432b3') // Your project ID
        const databases = new Databases(client);
        
        const fetchData = async () => {
            try {
                const response = await databases.listDocuments('66d2c2610028fa44c5aa', '66d2c62e000481c93cc4');
                setData(response.documents);
                console.log(data,";;;;");
                
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <CircularProgress />;
    }

    return (
        <TableContainer component={Paper} sx={{ backgroundColor: '#f5f5f5' }}>
            <Table>
                <TableHead sx={{ backgroundColor: '#3f51b5' }}>
                    <TableRow>
                        <TableCell sx={{ color: '#fff' }}>ID</TableCell>
                        <TableCell sx={{ color: '#fff' }}>Name</TableCell>
                        <TableCell sx={{ color: '#fff' }}>Email</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.map((row) => (
                        <TableRow key={row.$id}>
                            <TableCell>{row.$id}</TableCell>
                            <TableCell>{row.name}</TableCell>
                            <TableCell>{row.email}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default DataTable;
