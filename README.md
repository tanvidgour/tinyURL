# TinyURL Generator

A simple yet robust URL-shortening service enabling users to convert long URLs into concise, easy-to-share links.

## Features

- Shorten long URLs to easy-to-share links
- Copy shortened URLs to clipboard with one click
- View history of recently shortened URLs
- Clean, responsive UI with Tailwind CSS

## Tech Stack

- **Frontend**: React.js, Tailwind CSS, Axios
- **Backend**: Node.js, Express.js
- **Database**: SQLite
- **Libraries**: nanoid for generating short IDs

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm (v6 or later)

### Installation

1. Clone the repository
   ```
   git clone <repository-url>
   cd tinyurl
   ```

2. Install dependencies
   ```
   npm install
   cd client && npm install
   cd ..
   ```

3. Create a `.env` file in the root directory with the following content:
   ```
   PORT=5000
   NODE_ENV=development
   ```

### Running the Application

#### Development Mode

Run both frontend and backend concurrently:
```
npm run dev
```

Or run them separately:
```
npm run server  # Backend on port 5000
npm run client  # Frontend on port 5173
```

#### Production Mode

Build the frontend and start the server:
```
npm run build
npm start
```

## API Endpoints

- **POST** `/api/shorten` - Create a shortened URL
  - Body: `{ "originalUrl": "https://example.com/long-url" }`
  - Response: `{ "shortUrl": "http://localhost:5000/abc123", "originalUrl": "https://example.com/long-url" }`

- **GET** `/api/recent` - Get recently created URLs
  - Response: Array of URL objects

- **GET** `/:shortId` - Redirect to the original URL
