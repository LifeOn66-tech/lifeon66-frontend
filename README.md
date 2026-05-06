# LifeOn66 - Frontend

Discover your career potential through astrology, palmistry, and face reading with AI-powered insights.

## Tech Stack
- **Framework:** React with Vite
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **PDF Generation:** jsPDF & html2canvas
- **API Client:** Axios

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables:
   Copy `.env.example` to `.env` and update the `VITE_API_URL`.

3. Run the development server:
   ```bash
   npm run dev
   ```

## Deployment on Vercel

1. Connect your GitHub repository to Vercel.
2. Select the `dev` branch for deployment (if you want to deploy latest changes).
3. Set the following Environment Variable in Vercel:
   - `VITE_API_URL`: Your backend API URL (e.g., `https://api.lifeon66.com/api`)
4. Vercel will automatically detect Vite and use the following settings:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
