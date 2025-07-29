const Users = require("../models/Users");
const jwt = require("jsonwebtoken");
const { BadRequestError, UnauthenticatedError } = require("../errors");


const register = async (req, res) => {
    const newUser = await Users.create({...req.body});
    res.status(201).json({user: newUser.display_name});  
}

const login =  async (req, res) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
        throw new BadRequestError("Please provide email and password.")
    }

    const foundUser = await Users.findOne({ email });
    if (!foundUser) throw new BadRequestError("Email not found.")

    const isMatch = await foundUser.comparePassword(password)
    if (!isMatch) throw new UnauthenticatedError("Invalid credentials.")

    const token = jwt.sign(
            {
                id: foundUser._id, 
                email,
                displayName: foundUser.display_name
            },
            process.env.JWT_SECRET,
            {expiresIn: "1h"}) 

    res.status(201).json({msg: "login sucessful", token})  

} 



module.exports = {
    register,
    login
}