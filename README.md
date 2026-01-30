# Shopify Store Speed Auditor

A modern, full-stack application for auditing Shopify store performance. Built with React (Vite) + Tailwind CSS for the frontend and Node.js + Express + MongoDB for the backend.

## Features

- **Speed Score Analysis**: Get a comprehensive speed score (0-100) for your Shopify store
- **Issue Detection**: Identify performance bottlenecks and common issues
- **Actionable Recommendations**: Receive specific suggestions to improve store speed
- **Modern UI/UX**: Clean, responsive design with smooth animations
- **RESTful API**: Well-structured backend with proper error handling

## Project Structure

```
Shopify_Store_Speed_Auditor/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/     # Reusable components (Button, Card)
│   │   │   ├── layout/     # Layout components (Navbar, Footer)
│   │   │   └── audit/      # Audit-related components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API service layer
│   │   └── App.jsx         # Main app component
│   └── package.json
│
└── server/                 # Backend Express API
    ├── src/
    │   ├── controllers/    # Request handlers
    │   ├── models/         # MongoDB models
    │   ├── routes/         # API routes
    │   ├── middlewares/    # Custom middlewares
    │   ├── config/         # Configuration files
    │   ├── app.js          # Express app setup
    │   └── server.js       # Server entry point
    └── package.json
```

## Getting Started

### Prerequisites

- Node.js 
- MongoDB 
- npm 

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/akhiln2003/Shopify-Speed-Auditor.git
   cd Shopify_Store_Speed_Auditor
   ```

2. **Install frontend dependencies**
   ```bash
   cd client
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd ../server
   npm install
   ```

4. **Set up environment variables**

   Create env files:

   - `server/.env` 
   - `client/.env`

   **Server** (`server/.env`):
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/shopify-speed-auditor
   NODE_ENV=development
   ```

   **Client** (`client/.env.local`):
   ```env
   VITE_PORT=3000
   VITE_API_URL=/api
   VITE_API_TARGET=http://localhost:5000
   ```

### Running the Application

1. **Start MongoDB** (if running locally)
   ```bash
   mongod
   ```

2. **Start the backend server**
   ```bash
   cd server
   npm start
   # or for development with auto-reload
   npm run dev
   ```

3. **Start the frontend development server**
   ```bash
   cd client
   npm run dev
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## API Endpoints

### Content Management
- `GET /api/content` - Get landing page content
- `PUT /api/content` - Update landing page content

### Audit Reports
- `POST /api/audit` - Create a new audit report
  ```json
  {
    "storeUrl": "yourstore.myshopify.com"
  }
  ```
- `GET /api/audit/:id` - Get audit report by ID

## Technologies Used

### Frontend
- React 18
- Vite
- Tailwind CSS
- React Router DOM

### Backend
- Node.js
- Express
- MongoDB
- Mongoose

## Performance Optimizations

- React.memo for component memoization
- useMemo and useCallback hooks for expensive operations
- Optimized re-renders
- Smooth animations and transitions
- Responsive design with mobile-first approach

## Code Quality

- Clean, readable code with comments
- Consistent code style
- Proper error handling
- Input validation
- Semantic HTML
- Accessibility best practices



