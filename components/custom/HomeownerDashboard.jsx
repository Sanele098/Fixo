"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Video,
  Wrench,
  User,
  Settings,
  Bell,
  Calendar,
  Star,
  Phone,
  MessageSquare,
  CreditCard,
  Plus,
  Search,
  Filter,
  Lightbulb,
  Camera,
  Bot,
  Sparkles,
  X,
  MapPin,
  Truck,
  BrainCircuit,
} from "lucide-react"
import { useState } from "react"

export default function HomeownerDashboard() {
  const [activeSection, setActiveSection] = useState("overview")
  const [showInstantHelpModal, setShowInstantHelpModal] = useState(false)
  const [showHandymanModal, setShowHandymanModal] = useState(false)
  const [showPhotoModal, setShowPhotoModal] = useState(false)
  const [instantHelpStep, setInstantHelpStep] = useState(1)
  const [formData, setFormData] = useState({
    problemType: "",
    urgency: "",
    description: "",
    location: "",
    availability: "",
  })

  // Mock data for demonstration
  const recentSessions = [
    {
      id: 1,
      type: "Plumbing",
      expert: "Mike Johnson",
      date: "2024-01-15",
      status: "completed",
      rating: 5,
      cost: "$45",
      description: "Kitchen sink leak repair",
    },
    {
      id: 2,
      type: "Electrical",
      expert: "Sarah Chen",
      date: "2024-01-12",
      status: "in-progress",
      cost: "$60",
      description: "Light switch installation",
    },
    {
      id: 3,
      type: "HVAC",
      expert: "Tom Wilson",
      date: "2024-01-10",
      status: "completed",
      rating: 4,
      cost: "$75",
      description: "Thermostat troubleshooting",
    },
  ]

  const upcomingAppointments = [
    {
      id: 1,
      type: "Handyman Visit",
      professional: "Alex Rodriguez",
      date: "2024-01-18",
      time: "2:00 PM",
      service: "Cabinet door repair",
    },
  ]

  const suppliers = [
    {
      id: 1,
      name: "Home Depot",
      type: "nearby",
      distance: "2.3 miles",
      rating: 4.5,
      category: "Hardware Store",
      sponsored: true,
      logo: "HD",
    },
    {
      id: 2,
      name: "Lowe's",
      type: "nearby",
      distance: "3.1 miles",
      rating: 4.3,
      category: "Home Improvement",
      sponsored: false,
      logo: "LW",
    },
    {
      id: 3,
      name: "Amazon",
      type: "online",
      delivery: "Same day",
      rating: 4.7,
      category: "Online Retailer",
      sponsored: true,
      logo: "AM",
    },
    {
      id: 4,
      name: "Ferguson",
      type: "nearby",
      distance: "4.2 miles",
      rating: 4.6,
      category: "Plumbing Supply",
      sponsored: false,
      logo: "FG",
    },
  ]

  const handleInstantHelp = () => {
    setShowInstantHelpModal(true)
    setInstantHelpStep(1)
  }

  const handleNextStep = () => {
    if (instantHelpStep < 4) {
      setInstantHelpStep(instantHelpStep + 1)
    } else {
      // Redirect to Google Meet
      window.open("https://meet.google.com/new", "_blank")
      setShowInstantHelpModal(false)
      setInstantHelpStep(1)
    }
  }

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="h-screen bg-background flex flex-col">
      <header className="bg-card border-b border-border flex-shrink-0">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-bold text-foreground">Fixo Dashboard</h1>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm">
                <Bell className="h-4 w-4" />
              </Button>
              <Avatar>
                <AvatarImage src="/placeholder.svg?height=32&width=32" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-hidden">
        <div className="container mx-auto px-4 py-8 h-full">
          <div className="grid lg:grid-cols-4 gap-8 h-full">
            {/* Left Sidebar - Navigation + Tip Card */}
            <div className="lg:col-span-1 space-y-6 overflow-y-auto">
              <Card>
                <CardContent className="p-4">
                  <nav className="space-y-2">
                    <Button
                      variant={activeSection === "overview" ? "default" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => setActiveSection("overview")}
                    >
                      <User className="h-4 w-4 mr-2" />
                      Overview
                    </Button>
                    <Button
                      variant={activeSection === "sessions" ? "default" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => setActiveSection("sessions")}
                    >
                      <Video className="h-4 w-4 mr-2" />
                      My Sessions
                    </Button>
                    <Button
                      variant={activeSection === "appointments" ? "default" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => setActiveSection("appointments")}
                    >
                      <Calendar className="h-4 w-4 mr-2" />
                      Appointments
                    </Button>
                    <Button
                      variant={activeSection === "billing" ? "default" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => setActiveSection("billing")}
                    >
                      <CreditCard className="h-4 w-4 mr-2" />
                      Billing
                    </Button>
                    <Button
                      variant={activeSection === "profile" ? "default" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => setActiveSection("profile")}
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Profile
                    </Button>
                  </nav>
                </CardContent>
              </Card>

              {activeSection === "overview" && (
                <Card className="bg-gradient-to-br from-yellow-10 to-orange-10 border-yellow-200 shadow-md">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <Lightbulb className="h-5 w-5 text-yellow-600" />
                      <CardTitle className="text-lg text-yellow-800">Pro Tip</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-yellow-700 mb-3">
                      Take clear photos of your issue before starting a session. This helps experts diagnose problems
                      faster and saves you money!
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full border-yellow-300 text-yellow-700 hover:bg-yellow-100 bg-transparent"
                    >
                      Learn More Tips
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Main Content - Scrollable */}
            <div className="lg:col-span-3 overflow-y-auto">
              {activeSection === "overview" && (
                <div className="space-y-6 h-full flex flex-col">
                  <div className="grid md:grid-cols-3 gap-4 flex-shrink-0">
                    <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={handleInstantHelp}>
                      <CardContent className="p-4 text-center">
                        <Video className="h-8 w-8 text-accent mx-auto mb-3" />
                        <h3 className="font-semibold mb-2">Get Instant Help</h3>
                        <p className="text-sm text-muted-foreground">Connect with an expert now</p>
                      </CardContent>
                    </Card>
                    <Card
                      className="hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => setShowHandymanModal(true)}
                    >
                      <CardContent className="p-4 text-center">
                        <Wrench className="h-8 w-8 text-accent mx-auto mb-3" />
                        <h3 className="font-semibold mb-2">Book Handyman</h3>
                        <p className="text-sm text-muted-foreground">Schedule on-site service</p>
                      </CardContent>
                    </Card>
                    <Card
                      className="hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => setShowPhotoModal(true)}
                    >
                      <CardContent className="p-4 text-center">
                        <Camera className="h-8 w-8 text-accent mx-auto mb-3" />
                        <h3 className="font-semibold mb-2">Photo Diagnosis</h3>
                        <p className="text-sm text-muted-foreground">Upload photos for assessment</p>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="grid lg:grid-cols-2 gap-6 flex-1 min-h-0">
                    {/* Left Column - Fixo AI */}
                    <div className="space-y-3">
                      <h3 className="text-lg font-semibold text-foreground">Fixo AI</h3>
                      <Card className="">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-2 mb-3">
                            <BrainCircuit className="h-6 w-6 text-blue-600" />
                            <Sparkles className="h-6 w-6 text-yellow-500" />
                            <Badge className="text-sm bg-blue-400 rounded-xl">
                              Coming Soon
                            </Badge>
                          </div>
                          <p className="text-md text-foreground leading-relaxed mb-3">
                            Our AI-powered diagnostic tool will instantly analyze your home repair issues and provide
                            step-by-step solutions. Simply describe your problem or upload a photo, and get immediate
                            expert guidance for common repairs.
                          </p>
                          <div className="space-y-2 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                              <span>Instant problem diagnosis</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                              <span>Step-by-step repair guides</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                              <span>24/7 availability</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    <div className="space-y-3 flex flex-col min-h-0">
                      <h3 className="text-lg font-semibold text-foreground">Need parts? Find nearby stores</h3>
                      <div className="flex-1 overflow-y-auto space-y-2 pr-2">
                        {suppliers.map((supplier) => (
                          <Card key={supplier.id} className="hover:shadow-md transition-shadow flex-shrink-0">
                            <CardContent className="">
                              <div className="flex items-center gap-3">
                                <Avatar className="h-12 w-12">
                                  <AvatarFallback className="bg-blue-100 text-blue-600 font-bold">
                                    {supplier.logo}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2">
                                    <h4 className="font-semibold text-sm truncate">{supplier.name}</h4>
                                    {supplier.sponsored && (
                                      <Badge
                                        variant="outline"
                                        className="text-xs px-1 py-0 bg-yellow-50 text-yellow-700 border-yellow-200"
                                      >
                                        Sponsored
                                      </Badge>
                                    )}
                                  </div>
                                  <p className="text-xs text-muted-foreground truncate">{supplier.category}</p>
                                  <div className="flex items-center gap-2 mt-1">
                                    <div className="flex items-center">
                                      <Star className="h-3 w-3 text-yellow-500 fill-current" />
                                      <span className="text-xs ml-1">{supplier.rating}</span>
                                    </div>
                                    <div className="flex items-center text-xs text-muted-foreground">
                                      {supplier.type === "nearby" ? (
                                        <>
                                          <MapPin className="h-3 w-3 mr-1" />
                                          {supplier.distance}
                                        </>
                                      ) : (
                                        <>
                                          <Truck className="h-3 w-3 mr-1" />
                                          {supplier.delivery}
                                        </>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                <Button size="sm" className="bg-blue-300 hover:bg-blue-400 text-xs px-3">
                                  {supplier.type === "nearby" ? "Visit" : "Shop"}
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === "sessions" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold">My Sessions</h2>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Filter className="h-4 w-4 mr-2" />
                        Filter
                      </Button>
                      <Button variant="outline" size="sm">
                        <Search className="h-4 w-4 mr-2" />
                        Search
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {recentSessions.map((session) => (
                      <Card key={session.id}>
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between">
                            <div className="flex gap-4">
                              <div className="h-12 w-12 bg-accent/10 rounded-full flex items-center justify-center">
                                <Wrench className="h-6 w-6 text-accent" />
                              </div>
                              <div>
                                <h3 className="font-semibold text-lg">{session.description}</h3>
                                <p className="text-muted-foreground">Expert: {session.expert}</p>
                                <p className="text-sm text-muted-foreground">
                                  {session.date} • {session.type}
                                </p>
                                {session.rating && (
                                  <div className="flex items-center gap-1 mt-2">
                                    {[...Array(5)].map((_, i) => (
                                      <Star
                                        key={i}
                                        className={`h-4 w-4 ${
                                          i < session.rating ? "text-yellow-500 fill-current" : "text-gray-300"
                                        }`}
                                      />
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="text-right">
                              <Badge variant={session.status === "completed" ? "default" : "secondary"}>
                                {session.status}
                              </Badge>
                              <p className="text-lg font-semibold mt-2">{session.cost}</p>
                              <div className="flex gap-2 mt-3">
                                <Button variant="outline" size="sm">
                                  <MessageSquare className="h-4 w-4 mr-1" />
                                  Chat
                                </Button>
                                {session.status === "in-progress" && (
                                  <Button size="sm" className="bg-accent hover:bg-accent/90">
                                    <Video className="h-4 w-4 mr-1" />
                                    Join
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {activeSection === "appointments" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold">Appointments</h2>
                    <Button className="bg-accent hover:bg-accent/90">
                      <Plus className="h-4 w-4 mr-2" />
                      Book Handyman
                    </Button>
                  </div>

                  {upcomingAppointments.length > 0 ? (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Upcoming</h3>
                      {upcomingAppointments.map((appointment) => (
                        <Card key={appointment.id}>
                          <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                              <div className="flex gap-4">
                                <div className="h-12 w-12 bg-accent/10 rounded-full flex items-center justify-center">
                                  <Calendar className="h-6 w-6 text-accent" />
                                </div>
                                <div>
                                  <h3 className="font-semibold text-lg">{appointment.service}</h3>
                                  <p className="text-muted-foreground">with {appointment.professional}</p>
                                  <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                                    <span>{appointment.date}</span>
                                    <span>{appointment.time}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Button variant="outline" size="sm">
                                  <Phone className="h-4 w-4 mr-1" />
                                  Call
                                </Button>
                                <Button variant="outline" size="sm">
                                  Reschedule
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <Card>
                      <CardContent className="p-12 text-center">
                        <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No upcoming appointments</h3>
                        <p className="text-muted-foreground mb-4">Book a handyman for on-site repairs</p>
                        <Button className="bg-accent hover:bg-accent/90">
                          <Plus className="h-4 w-4 mr-2" />
                          Book Now
                        </Button>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}

              {activeSection === "billing" && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold">Billing & Payments</h2>

                  <div className="grid md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Payment Methods</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                            <div className="flex items-center gap-3">
                              <CreditCard className="h-5 w-5 text-accent" />
                              <div>
                                <p className="font-medium">•••• •••• •••• 4242</p>
                                <p className="text-sm text-muted-foreground">Expires 12/25</p>
                              </div>
                            </div>
                            <Badge>Default</Badge>
                          </div>
                          <Button variant="outline" className="w-full bg-transparent">
                            <Plus className="h-4 w-4 mr-2" />
                            Add Payment Method
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Spending Summary</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">This month</span>
                            <span className="font-semibold">$180</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Last month</span>
                            <span className="font-semibold">$240</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Total saved</span>
                            <span className="font-semibold text-green-600">$420</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Transactions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {recentSessions.map((session) => (
                          <div
                            key={session.id}
                            className="flex items-center justify-between p-4 border border-border rounded-lg"
                          >
                            <div>
                              <p className="font-medium">{session.description}</p>
                              <p className="text-sm text-muted-foreground">
                                {session.date} • {session.expert}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold">{session.cost}</p>
                              <Badge variant="outline" className="text-xs">
                                Paid
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {activeSection === "profile" && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold">Profile Settings</h2>

                  <div className="grid md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Personal Information</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <label className="text-sm font-medium">Full Name</label>
                          <p className="text-muted-foreground">John Doe</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium">Email</label>
                          <p className="text-muted-foreground">john.doe@email.com</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium">Phone</label>
                          <p className="text-muted-foreground">+1 (555) 123-4567</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium">Address</label>
                          <p className="text-muted-foreground">123 Main St, City, State 12345</p>
                        </div>
                        <Button variant="outline">Edit Profile</Button>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Preferences</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span>Email notifications</span>
                          <Badge variant="outline">Enabled</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>SMS notifications</span>
                          <Badge variant="outline">Enabled</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Auto-book handyman</span>
                          <Badge variant="secondary">Disabled</Badge>
                        </div>
                        <Button variant="outline">Manage Preferences</Button>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Instant Help Modal */}
      {showInstantHelpModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
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

              {instantHelpStep === 1 && (
                <div className="space-y-4">
                  <h3 className="font-semibold">What type of problem are you experiencing?</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {["Plumbing", "Electrical", "HVAC", "Appliance", "General", "Other"].map((type) => (
                      <Button
                        key={type}
                        variant={formData.problemType === type ? "default" : "outline"}
                        onClick={() => handleInputChange("problemType", type)}
                        className="text-sm"
                      >
                        {type}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {instantHelpStep === 2 && (
                <div className="space-y-4">
                  <h3 className="font-semibold">How urgent is this issue?</h3>
                  <div className="space-y-2">
                    {[
                      { value: "emergency", label: "Emergency - Immediate help needed" },
                      { value: "urgent", label: "Urgent - Within a few hours" },
                      { value: "normal", label: "Normal - Within a day" },
                      { value: "low", label: "Low priority - When convenient" },
                    ].map((option) => (
                      <Button
                        key={option.value}
                        variant={formData.urgency === option.value ? "default" : "outline"}
                        onClick={() => handleInputChange("urgency", option.value)}
                        className="w-full text-left justify-start text-sm"
                      >
                        {option.label}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {instantHelpStep === 3 && (
                <div className="space-y-4">
                  <h3 className="font-semibold">Describe the problem</h3>
                  <textarea
                    className="w-full p-3 border border-gray-300 rounded-lg resize-none"
                    rows="4"
                    placeholder="Please describe what's happening in detail..."
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                  />
                </div>
              )}

              {instantHelpStep === 4 && (
                <div className="space-y-4">
                  <h3 className="font-semibold">When are you available for the video call?</h3>
                  <div className="space-y-2">
                    {["Right now", "Within 15 minutes", "Within 30 minutes", "Within 1 hour"].map((time) => (
                      <Button
                        key={time}
                        variant={formData.availability === time ? "default" : "outline"}
                        onClick={() => handleInputChange("availability", time)}
                        className="w-full text-left justify-start text-sm"
                      >
                        {time}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-3 mt-6">
                {instantHelpStep > 1 && (
                  <Button variant="outline" onClick={() => setInstantHelpStep(instantHelpStep - 1)} className="flex-1">
                    Back
                  </Button>
                )}
                <Button
                  onClick={handleNextStep}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                  disabled={
                    (instantHelpStep === 1 && !formData.problemType) ||
                    (instantHelpStep === 2 && !formData.urgency) ||
                    (instantHelpStep === 3 && !formData.description.trim()) ||
                    (instantHelpStep === 4 && !formData.availability)
                  }
                >
                  {instantHelpStep === 4 ? "Start Video Call" : "Next"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Book Handyman Modal */}
      {showHandymanModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Book Handyman</h2>
                <Button variant="ghost" size="sm" onClick={() => setShowHandymanModal(false)} className="rounded-full">
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="text-center py-8">
                <Wrench className="h-16 w-16 text-blue-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Schedule On-Site Service</h3>
                <p className="text-muted-foreground mb-6">
                  Book a qualified handyman to visit your location and complete the repair work.
                </p>
                <Button className="w-full bg-blue-600 hover:bg-blue-700">Browse Available Handymen</Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Photo Diagnosis Modal */}
      {showPhotoModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Photo Diagnosis</h2>
                <Button variant="ghost" size="sm" onClick={() => setShowPhotoModal(false)} className="rounded-full">
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="text-center py-8">
                <Camera className="h-16 w-16 text-blue-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Upload Photos for Assessment</h3>
                <p className="text-muted-foreground mb-6">
                  Take clear photos of your repair issue and get an instant assessment from our experts.
                </p>
                <div className="space-y-3">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    <Camera className="h-4 w-4 mr-2" />
                    Take Photo
                  </Button>
                  <Button variant="outline" className="w-full bg-transparent">
                    Upload from Gallery
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
