import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Header from './Layouts/Header';

const Dashboard = () => {
  
  const navigate = useNavigate();

  
  

  return (
    <Box>
  {/* Header */}
  <Header />

  {/* Content Section */}
  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', padding: 2 }}>
    <Box sx={{ padding: 2, width:"100%", display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Typography variant="h4">
        Welcome to Admin Panel
      </Typography>
    </Box>
  </Box>
</Box>

  );
};

export default Dashboard;
