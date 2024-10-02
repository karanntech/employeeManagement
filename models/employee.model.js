import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema({
  name: { 
    type: String,
    required: true 
    },
  email: { 
    type: String, 
    required: true, 
    unique: true 
    },
  mobileNo: {
    type: String,
    required: true 
    },
  designation: {
    type: String,
    enum: ['HR', 'Sales', 'Manager'],
    required: true 
    },
  courses: {
    type: [String],
    enum: ['MCA', 'BCA', 'Bsc'],
    required: true 
    },
  gender: {
    type: String,
    enum: ['M', 'F'],
    required: true
    },
  image: {
    type: String 
    } // Path to the uploaded image
}, { timestamps: true });


export const Employee = mongoose.model('Employee', employeeSchema)
