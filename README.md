# FoodBridge - Food Link Impact

A platform connecting restaurants with NGOs to reduce food waste and help those in need.

## Features

- **Restaurant Dashboard**: For restaurants to manage food donations
- **NGO Dashboard**: For NGOs to view and coordinate food pickups
- **Real-time Updates**: Stay updated with the latest donations and requests
- **Secure Authentication**: Built with Supabase Auth

## Technologies Used

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- Supabase (Auth & Database)
- React Query

## Getting Started

### Prerequisites

- Node.js (v16 or later)
- npm or yarn
- Supabase account (for backend services)

### Installation

1. Clone the repository:
   ```sh
   git clone <your-repo-url>
   cd food-link-impact
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

3. Set up environment variables:
   - Create a `.env` file in the root directory
   - Add your Supabase URL and anon key:
     ```
     VITE_SUPABASE_URL=your_supabase_url
     VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
     ```

4. Start the development server:
   ```sh
   npm run dev
   ```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Deployment

This project can be deployed to any static hosting service (Vercel, Netlify, etc.) or containerized and deployed to a cloud provider.

## License

MIT
