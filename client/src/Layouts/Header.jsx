import React, { useState, useEffect } from 'react'
import {Box, AppBar, Button, Toolbar,Typography} from '@mui/material'
import { useNavigate } from 'react-router-dom';


const Header = () => {
    const [userName, setUserName] = useState('');
    const navigate = useNavigate();
    useEffect(() => {
        const loggedInUser = localStorage.getItem('username');
        if (loggedInUser) {
          setUserName(loggedInUser); // Set the username from localStorage
        } else {
          navigate('/signup'); // Redirect to signup if no username found in localStorage
        }
      }, [navigate]);
    
    const handleLogout = () => {
        localStorage.removeItem('username'); // Remove username from localStorage
        navigate('/signup'); // Redirect to signup page after logout
      };
  return (
    <Box>
    <AppBar position="static" sx={{ color:"black", backgroundColor: 'lightblue' }}>
        <Toolbar>
          <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'space-around' }}>
            <Button color="inherit" onClick={() => navigate('/dashboard')}>Home</Button>
            <Button color="inherit" onClick={() => navigate('/EmployeeList')}>Employee List</Button>
            <Typography variant="body1">{userName}</Typography> {/* Display the logged-in user's name */}
            <Button color="inherit" onClick={handleLogout}>Logout</Button> {/* Logout button */}
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  )
}

export default Header