"use client"

import { Button } from "@/components/ui/button"
import { Video, DollarSign, Users, Home, Briefcase, MessageCircle, MapPin, Search } from "lucide-react"
import { useState } from "react"
import { useAuth, SignInButton } from "@clerk/nextjs"
import { useRouter } from "next/navigation"

export default function ProfessionalDashboard() {
  const [activeTab, setActiveTab] = useState("available")
  const [selectedIssue, setSelectedIssue] = useState(null)
  const [filterStatus, setFilterStatus] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const { isSignedIn } = useAuth()
  const router = useRouter()

  const [availableIssues, setAvailableIssues] = useState([
    {
      id: 1,
      type: "Plumbing",
      title: "Leaky Kitchen Faucet",
      description: "Kitchen faucet has been dripping constantly for 2 days. Water pressure seems low.",
      status: "Logged",
      priority: "Normal",
      clientName: "Sarah Johnson",
      location: "Melbourne, VIC",
      timePosted: "2 hours ago",
      estimatedPay: "$45-65",
      attachments: ["kitchen-faucet.jpg"],
      preferredMethod: "Video Call",
    },
    {
      id: 2,
      type: "Electrical",
      title: "Power Outlet Not Working",
      description: "Bedroom power outlet stopped working suddenly. Other outlets in room work fine.",
      status: "Logged",
      priority: "Urgent",
      clientName: "Mike Chen",
      location: "Sydney, NSW",
      timePosted: "45 minutes ago",
      estimatedPay: "$60-80",
      attachments: ["outlet-photo.jpg"],
      preferredMethod: "On-site Visit",
    },
    {
      id: 3,
      type: "Carpentry",
      title: "Squeaky Floorboards",
      description: "Several floorboards in living room are squeaking when walked on.",
      status: "Logged",
      priority: "Low",
      clientName: "Emma Wilson",
      location: "Brisbane, QLD",
      timePosted: "1 day ago",
      estimatedPay: "$40-55",
      attachments: [],
      preferredMethod: "Video Call",
    },
  ])

  const [myJobs, setMyJobs] = useState([
    {
      id: 4,
      type: "Plumbing",
      title: "Blocked Bathroom Drain",
      description: "Bathroom sink draining very slowly, water backing up.",
      status: "In-Analysis",
      priority: "Normal",
      clientName: "David Brown",
      location: "Perth, WA",
      timeAccepted: "1 hour ago",
      estimatedPay: "$50-70",
      attachments: ["drain-photo.jpg"],
      preferredMethod: "Video Call",
      messages: [
        { sender: "client", message: "Hi, thanks for accepting my request!", time: "1 hour ago" },
        {
          sender: "professional",
          message: "No problem! I can see the photos. Let's start with a video call to assess the situation.",
          time: "55 minutes ago",
        },
      ],
    },
  ])

  const acceptIssue = (issue) => {
    setAvailableIssues((prev) => prev.filter((i) => i.id !== issue.id))
    setMyJobs((prev) => [
      ...prev,
      {
        ...issue,
        status: "In-Analysis",
        timeAccepted: "Just now",
        messages: [
          {
            sender: "system",
            message: "Professional has accepted your request and will contact you shortly.",
            time: "Just now",
          },
        ],
      },
    ])
  }

  const startVideoCall = (issue) => {
    alert(`Starting video call with ${issue.clientName}...`)
  }

  const updateJobStatus = (jobId, newStatus) => {
    setMyJobs((prev) => prev.map((job) => (job.id === jobId ? { ...job, status: newStatus } : job)))
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "Logged":
        return "bg-blue-100 text-blue-800"
      case "In-Analysis":
        return "bg-yellow-100 text-yellow-800"
      case "Fixing":
        return "bg-orange-100 text-orange-800"
      case "Completed":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "Emergency":
        return "text-red-600"
      case "Urgent":
        return "text-orange-600"
      case "Normal":
        return "text-blue-600"
      case "Low":
        return "text-gray-600"
      default:
        return "text-gray-600"
    }
  }

  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-6">
          <h1 className="text-3xl font-bold text-foreground">Professional Dashboard</h1>
          <p className="text-muted-foreground">Please sign in to access your professional dashboard</p>
          <SignInButton mode="modal" forceRedirectUrl="/professional-dashboard">
            <Button size="lg" className="gradient-purple">
              Sign In as Professional
            </Button>
          </SignInButton>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-white/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-foreground">Professional Dashboard</h1>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                Available for work
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="font-semibold">John Smith</p>
                <p className="text-sm text-muted-foreground">Licensed Plumber</p>
              </div>
              <div className="h-10 w-10 bg-primary rounded-full flex items-center justify-center">
                <Users className="h-5 w-5 text-white" />
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container py-8">
        {/* Navigation Tabs */}
        <div className="flex bg-white rounded-lg p-1 border shadow-sm mb-8 max-w-md">
          <button
            onClick={() => setActiveTab("available")}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-md text-sm font-medium transition-all ${
              activeTab === "available"
                ? "bg-primary text-white shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Search className="h-4 w-4" />
            Available Issues ({availableIssues.length})
          </button>
          <button
            onClick={() => setActiveTab("myjobs")}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-md text-sm font-medium transition-all ${
              activeTab === "myjobs" ? "bg-primary text-white shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Briefcase className="h-4 w-4" />
            My Jobs ({myJobs.length})
          </button>
        </div>

        {/* Available Issues Tab */}
        {activeTab === "available" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Available Issues</h2>
              <div className="flex items-center gap-4">
                <select
                  className="border rounded-lg px-3 py-2 text-sm"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="all">All Types</option>
                  <option value="plumbing">Plumbing</option>
                  <option value="electrical">Electrical</option>
                  <option value="carpentry">Carpentry</option>
                </select>
              </div>
            </div>

            <div className="grid gap-6">
              {availableIssues.map((issue) => (
                <div
                  key={issue.id}
                  className="bg-white rounded-lg border shadow-sm p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Home className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{issue.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {issue.type} • {issue.timePosted}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(issue.status)}`}>
                        {issue.status}
                      </span>
                      <span className={`text-sm font-medium ${getPriorityColor(issue.priority)}`}>
                        {issue.priority}
                      </span>
                    </div>
                  </div>

                  <p className="text-muted-foreground mb-4">{issue.description}</p>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>{issue.clientName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{issue.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span>{issue.estimatedPay}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {issue.preferredMethod === "Video Call" ? (
                        <Video className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                      )}
                      <span>{issue.preferredMethod}</span>
                    </div>
                  </div>

                  {issue.attachments.length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm text-muted-foreground mb-2">Attachments:</p>
                      <div className="flex gap-2">
                        {issue.attachments.map((attachment, index) => (
                          <div key={index} className="bg-gray-100 rounded px-3 py-1 text-sm">
                            {attachment}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">Preferred: {issue.preferredMethod}</div>
                    <Button onClick={() => acceptIssue(issue)} className="gradient-purple">
                      Accept Issue
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* My Jobs Tab */}
        {activeTab === "myjobs" && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">My Active Jobs</h2>

            {myJobs.length === 0 ? (
              <div className="text-center py-12">
                <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Active Jobs</h3>
                <p className="text-muted-foreground">Accept issues from the Available Issues tab to start working.</p>
              </div>
            ) : (
              <div className="grid gap-6">
                {myJobs.map((job) => (
                  <div key={job.id} className="bg-white rounded-lg border shadow-sm overflow-hidden">
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center">
                            <Home className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">{job.title}</h3>
                            <p className="text-sm text-muted-foreground">
                              {job.type} • Accepted {job.timeAccepted}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(job.status)}`}>
                            {job.status}
                          </span>
                        </div>
                      </div>

                      <p className="text-muted-foreground mb-4">{job.description}</p>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span>{job.clientName}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span>{job.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-muted-foreground" />
                          <span>{job.estimatedPay}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {job.preferredMethod === "Video Call" ? (
                            <Video className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                          )}
                          <span>{job.preferredMethod}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 mb-4">
                        <Button
                          onClick={() => startVideoCall(job)}
                          className="flex items-center gap-2"
                          disabled={job.status === "Completed"}
                        >
                          <Video className="h-4 w-4" />
                          Start Video Call
                        </Button>

                        {job.status !== "Completed" && (
                          <select
                            className="border rounded-lg px-3 py-2 text-sm"
                            value={job.status}
                            onChange={(e) => updateJobStatus(job.id, e.target.value)}
                          >
                            <option value="In-Analysis">In Analysis</option>
                            <option value="Fixing">Fixing</option>
                            <option value="Completed">Completed</option>
                          </select>
                        )}
                      </div>

                      {/* Messages Section */}
                      {job.messages && job.messages.length > 0 && (
                        <div className="border-t pt-4">
                          <h4 className="font-medium mb-3 flex items-center gap-2">
                            <MessageCircle className="h-4 w-4" />
                            Conversation
                          </h4>
                          <div className="space-y-3 max-h-40 overflow-y-auto">
                            {job.messages.map((message, index) => (
                              <div
                                key={index}
                                className={`flex ${message.sender === "professional" ? "justify-end" : "justify-start"}`}
                              >
                                <div
                                  className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                                    message.sender === "professional"
                                      ? "bg-primary text-white"
                                      : message.sender === "system"
                                        ? "bg-gray-100 text-gray-600 italic"
                                        : "bg-gray-100 text-gray-800"
                                  }`}
                                >
                                  <p>{message.message}</p>
                                  <p
                                    className={`text-xs mt-1 ${
                                      message.sender === "professional" ? "text-white/70" : "text-gray-500"
                                    }`}
                                  >
                                    {message.time}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
