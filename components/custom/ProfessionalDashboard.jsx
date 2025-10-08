"use client"

import { useEffect, useState } from "react"
import { useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, Users, Home, Briefcase, MapPin, Search, Loader2 } from "lucide-react"
import { toast } from "sonner"

export default function ProfessionalDashboard() {
  const { user } = useUser()
  const router = useRouter()
  const professional = useQuery(api.professionals.getByUid, user ? { uid: user.id } : "skip")
  const updateAvailability = useMutation(api.professionals.updateAvailability)

  const availableRequests = useQuery(api.requests.GetAvailableRequests)

  const myJobs = useQuery(
    api.requests.GetProfessionalRequests,
    professional?._id ? { professionalId: professional._id } : "skip",
  )

  const acceptRequest = useMutation(api.requests.AcceptRequest)
  const updateRequestStatus = useMutation(api.requests.UpdateRequestStatusByProfessional)

  const [activeTab, setActiveTab] = useState("available")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (professional !== undefined) {
      setIsLoading(false)

      // Check application status
      if (!professional) {
        // No application found, redirect to registration
        router.push("/professional-registration")
      } else if (professional.applicationStatus === "pending") {
        // Application pending, redirect to status page
        router.push("/professional-application-status")
      } else if (professional.applicationStatus === "rejected") {
        // Application rejected, redirect to status page
        router.push("/professional-application-status")
      }
      // If approved, stay on dashboard
    }
  }, [professional, router])

  const toggleAvailability = async () => {
    if (!professional) return

    try {
      await updateAvailability({
        professionalId: professional._id,
        isAvailable: !professional.isAvailable,
      })
      toast.success(professional.isAvailable ? "You are now unavailable" : "You are now available for work")
    } catch (error) {
      console.error("[v0] Error updating availability:", error)
      toast.error("Failed to update availability")
    }
  }

  const handleAcceptRequest = async (requestId) => {
    if (!professional) return

    try {
      await acceptRequest({
        requestId,
        professionalId: professional._id,
      })
      toast.success("Request accepted successfully!")
      setActiveTab("myjobs")
    } catch (error) {
      console.error("[v0] Error accepting request:", error)
      toast.error("Failed to accept request")
    }
  }

  const handleUpdateStatus = async (requestId, newStatus) => {
    if (!professional) return

    try {
      await updateRequestStatus({
        requestId,
        status: newStatus,
        professionalId: professional._id,
      })
      toast.success(`Status updated to ${newStatus}`)
    } catch (error) {
      console.error("[v0] Error updating status:", error)
      toast.error("Failed to update status")
    }
  }

  const getTimeAgo = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMinutes = Math.floor((now - date) / (1000 * 60))

    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hours ago`
    return `${Math.floor(diffInMinutes / 1440)} days ago`
  }

  if (isLoading || professional === undefined) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  // If not approved, the useEffect will redirect
  if (!professional || professional.applicationStatus !== "approved") {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-white/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-foreground">Professional Dashboard</h1>
              <button
                onClick={toggleAvailability}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <div
                  className={`h-2 w-2 rounded-full ${professional.isAvailable ? "bg-green-500" : "bg-gray-400"}`}
                ></div>
                {professional.isAvailable ? "Available for work" : "Unavailable"}
              </button>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="font-semibold">{professional.fullName}</p>
                <p className="text-sm text-muted-foreground">{professional.tradeCategory}</p>
              </div>
              <div className="h-10 w-10 bg-primary rounded-full flex items-center justify-center">
                <Users className="h-5 w-5 text-white" />
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Jobs</CardDescription>
              <CardTitle className="text-3xl">{professional.totalJobs}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Completed</CardDescription>
              <CardTitle className="text-3xl">{professional.completedJobs}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Rating</CardDescription>
              <CardTitle className="text-3xl">
                {professional.rating ? `${professional.rating.toFixed(1)}★` : "N/A"}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Earnings</CardDescription>
              <CardTitle className="text-3xl">${professional.earnings}</CardTitle>
            </CardHeader>
          </Card>
        </div>

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
            Available Issues ({availableRequests?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab("myjobs")}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-md text-sm font-medium transition-all ${
              activeTab === "myjobs" ? "bg-primary text-white shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Briefcase className="h-4 w-4" />
            My Jobs ({myJobs?.length || 0})
          </button>
        </div>

        {/* Available Issues Tab */}
        {activeTab === "available" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Available Issues</h2>
            </div>

            {!availableRequests || availableRequests.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Available Issues</h3>
                  <p className="text-muted-foreground">Check back later for new repair requests in your area.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6">
                {availableRequests.map((request) => (
                  <Card key={request._id}>
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center">
                            <Home className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">{request.title}</h3>
                            <p className="text-sm text-muted-foreground">
                              {request.type === "instant-help" ? request.problemType : request.serviceType} •{" "}
                              {getTimeAgo(request.createdAt)}
                            </p>
                          </div>
                        </div>
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                          {request.status}
                        </span>
                      </div>

                      <p className="text-muted-foreground mb-4">{request.description}</p>

                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span>{request.clientName}</span>
                        </div>
                        {request.preferredDate && (
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span>{request.preferredDate}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-muted-foreground" />
                          <span>${professional.hourlyRate}/hr</span>
                        </div>
                      </div>

                      <Button
                        className="gradient-purple"
                        onClick={() => handleAcceptRequest(request._id)}
                        disabled={!professional.isAvailable}
                      >
                        {professional.isAvailable ? "Accept Issue" : "Set yourself as available first"}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* My Jobs Tab */}
        {activeTab === "myjobs" && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">My Active Jobs</h2>

            {!myJobs || myJobs.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Active Jobs</h3>
                  <p className="text-muted-foreground">Accept issues from the Available Issues tab to start working.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6">
                {myJobs.map((job) => (
                  <Card key={job._id}>
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center">
                            <Home className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">{job.title}</h3>
                            <p className="text-sm text-muted-foreground">
                              Accepted {getTimeAgo(job.professionalAcceptedAt)}
                            </p>
                          </div>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            job.status === "completed"
                              ? "bg-green-100 text-green-700"
                              : job.status === "fixing"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {job.status}
                        </span>
                      </div>

                      <p className="text-muted-foreground mb-4">{job.description}</p>

                      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span>{job.clientName}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-muted-foreground" />
                          <span>${professional.hourlyRate}/hr</span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        {job.status === "in-analysis" && (
                          <Button onClick={() => handleUpdateStatus(job._id, "fixing")} className="gradient-purple">
                            Start Fixing
                          </Button>
                        )}
                        {job.status === "fixing" && (
                          <Button onClick={() => handleUpdateStatus(job._id, "completed")} className="gradient-purple">
                            Mark as Completed
                          </Button>
                        )}
                        {job.status === "completed" && (
                          <Button disabled className="bg-green-600">
                            Completed ✓
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
