const express = require("express");
const router = express.Router();
const {
    getSingleJob,
    getAllJobs,
    createJob,
    updateJob,
    deleteJob
} = require("../controllers/jobs-controller.js");


router.route("/:id")
    .get(getSingleJob)
    .patch(updateJob)
    .delete(deleteJob);

router.route("/")
    .get(getAllJobs)
    .post(createJob);





module.exports = router;