"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  ArrowLeft,
  Send,
  Sparkles,
  MessageSquare,
  Trash2,
  Plus,
  BrainCircuit,
  Loader2,
  Camera,
  Wrench,
  Box,
  Upload,
  Video,
  X,
  Play,
} from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@clerk/nextjs"
import { useMutation, useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import axios from "axios"
import ReactMarkdown from "react-markdown"

export default function AIChat() {
  const router = useRouter()
  const { user, isLoaded } = useUser()
  const messagesEndRef = useRef(null)
  const fileInputRef = useRef(null)

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
  const [videoError, setVideoError] = useState(false)

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Load selected chat messages
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

  const handleGenerate3DVideo = () => {
    setGeneratingVideo(true)
    setVideoError(false)

    // Simulate video generation (no actual API call as requested)
    setTimeout(() => {
      setGeneratingVideo(false)
      setVideoError(true)
    }, 3000)
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

    // Add user message to UI immediately
    const newUserMessage = {
      role: "user",
      content: userMessage,
      files: filesForMessage,
      timestamp: Date.now(),
    }
    setMessages((prev) => [...prev, newUserMessage])

    try {
      let chatId = selectedChat

      // Create new chat if none selected
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
        // Add user message to existing chat
        await addMessageToChat({
          chatId,
          role: "user",
          content: userMessage,
        })
      }

      // Get AI response
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

      // Add AI message to UI
      setMessages((prev) => [...prev, aiMessage])

      // Save AI message to Convex
      await addMessageToChat({
        chatId,
        role: "assistant",
        content: response.data.result,
      })

      setLoading(false)
    } catch (error) {
      console.error("Error sending message:", error)
      setLoading(false)
      alert("Failed to send message. Please try again.")
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
    <div className="h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 flex flex-col overflow-hidden">
      <header className="bg-white/90 backdrop-blur-lg border-b border-purple-200/50 shadow-sm z-50 flex-shrink-0">
        <div className="max-w-[1800px] mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={handleBackToDashboard}
                className="flex items-center gap-2 hover:bg-purple-100"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                  <BrainCircuit className="h-5 w-5 text-white" />
                </div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  Fixo AI Assistant
                </h1>
                <Sparkles className="h-5 w-5 text-yellow-500 animate-pulse" />
              </div>
            </div>
            <Button
              onClick={handleNewChat}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-md"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Chat
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <div className="max-w-[1800px] mx-auto px-6 py-6 h-full">
          <div className="grid lg:grid-cols-[320px_1fr] gap-6 h-full">
            <div className="flex flex-col gap-4 h-full overflow-hidden">
              {/* Chat History - Top Half */}
              <Card className="bg-white/90 backdrop-blur-sm border-purple-200/50 shadow-md flex-1 flex flex-col overflow-hidden">
                <CardHeader className="flex-shrink-0 pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <MessageSquare className="h-4 w-4 text-purple-600" />
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
                            ? "bg-gradient-to-r from-purple-100 to-blue-100 border border-purple-300 shadow-sm"
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

              <Card className="bg-white/90 backdrop-blur-sm border-purple-200/50 shadow-md flex-1 flex flex-col overflow-hidden">
                <CardHeader className="flex-shrink-0 pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Box className="h-4 w-4 text-green-600" />
                    3D Video Solution
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col items-center justify-center p-4">
                  {!generatingVideo && !videoError ? (
                    <div className="text-center space-y-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl flex items-center justify-center mx-auto">
                        <Box className="h-8 w-8 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 mb-1">Generate 3D Tutorial</p>
                        <p className="text-xs text-gray-600 mb-4">Create an interactive video guide</p>
                      </div>
                      <Button
                        onClick={handleGenerate3DVideo}
                        disabled={!selectedChat || messages.length === 0}
                        className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Play className="h-4 w-4 mr-2" />
                        Generate Video
                      </Button>
                      {(!selectedChat || messages.length === 0) && (
                        <p className="text-xs text-gray-500 mt-2">Start a conversation to enable</p>
                      )}
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
                        <p className="text-sm font-medium text-gray-900 mb-1">Creating 3D Video...</p>
                        <p className="text-xs text-gray-600">This may take a moment</p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center space-y-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-red-100 to-orange-100 rounded-2xl flex items-center justify-center mx-auto">
                        <X className="h-8 w-8 text-red-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 mb-1">Video Generation Failed</p>
                        <p className="text-xs text-gray-600 mb-4">Could not create 3D solution video at this time</p>
                      </div>
                      <Button
                        onClick={handleGenerate3DVideo}
                        variant="outline"
                        className="border-green-300 hover:bg-green-50 bg-transparent"
                      >
                        Try Again
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Right Side - Chat Area */}
            <div className="flex flex-col h-full overflow-hidden">
              <Card className="bg-white/90 backdrop-blur-sm border-purple-200/50 shadow-md flex-1 flex flex-col overflow-hidden">
                <CardContent className="p-6 flex-1 flex flex-col min-h-0">
                  {showHistory && !selectedChat ? (
                    <div className="flex-1 flex items-center justify-center overflow-y-auto">
                      <div className="text-center max-w-3xl px-4">
                        <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
                          Welcome to Fixo AI
                        </h2>
                        <p className="text-gray-600 text-lg mb-8">
                          I'm your AI-powered home repair assistant. Upload images or videos of your house issues, and
                          I'll provide instant diagnosis and step-by-step repair guides. I can even show you 3D
                          visualizations of how to fix problems!
                        </p>

                        <div className="grid md:grid-cols-3 gap-6 mb-8">
                          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 border border-purple-200 hover:shadow-lg transition-shadow">
                            <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                              <Camera className="h-7 w-7 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Upload Media</h3>
                            <p className="text-sm text-gray-600">Share photos or videos of your issue</p>
                          </div>

                          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200 hover:shadow-lg transition-shadow">
                            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                              <Wrench className="h-7 w-7 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">AI Diagnosis</h3>
                            <p className="text-sm text-gray-600">Get instant problem analysis</p>
                          </div>

                          <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl p-6 border border-green-200 hover:shadow-lg transition-shadow">
                            <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-4">
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
                                  <AvatarFallback className="bg-gradient-to-br from-purple-100 to-blue-100 text-purple-600">
                                    <BrainCircuit className="h-4 w-4" />
                                  </AvatarFallback>
                                </Avatar>
                              )}
                              <div
                                className={`max-w-[70%] rounded-2xl p-4 ${
                                  message.role === "user"
                                    ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-md"
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
                                  <AvatarFallback className="bg-gradient-to-br from-purple-600 to-blue-600 text-white">
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
                              <AvatarFallback className="bg-gradient-to-br from-purple-100 to-blue-100 text-purple-600">
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
                        <div className="mb-4 p-3 bg-purple-50 rounded-lg border border-purple-200">
                          <div className="flex items-center gap-2 mb-2">
                            <Upload className="h-4 w-4 text-purple-600" />
                            <span className="text-sm font-medium text-purple-900">
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
                          className="border-purple-300 hover:bg-purple-50"
                        >
                          <Upload className="h-5 w-5 text-purple-600" />
                        </Button>
                        <input
                          type="text"
                          value={inputValue}
                          onChange={(e) => setInputValue(e.target.value)}
                          placeholder="Describe your house issue or upload media..."
                          disabled={loading}
                          className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-100"
                        />
                        <Button
                          type="submit"
                          disabled={(!inputValue.trim() && uploadedFiles.length === 0) || loading}
                          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 px-6 shadow-md"
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
    </div>
  )
}
