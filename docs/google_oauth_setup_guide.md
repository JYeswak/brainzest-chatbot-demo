# Step-by-Step Guide: Setting up Google OAuth 2.0 for n8n

This guide will walk you through the process of creating Google OAuth 2.0 credentials so you can securely connect your n8n instance to Google services like Google Docs, Sheets, and Drive.

---

## Phase 1: In the Google Cloud Console

### Step 1: Go to the Google Cloud Console & Create a Project
1.  Open your web browser and navigate to the [Google Cloud Console](https://console.cloud.google.com/).
2.  If you don't have a project, you'll be prompted to create one. If you do, click the project selector dropdown at the top of the page and click **"New Project"**.
3.  Give your project a name (e.g., "n8n-integrations") and click **"Create"**.

### Step 2: Enable the Google Docs API
1.  With your new project selected, use the search bar at the top to search for **"Google Docs API"**.
2.  Click on the "Google Docs API" result from the marketplace.
3.  Click the blue **"Enable"** button. This grants your project permission to use the Google Docs service.

### Step 3: Configure the OAuth Consent Screen
*This is a one-time setup for your project that tells users who is asking for permission.*
1.  In the search bar, search for **"APIs & Services"** and go to that page.
2.  In the left-hand menu, click on **"OAuth consent screen"**.
3.  Choose the **"External"** user type and click **"Create"**.
4.  Fill out the required fields:
    *   **App name:** "n8n Automation" (or a name of your choice).
    *   **User support email:** Select your email address.
    *   **Developer contact information:** Enter your email address again.
5.  Click **"Save and Continue"** through the "Scopes" and "Test users" sections. You don't need to add anything here for now.
6.  On the "Summary" page, click **"Back to Dashboard"**.

### Step 4: Create the OAuth 2.0 Credentials
1.  In the left-hand menu, click on **"Credentials"**.
2.  At the top of the page, click **"+ CREATE CREDENTIALS"** and select **"OAuth client ID"**.
3.  Configure the credential:
    *   **Application type:** Select **"Web application"**.
    *   **Name:** "n8n Web Client" (or a name of your choice).
4.  **IMPORTANT - Do not close this page yet.** We need to get a URL from n8n to finish this step.

---

## Phase 2: In Your n8n Instance

### Step 5: Find Your n8n Redirect URL
1.  Open your n8n instance in a new browser tab.
2.  In the left-hand menu, go to **"Credentials"**.
3.  Click the **"Add credential"** button.
4.  In the search box, type **"Google Docs"** and select it.
5.  You will now see the credential setup screen. Look for the **"OAuth Redirect URL"**. It will look something like `https://your-n8n-instance.com/rest/oauth2-credential/callback`.
6.  **Copy this URL.**

---

## Phase 3: Connect Google and n8n

### Step 6: Add the Redirect URL to Google
1.  Go back to your Google Cloud Console browser tab.
2.  Under the **"Authorized redirect URIs"** section, click **"+ ADD URI"**.
3.  **Paste the URL** you copied from n8n into the text box.
4.  Click the **"Create"** button at the bottom of the page.

### Step 7: Get Your Client ID and Secret
1.  A pop-up will appear showing your **"Client ID"** and **"Client Secret"**.
2.  **Copy both of these values.** You will need them in n8n.

### Step 8: Finalize in n8n
1.  Go back to your n8n browser tab.
2.  **Paste the `Client ID`** from Google into the "Client ID" field in n8n.
3.  **Paste the `Client Secret`** from Google into the "Client Secret" field in n8n.
4.  Click the blue **"Sign in with Google"** button.
5.  A new pop-up window will appear asking you to choose your Google account and grant permission. **Allow it.**

---

## Completion

If everything was successful, the pop-up will close, and your n8n credential screen will show that it is connected. You can now save the credential.

You have successfully and securely connected n8n to your Google account. You can now use this credential in any Google Docs, Sheets, or Drive node in your workflows.
