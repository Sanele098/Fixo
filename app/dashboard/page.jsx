"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import {
  Video,
  Wrench,
  User,
  Settings,
  Bell,
  Calendar,
  MessageSquare,
  CreditCard,
  Plus,
  Search,
  Filter,
  Camera,
  Sparkles,
  X,
  BrainCircuit,
  Coins,
  CalendarX,
  Receipt,
  UserCircle,
  Upload,
  Package,
  ArrowLeft,
  Send,
  Trash2,
  CheckCircle,
  Clock,
} from "lucide-react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@clerk/nextjs"
import { useMutation, useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"

export default function CombinedDashboard() {
  const router = useRouter()
  const { user, isLoaded } = useUser()

  // Convex mutations and queries
  const createUser = useMutation(api.users.CreateUser)
  const getUser = useQuery(
    api.users.GetUser,
    user?.primaryEmailAddress?.emailAddress ? { email: user.primaryEmailAddress.emailAddress } : "skip",
  )
  const createRequest = useMutation(api.requests.CreateRequest)
  const getUserRequests = useQuery(api.requests.GetUserRequests, getUser?._id ? { userId: getUser._id } : "skip")
  const updateRequestStatus = useMutation(api.requests.UpdateRequestStatus)
  const deleteRequest = useMutation(api.requests.DeleteRequest)
  const addMessage = useMutation(api.conversations.AddMessage)

  const [selectedActivity, setSelectedActivity] = useState(null) // Moved up to fix lint error

  const getConversation = useQuery(
    api.conversations.GetConversation,
    selectedActivity?.convexId ? { requestId: selectedActivity.convexId } : "skip",
  )

  const [conversationMessage, setConversationMessage] = useState("")

  const [activeSection, setActiveSection] = useState("overview")
  const [showInstantHelpModal, setShowInstantHelpModal] = useState(false)
  const [showHandymanModal, setShowHandymanModal] = useState(false)
  const [showOrderSuppliesModal, setShowOrderSuppliesModal] = useState(false)

  const [formData, setFormData] = useState({
    problemType: "",
    description: "",
    attachments: [],
  })

  const [handymanFormData, setHandymanFormData] = useState({
    serviceType: "",
    description: "",
    attachments: [],
    preferredDate: "",
    preferredTime: "",
  })

  const [recentActivities, setRecentActivities] = useState([])
  const [tokensUsed, setTokensUsed] = useState(750)
  const totalTokens = 1000

  useEffect(() => {
    if (isLoaded && user && !getUser) {
      createUser({
        name: user.fullName || user.firstName || "User",
        email: user.primaryEmailAddress?.emailAddress || "",
        picture: user.imageUrl || "",
        uid: user.id,
      })
    }
  }, [isLoaded, user, getUser, createUser])

  useEffect(() => {
    if (getUserRequests) {
      const activities = getUserRequests.map((request) => ({
        id: request._id,
        convexId: request._id,
        title: request.title,
        description: request.description,
        time: new Date(request.createdAt).toLocaleString(),
        type: request.type,
        attachments: request.attachments || [],
        preferredDate: request.preferredDate,
        preferredTime: request.preferredTime,
        serviceType: request.serviceType,
        problemType: request.problemType,
        icon: request.type === "handyman" ? Wrench : Plus,
        color: request.status === "completed" ? "green" : request.type === "handyman" ? "blue" : "purple",
        status: request.status,
        createdAt: request.createdAt,
        professionalAssigned: request.professionalAssigned,
      }))
      setRecentActivities(activities)
    }
  }, [getUserRequests])

  useEffect(() => {
    if (getUser?.token) {
      setTokensUsed(totalTokens - getUser.token)
    }
  }, [getUser])

  const handleInstantHelp = () => {
    setShowInstantHelpModal(true)
  }

  const handleSubmitRequest = async () => {
    if (formData.problemType && formData.description && getUser?._id) {
      try {
        const attachmentData = formData.attachments.map((file) => ({
          name: file.name,
          type: file.type,
          size: file.size,
        }))

        await createRequest({
          userId: getUser._id,
          type: "instant-help",
          title: `${formData.problemType} Request`,
          description: formData.description,
          problemType: formData.problemType,
          attachments: attachmentData,
        })

        setFormData({
          problemType: "",
          description: "",
          attachments: [],
        })
        setShowInstantHelpModal(false)
      } catch (error) {
        console.error("Error creating request:", error)
      }
    }
  }

  const handleSubmitHandymanRequest = async () => {
    if (handymanFormData.serviceType && handymanFormData.description && getUser?._id) {
      try {
        const attachmentData = handymanFormData.attachments.map((file) => ({
          name: file.name,
          type: file.type,
          size: file.size,
        }))

        await createRequest({
          userId: getUser._id,
          type: "handyman",
          title: `${handymanFormData.serviceType} Service`,
          description: handymanFormData.description,
          serviceType: handymanFormData.serviceType,
          preferredDate: handymanFormData.preferredDate,
          preferredTime: handymanFormData.preferredTime,
          attachments: attachmentData,
        })

        setHandymanFormData({
          serviceType: "",
          description: "",
          attachments: [],
          preferredDate: "",
          preferredTime: "",
        })
        setShowHandymanModal(false)
      } catch (error) {
        console.error("Error creating handyman request:", error)
      }
    }
  }

  const handleActivityClick = (activity) => {
    setSelectedActivity(activity)
  }

  const handleSendMessage = async () => {
    if (conversationMessage.trim() && selectedActivity && getUser?._id) {
      try {
        const newMessage = {
          id: Date.now(),
          text: conversationMessage,
          sender: "user",
          timestamp: new Date().toISOString(),
        }

        await addMessage({
          requestId: selectedActivity.convexId,
          userId: getUser._id,
          message: newMessage,
        })

        setConversationMessage("")
      } catch (error) {
        console.error("Error sending message:", error)
      }
    }
  }

  const handleDeleteActivity = async (activityId) => {
    try {
      await deleteRequest({ requestId: activityId })
      setSelectedActivity(null)
    } catch (error) {
      console.error("Error deleting request:", error)
    }
  }

  const handleMarkAsSorted = async (activityId) => {
    try {
      const activity = recentActivities.find((a) => a.id === activityId)
      if (activity) {
        const statusFlow = {
          logged: "in-analysis",
          "in-analysis": "fixing",
          fixing: "completed",
        }
        const nextStatus = statusFlow[activity.status] || "completed"

        await updateRequestStatus({
          requestId: activityId,
          status: nextStatus,
        })
      }
    } catch (error) {
      console.error("Error updating status:", error)
    }
  }

  const handleStartVideoCall = () => {
    if (!selectedActivity.professionalAssigned) {
      alert("Video call will be available once a professional has been assigned to your request.")
      return
    }
    console.log("Starting video call for activity:", selectedActivity.id)
    alert("Video call feature would be integrated here")
  }

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleFileAttachment = (event) => {
    const files = Array.from(event.target.files)
    setFormData((prev) => ({
      ...prev,
      attachments: [...prev.attachments, ...files],
    }))
  }

  const removeAttachment = (index) => {
    setFormData((prev) => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index),
    }))
  }

  const handleHandymanInputChange = (field, value) => {
    setHandymanFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleHandymanFileAttachment = (event) => {
    const files = Array.from(event.target.files)
    setHandymanFormData((prev) => ({
      ...prev,
      attachments: [...prev.attachments, ...files],
    }))
  }

  const removeHandymanAttachment = (index) => {
    setHandymanFormData((prev) => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index),
    }))
  }

  const handleAIConversation = () => {
    router.push("/ai-chat")
  }

  const getStatusDisplay = (status) => {
    const statusConfig = {
      logged: { label: "Logged", color: "bg-gray-100 text-gray-700" },
      "in-analysis": { label: "In Analysis", color: "bg-yellow-100 text-yellow-700" },
      fixing: { label: "Fixing", color: "bg-blue-100 text-blue-700" },
      completed: { label: "Completed", color: "bg-green-100 text-green-700" },
    }
    return statusConfig[status] || statusConfig.logged
  }

  const renderEmptyState = (section, icon, message) => {
    const IconComponent = icon
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center mb-4">
          <IconComponent className="w-8 h-8 text-purple-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No {section} Yet</h3>
        <p className="text-gray-600 max-w-sm">{message}</p>
      </div>
    )
  }

  const renderActivityDetail = () => {
    if (!selectedActivity) return null

    const activityConversation = getConversation?.messages || []

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between mb-4">
          <Button variant="outline" onClick={() => setSelectedActivity(null)} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <Button
            onClick={handleStartVideoCall}
            disabled={!selectedActivity.professionalAssigned}
            className={`flex items-center gap-2 ${
              selectedActivity.professionalAssigned
                ? "bg-green-600 hover:bg-green-700"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            <Video className="h-4 w-4" />
            {selectedActivity.professionalAssigned ? "Start Video Call" : "Awaiting Professional"}
          </Button>
        </div>

        <div className="bg-white rounded-lg border p-4 mb-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
              <selectedActivity.icon className="w-5 h-5 text-purple-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">{selectedActivity.title}</h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm text-gray-600">{selectedActivity.time}</span>
                <span className={`px-2 py-1 text-xs rounded-full ${getStatusDisplay(selectedActivity.status).color}`}>
                  {getStatusDisplay(selectedActivity.status).label}
                </span>
              </div>
            </div>
          </div>

          {selectedActivity.type === "handyman" && (
            <div className="mt-4">
              <h4 className="font-medium text-gray-700 mb-1">Service Details:</h4>
              <p className="text-sm text-gray-900">
                <strong>Service Type:</strong> {selectedActivity.serviceType}
              </p>
              <p className="text-sm text-gray-900">
                <strong>Preferred Date:</strong> {selectedActivity.preferredDate}
              </p>
              <p className="text-sm text-gray-900">
                <strong>Preferred Time:</strong> {selectedActivity.preferredTime}
              </p>
            </div>
          )}

          <div className="mt-4">
            <h4 className="font-medium text-gray-700 mb-1">Description:</h4>
            <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg">{selectedActivity.description}</p>
          </div>

          {selectedActivity.attachments && selectedActivity.attachments.length > 0 && (
            <div className="mt-4">
              <h4 className="font-medium text-gray-700 mb-1">Attachments:</h4>
              <div className="grid grid-cols-2 gap-2">
                {selectedActivity.attachments.map((file, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                    {file.type?.startsWith("image/") ? (
                      <Camera className="h-4 w-4 text-green-600" />
                    ) : (
                      <Video className="h-4 w-4 text-blue-600" />
                    )}
                    <span className="text-sm text-gray-700 truncate">{file.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-2 mt-6">
            {selectedActivity.status !== "completed" && (
              <Button
                onClick={() => handleMarkAsSorted(selectedActivity.id)}
                variant="outline"
                className="border-green-200 hover:bg-green-50"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Mark as Sorted
              </Button>
            )}
            <Button
              onClick={() => handleDeleteActivity(selectedActivity.id)}
              variant="outline"
              className="border-red-200 hover:bg-red-50 text-red-600"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>

        <Card className="bg-white/80 backdrop-blur-sm border-purple-100 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-purple-600" />
              Conversation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="h-64 overflow-y-auto border border-gray-200 rounded-lg p-4 bg-gray-50">
                {activityConversation.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    <div className="text-center">
                      <MessageSquare className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                      <p>No messages yet. Start a conversation!</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {activityConversation.map((message) => (
                      <div key={message.id} className="flex gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-purple-100 text-purple-600">
                            {message.sender === "user" ? "You" : "Pro"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="bg-white p-3 rounded-lg shadow-sm">
                            <p className="text-sm">{message.text}</p>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(message.timestamp).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={conversationMessage}
                  onChange={(e) => setConversationMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!conversationMessage.trim()}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex flex-col">
      <header className="bg-white/80 backdrop-blur-md border-b border-purple-100 sticky top-0 z-50 flex-shrink-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">F</span>
              </div>
              <h1 className="text-xl font-bold text-gray-900">Fixo Dashboard</h1>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm">
                <Bell className="h-4 w-4" />
              </Button>
              <Avatar>
                <AvatarImage src={user?.imageUrl || "/placeholder.svg"} />
                <AvatarFallback>{user?.firstName?.[0] || "U"}</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 h-full">
          <div className="grid lg:grid-cols-4 gap-8 h-full">
            <div className="lg:col-span-1 space-y-6 overflow-y-auto">
              <Card className="bg-white/80 backdrop-blur-sm border-purple-100 shadow-sm">
                <CardContent className="p-4">
                  <nav className="space-y-2">
                    <Button
                      variant={activeSection === "overview" ? "default" : "ghost"}
                      className={`w-full justify-start ${
                        activeSection === "overview"
                          ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white"
                          : "hover:bg-purple-50"
                      }`}
                      onClick={() => setActiveSection("overview")}
                    >
                      <User className="h-4 w-4 mr-2" />
                      Overview
                    </Button>
                    <Button
                      variant={activeSection === "sessions" ? "default" : "ghost"}
                      className={`w-full justify-start ${
                        activeSection === "sessions"
                          ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white"
                          : "hover:bg-purple-50"
                      }`}
                      onClick={() => setActiveSection("sessions")}
                    >
                      <Video className="h-4 w-4 mr-2" />
                      My Sessions
                    </Button>
                    <Button
                      variant={activeSection === "appointments" ? "default" : "ghost"}
                      className={`w-full justify-start ${
                        activeSection === "appointments"
                          ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white"
                          : "hover:bg-purple-50"
                      }`}
                      onClick={() => setActiveSection("appointments")}
                    >
                      <Calendar className="h-4 w-4 mr-2" />
                      Appointments
                    </Button>
                    <Button
                      variant={activeSection === "billing" ? "default" : "ghost"}
                      className={`w-full justify-start ${
                        activeSection === "billing"
                          ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white"
                          : "hover:bg-purple-50"
                      }`}
                      onClick={() => setActiveSection("billing")}
                    >
                      <CreditCard className="h-4 w-4 mr-2" />
                      Billing
                    </Button>
                    <Button
                      variant={activeSection === "profile" ? "default" : "ghost"}
                      className={`w-full justify-start ${
                        activeSection === "profile"
                          ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white"
                          : "hover:bg-purple-50"
                      }`}
                      onClick={() => setActiveSection("profile")}
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Profile
                    </Button>
                  </nav>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200 shadow-sm">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <Coins className="h-5 w-5 text-blue-600" />
                    <CardTitle className="text-lg text-blue-800">AI Tokens</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-blue-700">Used: {tokensUsed}</span>
                      <span className="text-blue-700">Total: {totalTokens}</span>
                    </div>
                    <Progress value={(tokensUsed / totalTokens) * 100} className="h-2 bg-blue-100" />
                    <div className="flex justify-between text-xs text-blue-600">
                      <span>{totalTokens - tokensUsed} remaining</span>
                      <span>{Math.round((tokensUsed / totalTokens) * 100)}%</span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full border-blue-300 text-blue-700 hover:bg-blue-100 bg-transparent"
                    >
                      Buy More Tokens
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-3 overflow-y-auto">
              {selectedActivity ? (
                renderActivityDetail()
              ) : (
                <>
                  {activeSection === "overview" && (
                    <div className="space-y-6 h-full flex flex-col">
                      <div className="grid md:grid-cols-3 gap-4 flex-shrink-0">
                        <Card
                          className="bg-white/80 backdrop-blur-sm border-purple-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                          onClick={handleInstantHelp}
                        >
                          <CardContent className="p-4 text-center">
                            <Video className="h-8 w-8 text-purple-600 mx-auto mb-3" />
                            <h3 className="font-semibold mb-2">Get Instant Help</h3>
                            <p className="text-sm text-gray-600">Connect with an expert now</p>
                          </CardContent>
                        </Card>
                        <Card
                          className="bg-white/80 backdrop-blur-sm border-purple-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                          onClick={() => setShowHandymanModal(true)}
                        >
                          <CardContent className="p-4 text-center">
                            <Wrench className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                            <h3 className="font-semibold mb-2">Book Handyman</h3>
                            <p className="text-sm text-gray-600">Schedule on-site service</p>
                          </CardContent>
                        </Card>
                        <Card
                          className="bg-white/80 backdrop-blur-sm border-purple-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                          onClick={() => setShowOrderSuppliesModal(true)}
                        >
                          <CardContent className="p-4 text-center">
                            <Package className="h-8 w-8 text-green-600 mx-auto mb-3" />
                            <h3 className="font-semibold mb-2">Order Supplies</h3>
                            <p className="text-sm text-gray-600">Get materials delivered</p>
                            <Badge className="mt-2 text-xs bg-yellow-100 text-yellow-700 rounded-xl">Coming Soon</Badge>
                          </CardContent>
                        </Card>
                      </div>

                      <div className="grid lg:grid-cols-2 gap-6 flex-1 min-h-0">
                        <div className="space-y-3">
                          <h3 className="text-lg font-semibold text-gray-900">Fixo AI</h3>
                          <Card className="bg-white/80 backdrop-blur-sm border-purple-100 shadow-sm">
                            <CardContent className="p-4">
                              <div className="flex items-center gap-2 mb-3">
                                <BrainCircuit className="h-6 w-6 text-purple-600" />
                                <Sparkles className="h-6 w-6 text-yellow-500" />
                              </div>
                              <p className="text-sm text-gray-900 leading-relaxed mb-3">
                                Our AI-powered diagnostic tool will instantly analyze your home repair issues and
                                provide step-by-step solutions.
                              </p>
                              <div className="space-y-2 text-sm text-gray-600 mb-4">
                                <div className="flex items-center gap-2">
                                  <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                                  <span>Instant problem diagnosis</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                                  <span>Step-by-step repair guides</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                                  <span>24/7 availability</span>
                                </div>
                              </div>
                              <Button
                                onClick={handleAIConversation}
                                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                              >
                                <MessageSquare className="h-4 w-4 mr-2" />
                                Start Conversation with AI
                              </Button>
                            </CardContent>
                          </Card>
                        </div>

                        <div className="space-y-3 flex flex-col min-h-0">
                          <h3 className="text-lg font-semibold text-gray-900">Recent Activities</h3>
                          <Card className="bg-white/80 backdrop-blur-sm border-purple-100 shadow-sm flex-1">
                            <CardContent className="p-4 h-full">
                              {recentActivities.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-center">
                                  <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center mb-4">
                                    <Clock className="w-8 h-8 text-purple-600" />
                                  </div>
                                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Recent Activities</h3>
                                  <p className="text-gray-600 max-w-sm">
                                    You haven't submitted any requests yet. Click "Get Instant Help" to start your first
                                    request.
                                  </p>
                                </div>
                              ) : (
                                <div className="space-y-4">
                                  {recentActivities.map((activity) => {
                                    const IconComponent = activity.icon
                                    const colorClasses = {
                                      purple: "bg-purple-100 text-purple-600",
                                      blue: "bg-blue-100 text-blue-600",
                                      green: "bg-green-100 text-green-600",
                                    }
                                    const statusDisplay = getStatusDisplay(activity.status)

                                    return (
                                      <div
                                        key={activity.id}
                                        className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                                        onClick={() => handleActivityClick(activity)}
                                      >
                                        <div
                                          className={`w-8 h-8 rounded-full flex items-center justify-center ${colorClasses[activity.color]}`}
                                        >
                                          <IconComponent className="w-4 h-4" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                          <div className="flex items-center gap-2">
                                            <p className="text-sm font-medium text-gray-900 truncate">
                                              {activity.title}
                                            </p>
                                            <span className={`px-2 py-1 text-xs rounded-full ${statusDisplay.color}`}>
                                              {statusDisplay.label}
                                            </span>
                                          </div>
                                          <p className="text-xs text-gray-600 truncate">
                                            {activity.description} • {activity.time}
                                          </p>
                                        </div>
                                        <div className="text-xs text-gray-400">Click to view</div>
                                      </div>
                                    )
                                  })}
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeSection === "sessions" && (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-gray-900">My Sessions</h2>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-purple-200 hover:bg-purple-50 bg-transparent"
                          >
                            <Filter className="h-4 w-4 mr-2" />
                            Filter
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-purple-200 hover:bg-purple-50 bg-transparent"
                          >
                            <Search className="h-4 w-4 mr-2" />
                            Search
                          </Button>
                        </div>
                      </div>

                      <Card className="bg-white/80 backdrop-blur-sm border-purple-100 shadow-sm">
                        <CardContent className="p-6">
                          {renderEmptyState(
                            "sessions",
                            Video,
                            "You haven't had any video sessions yet. Submit a request to get matched with an expert.",
                          )}
                        </CardContent>
                      </Card>
                    </div>
                  )}

                  {activeSection === "appointments" && (
                    <div className="space-y-6">
                      <h2 className="text-2xl font-bold text-gray-900">Appointments</h2>
                      <Card className="bg-white/80 backdrop-blur-sm border-purple-100 shadow-sm">
                        <CardContent className="p-6">
                          {renderEmptyState(
                            "appointments",
                            CalendarX,
                            "You have no appointments scheduled. Book a handyman or schedule an expert consultation to get started.",
                          )}
                        </CardContent>
                      </Card>
                    </div>
                  )}

                  {activeSection === "billing" && (
                    <div className="space-y-6">
                      <h2 className="text-2xl font-bold text-gray-900">Billing & Payments</h2>
                      <div className="grid md:grid-cols-2 gap-6">
                        <Card className="bg-white/80 backdrop-blur-sm border-purple-100 shadow-sm">
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <Receipt className="h-5 w-5 text-purple-600" />
                              Recent Transactions
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-3">
                              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                <div>
                                  <p className="font-medium">Plumbing Consultation</p>
                                  <p className="text-sm text-gray-600">Jan 15, 2024</p>
                                </div>
                                <span className="font-semibold text-green-600">$45.00</span>
                              </div>
                              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                <div>
                                  <p className="font-medium">AI Tokens Purchase</p>
                                  <p className="text-sm text-gray-600">Jan 10, 2024</p>
                                </div>
                                <span className="font-semibold text-green-600">$19.99</span>
                              </div>
                              <div className="flex justify-between items-center py-2">
                                <div>
                                  <p className="font-medium">HVAC Diagnosis</p>
                                  <p className="text-sm text-gray-600">Jan 8, 2024</p>
                                </div>
                                <span className="font-semibold text-green-600">$75.00</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        <Card className="bg-white/80 backdrop-blur-sm border-purple-100 shadow-sm">
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <CreditCard className="h-5 w-5 text-blue-600" />
                              Payment Methods
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-3">
                              <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                                    <CreditCard className="h-4 w-4 text-blue-600" />
                                  </div>
                                  <div>
                                    <p className="font-medium">•••• •••• •••• 4242</p>
                                    <p className="text-sm text-gray-600">Expires 12/26</p>
                                  </div>
                                </div>
                                <Badge variant="secondary">Primary</Badge>
                              </div>
                              <Button
                                variant="outline"
                                className="w-full border-purple-200 hover:bg-purple-50 bg-transparent"
                              >
                                <Plus className="h-4 w-4 mr-2" />
                                Add Payment Method
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  )}

                  {activeSection === "profile" && (
                    <div className="space-y-6">
                      <h2 className="text-2xl font-bold text-gray-900">Profile Settings</h2>
                      <div className="grid md:grid-cols-2 gap-6">
                        <Card className="bg-white/80 backdrop-blur-sm border-purple-100 shadow-sm">
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <UserCircle className="h-5 w-5 text-purple-600" />
                              Personal Information
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div>
                              <label className="text-sm font-medium text-gray-700">Full Name</label>
                              <p className="mt-1 text-gray-900">{user?.fullName || "User"}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-700">Email</label>
                              <p className="mt-1 text-gray-900">{user?.primaryEmailAddress?.emailAddress}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-700">Phone</label>
                              <p className="mt-1 text-gray-900">+1 (555) 123-4567</p>
                            </div>
                            <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                              Edit Profile
                            </Button>
                          </CardContent>
                        </Card>

                        <Card className="bg-white/80 backdrop-blur-sm border-purple-100 shadow-sm">
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <Settings className="h-5 w-5 text-blue-600" />
                              Preferences
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">Email Notifications</span>
                              <Button variant="outline" size="sm">
                                Enabled
                              </Button>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">SMS Alerts</span>
                              <Button variant="outline" size="sm">
                                Disabled
                              </Button>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">Auto-book Handymen</span>
                              <Button variant="outline" size="sm">
                                Disabled
                              </Button>
                            </div>
                            <Button
                              variant="outline"
                              className="w-full border-purple-200 hover:bg-purple-50 bg-transparent"
                            >
                              Manage All Settings
                            </Button>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {showInstantHelpModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Get Instant Help</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowInstantHelpModal(false)}
                  className="rounded-full"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Problem Type</label>
                  <select
                    value={formData.problemType}
                    onChange={(e) => handleInputChange("problemType", e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">Select problem type</option>
                    <option value="Plumbing">Plumbing</option>
                    <option value="Electrical">Electrical</option>
                    <option value="HVAC">HVAC</option>
                    <option value="Appliance">Appliance</option>
                    <option value="General Maintenance">General Maintenance</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    placeholder="Describe your problem in detail..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent h-24 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Attachments (Optional)</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                    <input
                      type="file"
                      multiple
                      accept="image/*,video/*"
                      onChange={handleFileAttachment}
                      className="hidden"
                      id="file-upload"
                    />
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <div className="text-center">
                        <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">Click to upload images or videos</p>
                        <p className="text-xs text-gray-500">PNG, JPG, MP4 up to 10MB</p>
                      </div>
                    </label>
                  </div>

                  {formData.attachments.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {formData.attachments.map((file, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                          <span className="text-sm text-gray-700 truncate">{file.name}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeAttachment(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-xs text-blue-700">
                    <strong>Note:</strong> All work is performed under the supervision of a licensed professional.
                  </p>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button variant="outline" onClick={() => setShowInstantHelpModal(false)} className="flex-1">
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSubmitRequest}
                    disabled={!formData.problemType || !formData.description}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  >
                    Submit Request
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showHandymanModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Book Handyman</h2>
                <Button variant="ghost" size="sm" onClick={() => setShowHandymanModal(false)} className="rounded-full">
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Service Type</label>
                  <select
                    value={handymanFormData.serviceType}
                    onChange={(e) => handleHandymanInputChange("serviceType", e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select service type</option>
                    <option value="Plumbing Repair">Plumbing Repair</option>
                    <option value="Electrical Work">Electrical Work</option>
                    <option value="HVAC Service">HVAC Service</option>
                    <option value="Appliance Installation">Appliance Installation</option>
                    <option value="General Repairs">General Repairs</option>
                    <option value="Furniture Assembly">Furniture Assembly</option>
                    <option value="Painting">Painting</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Service Description</label>
                  <textarea
                    value={handymanFormData.description}
                    onChange={(e) => handleHandymanInputChange("description", e.target.value)}
                    placeholder="Describe the work you need done..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-24 resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Date</label>
                    <input
                      type="date"
                      value={handymanFormData.preferredDate}
                      onChange={(e) => handleHandymanInputChange("preferredDate", e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Time</label>
                    <select
                      value={handymanFormData.preferredTime}
                      onChange={(e) => handleHandymanInputChange("preferredTime", e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select time</option>
                      <option value="Morning (8AM-12PM)">Morning (8AM-12PM)</option>
                      <option value="Afternoon (12PM-5PM)">Afternoon (12PM-5PM)</option>
                      <option value="Evening (5PM-8PM)">Evening (5PM-8PM)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Photos (Optional)</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                    <input
                      type="file"
                      multiple
                      accept="image/*,video/*"
                      onChange={handleHandymanFileAttachment}
                      className="hidden"
                      id="handyman-file-upload"
                    />
                    <label htmlFor="handyman-file-upload" className="cursor-pointer">
                      <div className="text-center">
                        <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">Upload photos of the area/issue</p>
                        <p className="text-xs text-gray-500">PNG, JPG, MP4 up to 10MB</p>
                      </div>
                    </label>
                  </div>

                  {handymanFormData.attachments.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {handymanFormData.attachments.map((file, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                          <span className="text-sm text-gray-700 truncate">{file.name}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeHandymanAttachment(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-xs text-blue-700">
                    <strong>Note:</strong> All work is performed under the supervision of a licensed professional.
                  </p>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button variant="outline" onClick={() => setShowHandymanModal(false)} className="flex-1">
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSubmitHandymanRequest}
                    disabled={!handymanFormData.serviceType || !handymanFormData.description}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    Book Service
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showOrderSuppliesModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Order Supplies</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowOrderSuppliesModal(false)}
                  className="rounded-full"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="text-center py-8">
                <Package className="h-16 w-16 text-green-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Order Repair Supplies</h3>
                <p className="text-gray-600 mb-4">Get all the materials you need delivered directly to your door.</p>
                <Badge className="mb-6 text-sm bg-yellow-100 text-yellow-700 rounded-xl px-3 py-1">Coming Soon</Badge>
                <p className="text-sm text-gray-500 mb-6">
                  We're working on partnerships with major suppliers to bring you the best prices and fastest delivery.
                </p>
                <Button variant="outline" className="w-full border-green-200 hover:bg-green-50 bg-transparent" disabled>
                  Notify Me When Available
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
