// server/routes/resumeRoutes.js (NEW VERSION using axios)

const express = require('express');
const router = express.Router();
const axios = require('axios'); // Import axios

// NOTE: We are using gemini-1.5-flash which is the modern, fast, and stable model.
// This is the correct model name for the API.
const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyBEToPKVDdVTxT0LR_UMq5d0NalYV81z7E';

router.post('/ai/suggest', async (req, res) => {
    const { field, value } = req.body;
    if (!value) {
        return res.status(400).json({ message: 'Value is required' });
    }

    // This is the detailed prompt we send to the AI
    const prompt = `
        You are an expert career coach. Analyze the following text from the "${field}" section of a user's resume and provide 3-4 actionable suggestions for improvement.
        Focus on using strong action verbs and quantifying achievements.

        User's input:
        ---
        ${value}
        ---

        Your response MUST be a valid JSON object with a single key "suggestions" which is an array of strings. Do not include any other text or formatting.
        Example: { "suggestions": ["Suggestion 1...", "Suggestion 2..."] }
    `;

    // This is the JSON data structure required by the Gemini REST API
    const requestData = {
        contents: [
            {
                parts: [
                    {
                        text: 'this is a professional summary for resume i want you to enhance it and return only the enhanced summary and no comments just the corrected and enhanced summary' + prompt
                    }
                ]
            }
        ]
    };

    try {
        // Make the POST request using axios, just like your curl command
        const response = await axios.post(GEMINI_URL, requestData);

        // Extract the AI's response text from the deeply nested structure
        const suggestionText = response.data.candidates[0].content.parts[0].text;
        
        console.log("Gemini Raw Response:", suggestionText);

        // Parse the JSON text and send it to the frontend
        const parsedSuggestions = JSON.parse(suggestionText);
        res.json(parsedSuggestions);

    } catch (error) {
        // This will catch any network or API key errors
        console.error("Error calling Gemini API:", error.response ? error.response.data : error.message);
        res.status(500).json({ message: 'Failed to get AI suggestions from the API.' });
    }
});

module.exports = router;