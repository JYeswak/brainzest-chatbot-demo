# BrainZest: Tech Stack & Workflows

This document outlines the technology stack and high-level workflows required to run BrainZest's internal operations and deliver its services.

---

## 1. Core Technology Stack

This is our "shopping list" of tools to build our demos and run the business. Pricing is estimated for starter/small business tiers.

*   **Website Hosting:**
    *   **Recommendation:** **Webflow** or **Carrd**.
    *   **Pricing:** Carrd (~$19/year), Webflow (~$18/month).
    *   **Reasoning:** Easy to build a professional-looking site without code. Webflow is more scalable, Carrd is simpler for a one-page start.
*   **Automation & Orchestration:**
    *   **Recommendation:** **n8n (self-hosted or cloud)**.
    *   **Pricing:** Cloud starts at ~$20/month. Self-hosting can be cheaper if you have a server.
    *   **Reasoning:** More powerful and cost-effective than Zapier for complex, multi-step AI workflows. Gives us the power to build the core of our service offerings.
*   **AI / Language Models:**
    *   **Recommendation:** **OpenAI API (GPT-4 & others)** and/or **Google AI Platform (Gemini)**.
    *   **Pricing:** Pay-per-use. Initial costs will be very low (pennies per workflow run). A budget of ~$20/month is safe to start.
    *   **Reasoning:** Access to state-of-the-art models is essential. We should be proficient in both to offer the best solution for a given task.
*   **Chatbot Platform:**
    *   **Recommendation:** **Tidio** or **Crisp**.
    *   **Pricing:** Both have excellent free tiers that are sufficient to start. Paid plans (~$25-40/month) add more features.
    *   **Reasoning:** Excellent free tiers, easy to set up, and can be trained on a knowledge base. Perfect for our Tier 1 offering.
*   **Forms & Data Capture:**
    *   **Recommendation:** **Jotform** or **Typeform**.
    *   **Pricing:** Both have free tiers. Paid plans start around ~$30/month.
    *   **Reasoning:** Versatile and easy to integrate with automation workflows.
*   **Scheduling:**
    *   **Recommendation:** **Calendly** or **SavvyCal**.
    *   **Pricing:** Both have free tiers. Paid plans (~$10-15/month) add more customization.
    *   **Reasoning:** Professional and removes the back-and-forth of booking calls.
*   **CMS / Blogging Platform:**
    *   **Recommendation:** **Ghost**.
    *   **Pricing:** Starts at ~$9/month.
    *   **Reasoning:** Excellent writing experience and a robust API that allows for full automation of content posting.
*   **Email Marketing:**
    *   **Recommendation:** **MailerLite** or **ConvertKit**.
    *   **Pricing:** Both have free tiers for under 1000 subscribers.
    *   **Reasoning:** Good automation features for creating lead nurturing sequences.

---

## 2. Partnership & Reseller Opportunities

**This is a medium-to-long-term goal. Once BrainZest is established with a few clients, we can pursue these to add a new revenue stream.**

Most SaaS companies have affiliate or partner programs. The typical model is:
1.  **Affiliate Program:** You get a unique link. If someone signs up through your link, you get a percentage of their subscription fee (usually for the first year). This is the easiest to join.
2.  **Reseller/Agency Program:** A more formal partnership. You may get a larger revenue share, dedicated support, and a listing in their partner directory. This usually requires a larger client base.

*   **How to Approach This:**
    1.  **Become an Expert:** First, become a power user of the tools you recommend.
    2.  **Build Case Studies:** Document how you use these tools to achieve results for your clients.
    3.  **Apply:** Once you have a small portfolio of clients, start applying for the affiliate programs of the tools you use most (like Webflow, Tidio, Ghost, etc.).
    4.  **Integrate:** You can then offer a "Setup Fee" for new clients where you build their systems using your affiliate links, earning both service revenue and a future commission.

---

## 3. Key Internal Workflows

These are the automated processes we will build to run BrainZest itself.

### **Workflow 1: The "BrainZest Engine" (Content & Social Media)**

*   **Goal:** Automate our own marketing to demonstrate our capabilities.
*   **Tools:** n8n, Google Sheets, OpenAI/Gemini, Ghost, Buffer/SocialBee
*   **Steps:**
    1.  **Trigger:** New row in a Google Sheet named "Content Ideas".
    2.  **n8n:**
        *   Pulls the idea.
        *   Calls AI model to generate a blog post outline.
        *   (Optional Human Approval Step)
        *   Calls AI model to write the full post from the outline.
        *   Calls Ghost API to create a new draft.
    3.  **Human Step:** Review and publish the post in Ghost.
    4.  **Ghost Webhook -> n8n:**
        *   When post is published, a webhook triggers a new n8n workflow.
        *   This workflow sends the post to Buffer/SocialBee to be scheduled across all social media channels.

### **Workflow 2: The "Client Intake" Funnel**

*   **Goal:** Seamlessly handle new leads from the website.
*   **Tools:** Website, Tidio, Calendly, n8n, Email
*   **Steps:**
    1.  **Lead Capture:** A potential client interacts with the Tidio chatbot or fills out a contact form.
    2.  **Qualification:** The chatbot answers basic questions. If the lead is qualified, it directs them to the Calendly link to book a call.
    3.  **Calendly Trigger -> n8n:**
        *   When a new call is booked, an n8n workflow is triggered.
        *   It sends a confirmation email to the client with a pre-call questionnaire.
        *   It creates a new entry in a simple CRM (like a Google Sheet or Notion database).
    4.  **Human Step:** You show up to the call prepared with the questionnaire answers.
