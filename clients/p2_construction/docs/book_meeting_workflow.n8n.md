# n8n Workflow: Automated Appointment Booking (with Availability Check)

*   **Objective:** To intelligently schedule a meeting by first checking for conflicts, and only creating the event if the time slot is free.
*   **Trigger:** A webhook call from our `api/index.js` backend.

---

## Workflow Structure (Node by Node)

### **Node 1: Webhook**
*   **(No Change)** Receives the meeting request data.

---

### **Node 2: Google Calendar - "Check for Conflicts"**

*   **Node Type:** **Google Calendar**
*   **Configuration:**
    *   **Authentication:** Use your existing Google OAuth credential.
    *   **Resource:** `Event`
    *   **Operation:** `Get Many` (This operation lets us search for events within a time range).
    *   **Calendar:** Select Angel's primary calendar.
    *   **Return All:** Must be enabled (`true`).
    *   **Filters:**
        *   **Start Time:** `{{ $json.body.requestedTime }}`
        *   **End Time:** `{{ DateTime.fromISO($json.body.requestedTime, { setZone: true }).plus({ minutes: 30 }).toISO() }}`
*   **Output:** A list of events. If the list is empty, the time slot is free. If the list contains one or more items, there is a conflict.

---

### **Node 3: Router**

*   **Node Type:** **Router**
*   **Configuration:** This node creates conditional paths for your workflow.
    *   **Routing Setup:**
        *   Click **"Add Route"**.
        *   **Path 1 (Default):** This is the "Conflict" path.
        *   **Path 2:** This is the "Available" path.
    *   **Rules for Path 2 ("Available"):**
        *   **Condition:** `Number`
        *   **Value 1:** `{{ $node["Check for Conflicts"].result.length }}` (This gets the number of events found in the previous step).
        *   **Operation:** `Equals`
        *   **Value 2:** `0`
*   **Output:** The workflow will now split. If the number of conflicting events is 0, it will go down the "Available" path. Otherwise, it will go down the "Conflict" path.

---

## The "Available" Path

### **Node 4a: Google Calendar - "Create Event"**

*   **(This is your original Google Calendar node)**
*   **Configuration:**
    *   Connect this node to the **"Available"** output of the Router.
    *   All settings (Title, Start Time, End Time, Attendees, etc.) remain the same as you have already configured them.

---

## The "Conflict" Path (Manual Intervention for now)

### **Node 4b: Email - "Notify of Conflict"**

*   **Node Type:** **Email** (or Gmail, or another notification service)
*   **Configuration:**
    *   Connect this node to the **"Default"** (Conflict) output of the Router.
    *   **To:** Your email address (e.g., `joshua@zirkel.us`).
    *   **Subject:** `Scheduling Conflict for P2 Consultation: {{ $json.body.leadName }}`
    *   **Text:**
        ```
        A new meeting could not be booked because of a scheduling conflict.

        Client Details:
        Name: {{ $json.body.leadName }}
        Email: {{ $json.body.leadEmail }}
        Phone: {{ $json.body.leadPhone }}

        Requested Time: {{ $json.body.requestedTime }}

        Please reach out to them manually to reschedule.
        ```
*   **Output:** An email is sent to you, allowing you to handle the conflict without losing the lead.
