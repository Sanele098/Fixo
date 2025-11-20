import { GoogleGenerativeAI } from "@google/generative-ai"

// Only access API key on server-side (in API routes)
const apiKey = process.env.GOOGLE_API_KEY

if (!apiKey) {
  throw new Error("GOOGLE_API_KEY environment variable is required")
}

const genAI = new GoogleGenerativeAI(apiKey)

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
}

const systemInstruction = `You are Fixo AI, a helpful home repair and maintenance assistant. You help users diagnose home repair issues, provide step-by-step repair guides, recommend tools and materials, and offer safety tips. Be friendly, clear, and practical in your responses. When discussing repairs, always emphasize safety first and recommend calling a professional for complex or dangerous tasks.`

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
  systemInstruction,
  generationConfig,
})

const chatSession = model.startChat({
  generationConfig,
  history: [],
})

export { chatSession, generationConfig }
