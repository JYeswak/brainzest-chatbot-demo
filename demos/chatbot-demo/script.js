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

        try {
            // 2. Send the message to the backend API
            const response = await fetch('/api/index.js', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: message }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok.');
            }

            const data = await response.json();
            const botReply = data.reply;

            // 3. Display the bot's response
            addMessage(botReply, 'bot');

        } catch (error) {
            console.error('Error fetching bot reply:', error);
            addMessage("I'm having trouble connecting. Please try again later.", 'bot');
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
