import { NextResponse } from "next/server"

export async function POST(req) {
  try {
    const { prompt, model, cameraMovement, duration } = await req.json()

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 })
    }

    // Enhance prompt with camera movement instructions
    const enhancedPrompt = `${prompt}. Camera movement: ${cameraMovement}. Cinematic lighting with depth and parallax.`

    console.log("[v0] Generating video with model:", model)
    console.log("[v0] Enhanced prompt:", enhancedPrompt)

    // Route to appropriate API based on model selection
    let videoUrl

    if (model === "luma-ray-2") {
      videoUrl = await generateLumaVideo(enhancedPrompt, duration)
    } else if (model.startsWith("fal-")) {
      videoUrl = await generateFalVideo(enhancedPrompt, model, duration)
    } else {
      throw new Error("Unsupported model")
    }

    return NextResponse.json({
      videoUrl,
      prompt: enhancedPrompt,
      model,
    })
  } catch (error) {
    console.error("[v0] Video generation error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to generate video" },
      { status: 500 },
    )
  }
}

async function generateLumaVideo(prompt, duration) {
  const LUMA_API_KEY = process.env.LUMA_API_KEY

  if (!LUMA_API_KEY) {
    throw new Error("LUMA_API_KEY is not configured. Please add it to your environment variables.")
  }

  // Create generation
  const createResponse = await fetch("https://api.lumalabs.ai/dream-machine/v1/generations", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${LUMA_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt,
      model: "ray-2",
    }),
  })

  if (!createResponse.ok) {
    throw new Error(`Luma API error: ${createResponse.statusText}`)
  }

  const generation = await createResponse.json()
  const generationId = generation.id

  console.log("[v0] Luma generation started:", generationId)

  // Poll for completion
  let completed = false
  let attempts = 0
  const maxAttempts = 60 // 3 minutes max

  while (!completed && attempts < maxAttempts) {
    await new Promise((resolve) => setTimeout(resolve, 3000))

    const statusResponse = await fetch(`https://api.lumalabs.ai/dream-machine/v1/generations/${generationId}`, {
      headers: {
        Authorization: `Bearer ${LUMA_API_KEY}`,
      },
    })

    if (!statusResponse.ok) {
      throw new Error("Failed to check generation status")
    }

    const status = await statusResponse.json()
    console.log("[v0] Generation status:", status.state)

    if (status.state === "completed") {
      completed = true
      return status.assets.video
    } else if (status.state === "failed") {
      throw new Error("Video generation failed")
    }

    attempts++
  }

  throw new Error("Video generation timed out")
}

async function generateFalVideo(prompt, model, duration) {
  const FAL_KEY = process.env.FAL_KEY

  if (!FAL_KEY) {
    throw new Error("FAL_KEY is not configured. Please add it to your environment variables.")
  }

  // Map model names to Fal endpoints
  const modelMap = {
    "fal-veo-3": "fal-ai/veo-3",
    "fal-minimax": "fal-ai/minimax/video-01",
    "fal-mochi": "fal-ai/mochi-v1",
  }

  const endpoint = modelMap[model]
  if (!endpoint) {
    throw new Error("Unsupported Fal model")
  }

  const response = await fetch(`https://fal.run/${endpoint}`, {
    method: "POST",
    headers: {
      Authorization: `Key ${FAL_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt,
      duration,
    }),
  })

  if (!response.ok) {
    throw new Error(`Fal API error: ${response.statusText}`)
  }

  const result = await response.json()
  return result.video.url
}
