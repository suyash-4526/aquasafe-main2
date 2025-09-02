# AquaSafe Dashboard

This is a Next.js application for monitoring water quality and assessing health risks with AI-powered insights.

## Getting Started

This project is built with Next.js, Genkit for AI features, and shadcn/ui for components.

### Prerequisites

- [Node.js](https://nodejs.org/) (version 20 or later)
- [npm](https://www.npmjs.com/) (usually comes with Node.js)

### Running Locally in VS Code

1.  **Clone the repository and install dependencies:**

    ```bash
    npm install
    ```

2.  **Set up your Environment Variables:**

    You will need a Gemini API key from Google AI Studio to run the AI features.

    a. Create a new file named `.env.local` in the root of your project.

    b. Copy the contents of `.env` into `.env.local`.

    c. Open `.env.local` and add your Gemini API Key:

    ```
    GEMINI_API_KEY="YOUR_API_KEY_HERE"
    ```

    You can get a free API key from [Google AI Studio](https://aistudio.google.com/app/apikey).

3.  **Run the Genkit AI Flows:**

    In a new terminal in VS Code, run the following command to start the Genkit development server, which hosts the AI flows.

    ```bash
    npm run genkit:dev
    ```
    Keep this terminal running.

4.  **Run the Next.js Application:**

    In a separate terminal in VS Code, run the following command to start the Next.js front-end application.

    ```bash
    npm run dev
    ```

5.  **Open the application:**

    Open your browser and navigate to [http://localhost:9002](http://localhost:9002). You should now see the AquaSafe Dashboard running locally.
