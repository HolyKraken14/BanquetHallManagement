const express=require("express");
const dotenv=require("dotenv").config();
const userSchema=require("./models/userModel.js");
const dbConnect=require("./config/dbConnect");
const authRoutes=require("./routes/authRoutes");
const userRoutes=require("./routes/userRoutes");
const seminarHallRoutes = require("./routes/seminarHallRoutes");
const seedAdminAndManager = require('./models/seedAdminAndManager');
const seedBanquet = require('./config/seedBanquetHall');
const bookingRoutes = require("./routes/bookingRoutes");

const cors=require("cors");
dbConnect();
seedAdminAndManager();
// Seed banquet halls on startup
seedBanquet();
const app=express();

app.use(express.json());
app.use(cors());

// Serve images as static files
const path = require('path');
app.use('/images', express.static(path.join(__dirname, 'public/images')));

app.use("/api/auth",authRoutes);
app.use("/api/users",userRoutes);
app.use("/api/seminar-halls",seminarHallRoutes);
app.use("/api/bookings", bookingRoutes);


app.get('/',async(req,res)=>{
    const response=await userSchema.find();
    return res.json({user:response})
})


const PORT=process.env.PORT || 7002;
app.listen(PORT, ()=>{
    console.log(`Server is listening on port ${PORT}`)
});