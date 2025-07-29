const express = require("express");
const router = express.Router();
const Job = require("../models/Job");
const { BadRequestError, NotFoundError } = require("../errors");


router.get("/", async (req, res) => {
    const jobs = await Job
        .find({createdBy: req.user.userId})
        .sort("createdAt");

    res.status(200).json({count: jobs.length, jobs});
});


router.get("/:id", async (req, res) => {
    const {user: {userId}, params: {id}} = req;

    const foundJob = await Job.findOne({createdBy: userId, _id: id});

    if (!foundJob) throw new NotFoundError(`Job with id ${id} not found!`)
    
    res.status(200).json({job: foundJob });
});


router.post("/", async (req, res) => {
    req.body.createdBy = req.user.userId;
    const job = await Job.create(req.body);
    res.status(201).json({ job });
});


router.patch("/:id", async (req, res) => {
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
});


router.delete("/:id", async (req, res) => {
    const {
        user: {userId}, 
        params: {id: jobId}
    } = req;

    const removedJob = await Job.findByIdAndDelete({createdBy: userId, _id: jobId});

    if (!removedJob) throw new NotFoundError(`Job with id ${jobId} not found!`)
    
    res.status(200).json({job: removedJob });
});




module.exports = router;