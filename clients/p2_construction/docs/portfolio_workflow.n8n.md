# n8n Workflow: Dynamic Project Portfolio

*   **Objective:** To automatically create a draft project portfolio page on the P2 Construction website whenever Angel submits the "New Project Form."
*   **Trigger:** A new form submission from Jotform/Typeform.

---

## Workflow Structure (Node by Node)

### **Node 1: Webhook Trigger**

*   **Node Type:** **Webhook**
*   **Configuration:**
    *   **HTTP Method:** `POST`
    *   This node will generate a unique URL. You will copy this URL and paste it into the "Integrations" or "Webhooks" section of your form builder (Jotform/Typeform). This tells the form to send its data to this n8n workflow every time it's submitted.
*   **Output:** The raw data from the form submission, including the project title, summary notes, image URLs, and testimonial.

---

### **Node 2: Set (Data Cleanup)**

*   **Node Type:** **Set**
*   **Configuration:**
    *   This node is used to extract and clean up the data from the webhook to make it easier to work with.
    *   Create new variables for each piece of data you need:
        *   `projectTitle` = `{{ $json.body.project_title }}`
        *   `projectSummary` = `{{ $json.body.project_summary }}`
        *   `imageUrls` = `{{ $json.body.project_photos }}` (This may need slight adjustments based on the form provider's data structure)
        *   `testimonialText` = `{{ $json.body.client_testimonial }}`
        *   `testimonialName` = `{{ $json.body.client_name }}`
*   **Output:** Clean, named variables that are easy to reference in the next nodes.

---

### **Node 3: AI Agent (The Writer)**

*   **Node Type:** **AI Agent** or **LLM Chain**
*   **Configuration:**
    *   **LLM Service:** OpenAI
    *   **Model:** `gpt-4o`
    *   **System Prompt:**
        ```
        You are a professional architectural writer and marketing expert for a high-end construction company called P2 Construction. Your task is to write a compelling, 3-paragraph case study for the company's website portfolio based on the provided project details.

        The tone should be professional, sophisticated, and focused on quality, craftsmanship, and the client's vision.

        Start with a strong headline. Then, weave the summary notes into a professional narrative. If a client testimonial is provided, integrate it smoothly into the case study.
        ```
    *   **Input:**
        *   `Project Title`: `{{ $node["Set"].json.projectTitle }}`
        *   `Summary Notes`: `{{ $node["Set"].json.projectSummary }}`
        *   `Client Testimonial`: `{{ $node["Set"].json.testimonialText }}` by `{{ $node["Set"].json.testimonialName }}`
*   **Output:** A professionally written, multi-paragraph case study in plain text.

---

### **Node 4: CMS Integration (e.g., WordPress)**

*   **Node Type:** **WordPress** (or Ghost, or a generic **HTTP Request** node for a custom CMS)
*   **Configuration:**
    *   **Authentication:** You will need to connect your WordPress (or other CMS) account to n8n using an API key or credentials.
    *   **Resource:** `Post`
    *   **Operation:** `Create`
    *   **Fields:**
        *   **Title:** `{{ $node["Set"].json.projectTitle }}`
        *   **Content:** `{{ $node["AI Agent"].json.output }}`
        *   **Status:** `Draft` (This is crucial so Angel can review it before it goes live).
        *   **Featured Image:** You may need to use a separate WordPress node or a function to handle uploading the first image from `imageUrls` and setting it as the featured image.
        *   **Category:** `Portfolio` or `Projects`
*   **Output:** A confirmation that the new draft post has been successfully created in the website's backend.
