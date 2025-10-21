const { GoogleGenerativeAI } = require("@google/generative-ai")

const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY || process.env.GOOGLE_API_KEY
const genAI = new GoogleGenerativeAI(apiKey)

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash-exp",
})

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
}

export const chatSession = model.startChat({
  generationConfig,
  history: [],
  systemInstruction: {
    parts: [
      {
        text: `You are Fixo AI, a helpful home repair and maintenance assistant. You help users diagnose home repair issues, provide step-by-step repair guides, recommend tools and materials, and offer safety tips. Be friendly, clear, and practical in your responses. When discussing repairs, always emphasize safety first and recommend calling a professional for complex or dangerous tasks.`,
      },
    ],
    role: "system",
  },
})
