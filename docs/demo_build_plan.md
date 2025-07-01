# BrainZest: Demo Build Plan

This document outlines the steps to create functional, demo-ready versions of the core services offered in our packages. The goal is to have tangible, impressive examples to show potential clients.

---

## 1. AI-Powered Website Chatbot (for the "Time Saver" Pack)

*   **Objective:** Create a chatbot that can answer basic questions, qualify leads, and capture contact information. This will be the demo for your friend's construction site and the WISP landing page.

*   **Build Steps:**
    1.  **Choose a Platform:** Start with a user-friendly platform like **Tidio**, **Crisp**, or **Drift**. They have free tiers and are easy to integrate.
    2.  **Knowledge Base:** Create a simple document (or use their UI) with answers to common questions for a hypothetical business (e.g., "What are your hours?", "What services do you offer?", "Where are you located?").
    3.  **Design the Conversation Flow:**
        *   **Greeting:** Proactively engage the user (e.g., "Hi! I'm the AI assistant for [Business Name]. How can I help you today?").
        *   **Question Answering:** Let the AI handle questions based on the knowledge base.
        *   **Lead Qualification:** If the user asks for a quote or has a specific need, design a path: "It sounds like you're interested in [Service]. I can have someone from our team get in touch. What's the best email and phone number to reach you?"
        *   **Capture & Notify:** Configure the tool to email you the captured lead information instantly.
    4.  **Installation:** Install the chatbot on a simple landing page (we can build this next).

---

## 2. AI-Assisted Quoting System (for the "Get Paid Faster" Pack)

*   **Objective:** Build a simple system that takes a user's input from a form and uses AI to generate a draft quote.

*   **Build Steps:**
    1.  **Create a Quote Request Form:** Use a tool like **Jotform**, **Typeform**, or even a simple HTML form.
        *   **Fields:** `Name`, `Email`, `Phone`, `Service Required` (dropdown), `Project Details` (textarea).
    2.  **Set up an Automation Workflow:** Use **Zapier** or **n8n** for this.
        *   **Trigger:** New form submission.
        *   **Action 1 (AI):** Connect to the **OpenAI API (or Gemini)**.
        *   **Prompt Engineering:** Craft a prompt that takes the form data as input.
            *   *Example Prompt:* `"A new quote request has been submitted. Based on the following details, please draft a professional quote in a friendly but formal tone. Include a clear description of the service, a placeholder for the price, and a call to action to approve the quote. Details: [Form Data]"`
        *   **Action 2 (Email):** Send an email **to yourself** (the business owner) containing the AI-drafted quote. The subject line should be "Draft Quote for [Client Name]".
    3.  **Demo Flow:** You can show a client the form, fill it out, and then immediately show them the professional draft quote that landed in your inbox.

---

## 3. "Set it and Forget It" Content Engine (for the Marketing Pack)

*   **Objective:** Create a workflow that generates a blog post from a simple idea and schedules it for posting.

*   **Build Steps:**
    1.  **Use an Orchestration Tool:** This is best done in **n8n** or a custom script.
    2.  **Content Pipeline Workflow:**
        *   **Trigger:** A manual trigger or a new entry in a Google Sheet with a column for "Blog Post Ideas".
        *   **Action 1 (AI Outline):** Use an AI model to generate a detailed outline for the blog post based on the idea.
        *   **Action 2 (AI Content):** Use the outline to generate the full blog post content.
        *   **Action 3 (Save Draft):** Connect to the API of a CMS (like **WordPress** or **Ghost**) and create a new draft with the generated content.
    3.  **Demo Flow:** Show the client the Google Sheet. Add a new idea, run the workflow, and then show them the professionally formatted draft that instantly appeared in the blog's backend, ready for review.
