"use client"

import { useState } from "react"
import { useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import { toast } from "sonner"

export default function ProfessionalRegistration() {
  const { user } = useUser()
  const router = useRouter()
  const createApplication = useMutation(api.professionals.createApplication)

  const [formData, setFormData] = useState({
    fullName: user?.fullName || "",
    email: user?.primaryEmailAddress?.emailAddress || "",
    phoneNumber: "",
    tradeCategory: "",
    yearsOfExperience: "",
    hourlyRate: "",
    serviceArea: "",
    bio: "",
  })

  const [files, setFiles] = useState({
    profilePhoto: null,
    idDocument: null,
    tradeLicense: null,
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const tradeCategories = [
    "Plumbing",
    "Electrical",
    "Carpentry",
    "HVAC",
    "Painting",
    "Roofing",
    "Landscaping",
    "General Handyman",
  ]

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e, fileType) => {
    const file = e.target.files?.[0]
    if (file) {
      setFiles((prev) => ({ ...prev, [fileType]: file }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Validate required fields
      if (!formData.fullName || !formData.email || !formData.phoneNumber) {
        toast.error("Please fill in all required fields")
        setIsSubmitting(false)
        return
      }

      if (!formData.tradeCategory || !formData.yearsOfExperience || !formData.hourlyRate) {
        toast.error("Please complete your professional details")
        setIsSubmitting(false)
        return
      }

      if (!formData.serviceArea || !formData.bio) {
        toast.error("Please provide your service area and bio")
        setIsSubmitting(false)
        return
      }

      if (!files.idDocument || !files.tradeLicense) {
        toast.error("Please upload required documents (ID and Trade License)")
        setIsSubmitting(false)
        return
      }

      // In a real app, you would upload files to storage (e.g., Vercel Blob)
      // For now, we'll store file names
      const applicationData = {
        uid: user.id,
        email: formData.email,
        fullName: formData.fullName,
        phoneNumber: formData.phoneNumber,
        phoneVerified: true, // Assume verified via Clerk
        tradeCategory: formData.tradeCategory,
        yearsOfExperience: Number.parseInt(formData.yearsOfExperience),
        hourlyRate: Number.parseFloat(formData.hourlyRate),
        serviceArea: formData.serviceArea,
        bio: formData.bio,
        profilePhoto: files.profilePhoto?.name,
        idDocument: files.idDocument?.name,
        tradeLicense: files.tradeLicense?.name,
      }

      await createApplication(applicationData)

      toast.success("Application submitted successfully!")
      router.push("/professional-application-status")
    } catch (error) {
      console.error("[v0] Error submitting application:", error)
      toast.error(error.message || "Failed to submit application")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Join Fixo as a Professional</h1>
          <p className="text-muted-foreground">
            Complete your application to become a verified professional on our platform
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Your basic contact details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">
                    Full Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">
                    Email Address <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">
                  Phone Number <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  placeholder="+61 4XX XXX XXX"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Professional Details */}
          <Card>
            <CardHeader>
              <CardTitle>Professional Details</CardTitle>
              <CardDescription>Information about your trade and experience</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="tradeCategory">
                  Trade Category <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.tradeCategory}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, tradeCategory: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your trade" />
                  </SelectTrigger>
                  <SelectContent>
                    {tradeCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="yearsOfExperience">
                    Years of Experience <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="yearsOfExperience"
                    name="yearsOfExperience"
                    type="number"
                    min="0"
                    value={formData.yearsOfExperience}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hourlyRate">
                    Hourly Rate (AUD) <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="hourlyRate"
                    name="hourlyRate"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="e.g., 75.00"
                    value={formData.hourlyRate}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="serviceArea">
                  Service Area <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="serviceArea"
                  name="serviceArea"
                  placeholder="e.g., Melbourne, VIC"
                  value={formData.serviceArea}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">
                  Professional Bio <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="bio"
                  name="bio"
                  placeholder="Tell us about your experience, specializations, and what makes you a great professional..."
                  rows={4}
                  value={formData.bio}
                  onChange={handleInputChange}
                  required
                />
                <p className="text-sm text-muted-foreground">Minimum 50 characters</p>
              </div>
            </CardContent>
          </Card>

          {/* Documents */}
          <Card>
            <CardHeader>
              <CardTitle>Required Documents</CardTitle>
              <CardDescription>Upload your identification and certifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="profilePhoto">Profile Photo (Optional)</Label>
                <div className="flex items-center gap-4">
                  <Input
                    id="profilePhoto"
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, "profilePhoto")}
                    className="flex-1"
                  />
                  {files.profilePhoto && <CheckCircle className="h-5 w-5 text-green-500" />}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="idDocument">
                  Valid ID Document <span className="text-red-500">*</span>
                </Label>
                <div className="flex items-center gap-4">
                  <Input
                    id="idDocument"
                    type="file"
                    accept="image/*,.pdf"
                    onChange={(e) => handleFileChange(e, "idDocument")}
                    required
                    className="flex-1"
                  />
                  {files.idDocument && <CheckCircle className="h-5 w-5 text-green-500" />}
                </div>
                <p className="text-sm text-muted-foreground">Driver's license, passport, or government-issued ID</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tradeLicense">
                  Trade License/Certification <span className="text-red-500">*</span>
                </Label>
                <div className="flex items-center gap-4">
                  <Input
                    id="tradeLicense"
                    type="file"
                    accept="image/*,.pdf"
                    onChange={(e) => handleFileChange(e, "tradeLicense")}
                    required
                    className="flex-1"
                  />
                  {files.tradeLicense && <CheckCircle className="h-5 w-5 text-green-500" />}
                </div>
                <p className="text-sm text-muted-foreground">Valid trade license or professional certification</p>
              </div>
            </CardContent>
          </Card>

          {/* Terms and Submit */}
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-900">
                    <p className="font-medium mb-1">Application Review Process</p>
                    <p>
                      Your application will be reviewed by our admin team within 2-3 business days. You'll receive an
                      email notification once your application has been reviewed.
                    </p>
                  </div>
                </div>

                <Button type="submit" size="lg" className="w-full gradient-purple" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      Submitting Application...
                    </>
                  ) : (
                    <>
                      <Upload className="h-5 w-5 mr-2" />
                      Submit Application
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  )
}
