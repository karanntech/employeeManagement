import express from "express";
import multer from "multer";
import {body, validationResult } from "express-validator";
import {Employee} from "../models/employee.model.js"
import uploadOnCloudinary from "../utils/cloudinary.js";
const router = express.Router();

import dotenv from "dotenv";
dotenv.config();

// Set up multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Validation rules
const employeeValidation = [
  body('name').notEmpty().withMessage('Name is required.'),
  body('email').isEmail().withMessage('Valid email is required.'),
  body('mobileNo').isMobilePhone().withMessage('Valid mobile number is required.'),
  body('designation').isIn(['HR', 'Sales', 'Manager']).withMessage('Valid designation is required.'),
  body('courses').isArray().withMessage('At least one course must be selected.'),
  body('gender').isIn(['M', 'F']).withMessage('Valid gender is required.'),
];

// Create a new employee
router.post('/create', upload.single('image'), async (req, res) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
  }

  try {
    let imageUrl = '';
    if (req.file) {
      // Use the upload function to upload the image to Cloudinary
      const result = await uploadOnCloudinary(req.file.buffer);
      imageUrl = result.secure_url;
      }

      const employee = new Employee({
          name: req.body.name,
          email: req.body.email,
          mobileNo: req.body.mobileNo,
          designation: req.body.designation,
          courses: req.body.courses,
          gender: req.body.gender,
          image: imageUrl,
      });
    
      await employee.save();
      res.status(201).json(employee);
  } catch (error) {
      res.status(400).json({ error: error.message });
  }
});

// Get all employees
router.get('/getInfo', async (req, res) => {
  try {
    const employees = await Employee.find();
    res.json(employees);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update an employee
router.put('/:id', upload.single('image'), async (req, res) => {
  const { name, email, mobileNo, designation, courses, gender } = req.body;

  // Prepare an object to hold the updated fields
  const updatedData = {};

  // Only add fields that are present in the request body
  if (name) updatedData.name = name;
  if (email) updatedData.email = email;
  if (mobileNo) updatedData.mobileNo = mobileNo;
  if (designation) updatedData.designation = designation;
  if (courses) updatedData.courses = Array.isArray(courses) ? courses : courses.split(','); // Ensure it's an array
  if (gender) updatedData.gender = gender;

  try {
    // Handle image upload if provided
    if (req.file) {
      const imageUrl = await uploadOnCloudinary(req.file.buffer);
      updatedData.image = imageUrl; // Store the image URL
    }

    // Find the employee by ID and update with the new fields
    const employee = await Employee.findByIdAndUpdate(req.params.id, updatedData, { new: true, runValidators: true });
    
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    
    res.json(employee);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


// Delete an employee
router.delete('/:id', async (req, res) => {
  try {
    await Employee.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
