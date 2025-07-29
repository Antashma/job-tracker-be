const Users = require("../models/Users");
const Job = require("../models/Job");
const jwt = require("jsonwebtoken");
const { BadRequestError, CustomAPIError, NotFoundError } = require("../errors");

// const dashboard = async (req, res) => {
//     const authHeader = req.headers.authorization;
//     console.log(authHeader);
//     if (authHeader) {
//         try {
//             const decoded = jwt.verify(authHeader, process.env.JWT_SECRET);
//             res.status(200).json({msg: `Welcome to your dashboard, ${decoded.email}!`})            
//         } catch (error) {
//             throw new Error("User could not be verified.")
//         }
        

//     } else {
//         res.status(401).json({msg: "Token could not be verifired."})
//     }
    
// }

async function getAllJobs(req, res) {
    const jobs = await Job
        .find({createdBy: req.user.userId})
        .sort("createdAt");

    res.status(200).json({count: jobs.length, jobs});
}

async function getSingleJob(req, res) {
    const {user: {userId}, params: {id}} = req;

    const foundJob = await Job.findOne({createdBy: userId, _id: id});

    if (!foundJob) throw new NotFoundError(`Job with id ${id} not found!`)
    
    res.status(200).json({job: foundJob });
}

async function createJob(req, res) {
    req.body.createdBy = req.user.userId;
    const job = await Job.create(req.body);
    res.status(201).json({ job });
}

async function updateJob(req, res) {
    const {
        body: {company, position},
        user: {userId}, 
        params: {id: jobId}
    } = req;

    if (company === "" || position === "") throw new BadRequestError("Company or position cannot be empty.")

    const updatedJob = await Job.findByIdAndUpdate(
        {createdBy: userId, _id: jobId},
        req.body,
        {new: true, runValidators: true}
    );

    if (!updatedJob) throw new NotFoundError(`Job with id ${jobId} not found!`)
    
    res.status(200).json({job: updatedJob });
}

async function deleteJob(req, res) {
    const {
        user: {userId}, 
        params: {id: jobId}
    } = req;

    const removedJob = await Job.findByIdAndDelete({createdBy: userId, _id: jobId});

    if (!removedJob) throw new NotFoundError(`Job with id ${jobId} not found!`)
    
    res.status(200).json({job: removedJob });
}





module.exports = {
    getSingleJob,
    getAllJobs,
    createJob,
    updateJob,
    deleteJob
}