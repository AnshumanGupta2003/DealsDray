const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const bcrypt = require("bcryptjs");
const Employee = require('./models/Employee');
const DataModel = require('./models/Data');
const app = express();




// List of allowed origins for CORS
const allowedOrigins = ['http://localhost:3000', 'http://localhost:5173'];

// CORS middleware
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true); // Allow the request
    } else {
      callback(new Error('Not allowed by CORS')); // Reject the request if origin not allowed
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true, // Allow cookies and other credentials
}));

// Middleware for parsing JSON requests
app.use(express.json());

// MongoDB Connection
mongoose.connect(
  "mongodb+srv://Anshuman:Gupta2003@cluster0.brb55.mongodb.net/DealsDray",
  { useNewUrlParser: true, useUnifiedTopology: true }
)
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("Error connecting to MongoDB:", err));

// Multer configuration for file uploads (with file validation)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

app.use(express.json());

// MongoDB Connection
mongoose.connect(
  "mongodb+srv://Anshuman:Gupta2003@cluster0.brb55.mongodb.net/DealsDray", 
  { useNewUrlParser: true, useUnifiedTopology: true }
)
.then(() => console.log("Connected to MongoDB"))
.catch(err => console.error("Error connecting to MongoDB:", err));

// Routes
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    let user = await DataModel.findOne({ username });

    if (user) {
      // If user exists, check password
      if (user.password === password) {
        return res.status(200).json({ message: "Login successful", user });
      } else {
        return res.status(401).json({ message: "Incorrect password" });
      }
    } else {
      // If user does not exist, create a new user
      const newUser = await DataModel.create({ username, password });
      return res.status(201).json({ message: "User registered successfully", user: newUser });
    }
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});





const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Only JPEG and PNG images are allowed!'));
  }
};

const upload = multer({ storage, fileFilter });

// Routes for Employee Data

// 1. GET all employees
app.get('/employees', async (req, res) => {
  try {
    const employees = await Employee.find();
    res.status(200).json(employees);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching employees' });
  }
});

// 2. POST a new employee (this will be used for registration)
// app.post('/employees', upload.single('image'), async (req, res) => {
//   const { name, email, mobileNo, designation, gender, courses, password } = req.body;
//   const image = req.file ? req.file.filename : null;

//   // Validation check (example)
//   if (!email || !mobileNo) {
//     return res.status(400).json({ error: 'Email, Mobile number, and Password are required' });
//   }

//   // Mobile number validation (only 10 digits allowed)
//   const mobileRegex = /^[0-9]{10}$/;
//   if (!mobileRegex.test(mobileNo)) {
//     return res.status(400).json({ error: 'Mobile number must be exactly 10 digits' });
//   }

//   // Check if employee with the same email already exists
//   try {
//     const existingEmployee = await Employee.findOne({ email });
//     if (existingEmployee) {
//       return res.status(400).json({ error: 'Email already in use' });
//     }

//     // Hash the password before saving
//     const hashedPassword = await bcrypt.hash(password, 10);

//     const newEmployee = new Employee({
//       name,
//       email,
//       mobileNo,
//       designation,
//       gender,
//       courses: JSON.parse(courses), // Convert courses back to array
//       image,
//       password: hashedPassword // Save hashed password
//     });

//     await newEmployee.save();
//     res.status(201).json({ message: 'Employee registered successfully!' });
//   } catch (error) {
//     console.error('Error creating employee:', error);
//     res.status(500).json({ error: 'Error creating employee' });
//   }
// });

// 3. DELETE an employee by ID
app.delete('/employees/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // Find and delete the employee by ID
    const deletedEmployee = await Employee.findByIdAndDelete(id);

    if (!deletedEmployee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    res.status(200).json({ message: 'Employee deleted successfully' });
  } catch (error) {
    console.error('Error deleting employee:', error);
    res.status(500).json({ error: 'Error deleting employee' });
  }
});

// 4. PUT (Update) an employee by ID
app.put('/employees/:id', upload.single('image'), async (req, res) => {
  const { id } = req.params;
  const { name, email, mobileNo, designation, gender, courses } = req.body;
  const image = req.file ? req.file.filename : null;

  try {
    // Find the employee by ID
    const employee = await Employee.findById(id);

    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    // Check if email is being updated and ensure it's unique
    if (email && email !== employee.email) {
      const existingEmployee = await Employee.findOne({ email });
      if (existingEmployee) {
        return res.status(400).json({ error: 'Email already in use' });
      }
      employee.email = email;
    }

    // Validate mobile number (only 10 digits allowed)
    if (mobileNo) {
      const mobileRegex = /^[0-9]{10}$/;
      if (!mobileRegex.test(mobileNo)) {
        return res.status(400).json({ error: 'Mobile number must be exactly 10 digits' });
      }
      employee.mobileNo = mobileNo;
    }

    // Update other fields
    if (name) employee.name = name;
    if (designation) employee.designation = designation;
    if (gender) employee.gender = gender;
    if (courses) employee.courses = JSON.parse(courses); // Parse courses if it's a JSON string
    if (image) employee.image = image; // Update the image if a new one is provided

    // Save the updated employee
    const updatedEmployee = await employee.save();

    res.status(200).json({ message: 'Employee updated successfully', updatedEmployee });
  } catch (error) {
    console.error('Error updating employee:', error);
    res.status(500).json({ error: 'Error updating employee' });
  }
});

// Error handling middleware (optional)
app.use((err, req, res, next) => {
  if (err) {
    console.error('Error:', err.message || err);
    return res.status(400).json({ error: err.message || 'Something went wrong' });
  }
});

app.listen(3001, () => {
  console.log('Server is running on port 3001');
});

// Backend route to check if username exists

app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    let user = await DataModel.findOne({ username });

    if (user) {
      // If user exists, check password
      if (user.password === password) {
        return res.status(200).json({ message: "Login successful", user });
      } else {
        return res.status(401).json({ message: "Incorrect password" });
      }
    } else {
      // If user does not exist, create a new user
      const newUser = await DataModel.create({ username, password });
      return res.status(201).json({ message: "User registered successfully", user: newUser });
    }
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});