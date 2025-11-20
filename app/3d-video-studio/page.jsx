"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Loader2, Video, Camera, Sparkles, Download, Play } from "lucide-react"
import { Slider } from "@/components/ui/slider"

export default function VideoStudioPage() {
  const [prompt, setPrompt] = useState("")
  const [model, setModel] = useState("luma-ray-2")
  const [cameraMovement, setCameraMovement] = useState("dynamic")
  const [duration, setDuration] = useState([5])
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedVideo, setGeneratedVideo] = useState(null)
  const [error, setError] = useState(null)

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError("Please enter a prompt")
      return
    }

    setIsGenerating(true)
    setError(null)
    setGeneratedVideo(null)

    try {
      const response = await fetch("/api/3d-video/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          model,
          cameraMovement,
          duration: duration[0],
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate video")
      }

      const data = await response.json()
      setGeneratedVideo(data.videoUrl)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">3D Video Studio</h1>
          <p className="text-muted-foreground">Generate cinematic 3D videos using advanced AI models</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  Video Generation
                </CardTitle>
                <CardDescription>Describe your vision and let AI create cinematic 3D videos</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="prompt">Video Prompt</Label>
                  <Textarea
                    id="prompt"
                    placeholder="A cinematic shot of a futuristic city at sunset, camera slowly panning across gleaming skyscrapers with flying cars in the background..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    rows={4}
                    className="resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="model">AI Model</Label>
                    <Select value={model} onValueChange={setModel}>
                      <SelectTrigger id="model">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="luma-ray-2">
                          <div className="flex items-center gap-2">
                            <Badge variant="default">Recommended</Badge>
                            Luma Ray 2
                          </div>
                        </SelectItem>
                        <SelectItem value="fal-veo-3">Fal Veo 3</SelectItem>
                        <SelectItem value="fal-minimax">Fal MiniMax</SelectItem>
                        <SelectItem value="fal-mochi">Fal Mochi</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="camera">Camera Movement</Label>
                    <Select value={cameraMovement} onValueChange={setCameraMovement}>
                      <SelectTrigger id="camera">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="static">Static</SelectItem>
                        <SelectItem value="dynamic">Dynamic</SelectItem>
                        <SelectItem value="orbit">Orbit</SelectItem>
                        <SelectItem value="dolly">Dolly</SelectItem>
                        <SelectItem value="pan">Pan</SelectItem>
                        <SelectItem value="zoom">Zoom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="duration">Duration</Label>
                    <span className="text-sm text-muted-foreground">{duration[0]}s</span>
                  </div>
                  <Slider id="duration" min={3} max={10} step={1} value={duration} onValueChange={setDuration} />
                </div>

                {error && (
                  <div className="p-4 border border-destructive bg-destructive/10 rounded-lg text-destructive text-sm">
                    {error}
                  </div>
                )}

                <Button onClick={handleGenerate} disabled={isGenerating} className="w-full" size="lg">
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating Video...
                    </>
                  ) : (
                    <>
                      <Video className="mr-2 h-4 w-4" />
                      Generate 3D Video
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {generatedVideo && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Play className="h-5 w-5" />
                    Generated Video
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video bg-black rounded-lg overflow-hidden mb-4">
                    <video src={generatedVideo} controls className="w-full h-full" autoPlay loop />
                  </div>
                  <Button variant="outline" className="w-full bg-transparent">
                    <Download className="mr-2 h-4 w-4" />
                    Download Video
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="h-5 w-5" />
                  Camera Controls
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Movement Types</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>
                      <strong>Static:</strong> Fixed camera position
                    </li>
                    <li>
                      <strong>Dynamic:</strong> Natural camera movement
                    </li>
                    <li>
                      <strong>Orbit:</strong> Circular motion around subject
                    </li>
                    <li>
                      <strong>Dolly:</strong> Forward/backward movement
                    </li>
                    <li>
                      <strong>Pan:</strong> Left/right rotation
                    </li>
                    <li>
                      <strong>Zoom:</strong> Focal length changes
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Prompt Tips</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <div>
                  <h4 className="font-medium text-foreground mb-1">Be Specific</h4>
                  <p>Include details about lighting, atmosphere, and movement</p>
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-1">Cinematic Language</h4>
                  <p>Use terms like "wide shot", "close-up", "aerial view"</p>
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-1">Depth Cues</h4>
                  <p>Mention foreground, midground, and background elements</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Model Comparison</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <Badge className="mb-1">Luma Ray 2</Badge>
                  <p className="text-muted-foreground">Best for cinematic quality and 3D understanding</p>
                </div>
                <div>
                  <Badge variant="secondary" className="mb-1">
                    Fal Veo 3
                  </Badge>
                  <p className="text-muted-foreground">Excellent realism and camera control</p>
                </div>
                <div>
                  <Badge variant="secondary" className="mb-1">
                    Fal MiniMax
                  </Badge>
                  <p className="text-muted-foreground">Fast generation, good quality</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
