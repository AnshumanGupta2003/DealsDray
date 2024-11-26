import React, { useState } from 'react';
import {
  TextField, Button, Box, Typography,
  FormControl, FormLabel, RadioGroup,
  FormControlLabel, Radio, Checkbox, Select, MenuItem,
} from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from './Layouts/Header';

const AddEmployee = () => {
  const [employee, setEmployee] = useState({
    name: '',
    email: '',
    mobileNo: '',
    designation: '',
    gender: '',
    courses: [],
    image: null,
  });

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployee({ ...employee, [name]: value });
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    const updatedCourses = checked
      ? [...employee.courses, value]
      : employee.courses.filter((course) => course !== value);
    setEmployee({ ...employee, courses: updatedCourses });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setEmployee({ ...employee, image: file });
  };

  // Client-side validation
  const validateForm = () => {
    const { name, email, mobileNo, image } = employee;

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
      const fileExtension = image.name.split('.').pop().toLowerCase();
      if (!['jpg', 'jpeg', 'png'].includes(fileExtension)) {
        setError('Only JPG, JPEG, or PNG images are allowed');
        return false;
      }
    }

    setError('');  // Reset error message if all validations pass
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form before submission
    if (!validateForm()) return;

    const formData = new FormData();
    formData.append('name', employee.name);
    formData.append('email', employee.email);
    formData.append('mobileNo', employee.mobileNo);
    formData.append('designation', employee.designation);
    formData.append('gender', employee.gender);
    formData.append('courses', JSON.stringify(employee.courses));  // Send courses as JSON string
    
    // Append image only if it exists
    if (employee.image) {
      formData.append('image', employee.image);
    }

    try {
      const response = await axios.post('http://localhost:3001/employees', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setMessage('Employee created successfully!');
      setEmployee({
        name: '',
        email: '',
        mobileNo: '',
        designation: '',
        gender: '',
        courses: [],
        image: null,
      }); // Reset form after successful submission
      navigate('/EmployeeList');  // Redirect to employee list page
    } catch (error) {
      // Capture specific error messages from the server
      if (error.response && error.response.data && error.response.data.error) {
        setMessage('Error: ' + error.response.data.error); // Display specific error message
      } else {
        setMessage('Error creating employee. Please try again.'); // General error message if no specific error is found
      }
    }
  };

  return (
    <Box>
      <Header />
      <Typography variant="h4" sx={{ backgroundColor: 'yellow', padding: 1 }}>
        Create Employee
      </Typography>
      <Box
        sx={{
          width: '50%',
          margin: 'auto',
          padding: '20px',
          backgroundColor: '#f9f9f9',
          borderRadius: '8px',
        }}
      >
        {message && <Typography color="success">{message}</Typography>}
        {error && <Typography color="error">{error}</Typography>} {/* Display validation error */}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Name"
            name="name"
            value={employee.name}
            onChange={handleChange}
            required
            sx={{ marginBottom: 2 }}
          />
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={employee.email}
            onChange={handleChange}
            required
            sx={{ marginBottom: 2 }}
          />
          <TextField
            fullWidth
            label="Mobile No"
            name="mobileNo"
            type="text"
            value={employee.mobileNo}
            onChange={handleChange}
            required
            sx={{ marginBottom: 2 }}
          />
          <FormControl fullWidth sx={{ marginBottom: 2 }}>
            <FormLabel>Designation</FormLabel>
            <Select
              name="designation"
              value={employee.designation}
              onChange={handleChange}
              required
            >
              <MenuItem value="HR">HR</MenuItem>
              <MenuItem value="Manager">Manager</MenuItem>
              <MenuItem value="Sales">Sales</MenuItem>
            </Select>
          </FormControl>
          <Box sx={{ marginBottom: 3 }}>
            <FormControl component="fieldset">
              <FormLabel>Gender</FormLabel>
              <RadioGroup
                name="gender"
                value={employee.gender}
                onChange={handleChange}
              >
                <FormControlLabel value="Male" control={<Radio />} label="Male" />
                <FormControlLabel value="Female" control={<Radio />} label="Female" />
              </RadioGroup>
            </FormControl>
          </Box>
          <Box sx={{ marginBottom: 3 }}>
            <FormControl component="fieldset">
              <FormLabel>Courses</FormLabel>
              <Box>
                {['MCA', 'BCA', 'BSC'].map((course) => (
                  <FormControlLabel
                    key={course}
                    control={
                      <Checkbox
                        value={course}
                        checked={employee.courses.includes(course)}
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
            Add Employee
          </Button>
        </form>
      </Box>
    </Box>
  );
};

export default AddEmployee;
