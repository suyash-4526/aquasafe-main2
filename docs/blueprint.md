# **App Name**: AquaSafe Dashboard

## Core Features:

- Navigation: Responsive Navbar: Navigation buttons for Dashboard, Map View, Data Table, Risk Calculator, and Solutions (desktop) or dropdown menu (mobile), plus an 'Add Sample' button.
- Dashboard Summary: Dashboard Overview: Summary cards for Total Samples, High-Risk Locations, Latest Sample Location, and Latest Sample Date.
- Metal Concentrations Chart: Average Metal Concentrations Chart: Bar chart using recharts to compare average metal concentrations (Lead, Arsenic, etc.) against WHO safety limits.
- Action Cards: Action Cards: Two clickable cards for 'Contribute Data' and 'Find Solutions'.
- Risk Calculator Inputs: Health Risk Calculator: Input fields for water quality data, weight, and water intake.
- Risk Calculation Output: Hazard Index Display: Calculates and displays Lead HQ, Arsenic HQ, and total HI with success/error messaging.
- AI Recommendation: AI-Powered Recommendation:  After risk calculation, sends water quality parameters and the HI to Gemini Flash and renders the model's recommendations to the user. The tool will reason on what type of water filter to suggest and any simple immediate safety tips to share.

## Style Guidelines:

- Primary color: Saturated blue (#29ABE2) evoking cleanliness and water quality, contrasting with a light background.
- Background color: Light, desaturated blue (#E5F5FF), creating a calm and clean base.
- Accent color: A contrasting shade of green (#90EE90) to indicate 'safe' or 'within acceptable limits' scenarios. This analogous color provides visual cues for success and positive results.
- Body and headline font: 'PT Sans' (sans-serif) for a modern and readable interface.
- Use 'lucide-react' icons to represent data types and navigation actions throughout the dashboard.
- Responsive layout adapting to both desktop and mobile views using CSS, without Tailwind CSS. Clear sections for each component to maintain a professional look.
- Subtle loading animations when fetching data or waiting for AI responses to improve user experience.