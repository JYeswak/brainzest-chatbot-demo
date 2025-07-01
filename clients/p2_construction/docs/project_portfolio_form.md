# Dynamic Project Portfolio - Form Blueprint

## 1. Form Objective & Platform

*   **Objective:** To create a simple, mobile-friendly form that allows Angel to add a new project to his website portfolio in under 5 minutes.
*   **Platform:** This form will be built using a tool like **Jotform** or **Typeform** and will be accessible via a private, direct link on Angel's phone.

---

## 2. Form Structure & Fields

### **Page 1: The Core Details**

**Field 1: Project Title**
*   **Label:** Project Title
*   **Type:** Text Input
*   **Placeholder:** e.g., "Del Mar Modern Coastal Home" or "Rancho Santa Fe Chef's Kitchen"
*   **Instructions:** Give this project a short, memorable name.

**Field 2: Project Type**
*   **Label:** What type of project was this?
*   **Type:** Dropdown Menu
*   **Options:**
    *   Custom Home Build
    *   Kitchen Remodel
    *   Bathroom Remodel
    *   Home Addition / Extension
    *   Commercial Construction
    *   Exterior Renovation

**Field 3: Project Summary (The Story)**
*   **Label:** In a few bullet points, what were the key highlights of this project?
*   **Type:** Text Area
*   **Placeholder:**
    *   e.g., "Completely redesigned the floor plan for better flow."
    *   e.g., "Installed a 14-foot marble island."
    *   e.g., "Sourced reclaimed wood for the custom cabinetry."
*   **Instructions:** No need for full sentences. The AI will turn these notes into a professional narrative.

---

### **Page 2: The Visuals**

**Field 4: Project Photos**
*   **Label:** Upload Your Best Photos (5-10 recommended)
*   **Type:** File Upload
*   **Constraints:**
    *   Accepts `.jpg`, `.jpeg`, `.png` files.
    *   Allows multiple file uploads.
*   **Instructions:** Please upload high-quality images. The first image you upload will be used as the main "cover" photo for the portfolio.

---

### **Page 3: The Proof (Optional)**

**Field 5: Client Testimonial**
*   **Label:** Do you have a testimonial from the client for this project? (Optional)
*   **Type:** Text Area
*   **Placeholder:** e.g., "Angel and his team were incredible..."
*   **Instructions:** If you have a great quote from the client, paste it here.

**Field 6: Client Name for Testimonial**
*   **Label:** Client's Name (for the testimonial)
*   **Type:** Text Input
*   **Placeholder:** e.g., "J. Goodman" or "The Smith Family"

---

## 3. Automation Workflow (n8n)

*   **Trigger:** A new form submission is received from Jotform/Typeform.
*   **Action 1 (AI Writer):**
    *   The AI takes the `Project Title` and `Project Summary` bullet points.
    *   **Prompt:** "You are a professional architectural writer. Based on the following project title and summary notes, write a compelling, 3-paragraph case study for a construction company's website portfolio. The tone should be professional, highlighting quality and craftsmanship."
    *   The AI generates the case study text.
*   **Action 2 (CMS):**
    *   The generated text, project details, and uploaded photo URLs are sent to the website's CMS (e.g., WordPress, Ghost, or a headless CMS).
    *   A new project is created in a "Draft" state, ready for Angel to review and publish with a single click.
