"use client"

import { useEffect, useState } from "react"
import { useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Clock, CheckCircle, XCircle, Loader2, ArrowLeft } from "lucide-react"

export default function ProfessionalApplicationStatus() {
  const { user } = useUser()
  const router = useRouter()
  const professional = useQuery(api.professionals.getByUid, user ? { uid: user.id } : "skip")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (professional !== undefined) {
      setIsLoading(false)

      // If approved, redirect to professional dashboard
      if (professional?.applicationStatus === "approved") {
        setTimeout(() => {
          router.push("/professional-dashboard")
        }, 2000)
      }
    }
  }, [professional, router])

  if (isLoading || professional === undefined) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Loading application status...</p>
        </div>
      </div>
    )
  }

  if (!professional) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>No Application Found</CardTitle>
            <CardDescription>You haven't submitted a professional application yet.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push("/professional-registration")} className="w-full gradient-purple">
              Start Application
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const getStatusIcon = () => {
    switch (professional.applicationStatus) {
      case "pending":
        return <Clock className="h-16 w-16 text-yellow-500" />
      case "approved":
        return <CheckCircle className="h-16 w-16 text-green-500" />
      case "rejected":
        return <XCircle className="h-16 w-16 text-red-500" />
      default:
        return <Clock className="h-16 w-16 text-gray-500" />
    }
  }

  const getStatusMessage = () => {
    switch (professional.applicationStatus) {
      case "pending":
        return {
          title: "Application Under Review",
          description:
            "Thank you for applying! Our admin team is currently reviewing your application. This typically takes 2-3 business days.",
          color: "text-yellow-600",
        }
      case "approved":
        return {
          title: "Application Approved!",
          description:
            "Congratulations! Your application has been approved. You can now access the professional dashboard and start accepting jobs.",
          color: "text-green-600",
        }
      case "rejected":
        return {
          title: "Application Not Approved",
          description:
            "Unfortunately, your application was not approved at this time. Please review the notes below and feel free to reapply.",
          color: "text-red-600",
        }
      default:
        return {
          title: "Application Status Unknown",
          description: "Please contact support for more information.",
          color: "text-gray-600",
        }
    }
  }

  const statusInfo = getStatusMessage()

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container max-w-3xl">
        <Button variant="ghost" onClick={() => router.push("/")} className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Button>

        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">{getStatusIcon()}</div>
            <CardTitle className={`text-2xl ${statusInfo.color}`}>{statusInfo.title}</CardTitle>
            <CardDescription className="text-base">{statusInfo.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Application Details */}
            <div className="border-t pt-6">
              <h3 className="font-semibold mb-4">Application Details</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Full Name</p>
                  <p className="font-medium">{professional.fullName}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Email</p>
                  <p className="font-medium">{professional.email}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Trade Category</p>
                  <p className="font-medium">{professional.tradeCategory}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Experience</p>
                  <p className="font-medium">{professional.yearsOfExperience} years</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Hourly Rate</p>
                  <p className="font-medium">${professional.hourlyRate}/hr</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Service Area</p>
                  <p className="font-medium">{professional.serviceArea}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-muted-foreground">Applied On</p>
                  <p className="font-medium">{new Date(professional.appliedAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            {/* Review Notes (if rejected) */}
            {professional.applicationStatus === "rejected" && professional.reviewNotes && (
              <div className="border-t pt-6">
                <h3 className="font-semibold mb-2">Review Notes</h3>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-sm text-red-900">{professional.reviewNotes}</p>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="border-t pt-6">
              {professional.applicationStatus === "approved" && (
                <Button
                  onClick={() => router.push("/professional-dashboard")}
                  className="w-full gradient-purple"
                  size="lg"
                >
                  Go to Professional Dashboard
                </Button>
              )}
              {professional.applicationStatus === "pending" && (
                <div className="text-center text-sm text-muted-foreground">
                  <p>You'll receive an email notification once your application is reviewed.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
