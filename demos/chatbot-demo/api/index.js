// Load environment variables from .env file for local development
require('dotenv').config();

// Import the 'fs/promises' module to read files asynchronously
const fs = require('fs/promises');
// Import the 'path' module to handle file paths
const path = require('path');
// Import the OpenAI library
const OpenAI = require('openai');

// Initialize the OpenAI client with the API key from environment variables
// This is a secure way to handle API keys. We will need to set this up in our hosting platform.
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// This is the main handler function for the serverless environment
module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    try {
        const { sessionId, history } = req.body;

        if (!history || !Array.isArray(history)) {
            return res.status(400).json({ error: 'History is required and must be an array.' });
        }

        // --- AI Chat Logic ---
        const knowledgeBasePath = path.join(__dirname, 'knowledge_base.json');
        const knowledgeBaseJSON = await fs.readFile(knowledgeBasePath, 'utf8');
        const knowledgeBase = JSON.parse(knowledgeBaseJSON);
        const knowledgeText = knowledgeBase.faqs.map(faq => `Q: ${faq.question}
A: ${faq.answer}`).join('\n\n');

        const systemPrompt = `
            You are a helpful and friendly AI assistant for a construction company called ${knowledgeBase.company_name}.
            Your name is "Zesty".
            You must answer the user's questions based ONLY on the information provided in the "Knowledge Base" section below.
            Do not make up answers or provide information from outside the knowledge base.

            If the user asks a question that cannot be answered by the knowledge base, you must respond with the exact phrase:
            "That's a great question, but I don't have the answer. I can have a human from our team get in touch with you. What is your name and email address?"

            If the user expresses a clear intent to schedule a meeting or consultation, you must ask for their name, email, and a preferred day and time. Once you have this information, you must respond with the exact phrase: "BOOKING_CONFIRMED" followed by a single-line JSON object containing the collected information. The time must be converted to ISO 8601 format.
            Example of a final response: BOOKING_CONFIRMED {"name":"Jane Doe","email":"jane.doe@example.com","time":"2025-07-08T15:00:00-06:00"}
            
            --- Knowledge Base ---
            ${knowledgeText}
            --- End Knowledge Base ---
        `;

        // Construct the messages array for the API call
        const messages = [
            { role: 'system', content: systemPrompt },
            ...history 
        ];

        const completion = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages: messages,
            temperature: 0.5,
            max_tokens: 200, // Increased max tokens to accommodate the JSON response
        });

        let botResponse = completion.choices[0].message.content;

        // Check if the response contains the booking confirmation keyword
        if (botResponse.startsWith("BOOKING_CONFIRMED")) {
            try {
                // Extract the JSON part of the string
                const jsonString = botResponse.replace("BOOKING_CONFIRMED", "").trim();
                const bookingDetails = JSON.parse(jsonString);

                // Call the n8n webhook to book the meeting
                await fetch('http://localhost:5678/webhook/book-p2-meeting', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        leadName: bookingDetails.name,
                        leadEmail: bookingDetails.email,
                        requestedTime: bookingDetails.time
                    }),
                });

                // Update the response to be more user-friendly
                botResponse = `Thank you, ${bookingDetails.name}! I have scheduled a 30-minute consultation for you. You will receive a calendar invitation at ${bookingDetails.email} shortly.`;

            } catch (e) {
                console.error("Error parsing booking JSON or calling webhook:", e);
                botResponse = "I had trouble finalizing the booking. A team member will reach out to you shortly to confirm.";
            }
        }

        res.status(200).json({ reply: botResponse });

    } catch (error) {
        console.error('Error processing request:', error);
        res.status(500).json({ error: 'An internal error occurred.' });
    }
};
