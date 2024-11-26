const mongoose = require('mongoose');

// Employee Schema
const employeeSchema = new mongoose.Schema({
  uniqueId: { type: Number, unique: true },
  image: { type: String },
  name: { type: String, required: true },
  email: { type: String, required: true },
  mobileNo: { type: String, required: true },
  designation: { type: String, required: true },
  gender: { type: String, required: true },
  courses: { type: [String], required: true },
  createdDate: { type: Date, default: Date.now },
});

// Pre-save hook to generate uniqueId as one more than the last employee's uniqueId
employeeSchema.pre('save', async function (next) {
  if (!this.uniqueId) {
    try {
      // Find the employee with the highest uniqueId
      const lastEmployee = await Employee.findOne().sort({ uniqueId: -1 });
      this.uniqueId = lastEmployee ? lastEmployee.uniqueId + 1 : 1; // If no employee exists, start with 1
    } catch (error) {
      console.error('Error getting the last employee ID:', error);
      next(error); // Pass the error to the next middleware if there is an issue
    }
  }
  next();
});

const Employee = mongoose.model('Employee', employeeSchema);

module.exports = Employee;
