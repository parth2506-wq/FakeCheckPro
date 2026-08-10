# FakeCheckPro

FakeCheckPro is a comprehensive platform designed for fake news detection and media authenticity verification. This repository contains both the FastAPI backend and the React (Vite) frontend for the platform.

## Current Architecture & Status

- **Frontend**: React, built with Vite, styled with TailwindCSS (v4). Features a modern, responsive UI with premium branding ("Trust What You See"), glassmorphism UI elements, and a robust authentication flow (Login, Register, Forgot Password, Reset Password).
- **Backend**: Python FastAPI with SQLAlchemy for database ORM.
- **Database**: SQLite (default setup) with SQLAlchemy.
- **Authentication**: JWT (JSON Web Token) based authentication.

### JWT Authentication Implementation Details
Authentication in this platform is currently implemented using standard `PyJWT` for encoding and decoding tokens. 
- **Secret Key & Algorithm**: It uses `HS256` for signing the token. The secret key is loaded from the `.env` file via `JWT_SECRET_KEY` (defaulting to a development fallback if not provided).
- **Token Expiration**: Access tokens are configured to expire after a certain number of minutes, controlled by `ACCESS_TOKEN_EXPIRE_MINUTES` in the `.env` (default is 30 minutes).
- **Token Generation**: Upon successful login, the `create_access_token` function encodes the user's email (`sub`) and an expiration timestamp (`exp`) into a JWT.
- **Token Verification**: The `verify_access_token` function decodes incoming tokens. If a token is expired or structurally invalid, an `InvalidTokenError` is caught, and the system raises a 401 Unauthorized exception. Valid tokens return a `TokenData` object containing the user's email, which is used to retrieve the current user context.
- **Middleware/CORS**: The FastAPI backend includes standard `CORSMiddleware` configured to accept requests from the Vite frontend running on `http://localhost:5173`.

---

## Getting Started

Follow the instructions below to set up both the backend and the frontend on your local development environment.

### Prerequisites

- [Python 3.10+](https://www.python.org/downloads/)
- [Node.js (v18+) and npm](https://nodejs.org/)

### 1. Backend Setup

The backend is built with FastAPI. It uses a virtual environment to manage dependencies.

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Create a virtual environment:**
   ```bash
   python -m venv venv
   ```

3. **Activate the virtual environment:**
   - On **Windows**:
     ```powershell
     .\venv\Scripts\Activate.ps1
     # or using Command Prompt:
     .\venv\Scripts\activate.bat
     ```
   - On **macOS/Linux**:
     ```bash
     source venv/bin/activate
     ```

4. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

5. **Set up environment variables:**
   Copy the `.env.example` file to `.env`:
   ```bash
   cp .env.example .env
   ```
   Open the `.env` file and set the `JWT_SECRET_KEY`. You can generate a secure random key using Python:
   ```bash
   python -c "import secrets; print(secrets.token_hex(32))"
   ```
   Copy the output and paste it as the value for `JWT_SECRET_KEY` in your `.env` file.

6. **Run the backend server:**
   ```bash
   uvicorn app.main:app --reload
   ```
   *The backend will now be running at `http://127.0.0.1:8000`. You can view the API documentation at `http://127.0.0.1:8000/docs`.*

### 2. Frontend Setup

The frontend is a React application built using Vite.

1. **Open a new terminal window** (keep the backend running in the previous one).

2. **Navigate to the frontend directory:**
   ```bash
   cd frontend
   ```

3. **Install Node dependencies:**
   ```bash
   npm install
   ```

4. **Run the frontend development server:**
   ```bash
   npm run dev
   ```
   *The frontend will now be running, typically at `http://localhost:5173`. Check the terminal output for the exact local URL.*

## Development

- Any changes made to the Python files in the `backend/app/` directory will automatically reload the FastAPI server.
- Any changes made to the React files in `frontend/src/` will hot-reload instantly in the browser thanks to Vite.

## License

This project is proprietary and confidential.
