"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  ArrowLeft,
  Send,
  Upload,
  X,
  Camera,
  VideoIcon,
  Sparkles,
  BrainCircuit,
  Loader2,
  Cable as Cube,
  Play,
  Pause,
} from "lucide-react"

export default function AIChat() {
  const router = useRouter()
  const [messages, setMessages] = useState([])
  const [inputMessage, setInputMessage] = useState("")
  const [attachments, setAttachments] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [show3DView, setShow3DView] = useState(false)
  const [current3DContent, setCurrent3DContent] = useState(null)
  const messagesEndRef = useRef(null)
  const fileInputRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files)
    const newAttachments = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      type: file.type.startsWith("image/") ? "image" : "video",
    }))
    setAttachments([...attachments, ...newAttachments])
  }

  const removeAttachment = (index) => {
    const newAttachments = attachments.filter((_, i) => i !== index)
    setAttachments(newAttachments)
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim() && attachments.length === 0) return

    const userMessage = {
      id: Date.now(),
      role: "user",
      content: inputMessage,
      attachments: attachments,
      timestamp: new Date().toISOString(),
    }

    setMessages([...messages, userMessage])
    setInputMessage("")
    setAttachments([])
    setIsLoading(true)

    try {
      const response = await fetch("/api/ai-diagnosis", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: inputMessage,
          attachments: attachments.map((att) => ({
            type: att.type,
            name: att.file.name,
          })),
        }),
      })

      const data = await response.json()

      const aiMessage = {
        id: Date.now() + 1,
        role: "assistant",
        content: data.diagnosis || "I've analyzed your issue. Here's what I found...",
        steps: data.steps || [],
        has3DGuide: data.has3DGuide || false,
        timestamp: new Date().toISOString(),
      }

      setMessages((prev) => [...prev, aiMessage])
    } catch (error) {
      console.error("Error sending message:", error)
      const errorMessage = {
        id: Date.now() + 1,
        role: "assistant",
        content: "I apologize, but I encountered an error analyzing your request. Please try again.",
        timestamp: new Date().toISOString(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handle3DView = (messageId) => {
    setShow3DView(true)
    setCurrent3DContent({
      messageId,
      title: "3D Repair Guide",
      description: "Interactive 3D visualization showing how to fix your issue",
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex flex-col">
      <header className="bg-white/80 backdrop-blur-md border-b border-purple-100 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" onClick={() => router.push("/")} className="rounded-full">
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                  <BrainCircuit className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-gray-900">Fixo AI Assistant</h1>
                  <p className="text-xs text-gray-600">Powered by Advanced AI</p>
                </div>
              </div>
            </div>
            <Badge className="bg-green-100 text-green-700 rounded-xl">
              <div className="w-2 h-2 bg-green-600 rounded-full mr-2 animate-pulse"></div>
              Online
            </Badge>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 h-full flex flex-col">
          {messages.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center max-w-2xl">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Sparkles className="w-10 h-10 text-purple-600" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Welcome to Fixo AI</h2>
                <p className="text-gray-600 mb-8 leading-relaxed">
                  I'm your AI-powered home repair assistant. Upload images or videos of your house issues, and I'll
                  provide instant diagnosis and step-by-step repair guides. I can even show you 3D visualizations of how
                  to fix problems!
                </p>
                <div className="grid md:grid-cols-3 gap-4 text-left">
                  <Card className="bg-white/80 backdrop-blur-sm border-purple-100">
                    <CardContent className="p-4">
                      <Camera className="h-6 w-6 text-purple-600 mb-2" />
                      <h3 className="font-semibold mb-1">Upload Media</h3>
                      <p className="text-sm text-gray-600">Share photos or videos of your issue</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-white/80 backdrop-blur-sm border-purple-100">
                    <CardContent className="p-4">
                      <BrainCircuit className="h-6 w-6 text-blue-600 mb-2" />
                      <h3 className="font-semibold mb-1">AI Diagnosis</h3>
                      <p className="text-sm text-gray-600">Get instant problem analysis</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-white/80 backdrop-blur-sm border-purple-100">
                    <CardContent className="p-4">
                      <Cube className="h-6 w-6 text-green-600 mb-2" />
                      <h3 className="font-semibold mb-1">3D Guides</h3>
                      <p className="text-sm text-gray-600">View interactive repair tutorials</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto mb-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {message.role === "assistant" && (
                    <Avatar className="h-8 w-8 flex-shrink-0">
                      <AvatarFallback className="bg-gradient-to-br from-purple-100 to-blue-100 text-purple-600">
                        <BrainCircuit className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={`max-w-2xl ${
                      message.role === "user"
                        ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white"
                        : "bg-white border border-gray-200"
                    } rounded-2xl p-4 shadow-sm`}
                  >
                    {message.attachments && message.attachments.length > 0 && (
                      <div className="grid grid-cols-2 gap-2 mb-3">
                        {message.attachments.map((att, idx) => (
                          <div key={idx} className="relative rounded-lg overflow-hidden">
                            {att.type === "image" ? (
                              <img
                                src={att.preview || "/placeholder.svg"}
                                alt="Attachment"
                                className="w-full h-32 object-cover"
                              />
                            ) : (
                              <div className="w-full h-32 bg-gray-800 flex items-center justify-center">
                                <VideoIcon className="h-8 w-8 text-white" />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                    {message.steps && message.steps.length > 0 && (
                      <div className="mt-4 space-y-2">
                        <h4 className="font-semibold text-sm text-gray-900">Repair Steps:</h4>
                        <ol className="list-decimal list-inside space-y-1 text-sm text-gray-700">
                          {message.steps.map((step, idx) => (
                            <li key={idx}>{step}</li>
                          ))}
                        </ol>
                      </div>
                    )}
                    {message.has3DGuide && (
                      <Button
                        onClick={() => handle3DView(message.id)}
                        className="mt-4 w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white"
                        size="sm"
                      >
                        <Cube className="h-4 w-4 mr-2" />
                        View 3D Repair Guide
                      </Button>
                    )}
                    <p className="text-xs mt-2 opacity-70">{new Date(message.timestamp).toLocaleTimeString()}</p>
                  </div>
                  {message.role === "user" && (
                    <Avatar className="h-8 w-8 flex-shrink-0">
                      <AvatarFallback className="bg-gray-200 text-gray-700">You</AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-3 justify-start">
                  <Avatar className="h-8 w-8 flex-shrink-0">
                    <AvatarFallback className="bg-gradient-to-br from-purple-100 to-blue-100 text-purple-600">
                      <BrainCircuit className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin text-purple-600" />
                      <span className="text-sm text-gray-600">Analyzing your issue...</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}

          <Card className="bg-white/80 backdrop-blur-sm border-purple-100 shadow-lg">
            <CardContent className="p-4">
              {attachments.length > 0 && (
                <div className="mb-3 flex gap-2 flex-wrap">
                  {attachments.map((att, idx) => (
                    <div key={idx} className="relative">
                      <div className="w-20 h-20 rounded-lg overflow-hidden border-2 border-purple-200">
                        {att.type === "image" ? (
                          <img
                            src={att.preview || "/placeholder.svg"}
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                            <VideoIcon className="h-6 w-6 text-white" />
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => removeAttachment(idx)}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <div className="flex gap-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  accept="image/*,video/*"
                  multiple
                  className="hidden"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  className="border-purple-200 hover:bg-purple-50"
                >
                  <Upload className="h-4 w-4" />
                </Button>
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && !e.shiftKey && handleSendMessage()}
                  placeholder="Describe your house issue or upload media..."
                  className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  disabled={isLoading}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={(!inputMessage.trim() && attachments.length === 0) || isLoading}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                >
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {show3DView && current3DContent && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full h-[80vh] flex flex-col">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">{current3DContent.title}</h2>
                <p className="text-sm text-gray-600">{current3DContent.description}</p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setShow3DView(false)} className="rounded-full">
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex-1 bg-gradient-to-br from-gray-900 to-gray-800 relative">
              <ThreeDViewer />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function ThreeDViewer() {
  const [isPlaying, setIsPlaying] = useState(true)

  return (
    <div className="w-full h-full flex items-center justify-center relative">
      <div className="text-center text-white">
        <Cube className="h-20 w-20 mx-auto mb-4 animate-spin" style={{ animationDuration: "3s" }} />
        <h3 className="text-2xl font-bold mb-2">3D Repair Visualization</h3>
        <p className="text-gray-300 mb-6">Interactive step-by-step repair guide</p>
        <div className="flex gap-3 justify-center">
          <Button
            onClick={() => setIsPlaying(!isPlaying)}
            className="bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm"
          >
            {isPlaying ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
            {isPlaying ? "Pause" : "Play"}
          </Button>
          <Button className="bg-purple-600 hover:bg-purple-700 text-white">
            <Sparkles className="h-4 w-4 mr-2" />
            Next Step
          </Button>
        </div>
        <p className="text-sm text-gray-400 mt-6">
          3D visualization powered by React Three Fiber
          <br />
          (Full 3D implementation would be integrated here)
        </p>
      </div>
    </div>
  )
}
