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
   - Add:
     - `USE_OPEN_AI`: `true` or `false`
     - `OPEN_AI_API_KEY`: your OpenAI key (if USE_OPEN_AI=true)
     - `GOOGLE_GENAI_API_KEY`: your Google key (if USE_OPEN_AI=false)
     - `OPENAI_MODEL`: model to use (default: `gpt-4`)
     - `GEMINI_MODEL`: model to use (default: `gemini-2.5-flash`)
   - Click "Save"

4. **Redeploy:**
   - Go to **Deployments**
   - Click "Redeploy" on the latest deployment
   - Wait for the build to complete

Done! Your application will be available at `https://your-project.vercel.app`

## Endpoints

- `GET /health` - Application status
- `POST /api/chat` - Send a message to chat

## Tests

```bash
npm test              # Run tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Run tests with coverage report
```
