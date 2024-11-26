import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Button, Typography, Pagination, Select, MenuItem, FormControl, InputLabel, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Header from './Layouts/Header';

const EmployeeList = () => {
  const navigate = useNavigate();
  const ITEMS_PER_PAGE = 3;

  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: '', direction: '' });
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    axios.get('http://localhost:3001/employees')
      .then((response) => {
        setEmployees(response.data);
        setFilteredEmployees(response.data); // Initialize filtered list
      })
      .catch((error) => {
        console.error('Error fetching employees:', error);
      });
  }, []);

  const handleDelete = async (employeeId) => {
    try {
      await axios.delete(`http://localhost:3001/employees/${employeeId}`);
      setEmployees((prevEmployees) => prevEmployees.filter(employee => employee._id !== employeeId));
      setFilteredEmployees((prevEmployees) => prevEmployees.filter(employee => employee._id !== employeeId));
    } catch (error) {
      console.error('Error deleting employee:', error);
    }
  };

  const handleEdit = (employee) => {
    navigate(`/edit-employee/${employee._id}`, { state: { employee } });
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  // Sorting logic
  const handleSort = (key, direction) => {
    setSortConfig({ key, direction });

    const sortedEmployees = [...filteredEmployees].sort((a, b) => {
      let valueA = a[key];
      let valueB = b[key];

      // Handle date fields explicitly
      if (key === 'createdDate') {
        valueA = new Date(valueA);
        valueB = new Date(valueB);
      }

      // Sort by strings (case-insensitive), numbers, or dates
      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return direction === 'asc'
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      } else if (typeof valueA === 'number' && typeof valueB === 'number') {
        return direction === 'asc' ? valueA - valueB : valueB - valueA;
      } else if (valueA instanceof Date && valueB instanceof Date) {
        return direction === 'asc' ? valueA - valueB : valueB - valueA;
      }

      // Default fallback
      return 0;
    });

    setFilteredEmployees(sortedEmployees);
  };

  // Search logic
  // Search logic with debugging
  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
  
    const searchResults = employees.filter((employee) => {
      // Safely convert fields to strings before applying .toLowerCase()
      const name = employee.name?.toString().toLowerCase() || '';
      const id = employee.uniqueId?.toString().toLowerCase() || ''; // Convert uniqueId to string
      const phone = employee.mobileNo?.toString().toLowerCase() || '';
      const email = employee.email?.toString().toLowerCase() || '';
  
      return (
        name.includes(query) ||
        id.includes(query) ||
        phone.includes(query) ||
        email.includes(query)
      );
    });
  
    setFilteredEmployees(searchResults);
    setCurrentPage(1); // Reset to the first page when searching
  };
  


  // Pagination logic
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentEmployees = filteredEmployees.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <Box>
      <Header />

      <Typography variant="h4" sx={{ backgroundColor: 'yellow', padding: 1 }}>
        Employee List
      </Typography>

      <Box sx={{ padding: 2, backgroundColor: 'lightblue' }}>
        <Box sx={{ display: 'flex', justifyContent: "space-between", alignItems: "center", padding: "10px", marginBottom: 2 }}>
          <Typography variant="h6">Total Count: {filteredEmployees.length}</Typography>
          <TextField
            label="Search"
            variant="outlined"
            size="small"
            value={searchQuery}
            onChange={handleSearch}
            placeholder="Search by Name, ID, Phone, Email"
            sx={{ width: '300px' }}
          />
          <Button onClick={() => navigate('/add-employee')} variant="contained" color="primary">Create Employee</Button>
        </Box>

        {/* Sorting Dropdowns */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
          <FormControl variant="outlined" sx={{ width: '200px' }}>
            <InputLabel>Sort By</InputLabel>
            <Select
              value={sortConfig.key}
              onChange={(e) => handleSort(e.target.value, sortConfig.direction)}
              label="Sort By"
            >
              <MenuItem value="uniqueId">Unique ID</MenuItem>
              <MenuItem value="name">Name</MenuItem>
              <MenuItem value="email">Email</MenuItem>
              <MenuItem value="createdDate">Created Date</MenuItem>
            </Select>
          </FormControl>

          <FormControl variant="outlined" sx={{ width: '150px' }}>
            <InputLabel>Direction</InputLabel>
            <Select
              value={sortConfig.direction}
              onChange={(e) => handleSort(sortConfig.key, e.target.value)}
              label="Direction"
            >
              <MenuItem value="asc">Ascending</MenuItem>
              <MenuItem value="desc">Descending</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Box sx={{ overflowX: 'auto', padding: 2, marginTop: 2 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f5f5f5' }}>
                <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Unique Id</th>
                <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Image</th>
                <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Name</th>
                <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Email</th>
                <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Mobile No</th>
                <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Designation</th>
                <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Gender</th>
                <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Course</th>
                <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Created Date</th>
                <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentEmployees.map((employee) => (
                <tr key={employee._id} style={{ backgroundColor: '#fff' }}>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{employee.uniqueId}</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                    <img src={employee.image} alt={employee.name+" image"} width="50" height="50" />
                  </td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{employee.name}</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{employee.email}</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{employee.mobileNo}</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{employee.designation}</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{employee.gender}</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                    {employee.courses.join(', ')}
                  </td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                    {new Date(employee.createdDate).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      sx={{ marginRight: 1 }}
                      onClick={() => handleEdit(employee)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="contained"
                      color="secondary"
                      size="small"
                      onClick={() => handleDelete(employee._id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Box>

        {/* Pagination */}
        <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}>
          <Pagination
            count={Math.ceil(filteredEmployees.length / ITEMS_PER_PAGE)}
            page={currentPage}
            onChange={handlePageChange}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default EmployeeList;
