import { generateText } from "ai"

export async function POST(req) {
  try {
    const { message, attachments } = await req.json()

    const hasMedia = attachments && attachments.length > 0
    const mediaTypes = hasMedia ? attachments.map((att) => att.type).join(", ") : "none"

    const prompt = `You are Fixo AI, an expert home repair diagnostic assistant. A user has submitted the following issue:

User Message: "${message}"
Attached Media: ${mediaTypes}

Provide a detailed diagnosis and repair guide. Include:
1. A brief diagnosis of the problem
2. Step-by-step repair instructions (3-5 steps)
3. Safety warnings if applicable
4. Estimated difficulty level

Format your response as a helpful, professional home repair expert.`

    const { text } = await generateText({
      model: "openai/gpt-5-mini",
      prompt,
      maxOutputTokens: 1000,
      temperature: 0.7,
    })

    const steps = [
      "Turn off the main water supply or electrical circuit",
      "Gather necessary tools and safety equipment",
      "Follow manufacturer guidelines for your specific model",
      "Test the repair before fully reassembling",
      "Monitor for 24 hours to ensure the fix holds",
    ]

    return Response.json({
      diagnosis: text,
      steps: steps,
      has3DGuide: Math.random() > 0.5,
      difficulty: "Moderate",
      estimatedTime: "30-60 minutes",
    })
  } catch (error) {
    console.error("Error in AI diagnosis:", error)
    return Response.json(
      {
        diagnosis:
          "I apologize, but I encountered an error analyzing your request. Please try again or contact support if the issue persists.",
        steps: [],
        has3DGuide: false,
      },
      { status: 500 },
    )
  }
}
