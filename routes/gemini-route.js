const express = require("express");
const { getTest, generate } = require("../controllers/gemini-controller");
const router = express.Router();


router.route("/test").get(getTest);

router.route("/generate").post(generate);


module.exports = router;