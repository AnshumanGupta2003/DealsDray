import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import {
  Box, Button, TextField, Typography, FormControl, FormLabel, Select, MenuItem,
  FormControlLabel, Checkbox, Radio, RadioGroup,
} from '@mui/material';
import Header from './Layouts/Header'; 

const EditEmployee = () => {
  const navigate = useNavigate();
  const { state } = useLocation();

  const [formData, setFormData] = useState(null); 
  const [error, setError] = useState(null); 
  const [message, setMessage] = useState('');

  // Redirect if no employee data is passed
  useEffect(() => {
    if (!state || !state.employee) {
      navigate('/employees');
    } else {
      const { employee } = state;
      setFormData({
        name: employee.name,
        email: employee.email,
        mobileNo: employee.mobileNo,
        designation: employee.designation,
        gender: employee.gender,
        courses: employee.courses || [],
        image: employee.image,
      });
    }
  }, [state, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    const updatedCourses = checked
      ? [...formData.courses, value]
      : formData.courses.filter((course) => course !== value);
    setFormData({ ...formData, courses: updatedCourses });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
    }
  };

  const validateForm = () => {
    const { name, email, mobileNo, image, courses } = formData;
  
    // Email validation (basic format check)
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(email)) {
      setError('Invalid email format');
      return false;
    }
  
    // Mobile number validation (only 10 digits allowed)
    const mobileRegex = /^[0-9]{10}$/;
    if (!mobileRegex.test(mobileNo)) {
      setError('Mobile number must be exactly 10 digits');
      return false;
    }
  
    // File validation (only jpg, jpeg, png)
    if (image) {
      const fileExtension = image.name?.split('.').pop().toLowerCase(); // Check if image exists before splitting
      if (!['jpg', 'jpeg', 'png'].includes(fileExtension)) {
        setError('Only JPG, JPEG, or PNG images are allowed');
        return false;
      }
    }
  
    // Make sure courses is an array if it exists
    if (courses && !Array.isArray(courses)) {
      setError('Courses must be an array');
      return false;
    }
  
    setError('');  // Reset error message if all validations pass
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
  
    if (!validateForm()) return;
  
    try {
      const formDataToSend = new FormData();
      for (const key in formData) {
        if (key === 'courses') {
          // Send courses as a JSON string
          formDataToSend.append(key, JSON.stringify(formData[key]));
        } else {
          formDataToSend.append(key, formData[key]);
        }
      }
  
      // API request to update employee without checking for duplicate emails
      await axios.put(`http://localhost:3001/employees/${state.employee._id}`, formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
  
      setMessage('Employee updated successfully!');
      navigate('/EmployeeList');
    } catch (error) {
      console.error('Error updating employee:', error);
      setError('Failed to update employee. Please try again.');
    }
  };

  if (!formData) return <Typography>Loading...</Typography>;

  const coursesList = ['MCA', 'BCA', 'BSC']; 

  return (
    <Box>
      <Header />
      <Typography variant="h4" sx={{ backgroundColor: 'yellow', padding: 1 }}>
        Edit Employee
      </Typography>
      <Box sx={{ width: '50%', margin: 'auto', padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
        {error && <Typography color="error">{error}</Typography>}
        {message && <Typography color="success">{message}</Typography>}
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            sx={{ marginBottom: 2 }}
          />
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            sx={{ marginBottom: 2 }}
          />
          <TextField
            fullWidth
            label="Mobile No"
            name="mobileNo"
            type="text"
            value={formData.mobileNo}
            onChange={handleChange}
            required
            sx={{ marginBottom: 2 }}
          />
          <FormControl fullWidth sx={{ marginBottom: 2 }}>
            <FormLabel>Designation</FormLabel>
            <Select name="designation" value={formData.designation} onChange={handleChange} required>
              <MenuItem value="HR">HR</MenuItem>
              <MenuItem value="Manager">Manager</MenuItem>
              <MenuItem value="Sales">Sales</MenuItem>
            </Select>
          </FormControl>
          <Box sx={{ marginBottom: 3 }}>
            <FormControl component="fieldset">
              <FormLabel>Gender</FormLabel>
              <RadioGroup name="gender" value={formData.gender} onChange={handleChange}>
                <FormControlLabel value="Male" control={<Radio />} label="Male" />
                <FormControlLabel value="Female" control={<Radio />} label="Female" />
              </RadioGroup>
            </FormControl>
          </Box>
          <Box sx={{ marginBottom: 3 }}>
            <FormControl component="fieldset">
              <FormLabel>Courses</FormLabel>
              <Box>
                {coursesList.map((course) => (
                  <FormControlLabel
                    key={course}
                    control={
                      <Checkbox
                        value={course}
                        checked={formData.courses.includes(course)}
                        onChange={handleCheckboxChange}
                      />
                    }
                    label={course}
                  />
                ))}
              </Box>
            </FormControl>
          </Box>
          <FormControl fullWidth sx={{ marginBottom: 2 }}>
            <FormLabel>Image</FormLabel>
            <input type="file" onChange={handleImageChange} accept="image/*" />
          </FormControl>
          <Button variant="contained" type="submit" color="primary" fullWidth>
            Save Changes
          </Button>
        </form>
      </Box>
    </Box>
  );
};

export default EditEmployee;
