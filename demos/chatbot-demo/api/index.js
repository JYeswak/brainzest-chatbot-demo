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
    // We only want to handle POST requests for this endpoint
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    try {
        const { message, lead } = req.body;

        // --- Lead Capture Logic ---
        if (lead) {
            console.log('--- NEW LEAD CAPTURED ---');
            console.log('Name:', lead.name);
            console.log('Email:', lead.email);
            console.log('-------------------------');
            // In a real application, you would add code here to:
            // 1. Save the lead to a database or Google Sheet.
            // 2. Send a notification email using a service like SendGrid or Resend.
            return res.status(200).json({ success: true, message: 'Lead captured.' });
        }

        // --- AI Chat Logic ---
        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        // 1. Read the knowledge base file
        const knowledgeBasePath = path.join(__dirname, 'knowledge_base.json');
        const knowledgeBaseJSON = await fs.readFile(knowledgeBasePath, 'utf8');
        const knowledgeBase = JSON.parse(knowledgeBaseJSON);
        const knowledgeText = knowledgeBase.faqs.map(faq => `Q: ${faq.question}\nA: ${faq.answer}`).join('\n\n');

        // 2. Construct the prompt for the AI
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

        // 3. Call the OpenAI API
        const completion = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: message }
            ],
            temperature: 0.5,
            max_tokens: 150,
        });

        const botResponse = completion.choices[0].message.content;

        // Send the bot's response back to the frontend
        res.status(200).json({ reply: botResponse });

    } catch (error) {
        console.error('Error processing request:', error);
        res.status(500).json({ error: 'An internal error occurred.' });
    }
};
