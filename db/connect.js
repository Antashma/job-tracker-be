const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const uri = process.env.MONGODB_URI;

const connectDB = () => {
    return mongoose
     .connect(uri)
 }

module.exports = connectDB;