# Troubleshooting Guide

## 500 Internal Server Error on Vercel

### Issue
When making a POST request to `/api/generate`, you receive a 500 Internal Server Error.

### Root Cause
The API keys are **not configured** in your Vercel environment variables. When the application tries to initialize the AI service (OpenAI or Google Gemini), it fails because:
- `OPEN_AI_API_KEY` is undefined (when using OpenAI)
- `GOOGLE_GENAI_API_KEY` is undefined (when using Gemini)

### How to Fix

#### Step 1: Get Your API Keys
- **OpenAI**: https://platform.openai.com/api-keys
- **Google Gemini**: https://ai.google.dev/

#### Step 2: Add Environment Variables to Vercel
1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Choose **one** of these configurations:

**Option A: Use OpenAI**
```
USE_OPEN_AI = true
OPEN_AI_API_KEY = sk-... (your actual key)
OPENAI_MODEL = gpt-4 (optional, defaults to gpt-4)
```

**Option B: Use Google Gemini**
```
USE_OPEN_AI = false
GOOGLE_GENAI_API_KEY = AIza... (your actual key)
GEMINI_MODEL = gemini-2.5-flash (optional, defaults to gemini-2.5-flash)
```

4. Click **Save**

#### Step 3: Redeploy
1. Go to **Deployments** tab
2. Click **Redeploy** on the latest deployment
3. Wait for the build to complete (should take 1-2 minutes)

#### Step 4: Test
```bash
curl -X POST https://your-project.vercel.app/api/generate \
  -H "Content-Type: application/json" \
  -d '{"prompt": "What is the capital of France?"}'
```

### Expected Response
If successful, you'll see:
```json
{
  "text": "The capital of France is Paris.",
  "updatedHistory": [
    { "role": "user", "content": "What is the capital of France?" },
    { "role": "assistant", "content": "The capital of France is Paris." }
  ]
}
```

### Still Not Working?

1. **Check Vercel Logs:**
   - Go to your project in Vercel
   - Click **Deployments**
   - Click the latest deployment
   - Click **Runtime Logs** to see detailed error messages

2. **Verify Environment Variables:**
   - Go to **Settings** → **Environment Variables**
   - Make sure variables are saved for the correct environment (Production)
   - Check that API keys have no extra spaces or quotes

3. **Test Locally First:**
   ```bash
   # Copy the example file
   cp .env.example .env
   
   # Fill in your API keys in .env
   
   # Install dependencies
   npm install
   
   # Run locally
   npm run dev
   
   # Test with curl or Postman
   ```

4. **Check API Key Validity:**
   - OpenAI keys should start with `sk-`
   - Google keys should start with `AIza`
   - Make sure keys haven't reached their usage limit

### Common Issues

| Error | Cause | Solution |
|-------|-------|----------|
| 429 Quota Exceeded | Free tier API quota reached | Upgrade plan or wait for quota reset |
| 401 Unauthorized | Invalid API key | Check key is correct and not expired |
| 500 Internal Server Error | Missing environment variables | Add API keys to Vercel settings |
| CORS error in frontend | Frontend on different domain | CORS is already enabled (*) |

### Need More Help?

- OpenAI Issues: https://help.openai.com/
- Google Gemini Issues: https://ai.google.dev/docs
- Vercel Documentation: https://vercel.com/docs
