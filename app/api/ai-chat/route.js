import { GoogleGenerativeAI } from "@google/generative-ai"
import { NextResponse } from "next/server"

const apiKey = process.env.GOOGLE_API_KEY

const genAI = new GoogleGenerativeAI(apiKey)

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
}

const systemInstruction = `You are Fixo AI, a helpful home repair and maintenance assistant. You help users diagnose home repair issues from text descriptions and images. Provide step-by-step repair guides, recommend tools and materials, and offer safety tips. When analyzing images, describe what you see and identify potential issues. Be friendly, clear, and practical in your responses. Always emphasize safety first and recommend calling a professional for complex or dangerous tasks.`

export async function POST(req) {
  const { prompt, imageData, hasMedia } = await req.json()

  if (!apiKey) {
    console.error("GOOGLE_API_KEY environment variable is not set")
    return NextResponse.json({ error: "API key not configured" }, { status: 500 })
  }

  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      systemInstruction,
      generationConfig,
    })

    let result

    if (hasMedia && imageData) {
      const base64Image = imageData.replace(/^data:image\/\w+;base64,/, "")

      const imagePart = {
        inlineData: {
          data: base64Image,
          mimeType: "image/jpeg",
        },
      }

      result = await model.generateContent([prompt, imagePart])
    } else {
      result = await model.generateContent(prompt)
    }

    const AIresp = result.response.text()

    return NextResponse.json({ result: AIresp })
  } catch (e) {
    console.error("AI Chat Error:", e)

    let errorMessage = "Failed to generate response"
    let statusCode = 500

    if (e.message?.includes("quota") || e.message?.includes("429")) {
      errorMessage = "API quota exceeded. Please try again in a few moments or check your Google API billing settings."
      statusCode = 429
    } else if (e.message?.includes("API key")) {
      errorMessage = "Invalid API key. Please check your Google API configuration."
      statusCode = 401
    } else if (e.message) {
      errorMessage = e.message
    }

    return NextResponse.json({ error: errorMessage }, { status: statusCode })
  }
}
