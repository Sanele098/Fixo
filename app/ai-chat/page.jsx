"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ArrowLeft, Send, Sparkles, MessageSquare, Trash2, Plus, BrainCircuit, Loader2, Camera, Wrench, Box, Upload, Video, X } from 'lucide-react'
import { useState, useEffect, useRef } from "react"
import { useRouter, useSearchParams } from 'next/navigation'
import { useUser } from "@clerk/nextjs"
import { useMutation, useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import axios from "axios"
import ReactMarkdown from "react-markdown"

export default function AIChat() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, isLoaded } = useUser()
  const messagesEndRef = useRef(null)
  const fileInputRef = useRef(null)
  const hasProcessedInitialMessage = useRef(false)

  const getUser = useQuery(
    api.users.GetUser,
    user?.primaryEmailAddress?.emailAddress ? { email: user.primaryEmailAddress.emailAddress } : "skip",
  )
  const getUserAIChats = useQuery(api.aiChats.GetUserAIChats, getUser?._id ? { userId: getUser._id } : "skip")
  const createAIChat = useMutation(api.aiChats.CreateAIChat)
  const addMessageToChat = useMutation(api.aiChats.AddMessageToChat)
  const deleteAIChat = useMutation(api.aiChats.DeleteAIChat)

  const [selectedChat, setSelectedChat] = useState(null)
  const [showHistory, setShowHistory] = useState(true)
  const [inputValue, setInputValue] = useState("")
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState([])
  const [generatingVideo, setGeneratingVideo] = useState(false)
  const [videoGenerated, setVideoGenerated] = useState(false)
  const [videoData, setVideoData] = useState(null)
  const [isPlayingVideo, setIsPlayingVideo] = useState(false)
  const [videoError, setVideoError] = useState(null)
  const videoRef = useRef(null)

  useEffect(() => {
    if (isLoaded && getUser?._id && !hasProcessedInitialMessage.current) {
      const storedData = sessionStorage.getItem("fixo_initial_chat")

      if (storedData) {
        hasProcessedInitialMessage.current = true
        sessionStorage.removeItem("fixo_initial_chat")

        const chatData = JSON.parse(storedData)
        setShowHistory(false)

        setTimeout(() => {
          handleSendMessageFromHero(chatData)
        }, 500)
      }
    }
  }, [isLoaded, getUser?._id])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  useEffect(() => {
    if (selectedChat) {
      const chat = getUserAIChats?.find((c) => c._id === selectedChat)
      if (chat) {
        setMessages(chat.messages || [])
      }
    } else {
      setMessages([])
    }
  }, [selectedChat, getUserAIChats])

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files || [])
    const validFiles = files.filter((file) => file.type.startsWith("image/") || file.type.startsWith("video/"))

    const fileObjects = validFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      type: file.type.startsWith("image/") ? "image" : "video",
      name: file.name,
    }))

    setUploadedFiles((prev) => [...prev, ...fileObjects])
  }

  const handleRemoveFile = (index) => {
    setUploadedFiles((prev) => {
      const newFiles = [...prev]
      URL.revokeObjectURL(newFiles[index].preview)
      newFiles.splice(index, 1)
      return newFiles
    })
  }

  const handleGenerate3DVideo = async () => {
    if (generatingVideo) {
      setGeneratingVideo(false)
      return
    }

    const userMessages = messages.filter(m => m.role === 'user')
    const lastUserMessage = userMessages[userMessages.length - 1]
    
    // Build context-aware prompt from the actual user's issue
    let videoPrompt = ""
    let imageData = null
    
    if (lastUserMessage?.files && lastUserMessage.files.length > 0) {
      // User attached an image - extract it
      const imageFile = lastUserMessage.files.find(f => f.type === 'image')
      if (imageFile) {
        imageData = imageFile.preview
      }
    }
    
    // Use the user's actual description
    if (lastUserMessage?.content) {
      videoPrompt = lastUserMessage.content
    } else {
      videoPrompt = "home repair tutorial based on the attached image"
    }

    setGeneratingVideo(true)
    setVideoGenerated(false)
    setVideoData(null)
    setVideoError(null)

    try {
      const response = await axios.post("/api/generate-video", {
        prompt: videoPrompt,
        imageData: imageData
      })

      if (response.data.success) {
        setVideoData(response.data)
        setGeneratingVideo(false)
        setVideoGenerated(true)
        
        // Show demo indicator if in demo mode
        if (response.data.isDemo) {
          console.log("[v0] Demo mode: Using sample video for testing UI")
        }
      }
    } catch (error) {
      console.error("Error generating video:", error)
      setGeneratingVideo(false)
      
      if (error.response?.data?.code === "MODEL_NOT_AVAILABLE") {
        setVideoError(
          "⚠️ Veo 3.1 Video Generation Requires Paid Access\n\n" +
          error.response.data.details + "\n\n" +
          "💡 Tip: Enable DEMO_MODE in /app/api/generate-video/route.js to test the video player UI with sample content."
        )
      } else if (error.response?.data?.code === "RATE_LIMIT") {
        setVideoError("⏳ Rate limit reached. Please wait a moment and try again.")
      } else if (error.response?.data?.code === "AUTH_ERROR") {
        setVideoError("🔑 API authentication issue. Please check your API key configuration.")
      } else {
        setVideoError(
          error.response?.data?.error || "I couldn't generate the video at this time. Please try again."
        )
      }
    }
  }

  const handlePlayVideo = () => {
    setIsPlayingVideo(true)
  }

  const handleCloseVideo = () => {
    setIsPlayingVideo(false)
    if (videoRef.current) {
      videoRef.current.pause()
      videoRef.current.currentTime = 0
    }
  }

  const handleSendMessageFromHero = async (chatData) => {
    const userMessage = chatData.message?.trim() || "Can you analyze this image?"
    const hasImage = chatData.hasImage && chatData.image

    const newUserMessage = {
      role: "user",
      content: userMessage,
      timestamp: Date.now(),
    }

    if (hasImage) {
      newUserMessage.image = chatData.image // Store the actual base64 image
      newUserMessage.files = [
        {
          preview: chatData.image,
          type: "image",
          name: "uploaded-image.jpg",
        },
      ]
    }

    setMessages([newUserMessage])

    try {
      const title = userMessage.substring(0, 50) + (userMessage.length > 50 ? "..." : "")
      const chatId = await createAIChat({
        userId: getUser._id,
        title,
        firstMessage: userMessage,
      })
      setSelectedChat(chatId)

      setLoading(true)
      const response = await axios.post("/api/ai-chat", {
        prompt: userMessage,
        imageData: hasImage ? chatData.image : null,
        hasMedia: hasImage,
      })

      const aiMessage = {
        role: "assistant",
        content: response.data.result,
        timestamp: Date.now(),
      }

      setMessages((prev) => [...prev, aiMessage])

      await addMessageToChat({
        chatId,
        role: "assistant",
        content: response.data.result,
      })

      setLoading(false)
    } catch (error) {
      console.error("Error sending message:", error)
      setLoading(false)

      let errorContent = "I apologize, but I encountered an error analyzing your request. Please try again."

      if (error.response?.status === 429) {
        errorContent =
          "⚠️ **API Rate Limit Reached**\n\nI've exceeded my current usage quota. This typically resets within a few moments. Please:\n\n1. Wait about 10-15 seconds\n2. Try your request again\n3. If the issue persists, check your Google API billing settings\n\nI apologize for the inconvenience!"
      } else if (error.response?.status === 401) {
        errorContent =
          "⚠️ **API Configuration Error**\n\nThere's an issue with the API key configuration. Please check that your GOOGLE_API_KEY environment variable is set correctly."
      } else if (error.response?.data?.error) {
        errorContent = `⚠️ **Error**\n\n${error.response.data.error}`
      }

      const errorMessage = {
        role: "assistant",
        content: errorContent,
        timestamp: Date.now(),
        isError: true,
      }
      setMessages((prev) => [...prev, errorMessage])
    }
  }

  const handleSendMessage = async (e) => {
    e.preventDefault()

    if ((!inputValue.trim() && uploadedFiles.length === 0) || loading || !getUser?._id) return

    const userMessage = inputValue.trim() || "Uploaded media for analysis"
    setInputValue("")

    const filesForMessage = uploadedFiles.map((f) => ({
      preview: f.preview,
      type: f.type,
      name: f.name,
    }))
    setUploadedFiles([])

    const newUserMessage = {
      role: "user",
      content: userMessage,
      files: filesForMessage,
      timestamp: Date.now(),
    }
    setMessages((prev) => [...prev, newUserMessage])

    try {
      let chatId = selectedChat

      if (!chatId) {
        const title = userMessage.substring(0, 50) + (userMessage.length > 50 ? "..." : "")
        chatId = await createAIChat({
          userId: getUser._id,
          title,
          firstMessage: userMessage,
        })
        setSelectedChat(chatId)
        setShowHistory(false)
      } else {
        await addMessageToChat({
          chatId,
          role: "user",
          content: userMessage,
        })
      }

      setLoading(true)
      const response = await axios.post("/api/ai-chat", {
        prompt: userMessage,
        hasMedia: filesForMessage.length > 0,
      })

      const aiMessage = {
        role: "assistant",
        content: response.data.result,
        timestamp: Date.now(),
      }

      setMessages((prev) => [...prev, aiMessage])

      await addMessageToChat({
        chatId,
        role: "assistant",
        content: response.data.result,
      })

      setLoading(false)
    } catch (error) {
      console.error("Error sending message:", error)
      setLoading(false)

      let errorContent = "I apologize, but I encountered an error processing your message. Please try again."

      if (error.response?.status === 429) {
        errorContent =
          "⚠️ **API Rate Limit Reached**\n\nI've exceeded my current usage quota. This typically resets within a few moments. Please:\n\n1. Wait about 10-15 seconds\n2. Try your request again\n3. If the issue persists, check your Google API billing settings\n\nI apologize for the inconvenience!"
      } else if (error.response?.status === 401) {
        errorContent =
          "⚠️ **API Configuration Error**\n\nThere's an issue with the API key configuration. Please check that your GOOGLE_API_KEY environment variable is set correctly."
      } else if (error.response?.data?.error) {
        errorContent = `⚠️ **Error**\n\n${error.response.data.error}`
      }

      const errorMessage = {
        role: "assistant",
        content: errorContent,
        timestamp: Date.now(),
        isError: true,
      }
      setMessages((prev) => [...prev, errorMessage])
    }
  }

  const handleNewChat = () => {
    setSelectedChat(null)
    setMessages([])
    setInputValue("")
    setUploadedFiles([])
    setShowHistory(false)
  }

  const handleSelectChat = (chatId) => {
    setSelectedChat(chatId)
    setShowHistory(false)
  }

  const handleDeleteChat = async (chatId) => {
    if (confirm("Are you sure you want to delete this chat?")) {
      await deleteAIChat({ chatId })
      if (selectedChat === chatId) {
        setSelectedChat(null)
        setMessages([])
      }
    }
  }

  const handleBackToDashboard = () => {
    router.push("/dashboard")
  }

  return (
    <div className="h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex flex-col overflow-hidden">
      <header className="bg-white/90 backdrop-blur-lg border-b border-blue-200/50 shadow-sm z-50 flex-shrink-0">
        <div className="max-w-[1800px] mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={handleBackToDashboard}
                className="flex items-center gap-2 hover:bg-blue-50"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-blue-600 rounded-lg flex items-center justify-center">
                  <BrainCircuit className="h-5 w-5 text-white" />
                </div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
                  Fixo AI Assistant
                </h1>
                <Sparkles className="h-5 w-5 text-yellow-500 animate-pulse" />
              </div>
            </div>
            <Button
              onClick={handleNewChat}
              className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 shadow-md"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Chat
            </Button>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-hidden">
        <div className="max-w-[1800px] mx-auto px-6 py-6 h-full">
          <div className="grid lg:grid-cols-[320px_1fr] gap-6 h-full">
            <div className="flex flex-col gap-4 h-full overflow-hidden">
              <Card className="bg-white/90 backdrop-blur-sm border-blue-200/50 shadow-md flex-1 flex flex-col overflow-hidden">
                <CardHeader className="flex-shrink-0 pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <MessageSquare className="h-4 w-4 text-indigo-600" />
                    AI Chat History
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 overflow-y-auto space-y-2 pt-0">
                  {!getUserAIChats || getUserAIChats.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <MessageSquare className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                      <p className="text-sm">No chat history yet</p>
                      <p className="text-xs">Start a conversation!</p>
                    </div>
                  ) : (
                    getUserAIChats.map((chat) => (
                      <div
                        key={chat._id}
                        className={`p-3 rounded-lg cursor-pointer transition-all group ${
                          selectedChat === chat._id
                            ? "bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-300 shadow-sm"
                            : "bg-gray-50 hover:bg-gray-100 border border-transparent"
                        }`}
                        onClick={() => handleSelectChat(chat._id)}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{chat.title}</p>
                            <p className="text-xs text-gray-600">{new Date(chat.createdAt).toLocaleDateString()}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDeleteChat(chat._id)
                            }}
                            className="opacity-0 group-hover:opacity-100 transition-opacity h-7 w-7 p-0"
                          >
                            <Trash2 className="h-3.5 w-3.5 text-red-500" />
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>

              <Card className="bg-white/90 backdrop-blur-sm border-blue-200/50 shadow-md flex-1 flex flex-col overflow-hidden">
                <CardHeader className="flex-shrink-0 pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Box className="h-4 w-4 text-emerald-600" />
                    3D Video Solution
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col items-center justify-center p-4">
                  {videoError ? (
                    <div className="text-center space-y-4 w-full">
                      <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto">
                        <X className="h-8 w-8 text-red-600" />
                      </div>
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <p className="text-sm text-red-800 whitespace-pre-wrap">{videoError}</p>
                      </div>
                      <Button
                        onClick={() => {
                          setVideoError(null)
                        }}
                        variant="outline"
                        size="sm"
                        className="border-slate-300 hover:bg-slate-50"
                      >
                        Try Again
                      </Button>
                    </div>
                  ) : generatingVideo ? (
                    <div className="text-center space-y-4">
                      <div className="relative w-20 h-20 mx-auto">
                        <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-emerald-400 rounded-2xl animate-pulse"></div>
                        <div className="absolute inset-2 bg-white rounded-xl flex items-center justify-center">
                          <Loader2 className="h-8 w-8 text-green-600 animate-spin" />
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 mb-1">Generating 3D Video...</p>
                        <p className="text-xs text-gray-600 mb-4">This may take a few moments</p>
                        <Button
                          onClick={handleGenerate3DVideo}
                          variant="outline"
                          size="sm"
                          className="border-red-300 hover:bg-red-50 text-red-600 bg-transparent"
                        >
                          <X className="h-4 w-4 mr-2" />
                          Stop Generation
                        </Button>
                      </div>
                    </div>
                  ) : videoGenerated && videoData ? (
                    <div className="text-center space-y-4 w-full">
                      <div 
                        className="w-full aspect-video bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 rounded-xl flex items-center justify-center border-2 border-indigo-300 cursor-pointer hover:border-indigo-400 transition-all shadow-lg overflow-hidden relative group"
                        onClick={handlePlayVideo}
                      >
                        <img 
                          src={videoData.thumbnail || "/placeholder.svg?height=200&width=300&query=repair+video+thumbnail"}
                          alt="Video thumbnail"
                          className="w-full h-full object-cover opacity-70"
                        />
                        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-all flex items-center justify-center">
                          <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-xl">
                            <Video className="h-8 w-8 text-indigo-600 ml-1" />
                          </div>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 mb-1">{videoData.title}</p>
                        <p className="text-xs text-gray-600 mb-4">{videoData.description}</p>
                        <div className="flex gap-2 justify-center">
                          <Button
                            onClick={handlePlayVideo}
                            className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700"
                            size="sm"
                          >
                            <Video className="h-4 w-4 mr-2" />
                            Play Video
                          </Button>
                          <Button
                            onClick={() => {
                              setVideoGenerated(false)
                              setVideoData(null)
                            }}
                            variant="outline"
                            size="sm"
                            className="border-slate-300 hover:bg-slate-50"
                          >
                            Generate New
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center space-y-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-green-100 rounded-2xl flex items-center justify-center mx-auto">
                        <Video className="h-8 w-8 text-emerald-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 mb-1">3D Video Generator</p>
                        <p className="text-xs text-gray-600 mb-4">Generate an interactive 3D repair tutorial video</p>
                      </div>
                      <Button
                        onClick={handleGenerate3DVideo}
                        disabled={messages.length === 0}
                        className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 disabled:opacity-50"
                      >
                        <Video className="h-4 w-4 mr-2" />
                        Generate Video
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="flex flex-col h-full overflow-hidden">
              <Card className="bg-white/90 backdrop-blur-sm border-blue-200/50 shadow-md flex-1 flex flex-col overflow-hidden">
                <CardContent className="p-6 flex-1 flex flex-col min-h-0">
                  {showHistory && !selectedChat ? (
                    <div className="flex-1 flex items-center justify-center overflow-y-auto">
                      <div className="text-center max-w-3xl px-4">
                        <h2 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-indigo-100 bg-clip-text text-transparent mb-4">
                          Welcome to Fixo AI
                        </h2>
                        <p className="text-gray-600 text-lg mb-8">
                          I'm your AI-powered home repair assistant. Upload images or videos of your house issues, and
                          I'll provide instant diagnosis and step-by-step repair guides. I can even show you 3D
                          visualizations of how to fix problems!
                        </p>

                        <div className="grid md:grid-cols-3 gap-6 mb-8">
                          <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-2xl p-6 border border-indigo-200 hover:shadow-lg transition-shadow">
                            <div className="w-14 h-14 bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-xl flex items-center justify-center mx-auto mb-4">
                              <Camera className="h-7 w-7 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Upload Media</h3>
                            <p className="text-sm text-gray-600">Share photos or videos of your issue</p>
                          </div>

                          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200 hover:shadow-lg transition-shadow">
                            <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center mx-auto mb-4">
                              <Wrench className="h-7 w-7 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">AI Diagnosis</h3>
                            <p className="text-sm text-gray-600">Get instant problem analysis</p>
                          </div>

                          <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-2xl p-6 border border-cyan-200 hover:shadow-lg transition-shadow">
                            <div className="w-14 h-14 bg-gradient-to-br from-cyan-600 to-cyan-700 rounded-xl flex items-center justify-center mx-auto mb-4">
                              <Box className="h-7 w-7 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">3D Guides</h3>
                            <p className="text-sm text-gray-600">View interactive repair tutorials</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex-1 overflow-y-auto mb-4 space-y-4 pr-2">
                        {messages.length === 0 ? (
                          <div className="flex items-center justify-center h-full text-gray-500">
                            <div className="text-center">
                              <MessageSquare className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                              <p className="text-lg font-medium">Start a conversation</p>
                              <p className="text-sm">Ask me anything about home repairs!</p>
                            </div>
                          </div>
                        ) : (
                          messages.map((message, index) => (
                            <div
                              key={index}
                              className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                            >
                              {message.role === "assistant" && (
                                <Avatar className="h-8 w-8 flex-shrink-0">
                                  <AvatarFallback className="bg-gradient-to-br from-indigo-100 to-blue-100 text-purple-600">
                                    <BrainCircuit className="h-4 w-4" />
                                  </AvatarFallback>
                                </Avatar>
                              )}
                              <div
                                className={`max-w-[70%] rounded-2xl p-4 ${
                                  message.role === "user"
                                    ? "bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-md"
                                    : message.isError
                                      ? "bg-red-50 text-gray-900 border border-red-200"
                                      : "bg-gray-100 text-gray-900 border border-gray-200"
                                }`}
                              >
                                {message.files && message.files.length > 0 && (
                                  <div className="mb-3 grid grid-cols-2 gap-2">
                                    {message.files.map((file, idx) => (
                                      <div key={idx} className="relative rounded-lg overflow-hidden">
                                        {file.type === "image" ? (
                                          <img
                                            src={file.preview || "/placeholder.svg"}
                                            alt="Uploaded"
                                            className="w-full h-24 object-cover"
                                          />
                                        ) : (
                                          <div className="w-full h-24 bg-gray-800 flex items-center justify-center">
                                            <Video className="h-8 w-8 text-white" />
                                          </div>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                )}
                                {message.role === "assistant" ? (
                                  <div className="text-sm prose prose-sm max-w-none">
                                    <ReactMarkdown>{message.content}</ReactMarkdown>
                                  </div>
                                ) : (
                                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                                )}
                              </div>
                              {message.role === "user" && (
                                <Avatar className="h-8 w-8 flex-shrink-0">
                                  <AvatarFallback className="bg-gradient-to-br from-indigo-600 to-blue-600 text-white">
                                    {user?.firstName?.[0] || "U"}
                                  </AvatarFallback>
                                </Avatar>
                              )}
                            </div>
                          ))
                        )}
                        {loading && (
                          <div className="flex gap-3 justify-start">
                            <Avatar className="h-8 w-8 flex-shrink-0">
                              <AvatarFallback className="bg-gradient-to-br from-indigo-100 to-blue-100 text-purple-600">
                                <BrainCircuit className="h-4 w-4" />
                              </AvatarFallback>
                            </Avatar>
                            <div className="bg-gray-100 rounded-2xl p-4 border border-gray-200">
                              <Loader2 className="h-5 w-5 animate-spin text-purple-600" />
                            </div>
                          </div>
                        )}
                        <div ref={messagesEndRef} />
                      </div>

                      {uploadedFiles.length > 0 && (
                        <div className="mb-4 p-3 bg-indigo-50 rounded-lg border border-indigo-200">
                          <div className="flex items-center gap-2 mb-2">
                            <Upload className="h-4 w-4 text-indigo-600" />
                            <span className="text-sm font-medium text-indigo-900">
                              Uploaded Files ({uploadedFiles.length})
                            </span>
                          </div>
                          <div className="grid grid-cols-4 gap-2">
                            {uploadedFiles.map((file, index) => (
                              <div key={index} className="relative group">
                                {file.type === "image" ? (
                                  <img
                                    src={file.preview || "/placeholder.svg"}
                                    alt="Preview"
                                    className="w-full h-20 object-cover rounded-lg"
                                  />
                                ) : (
                                  <div className="w-full h-20 bg-gray-800 rounded-lg flex items-center justify-center">
                                    <Video className="h-6 w-6 text-white" />
                                  </div>
                                )}
                                <button
                                  onClick={() => handleRemoveFile(index)}
                                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <X className="h-4 w-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <form onSubmit={handleSendMessage} className="flex gap-2 pt-4 border-t border-gray-200">
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleFileUpload}
                          accept="image/*,video/*"
                          multiple
                          className="hidden"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => fileInputRef.current?.click()}
                          className="border-indigo-300 hover:bg-indigo-50"
                        >
                          <Upload className="h-5 w-5 text-indigo-600" />
                        </Button>
                        <input
                          type="text"
                          value={inputValue}
                          onChange={(e) => setInputValue(e.target.value)}
                          placeholder="Describe your house issue or upload media..."
                          disabled={loading}
                          className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-100"
                        />
                        <Button
                          type="submit"
                          disabled={(!inputValue.trim() && uploadedFiles.length === 0) || loading}
                          className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 px-6 shadow-md"
                        >
                          {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                        </Button>
                      </form>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {isPlayingVideo && videoData && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl">
            <Button
              onClick={handleCloseVideo}
              className="absolute -top-12 right-0 bg-white/10 hover:bg-white/20 text-white"
              size="sm"
            >
              <X className="h-5 w-5" />
            </Button>
            <div className="bg-gradient-to-br from-slate-900 to-indigo-900 rounded-2xl overflow-hidden shadow-2xl border-2 border-indigo-500/50">
              <div className="aspect-video bg-black">
                {videoData.videoUrl ? (
                  <video
                    ref={videoRef}
                    src={videoData.videoUrl}
                    controls
                    autoPlay
                    className="w-full h-full"
                  >
                    Your browser does not support video playback.
                  </video>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center space-y-4 p-8">
                      <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                        <Video className="h-12 w-12 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-white">{videoData.title}</h3>
                      <p className="text-gray-300">{videoData.description}</p>
                      <p className="text-sm text-gray-400">Duration: {videoData.duration}</p>
                      <div className="pt-4">
                        <p className="text-xs text-gray-500">Video playback will be available once Veo API is fully integrated</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="bg-slate-800/50 p-4 border-t border-slate-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-white">{videoData.title}</p>
                    <p className="text-xs text-gray-300">{videoData.description}</p>
                  </div>
                  {videoData.isDemo && (
                    <span className="px-3 py-1 bg-yellow-500/20 text-yellow-300 text-xs font-medium rounded-full border border-yellow-500/30">
                      Demo Mode
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
