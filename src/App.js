import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import CreateEmployee from './components/CreateEmployee';
import EmployeeList from './components/EmployeeList';
import Dashboard from './components/Dashboard'; // Import the new Dashboard component
import { AppBar, Toolbar, Typography, Box, SwipeableDrawer, List, ListItem, ListItemText, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import DataTable from './components/Report';

function App() {
  const [open, setOpen] = useState(false);

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  return (
    <Router>
      <Box sx={{ display: 'flex' }}>
        <AppBar position="fixed">
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              {open ? <ChevronLeftIcon /> : <MenuIcon />}
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Employee Management
            </Typography>
          </Toolbar>
        </AppBar>
        <SwipeableDrawer
          anchor="left"
          open={open}
          onClose={handleDrawerToggle}
          onOpen={() => setOpen(true)}
          sx={{
            width: 240,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: 240,
              boxSizing: 'border-box',
            },
          }}
        >
          <List>
            <ListItem button component={Link} to="/" onClick={handleDrawerToggle}>
              <ListItemText primary="Home" />
            </ListItem>
            <ListItem button component={Link} to="/create" onClick={handleDrawerToggle}>
              <ListItemText primary="Create Employee" />
            </ListItem>
            <ListItem button component={Link} to="/dashboard" onClick={handleDrawerToggle}>
              <ListItemText primary="Dashboard" />
            </ListItem>
            <ListItem button component={Link} to="/report" onClick={handleDrawerToggle}>
              <ListItemText primary="Report" />
            </ListItem>
          </List>
        </SwipeableDrawer>
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            bgcolor: 'background.default',
            p: 3,
            marginLeft: open ? 240 : 0,
            transition: 'margin 0.3s ease',
          }}
        >
          <Toolbar />
          <Routes>
            <Route path="/create" element={<CreateEmployee />} />
            <Route path="/" element={<EmployeeList />} />
            <Route path="/dashboard" element={<Dashboard />} /> {/* Add route for Dashboard */}
            <Route path="/report" element={<DataTable />} /> {/* Add route for Dashboard */}
          </Routes>
        </Box>
      </Box>
    </Router>
  );
}

export default App;
