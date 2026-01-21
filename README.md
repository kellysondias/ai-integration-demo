# AI Integration Demo

An Express application that integrates with OpenAI or Google Gemini for chat.

## Local Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   ```bash
   cp .env.example .env
   ```
   Fill in with your API keys

4. Run the application:
   ```bash
   npm run dev
   ```

## Deploy to Vercel

### Requirements
- GitHub account
- Vercel account (free at https://vercel.com)
- API keys (OpenAI or Google Gemini)

### Step by step

1. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/your-username/your-repository.git
   git push -u origin main
   ```

2. **Connect to Vercel:**
   - Visit https://vercel.com
   - Click "New Project"
   - Select your GitHub repository
   - Click "Deploy"

3. **Configure environment variables:**
   - Go to **Settings** → **Environment Variables**
   - Add **at least one** of these API keys:
     - **OpenAI Configuration:**
       - `USE_OPEN_AI`: `true`
       - `OPEN_AI_API_KEY`: your OpenAI API key (get it from https://platform.openai.com/api-keys)
     - **Google Gemini Configuration:**
       - `USE_OPEN_AI`: `false`
       - `GOOGLE_GENAI_API_KEY`: your Google API key (get it from https://ai.google.dev/)
   - **Optional Model Configuration:**
     - `OPENAI_MODEL`: model to use (default: `gpt-4`)
     - `GEMINI_MODEL`: model to use (default: `gemini-2.5-flash`)
   - Click "Save"

4. **Redeploy:**
   - Go to **Deployments**
   - Click "Redeploy" on the latest deployment
   - Wait for the build to complete

## Troubleshooting

### 500 Internal Server Error on Vercel

If you get a 500 error when calling the API, the most common cause is **missing API keys**:

**Solution:**
1. Make sure you've added the required API keys to Vercel Environment Variables:
   - For OpenAI: Add `USE_OPEN_AI=true` and `OPEN_AI_API_KEY=your-key`
   - For Gemini: Add `USE_OPEN_AI=false` and `GOOGLE_GENAI_API_KEY=your-key`

2. After adding the variables, redeploy:
   - Go to **Deployments** in Vercel
   - Click "Redeploy" on the latest deployment

3. Test the API with:
   ```bash
   curl -X POST https://your-project.vercel.app/api/generate \
     -H "Content-Type: application/json" \
     -d '{"prompt": "Hello, how are you?"}'
   ```

### API Keys

- **OpenAI**: Get free API key at https://platform.openai.com/api-keys
- **Google Gemini**: Get free API key at https://ai.google.dev/


## Endpoints

- `GET /health` - Application status
- `POST /api/chat` - Send a message to chat

## Tests

```bash
npm test              # Run tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Run tests with coverage report
```
