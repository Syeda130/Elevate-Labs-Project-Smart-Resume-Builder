// server/routes/resumeRoutes.js (NEW VERSION using axios)

const express = require('express');
const router = express.Router();
const axios = require('axios'); // Import axios
const path = require('path'); // Import the path module
require('dotenv').config({ path: path.resolve(__dirname, '../.env') }); // Load environment variables from .env file using absolute path


// This is the correct model name for the API.
const LLM_API_KEY = process.env.LLM_API_KEY;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${LLM_API_KEY}`;
console.log(GEMINI_URL);

router.post('/ai/suggest', async (req, res) => {
    const { field, value } = req.body;
    if (!value) {
        return res.status(400).json({ message: 'Value is required' });
    }

    let prompt = ``;
    if (field === 'projectDescription') {
        prompt = `
            You are an expert career coach. Analyze the following project description from a user's resume. 

            First, briefly explain what the user should *avoid* saying or common pitfalls to watch out for, providing a mild and educating criticism.

            Then, explain how they can improve their description by clearly stating the problem the project solved, highlighting the technologies and skills used, and quantifying the outcome. Be specific and actionable.

            Finally, provide 2 actionable suggestions for improvement, incorporating the advice you just gave.

            User's input:
            ---
            ${value}
            ---

            Your response MUST be a valid JSON object with two keys: "criticism" (a string explaining what to avoid) and "suggestions" (an array of strings). Do not include any other text or formatting.
            Example: { "criticism": "Avoid vague terms...", "suggestions": ["Suggestion 1...", "Suggestion 2..."] }
        `;
    } else {
        prompt = `
            You are an expert career coach. Analyze the following text from the "${field}" section of a user's resume. 

            First, briefly explain what the user should *avoid* saying or common pitfalls to watch out for, providing a mild and educating criticism.

            Then, explain how they can improve their text by using stronger action verbs and quantifying achievements. Be specific and actionable.

            Finally, provide 2 actionable suggestions for improvement, incorporating the advice you just gave.

            User's input:
            ---
            ${value}
            ---

            Your response MUST be a valid JSON object with two keys: "criticism" (a string explaining what to avoid) and "suggestions" (an array of strings). Do not include any other text or formatting.
            Example: { "criticism": "Avoid vague terms...", "suggestions": ["Suggestion 1...", "Suggestion 2..."] }
        `;
    }

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

        // Attempt to extract JSON using regex
        const jsonMatch = suggestionText.match(/\{[\s\S]*?\}/);

        if (jsonMatch) {
            try {
                const parsedSuggestions = JSON.parse(jsonMatch[0]);
                res.json(parsedSuggestions);
            } catch (parseError) {
                console.error("Error parsing JSON after regex extraction:", parseError);
                res.status(500).json({ message: 'Failed to parse AI suggestions even after extraction.' });
            }
        } else {
            console.error("Could not find JSON in AI response.");
            res.status(500).json({ message: 'Could not find valid JSON in the AI response.' });
        }

    } catch (error) {
        // This will catch any network or API key errors
        console.error("Error calling Gemini API:", error.response ? error.response.data : error.message);
        res.status(500).json({ message: 'Failed to get AI suggestions from the API.' });
    }
});

module.exports = router;
