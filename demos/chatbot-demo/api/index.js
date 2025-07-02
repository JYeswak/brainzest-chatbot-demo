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
            
            --- Knowledge Base ---
            ${knowledgeText}
            --- End Knowledge Base ---
        `;

        // Construct the messages array for the API call
        const messages = [
            { role: 'system', content: systemPrompt },
            // Add the entire chat history to the messages
            ...history 
        ];

        const completion = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages: messages, // Send the full conversation history
            temperature: 0.5,
            max_tokens: 150,
        });

        const botResponse = completion.choices[0].message.content;

        res.status(200).json({ reply: botResponse });

    } catch (error) {
        console.error('Error processing request:', error);
        res.status(500).json({ error: 'An internal error occurred.' });
    }
};
