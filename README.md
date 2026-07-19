# Quick Commerce Platform (MERN Stack)

A production-grade, end-to-end decoupled MERN stack Quick Commerce application featuring user session management, dynamic catalog browsing with search and filters, dynamic shopping carts, wishlists, address default management, checkouts, and a secure payment gateway integration.

---

## Architecture & Tech Stack

This platform is architected as a completely decoupled SPA and API backend, designed to build and deploy independently.

### Frontend
*   **Core**: React (Vite-powered SPA), React Router DOM for routing.
*   **State Management**: React Context API (Cart, Wishlist, Auth) & Redux Toolkit (Orders, Reviews).
*   **Styling**: Modern vanilla CSS with HSL customized color themes and micro-animations.
*   **Visual Assets**: Curated product images and vector icons.

### Backend
*   **Runtime**: Node.js & Express API server.
*   **Database**: MongoDB & Mongoose ODM.
*   **Authentication**: JWT (JSON Web Tokens) with request interceptor authorization headers.
*   **Storage**: Cloudinary image upload via Multi-part Multer middleware with auto disk-cleanup.
*   **Payments**: Razorpay payments gateway integration with cryptographic signature verification.

---

## Folder Structure

```
Quick-Commerce-Platform/
├── client/                      # React Frontend SPA
│   ├── src/
│   │   ├── components/          # Reusable UI Components
│   │   ├── context/             # React Context Providers (Auth, Cart, Wishlist)
│   │   ├── data/                # Static configuration options
│   │   ├── hooks/               # Custom Hooks
│   │   ├── pages/               # Page Components (Home, Products, Checkout, etc.)
│   │   ├── services/            # Axios API Service Layer
│   │   ├── store/               # Redux Toolkit Store & Slices
│   │   └── utils/               # Formatting Helpers
│   ├── package.json
│   └── vite.config.js
│
├── server/                      # Node.js Express Backend API
│   ├── config/                  # Database, Razorpay, and Cloudinary Configs
│   ├── controllers/             # Request Controller Handlers
│   ├── middleware/              # Authentication & Error Middleware
│   ├── models/                  # Mongoose Schema Models
│   ├── routes/                  # Express Router Endpoints
│   ├── validations/             # Express-Validator rules
│   └── server.js                # Server Entrypoint
```

---

## Environment Variables

### Backend Configuration (`server/.env`)
Create a `.env` file in the `/server` directory:
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/quick-commerce  # Local or MongoDB Atlas URI
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173                      # Frontend URL for CORS
NODE_ENV=development

# Razorpay Integration (Test Mode)
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# Cloudinary Storage
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### Frontend Configuration (`client/.env`)
Create a `.env` file in the `/client` directory:
```env
VITE_API_BASE_URL=http://localhost:5000               # Backend URL
```

---

## Local Installation

### Prerequisites
*   Node.js (v18+)
*   MongoDB Community Server running locally

### Setup Steps
1.  **Clone the Repository**:
    ```bash
    git clone https://github.com/saradoegar/Quick-Commerce-Platform.git
    cd Quick-Commerce-Platform
    ```

2.  **Configure Environment Variables**:
    *   Create `server/.env` based on `server/.env.example`.
    *   Create `client/.env` with `VITE_API_BASE_URL`.

3.  **Install Dependencies**:
    *   **Backend**:
        ```bash
        cd server
        npm install
        ```
    *   **Frontend**:
        ```bash
        cd ../client
        npm install
        ```

4.  **Run Development Servers**:
    *   **Backend**:
        ```bash
        cd server
        npm run dev
        ```
    *   **Frontend**:
        ```bash
        cd client
        npm run dev
        ```
    *   The frontend will run on `http://localhost:5173` and communicate with the backend on `http://localhost:5000`.

---

## Production Deployment Guide

### STEP 1: MongoDB Atlas (Database Cloud)
1.  Sign in to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2.  Create a Free Shared Cluster.
3.  Under **Network Access**, whitelist all IP addresses (`0.0.0.0/0`) for hosting integrations.
4.  Under **Database Access**, create a user with read/write privileges.
5.  Click **Connect** -> **Connect your application** and copy the Connection String.
6.  Replace username and password in the connection string and use it as `MONGODB_URI` in the backend environment.

### STEP 2: Deploy Backend to Render
1.  Sign in to [Render](https://render.com) and create a new **Web Service**.
2.  Link your GitHub repository.
3.  Configure:
    *   **Root Directory**: `server`
    *   **Build Command**: `npm install`
    *   **Start Command**: `npm start`
4.  Add all variables from `server/.env` in the **Environment Variables** section.
5.  Deploy the service and copy the provided Live Web URL (e.g. `https://quick-commerce-api.onrender.com`).

### STEP 3: Deploy Frontend to Vercel
1.  Sign in to [Vercel](https://vercel.com) and import the repository.
2.  Configure:
    *   **Root Directory**: `client`
    *   **Framework Preset**: `Vite`
    *   **Build Command**: `npm run build`
    *   **Output Directory**: `dist`
3.  Add the environment variable:
    *   `VITE_API_BASE_URL`: `<Your Deployed Render Backend URL>`
4.  Deploy the application. Vercel will provide your live storefront URL.
5.  *(Optional)* Update `CLIENT_URL` in Render variables to match your Vercel URL to secure CORS headers.

---

## API Documentation Summary

| Method | Path | Authentication | Access Role | Description |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | All | Register a new user profile |
| `POST` | `/api/auth/login` | Public | All | Log in and receive JWT token |
| `GET` | `/api/auth/me` | Private | All | Fetch logged-in user profile details |
| `GET` | `/api/categories` | Public | All | Fetch all active categories |
| `GET` | `/api/products` | Public | All | Fetch products (with search/filters/pages) |
| `GET` | `/api/cart` | Private | Customer | Fetch user shopping cart details |
| `POST` | `/api/cart` | Private | Customer | Add item to shopping cart |
| `GET` | `/api/wishlist` | Private | Customer | Fetch user wishlist items |
| `POST` | `/api/orders` | Private | Customer | Place checkout order |
| `PATCH` | `/api/orders/:id/cancel` | Private | Customer | Cancel unshipped order |
| `POST` | `/api/payments/create-order` | Private | Customer | Create Razorpay order |
| `POST` | `/api/payments/verify` | Private | Customer | Verify payment and complete order |
| `POST` | `/api/upload/image` | Private | Admin Only | Upload image to Cloudinary |

---

## License
Licensed under the [MIT License](LICENSE).