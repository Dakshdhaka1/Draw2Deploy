# How to Start Draw2Deploy Services

You need to run **TWO services** for the application to work:

## 1. Backend (Spring Boot) - Port 9000

**Required for:**
- User authentication (login, signup, email verification)
- Project management (create, delete projects)
- API endpoints
- Image upload to S3

**How to start:**

### Option A: Using Maven Wrapper (Recommended)
```powershell
cd Draw2Deploy
.\mvnw.cmd spring-boot:run
```

### Option B: Using Maven (if installed)
```powershell
cd Draw2Deploy
mvn spring-boot:run
```

### Option C: Run from IDE
- Open `Draw2DeployApplication.java`
- Right-click → Run `main` method

**Verify it's running:**
- Check console for: "Started Draw2DeployApplication"
- Visit: http://localhost:9000/api/user/ (should return "Hello World")

---

## 2. AI Service - Port 7000

**Required for:**
- Analyzing uploaded architecture diagrams
- Generating Terraform components from images
- **Only needed when clicking "Generate TF" button**

**IMPORTANT:** 
- `AiService.java` is **NOT** the AI service - it's just a client class in the backend
- The AI service is a **SEPARATE application** that you need to start
- Do NOT try to run `AiService.java` directly - it's part of the backend

**How to start:**
You need to start your **separate AI service application** (Python/Flask, FastAPI, Node.js, etc.). The backend expects it at:
- **URL:** `http://localhost:7000`
- **Endpoint:** `POST /analyze-url`
- **Request Body:** `{ "image_url": "presigned-s3-url" }`
- **Response:** JSON with component information

**Example AI Service Structure:**
```python
# Example: Python Flask/FastAPI service
@app.post("/analyze-url")
def analyze_url(data: dict):
    image_url = data.get("image_url")
    # Analyze image and return components
    return {"components": [...]}
```

**Verify it's running:**
- The frontend dashboard will show a warning if AI service is unavailable
- Check: http://localhost:7000/analyze-url (should respond, even if 405 Method Not Allowed)

---

## 3. Frontend (React) - Port 5173

**How to start:**
```powershell
cd frontend
npm run dev
```

**Verify it's running:**
- Visit: http://localhost:5173

---

## Quick Start Checklist

1. ✅ **Start Backend** (port 9000) - Required for everything
2. ✅ **Start AI Service** (port 7000) - Required for Terraform generation
3. ✅ **Start Frontend** (port 5173) - The web interface

---

## What Happens If Services Are Missing?

### Backend Not Running:
- ❌ Cannot login/signup
- ❌ Cannot create projects
- ❌ Frontend shows connection errors

### AI Service Not Running:
- ✅ Can login/signup
- ✅ Can create projects
- ✅ Can upload images
- ❌ **Cannot generate Terraform** - Button will be disabled with warning message

---

## Troubleshooting

### Backend won't start?
- Check if port 9000 is already in use
- Check database connection in `application.properties`
- Check AWS credentials in `application.properties`

### AI Service not found?
- The dashboard will show a yellow warning banner
- "Generate TF" button will be disabled
- Error messages will guide you to start the service

### Frontend can't connect to backend?
- Ensure backend is running on port 9000
- Check CORS configuration
- Check browser console for errors

