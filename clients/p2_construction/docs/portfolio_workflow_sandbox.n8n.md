# n8n Workflow: Dynamic Project Portfolio (Sandbox Version)

*   **Objective:** To create a safe, self-contained demo that takes a form submission and automatically generates a professional case study as a Google Doc.
*   **Environment:** Local n8n instance for testing and demonstration. Does NOT connect to any live website.

---

## Workflow Structure (Node by Node)

### **Node 1: Webhook Trigger**

*   **Node Type:** **Webhook**
*   **Configuration:**
    *   **HTTP Method:** `POST`
    *   This node generates a unique URL. You will copy this URL and paste it into the "Integrations" or "Webhooks" section of your form builder (Jotform/Typeform).
*   **Output:** The raw data from the form submission.

---

### **Node 2: Set (Data Cleanup)**

*   **Node Type:** **Set**
*   **Configuration:**
    *   This node cleans up the incoming data for easier use.
    *   Create new variables:
        *   `projectTitle` = `{{ $json.body.project_title }}`
        *   `projectSummary` = `{{ $json.body.project_summary }}`
        *   `testimonialText` = `{{ $json.body.client_testimonial }}`
        *   `testimonialName` = `{{ $json.body.client_name }}`
*   **Output:** Clean, named variables.

---

### **Node 3: AI Agent (The Writer)**

*   **Node Type:** **AI Agent** or **LLM Chain**
*   **Configuration:**
    *   **LLM Service:** OpenAI
    *   **Model:** `gpt-4o`
    *   **System Prompt:**
        ```
        You are a professional architectural writer for P2 Construction. Your task is to write a compelling case study for the company's website portfolio based on the provided project details. The tone should be professional, sophisticated, and focused on quality and craftsmanship.

        Start with the project title as a main headline. Then, weave the summary notes into a professional narrative of 2-3 paragraphs. If a client testimonial is provided, integrate it smoothly at the end under a subheading called "Client Feedback".
        ```
    *   **Input:**
        *   `Project Title`: `{{ $node["Set"].json.projectTitle }}`
        *   `Summary Notes`: `{{ $node["Set"].json.projectSummary }}`
        *   `Client Testimonial`: `{{ $node["Set"].json.testimonialText }}` by `{{ $node["Set"].json.testimonialName }}`
*   **Output:** A professionally written case study in Markdown format.

---

### **Node 4: Google Docs (The Output)**

*   **Node Type:** **Google Docs**
*   **Configuration:**
    *   **Authentication:** You will need to connect your Google account to n8n.
    *   **Operation:** `Create Document from Text`
    *   **Fields:**
        *   **Title:** `Portfolio Draft: {{ $node["Set"].json.projectTitle }}`
        *   **Content:** `{{ $node["AI Agent"].json.output }}` (The Markdown output from the AI node will be automatically converted to a formatted Google Doc).
        *   **Folder:** You can specify a Google Drive folder ID to keep all generated drafts organized.
*   **Output:** A new, beautifully formatted Google Doc containing the case study, ready to be shared with the client for review.
