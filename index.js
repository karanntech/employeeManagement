import dotenv from "dotenv";

dotenv.config();

import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";
import employeeRoutes from "./routes/employee.routes.js";
import authRoutes from "./routes/auth.routes.js";

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static('uploads'));
app.use('/api/employees', employeeRoutes);
app.use('/api/auth', authRoutes);

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
.then(()=>{
    app.listen(process.env.PORT || 8000,() => {
        console.log(`Server is running at Port : ${process.env.PORT}`)
        console.log("MongoDB connected!!!")
    })
})
.catch((error) => {
    console.log("MongoDB connection Failed!!!", error);
})

// console.log(process.env.MONGODB_URI)
// console.log(process.env.CLOUDINARY_API_KEY)