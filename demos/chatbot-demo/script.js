document.addEventListener('DOMContentLoaded', () => {
    const chatBubble = document.getElementById('chat-bubble');
    const chatContainer = document.getElementById('chat-container');
    const closeBtn = document.getElementById('close-btn');
    const chatBox = document.getElementById('chat-box');
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');

    // --- Event Listeners for opening and closing the chat ---
    chatBubble.addEventListener('click', () => {
        chatContainer.style.display = 'flex';
        chatBubble.style.display = 'none';
    });

    closeBtn.addEventListener('click', () => {
        chatContainer.style.display = 'none';
        chatBubble.style.display = 'block';
    });

    // --- Core Chat Logic ---

    // Function to add a message to the chat box
    const addMessage = (message, sender) => {
        const messageElement = document.createElement('div');
        messageElement.classList.add('chat-message', `${sender}-message`);
        messageElement.innerHTML = `<p>${message}</p>`;
        chatBox.appendChild(messageElement);
        // Scroll to the bottom of the chat box
        chatBox.scrollTop = chatBox.scrollHeight;
    };

    // Function to handle sending a message
    const handleSendMessage = async () => {
        const message = userInput.value.trim();
        if (message === '') return;

        // 1. Display the user's message immediately
        addMessage(message, 'user');
        userInput.value = ''; // Clear the input field
        
        // Show the typing indicator
        showTypingIndicator();

        try {
            // 2. Send the message to the backend API
            const response = await fetch('/api/index.js', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: message }),
            });

            // Hide the typing indicator once the response is received
            hideTypingIndicator();

            if (!response.ok) {
                throw new Error('Network response was not ok.');
            }

            const data = await response.json();
            const botReply = data.reply;

            // 3. Display the bot's response
            // Check if the bot is asking for lead capture
            if (botReply.includes("What is your name and email address?")) {
                addMessage(botReply, 'bot');
                showLeadCaptureForm();
            } else {
                addMessage(botReply, 'bot');
            }

        } catch (error) {
            // Hide the typing indicator in case of an error
            hideTypingIndicator();
            console.error('Error fetching bot reply:', error);
            addMessage("I'm having trouble connecting. Please try again later.", 'bot');
        }
    };

    const showLeadCaptureForm = () => {
        const formHTML = `
            <form id="lead-form" class="lead-capture-form">
                <input type="text" id="name-input" placeholder="Your Name" required>
                <input type="email" id="email-input" placeholder="Your Email" required>
                <button type="submit">Submit</button>
            </form>
        `;
        addMessage(formHTML, 'bot');

        const leadForm = document.getElementById('lead-form');
        leadForm.addEventListener('submit', handleLeadSubmit);
    };

    const handleLeadSubmit = async (e) => {
        e.preventDefault();
        const name = document.getElementById('name-input').value;
        const email = document.getElementById('email-input').value;

        addMessage("Thank you! We've received your information and will be in touch shortly.", 'bot');
        
        // Disable the form
        e.target.innerHTML = '<p>Submitted.</p>';

        // Send the lead data to the backend
        try {
            await fetch('/api/index.js', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ lead: { name, email } }),
            });
        } catch (error) {
            console.error('Error submitting lead:', error);
        }
    };

    // --- Helper functions for typing indicator ---
    const showTypingIndicator = () => {
        const indicator = document.createElement('div');
        indicator.classList.add('typing-indicator');
        indicator.id = 'typing-indicator';
        indicator.innerHTML = '<span></span><span></span><span></span>';
        chatBox.appendChild(indicator);
        chatBox.scrollTop = chatBox.scrollHeight;
    };

    const hideTypingIndicator = () => {
        const indicator = document.getElementById('typing-indicator');
        if (indicator) {
            indicator.remove();
        }
    };

    // Send message when the send button is clicked
    sendBtn.addEventListener('click', handleSendMessage);

    // Send message when Enter key is pressed in the input field
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    });
});
