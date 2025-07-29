const express = require("express");
const { CustomAPIError } = require("../errors");
const fetchGeminiResponse = require("../middleware/fetchGeminiResponse");
const router = express.Router();


router.get("/test", async (req, res) => {
    res.send("<h1>Test</h1><p>You passed 🥳!</p>")
});


router.post("/generate", async (req, res) => {
    
    res.set("Content-Type", "application/json");
    try {
        const response = await fetchGeminiResponse();
        const jsonStr = response.candidates[0].content.parts[0].text;
        const parsed = JSON.parse(jsonStr);
        res.status(201).json({msg: "success", data: parsed})
    } catch (error) {
        throw new CustomAPIError(`Failure generating ai response due to ${error}`, 500)
   }
   
});


module.exports = router;