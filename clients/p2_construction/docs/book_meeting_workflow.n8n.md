# n8n Workflow: Automated Appointment Booking

*   **Objective:** To receive a meeting request from our chatbot's backend and automatically create a new event in Angel's Google Calendar.
*   **Trigger:** A webhook call from our `api/index.js` backend.

---

## Workflow Structure (Node by Node)

### **Node 1: Webhook**

*   **Node Type:** **Webhook**
*   **Configuration:**
    *   **HTTP Method:** `POST`
    *   **Path:** `book-p2-meeting`
        *   This will give you a unique Production URL that our backend API will call.
*   **Output:** The JSON data sent from our backend. It will be structured like this:
    ```json
    {
      "leadName": "Jane Doe",
      "leadEmail": "jane.doe@example.com",
      "leadPhone": "555-123-4567",
      "leadAddress": "123 Main St, Steamboat Springs, CO",
      "requestedTime": "2025-07-08T15:00:00-06:00" 
    }
    ```

---

### **Node 2: Google Calendar**

*   **Node Type:** **Google Calendar**
*   **Configuration:**
    *   **Authentication:** Select the Google OAuth credential you have already created.
    *   **Resource:** `Event`
    *   **Operation:** `Create`
    *   **Calendar:** Select Angel's primary calendar from the list.
    *   **Title:** `Project Consultation: P2 Construction + {{ $json.body.leadName }}`
    *   **Start Time:** `{{ $json.body.requestedTime }}`
    *   **End Time:** `{{ DateTime.fromISO($json.body.requestedTime, { setZone: true }).plus({ minutes: 30 }).toISO() }}`
    *   **Attendees:** `{{ $json.body.leadEmail }}`
    *   **Add Video Conferencing:** `True` (This will automatically create a Google Meet link).
    *   **Send Updates:** `all` (This ensures the client gets a calendar invitation email).
    *   **Description:**
        ```
        New Project Consultation with:
        Name: {{ $json.body.leadName }}
        Email: {{ $json.body.leadEmail }}
        Phone: {{ $json.body.leadPhone }}
        Address: {{ $json.body.leadAddress }}

        A Google Meet link has been attached to this event.
        ```
*   **Output:** A confirmation that the calendar event has been successfully created.
