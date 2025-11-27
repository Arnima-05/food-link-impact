# FoodBridge - Food Link Impact

A platform connecting restaurants with NGOs to reduce food waste and help those in need.

## Features

- **Restaurant Dashboard**: For restaurants to manage food donations
- **NGO Dashboard**: For NGOs to view and coordinate food pickups
- **Real-time Updates**: Stay updated with the latest donations and requests
- **Secure Authentication**: Simple local session with MongoDB-backed profiles

## Technologies Used

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- Express + MongoDB (API & Database)
- React Query

## Getting Started

### Prerequisites

- Node.js (v16 or later)
- npm or yarn
- Local MongoDB instance (e.g., `mongodb://localhost:27017/`)

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

3. Start the API server (MongoDB required):
   ```sh
   npm run server
   ```
   The API runs at `http://localhost:8080` by default.

4. Start the development server:
   ```sh
   npm run dev
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
