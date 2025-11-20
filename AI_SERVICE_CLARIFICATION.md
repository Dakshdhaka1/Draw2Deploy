# ⚠️ IMPORTANT: About AiService.java

## ❌ DO NOT run AiService.java directly!

`AiService.java` is **NOT** a standalone application. It's a **service class** that's part of your Spring Boot backend.

## What is AiService.java?

- It's a **client** that makes HTTP calls to an external AI service
- It's automatically included when you start the backend
- It runs on port **9000** (as part of the backend), NOT port 7000

## What is the AI Service?

The AI service is a **SEPARATE application** that should run on port **7000**. This is:
- A different codebase/project (probably Python, Node.js, or another framework)
- A separate server/application
- NOT part of this Draw2Deploy backend

## How it works:

```
┌─────────────────┐         HTTP Call          ┌─────────────────┐
│   Backend       │  ────────────────────────> │   AI Service    │
│  (Port 9000)    │  POST /analyze-url         │  (Port 7000)    │
│                 │  { "image_url": "..." }    │                 │
│  AiService.java │ <────────────────────────  │  Returns JSON  │
│  (client class) │                            │  with components│
└─────────────────┘                            └─────────────────┘
```

## What to do:

1. ✅ **Start Backend** (includes AiService.java automatically):
   ```powershell
   cd Draw2Deploy
   .\mvnw.cmd spring-boot:run
   ```
   This starts on port 9000

2. ✅ **Start your separate AI service** on port 7000:
   - This is a different application
   - You need to start it using whatever command you use for that service
   - Example: `python app.py`, `npm start`, `uvicorn main:app`, etc.

3. ❌ **DO NOT** try to run `AiService.java` directly - it's not a main class!

## If you don't have an AI service yet:

You need to create a separate AI service application that:
- Runs on port 7000
- Has a `POST /analyze-url` endpoint
- Accepts: `{ "image_url": "presigned-s3-url" }`
- Returns: JSON with component information for Terraform generation

Example response format:
```json
{
  "components": [
    {
      "type": "vpc",
      "variables": {
        "cidr": "10.0.0.0/16"
      }
    },
    {
      "type": "ec2",
      "variables": {
        "instance_type": "t2.micro"
      }
    }
  ]
}
```










