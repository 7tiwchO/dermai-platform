# 🩺 DermAI — Cancer Detection Platform

A modern, full-stack AI-powered medical web application for early skin cancer detection using Deep Learning (VGG16 Transfer Learning).

## Architecture

* **Frontend**: Next.js 15, React 19, Tailwind CSS v4, Framer Motion
* **Backend**: FastAPI (Python), SQLite, JWT Authentication
* **Machine Learning**: TensorFlow Lite (TFLite) inference with VGG16 model
* **Infrastructure**: Docker & Docker Compose

## Prerequisites

* Node.js 20+
* Python 3.11+
* Docker (optional, for containerized deployment)

## Setup Instructions (Local Development)

### 1. Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

Place your trained `model.tflite` file in the `backend/` directory. If the model is not present, the app will run in **Demo Mode**.

Run the backend:
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```
The API will be available at `http://localhost:8000`. API docs are at `http://localhost:8000/docs`.

### 2. Frontend Setup

```bash
cd frontend
npm install
```

Configure the API URL in `frontend/.env.local` (or let it default to localhost:8000/api).

Run the frontend:
```bash
npm run dev
```
The web application will be available at `http://localhost:3000`.

### Default Credentials

An admin account is automatically created on first startup:
* **Username**: admin
* **Password**: admin123

## Deployment (Docker)

To deploy the entire platform using Docker Compose:

1. Copy `.env.example` to `.env` and update the values.
2. Place `model.tflite` in the `backend/` directory.
3. Update `frontend/next.config.ts` to enable standalone output:
   ```typescript
   const nextConfig = {
     output: 'standalone',
   };
   export default nextConfig;
   ```
4. Run:
   ```bash
   docker-compose up -d --build
   ```
