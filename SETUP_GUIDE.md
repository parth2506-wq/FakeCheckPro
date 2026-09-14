# FakeCheckPro Setup Guide

This guide provides step-by-step instructions for setting up the FakeCheckPro environment on a new Windows PC. It covers everything from installing dependencies to running the backend and frontend servers.

---

## 1. Prerequisites

Before starting, ensure you have the following installed on your new PC:

1. **Python 3.10+**: Download and install from [python.org](https://www.python.org/downloads/). *Make sure to check "Add Python to PATH" during installation.*
2. **Node.js (v18+)**: Download and install from [nodejs.org](https://nodejs.org/). This includes `npm`.
3. **Git**: Download and install from [git-scm.com](https://git-scm.com/).
4. **Tesseract OCR (Optional but required for Image Analysis)**: 
   - Download the Windows installer from [UB-Mannheim Tesseract](https://github.com/UB-Mannheim/tesseract/wiki).
   - Install it (usually to `C:\Program Files\Tesseract-OCR`).

---

## 2. Clone the Repository

Open your terminal (PowerShell or Command Prompt) and clone the repository:

```bash
git clone https://github.com/parth2506-wq/FakeCheckPro.git
cd FakeCheckPro
```

---

## 3. Backend Setup (FastAPI & ML)

The backend handles machine learning models, database operations, and API routing.

### Step 3.1: Create a Virtual Environment

It's best practice to use a virtual environment for Python dependencies.

```bash
cd backend
python -m venv venv
```

Activate the virtual environment:
- **Windows (PowerShell)**: `.\venv\Scripts\Activate.ps1`
- **Windows (CMD)**: `.\venv\Scripts\activate.bat`

*(You should see `(venv)` appear at the beginning of your terminal prompt).*

### Step 3.2: Install Dependencies

With the virtual environment active, install the required Python packages:

```bash
pip install -r requirements.txt
```

### Step 3.3: Configure Environment Variables

1. Copy the example `.env` file to create your local `.env`:
   ```bash
   copy .env.example .env
   ```
2. Open `.env` in a text editor and fill in the required values:

```env
# Generate a random secret key for JWT (You can use: openssl rand -hex 32)
JWT_SECRET_KEY=your_super_secret_key_here
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440

# ML Models (Ensure the models folder exists and contains these .pkl files)
MODEL_PATH=models/logistic_regression.pkl
VECTORIZER_PATH=models/vectorizer.pkl

# Database
DATABASE_URL=sqlite:///./fakecheckpro.db
DATABASE_URL_HISTORY=sqlite:///./prediction_history.db

# Tesseract OCR path (IMPORTANT for Windows image analysis)
# Change this if you installed Tesseract somewhere else
TESSERACT_CMD=C:\Program Files\Tesseract-OCR\tesseract.exe

# CORS config
CORS_ORIGINS=http://localhost:5173,http://localhost:3000

# Required API Keys
GEMINI_API_KEY=your_google_gemini_api_key_here
GNEWS_API_KEY=your_gnews_api_key_here
```

### Step 3.4: Initialize the Database

Run the database migration script to generate the SQLite tables:

```bash
python migrate_db.py
```
*This will create `fakecheckpro.db` and `prediction_history.db`.*

### Step 3.5: Run the Backend Server

Start the FastAPI backend using `uvicorn`:

```bash
uvicorn app.main:app --reload --port 8000
```
*The backend is now running at `http://localhost:8000`. You can view the API documentation at `http://localhost:8000/docs`.*

---

## 4. Frontend Setup (React/Vite)

Open a **new** terminal window (leave the backend running in the first one) and navigate to the frontend folder.

### Step 4.1: Install Dependencies

```bash
cd d:\FakeCheckPro\frontend
npm install
```

### Step 4.2: Run the Frontend Server

Start the Vite development server:

```bash
npm run dev
```

*The frontend is now running, typically at `http://localhost:5173`. Open this URL in your browser.*

---

## 5. First-Time Usage

1. Open `http://localhost:5173` in your browser.
2. Click **Get Started** or **Log In**.
3. Since it's a fresh database, you'll need to create a new account via the **Register** page.
4. Once registered, log in. A JWT token will be generated via the backend, authenticating your session.
5. You can now use the URL, text, image, and PDF analyzers!

## Troubleshooting

- **Gemini Evidence returning 401 Unauthorized**: Double check your `GEMINI_API_KEY` in `backend/.env`. Stop the backend server (`Ctrl+C`) and restart it after changing the key.
- **Image Analysis fails**: Ensure `TESSERACT_CMD` in `backend/.env` points to the exact installation path of your `tesseract.exe`.
- **Database Locked Errors**: SQLite does not handle heavy concurrency well. If you get lock errors, restart the backend terminal.
