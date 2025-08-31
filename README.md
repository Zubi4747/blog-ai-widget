# Blog AI Widget (Vercel + OpenAI)

This project is a serverless API that powers a floating AI chat widget for Blogger/WordPress.  
It securely connects to OpenAI without exposing your API key.

## 🚀 Deploy to Vercel

1. Fork this repo or download it.
2. Push it to your GitHub.
3. Go to [Vercel](https://vercel.com), import this repo.
4. Add an **Environment Variable** in Vercel:
   - `OPENAI_API_KEY = your_openai_api_key`
5. Deploy 🎉

Your endpoint will be:
```
https://your-app.vercel.app/api/generate
```

Use this inside your Blogger widget.

## 🛠 Example Request

```bash
curl -X POST https://your-app.vercel.app/api/generate   -H "Content-Type: application/json"   -d '{"topic":"AI tools for bloggers","type":"chat"}'
```
