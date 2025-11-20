import { NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

const DEMO_MODE = false

export async function POST(req) {
  try {
    const { prompt, imageData } = await req.json()

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 })
    }

    if (DEMO_MODE) {
      console.log("[v0] DEMO MODE - Simulating video generation...")
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      return NextResponse.json({
        success: true,
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        thumbnail: "/repair-tutorial-video.jpg",
        duration: "8s",
        title: "Home Repair Tutorial (Demo)",
        description: prompt,
        status: "completed",
        isDemo: true
      })
    }

    // Real Veo API implementation
    const apiKey = process.env.GOOGLE_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: "Google API key not configured" }, { status: 500 })
    }

    let enhancedPrompt = ""
    
    if (imageData) {
      console.log("[v0] Analyzing uploaded image with Gemini Vision...")
      
      const genAI = new GoogleGenerativeAI(apiKey)
      const visionModel = genAI.getGenerativeModel({ model: "gemini-2.0-flash" })
      
      // Extract base64 data
      const base64Data = imageData.includes(',') ? imageData.split(',')[1] : imageData
      
      // Analyze the image to understand the repair issue
      const analysisResult = await visionModel.generateContent([
        {
          inlineData: {
            data: base64Data,
            mimeType: "image/jpeg"
          }
        },
        `Analyze this home repair image and create a detailed video generation prompt. Describe:
1. What exactly is damaged or broken (be specific about materials, location, type of damage)
2. What tools would be needed to fix it
3. The step-by-step repair process
4. Important details about the repair area

Format as: "A detailed 8-second repair tutorial showing [specific issue]. The video demonstrates [repair steps with tools]. Show close-up of [damaged area] and hands using [specific tools]. Focus on [repair technique]."

Keep it concise but specific. Only mention hands and tools, NO faces or people.`
      ])
      
      const analysisText = analysisResult.response.text()
      console.log("[v0] Image analysis result:", analysisText)
      
      // Use the AI-generated prompt that's based on the actual image content
      enhancedPrompt = analysisText.trim()
    } else {
      // No image - use text description with repair focus
      enhancedPrompt = `A detailed 8-second home repair tutorial video demonstrating: ${prompt}. 
Show the problem area, tools needed, and step-by-step repair technique.
Use close-up shots of hands working with tools and materials.
Style: Clear, professional home improvement tutorial. Only hands and tools visible, no faces or people.`
    }

    console.log("[v0] Final video prompt:", enhancedPrompt)
    console.log("[v0] Starting Veo 2.0 video generation...")

    const baseUrl = "https://generativelanguage.googleapis.com/v1beta"
    const endpoint = `${baseUrl}/models/veo-2.0-generate-001:predictLongRunning`

    const payload = {
      instances: [{
        prompt: enhancedPrompt
      }],
      parameters: {
        aspectRatio: "16:9",
        personGeneration: "dont_allow",
        durationSeconds: 8
      }
    }

    // Step 1: Initiate video generation
    const generateResponse = await fetch(`${endpoint}?key=${apiKey}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    })

    if (!generateResponse.ok) {
      const errorData = await generateResponse.json()
      throw new Error(`Veo API Error: ${errorData.error?.message || 'Unknown error'}`)
    }

    const generateData = await generateResponse.json()
    const operationName = generateData.name

    if (!operationName) {
      throw new Error("No operation name returned from Veo API")
    }

    console.log("[v0] Video generation operation started:", operationName)

    // Step 2: Poll for completion (max 30 attempts, 6 seconds each = 3 minutes)
    let videoUrl = null
    let attempts = 0
    const maxAttempts = 30

    while (attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 6000))
      
      const statusResponse = await fetch(`${baseUrl}/${operationName}?key=${apiKey}`, {
        headers: {
          "Content-Type": "application/json"
        }
      })

      if (!statusResponse.ok) {
        throw new Error("Failed to check operation status")
      }

      const statusData = await statusResponse.json()
      
      if (statusData.done) {
        const generateVideoResponse = statusData.response?.generateVideoResponse
        
        if (generateVideoResponse?.generatedSamples && generateVideoResponse.generatedSamples.length > 0) {
          const firstSample = generateVideoResponse.generatedSamples[0]
          const rawVideoUrl = firstSample.video?.uri
          
          videoUrl = rawVideoUrl ? `${rawVideoUrl}&key=${apiKey}` : null
          
          console.log("[v0] Video generated successfully based on image analysis")
          
          if (generateVideoResponse.raiMediaFilteredCount > 0) {
            const reasons = generateVideoResponse.raiMediaFilteredReasons || []
            console.log("[v0] Warning: Some videos were filtered, but we have a valid video:", reasons[0])
          }
        } else if (generateVideoResponse?.raiMediaFilteredCount > 0) {
          const reasons = generateVideoResponse.raiMediaFilteredReasons || []
          const filterMessage = reasons.length > 0 ? reasons[0] : "Content filtered by safety settings"
          
          console.log("[v0] All videos filtered by safety settings:", filterMessage)
          throw new Error(`Safety Filter: ${filterMessage}`)
        }
        
        console.log("[v0] Video generation completed, extracted URL:", videoUrl)
        break
      }

      attempts++
      console.log(`[v0] Polling attempt ${attempts}/${maxAttempts}...`)
    }

    if (!videoUrl) {
      throw new Error("Video generation timed out or no video URL returned")
    }

    return NextResponse.json({
      success: true,
      videoUrl: videoUrl,
      thumbnail: "/repair-tutorial-video.jpg",
      duration: "8s",
      title: "Repair Tutorial Video",
      description: prompt,
      status: "completed",
      apiKey: apiKey
    })

  } catch (error) {
    console.error("[v0] Video generation error:", error)
    
    if (error.message?.includes("429") || error.message?.includes("quota")) {
      return NextResponse.json(
        { 
          error: "API rate limit reached. Please wait and try again.",
          code: "RATE_LIMIT"
        },
        { status: 429 }
      )
    }
    
    if (error.message?.includes("404") || error.message?.includes("not found")) {
      return NextResponse.json(
        { 
          error: "Veo 2.0 API access required. This is a paid feature.",
          code: "MODEL_NOT_AVAILABLE",
          details: "Enable Veo in Google AI Studio (https://aistudio.google.com/billing)"
        },
        { status: 503 }
      )
    }

    if (error.message?.includes("Safety Filter")) {
      return NextResponse.json(
        { 
          error: "Video content was filtered by safety settings.",
          code: "SAFETY_FILTER",
          details: error.message.replace("Safety Filter: ", "")
        },
        { status: 400 }
      )
    }
    
    if (error.message?.includes("401") || error.message?.includes("403") || error.message?.includes("API key")) {
      return NextResponse.json(
        { 
          error: "Invalid API key or insufficient permissions for Veo.",
          code: "AUTH_ERROR",
          details: "Ensure your API key has Veo access enabled"
        },
        { status: 401 }
      )
    }
    
    return NextResponse.json(
      { 
        error: error.message || "Failed to generate video",
        code: "GENERATION_ERROR",
        details: "Set DEMO_MODE = true in the API route to test the UI"
      },
      { status: 500 }
    )
  }
}
