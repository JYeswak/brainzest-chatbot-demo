# Chatbot v2 - Integration Plan

## 1. Objective & Architecture

*   **Objective:** To upgrade the MVP chatbot into a true "24/7 Sales Assistant" by integrating Google Sheets for conversation logging and Google Calendar for automated appointment booking.
*   **Architecture:** We will maintain a clean separation of concerns:
    *   **Chatbot UI (Frontend):** Remains the user interface. No major changes are needed.
    *   **Backend API (`api/index.js`):** Remains the "language brain." Its job is to interpret user intent via the OpenAI API. We will add a small amount of logic to trigger n8n workflows when a specific action is required.
    *   **n8n (The "Action Engine"):** We will build two new, dedicated n8n workflows to handle all business logic and communication with Google services. This keeps our API lightweight and our automations modular.

---

## 2. Part 1: Conversation Logging to Google Sheets

*   **Goal:** To automatically save a transcript of every chat session to a single Google Sheet, creating a powerful lead database and conversation history.

### **Step 1: Design the Google Sheet**
1.  Create a new Google Sheet named "P2 Chatbot Conversation Log".
2.  Create the following headers in the first row:
    *   `A1`: `SessionID` (A unique ID we'll generate for each conversation)
    *   `B1`: `Timestamp` (When the conversation happened)
    *   `C1`: `FullTranscript` (The entire back-and-forth of the conversation)
    *   `D1`: `LeadName` (The name captured from the lead form, if any)
    *   `E1`: `LeadEmail` (The email captured from the lead form, if any)

### **Step 2: Design the n8n Workflow (`log_chat_workflow`)**
*   **Trigger:** `Webhook`
    *   This workflow will have a unique URL that our backend API can call.
*   **Action:** `Google Sheets - Append Row`
    *   **Authentication:** Use the Google OAuth credential we already created.
    *   **Spreadsheet ID:** The ID of the "P2 Chatbot Conversation Log" sheet.
    *   **Sheet Name:** The name of the specific sheet (e.g., "Sheet1").
    *   **Columns:** Map the incoming data from the webhook to the correct columns (`SessionID`, `Timestamp`, `FullTranscript`, etc.).

### **Step 3: Update the Backend API & Frontend**
1.  **In `script.js`:** We will add logic to generate a simple, unique `SessionID` when the chat window is first opened. This ID will be sent with every message.
2.  **In `api/index.js`:**
    *   The API will now need to receive and manage a simple history of the current conversation.
    *   After a conversation ends (e.g., the user closes the chat, or a lead is captured), the API will make a single `POST` request to our new `log_chat_workflow` webhook, sending the entire transcript and any captured lead details.

---

## 3. Part 2: Appointment Booking with Google Calendar

*   **Goal:** To allow the chatbot to intelligently offer and book a "30-minute project consultation" directly into Angel's Google Calendar.

### **Step 1: Design the n8n Workflow (`book_meeting_workflow`)**
*   **Trigger:** `Webhook`
*   **Action:** `Google Calendar - Create Event`
    *   **Authentication:** Use the same Google OAuth credential.
    *   **Calendar:** Select Angel's primary calendar.
    *   **Event Title:** `Project Consultation: P2 Construction + {{ $json.body.leadName }}`
    *   **Start Time / End Time:** The workflow will need to receive a date/time from the chatbot.
    *   **Attendees:** Add the `leadEmail` as a guest.
    *   **Description:** Pre-fill with a standard meeting agenda.
    *   **Add Video Conference:** Enable this to automatically create a Google Meet link.

### **Step 2: Update the Backend API & AI Prompt**
1.  **Update the AI System Prompt:** We will add a new instruction to the main system prompt in `api/index.js`:
    *   "If the user expresses clear interest in starting a project or asks to schedule a meeting, you must respond with the exact phrase: 'I can help with that. What is your name and email, and what day and time works best for you to schedule a 30-minute consultation?'"
2.  **Update the API Logic:**
    *   The API will detect this specific response from the AI.
    *   It will then prompt the user for the required information (name, email, time).
    *   Once the information is collected, the API will call the `book_meeting_workflow` webhook with the details.

---

## 4. Implementation Order

1.  We will build and test the **Google Sheets logging system first**. It is simpler and provides immediate value by capturing data.
2.  Once logging is complete, we will move on to the more complex **Google Calendar booking system**.
