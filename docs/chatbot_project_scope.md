# Project Scope: MVP AI-Powered Website Chatbot

## 1. Project Overview & Goal

*   **Project:** MVP AI-Powered Website Chatbot.
*   **Goal:** To create a functional, impressive chatbot demo that can be showcased to potential clients (specifically, the construction business test case). This MVP will serve as the foundation for the "Time Saver" service package.
*   **Guiding Principle:** Keep it simple, make it work, and make it look professional. We will avoid unnecessary complexity to ensure a fast, successful build.

---

## 2. Phase 1: Ideation & MVP Feature Set

### User Stories

*   **As a potential customer (website visitor), I want to:**
    *   Be greeted proactively when I land on the site.
    *   Ask questions about the business in plain English.
    *   Get instant, accurate answers to my questions.
    *   Leave my contact information if my question is complex or I want a quote.
*   **As the business owner (our client), I want to:**
    *   Have the chatbot handle common questions automatically to save me time.
    *   Receive an email notification with the potential customer's contact info and their question.

### Core MVP Features (In Scope)

1.  **Static Chat Bubble:** A chat icon that sits in the bottom-right corner of the page.
2.  **Chat Window:** A pop-up window for the conversation.
3.  **Automated Greeting:** The chatbot sends the first message (e.g., "Hi! How can I help you today?").
4.  **FAQ Answering:** The chatbot uses an AI model to answer questions based on a predefined knowledge base.
5.  **Lead Capture:** If the chatbot cannot answer or the user asks for a quote, it will ask for their name, email, and a summary of their needs.
6.  **Email Notification:** A plain text email is sent to the business owner with the captured lead information.

### Features Out of Scope for MVP

*   **Voice Capabilities:** This will be a text-only chatbot.
*   **Booking Appointments:** The bot will direct users to a booking link, not book appointments itself.
*   **User Accounts & Login:** The chat will be anonymous.
*   **Conversation History:** The chatbot will not remember past conversations.
*   **Complex Integrations:** No integration with CRM, accounting software, etc. (This is a future upsell!).

---

## 3. Phase 2: Technology & Framework Selection

To build this quickly and efficiently, we will use a simple, modern, and low-cost stack.

*   **Frontend (The Chat Window):**
    *   **Framework:** Plain **HTML, CSS, and JavaScript**.
    *   **Reasoning:** For a single-purpose UI like this, a heavy framework like React is overkill. This keeps it fast, simple, and with no complex dependencies.

*   **Backend (The "Brain"):**
    *   **Framework:** A **Node.js Serverless Function**.
    *   **Reasoning:** We don't need a full, always-on server. A serverless function is incredibly cheap (effectively free at this scale) and automatically scalable. We can host it on a platform like **Vercel** or **Netlify**.

*   **Database (The "Memory"):**
    *   **Framework:** **None. A simple JSON file.**
    *   **Reasoning:** For the MVP's knowledge base, a database is unnecessary complexity. We will create a `knowledge_base.json` file that the backend function will read from. This is easy to create and edit.

*   **AI Model:**
    *   **API:** **OpenAI API**.
    *   **Model:** We will start with `gpt-3.5-turbo` or `gpt-4o` as it is fast and cost-effective.

---

## 4. Phase 3: Development Sprints

We will build this in four distinct, sequential sprints.

### **Sprint 1: The HTML Prototype (Visual Mockup)**

*   **Goal:** Create the look and feel of the chatbot.
*   **Tasks:**
    1.  Create an `index.html` file.
    2.  Write the HTML for the chat bubble and the hidden chat window.
    3.  Write the CSS to style the chat window, message bubbles (for user and bot), and the text input area.
*   **Outcome:** A static, non-functional but visually complete chat window.

### **Sprint 2: The Backend Core (AI Brain)**

*   **Goal:** Create the serverless function that can "think."
*   **Tasks:**
    1.  Set up a new Node.js project for our serverless function.
    2.  Create the `knowledge_base.json` file with some sample Q&A for the construction business.
    3.  Write the function logic that:
        *   Receives a user's question.
        *   Reads the `knowledge_base.json`.
        *   Sends the question and the knowledge base content to the OpenAI API with a carefully crafted prompt.
        *   Returns the AI's answer.
*   **Outcome:** A functional backend endpoint that we can test with a tool like Postman or `curl`.

### **Sprint 3: Frontend-Backend Integration (Making it Talk)**

*   **Goal:** Connect the visual prototype to the AI brain.
*   **Tasks:**
    1.  Write the JavaScript for the `index.html` file.
    2.  Add an event listener to the text input to capture the user's message.
    3.  Use the `fetch()` API in JavaScript to send the message to our serverless function endpoint.
    4.  Receive the response from the backend and display the bot's message in the chat window.
*   **Outcome:** A user can type a message, press enter, and get a real response from the AI.

### **Sprint 4: UI Refinement & Polish**

*   **Goal:** Make the chatbot feel professional and responsive.
*   **Tasks:**
    1.  Add a "typing..." indicator while the bot is waiting for a response.
    2.  Implement the lead capture form and the email notification logic.
    3.  Ensure the chat window is mobile-friendly.
    4.  Final CSS tweaks.
*   **Outcome:** A polished, demo-ready MVP.
