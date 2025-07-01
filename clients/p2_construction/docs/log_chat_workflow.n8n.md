# n8n Workflow: Chat Conversation Logging

*   **Objective:** To receive a completed chat transcript from our chatbot's backend and save it to the "P2 Chatbot Conversation Log" Google Sheet.
*   **Trigger:** A webhook call from our `api/index.js` backend.

---

## Workflow Structure (Node by Node)

### **Node 1: Webhook**

*   **Node Type:** **Webhook**
*   **Configuration:**
    *   **HTTP Method:** `POST`
    *   **Path:** `log-chat-session`
        *   This will give you a unique Test URL (e.g., `http://localhost:5678/webhook-test/log-chat-session`) and a Production URL. Our backend API will call this URL to trigger the workflow.
*   **Output:** The JSON data sent from our backend. It will be structured like this:
    ```json
    {
      "sessionId": "some-unique-id-12345",
      "fullTranscript": "User: Hi there!\nBot: Hello, how can I help you?",
      "leadName": "Jane Doe",
      "leadEmail": "jane.doe@example.com"
    }
    ```

---

### **Node 2: Google Sheets**

*   **Node Type:** **Google Sheets**
*   **Configuration:**
    *   **Authentication:** Select the Google OAuth credential you have already created.
    *   **Resource:** `Sheet`
    *   **Operation:** `Append`
    *   **Spreadsheet ID:**
        *   Paste the ID of your "P2 Chatbot Conversation Log" sheet here. You can get this from the sheet's URL.
    *   **Sheet Name:**
        *   Enter the name of the sheet you want to write to (e.g., "Sheet1").
    *   **Columns:**
        *   This is where you map the data from the webhook to the correct columns in your sheet.
        *   **SessionID:** `{{ $json.body.sessionId }}`
        *   **Timestamp:** `{{ new Date().toISOString() }}` (This expression automatically inserts the current date and time).
        *   **FullTranscript:** `{{ $json.body.fullTranscript }}`
        *   **LeadName:** `{{ $json.body.leadName }}`
        *   **LeadEmail:** `{{ $json.body.leadEmail }}`
*   **Output:** A confirmation that the new row has been successfully added to the Google Sheet.

```