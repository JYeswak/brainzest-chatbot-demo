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
      "requestedTime": "Tomorrow at 3pm" 
    }
    ```

---

### **Node 2: Date & Time**

*   **Node Type:** **Date & Time**
*   **Configuration:**
    *   **Operation:** `Parse`
    *   **Value to Parse:** `{{ $json.body.requestedTime }}`
        *   This node is incredibly powerful. It can take a human-readable string like "Tomorrow at 3pm" or "Next Tuesday at noon" and convert it into a standardized, machine-readable date format (ISO 8601).
*   **Output:** A standardized date/time string that the Google Calendar node can understand.

---

### **Node 3: Google Calendar**

*   **Node Type:** **Google Calendar**
*   **Configuration:**
    *   **Authentication:** Select the Google OAuth credential you have already created.
    *   **Resource:** `Event`
    *   **Operation:** `Create`
    *   **Calendar:** Select Angel's primary calendar from the list.
    *   **Title:** `Project Consultation: P2 Construction + {{ $json.body.leadName }}`
    *   **Start Time:** `{{ $node["Date & Time"].json.iso }}` (This uses the output from the Date & Time node).
    *   **End Time:** We need to add 30 minutes to the start time. The expression is:
        `{{ $DateTime.fromISO($node["Date & Time"].json.iso).plus({ minutes: 30 }).toISO() }}`
    *   **Attendees:** `{{ $json.body.leadEmail }}`
    *   **Add Video Conferencing:** `True` (This will automatically create a Google Meet link).
    *   **Send Updates:** `all` (This ensures the client gets a calendar invitation email).
    *   **Description:**
        ```
        This is a 30-minute initial project consultation with Angel Perez from P2 Construction to discuss your vision.

        A Google Meet link has been attached to this event.
        ```
*   **Output:** A confirmation that the calendar event has been successfully created.
