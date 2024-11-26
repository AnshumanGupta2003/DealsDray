const express = require('express');
const Employee = require('../models/Employee'); // Import the Employee model
const multer = require('multer'); // Import multer for file uploads
const path = require('path');
const router = express.Router();

// Multer configuration for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Set upload folder
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Unique filename based on timestamp
  },
});
const upload = multer({ storage });

// Route to get all employees from the database
router.get('/employees', async (req, res) => {
  try {
    // Fetch all employees from the Employee collection in MongoDB
    const employees = await Employee.find();
    res.status(200).json(employees); // Send the list of employees back as a JSON response
  } catch (error) {
    res.status(500).json({ message: 'Error fetching employee data' });
  }
});

// Route to update employee details
router.put('/employees/:id', upload.single('image'), async (req, res) => {
  const { id } = req.params; // Get employee ID from URL params
  const { name, email, mobileNo, designation, gender, courses } = req.body;

  try {
    // Find the employee by ID
    const employee = await Employee.findById(id);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    // Update employee fields only if provided
    employee.name = name || employee.name;
    employee.email = email || employee.email;
    employee.mobileNo = mobileNo || employee.mobileNo;
    employee.designation = designation || employee.designation;
    employee.gender = gender || employee.gender;
    employee.courses = courses ? JSON.parse(courses) : employee.courses; // Parse courses if provided

    // Update image if a new one is uploaded
    if (req.file) {
      employee.image = req.file.path; // Set new image path
    }

    // Save updated employee data
    await employee.save();
    res.status(200).json({ message: 'Employee updated successfully', employee });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating employee data' });
  }
});

// Route to delete an employee
router.delete('/employees/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // Find and delete the employee by ID
    const employee = await Employee.findById(id);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    await employee.remove(); // Remove the employee from the database
    res.status(200).json({ message: 'Employee deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting employee data' });
  }
});

module.exports = router;
