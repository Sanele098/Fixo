"use client"

import { Button } from "@/components/ui/button"
import { Video, Clock, DollarSign, Users, CheckCircle, Home, Briefcase, Brain, Sparkles, Zap } from "lucide-react"
import { useState } from "react"
import { useAuth, SignInButton } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import HowItWorksSection from "@/components/custom/how-it-works-section"
import DemoVideoModal from "@/components/custom/demo-video-modal"

export default function HeroSection() {
  const [activeTab, setActiveTab] = useState("client")
  const [isDemoOpen, setIsDemoOpen] = useState(false)
  const { isSignedIn } = useAuth()
  const router = useRouter()

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  const handleJoinWaitlist = () => {
    if (isSignedIn) {
      router.push("/dashboard")
    }
  }

  const handleJoinAsProfessional = () => {
    if (isSignedIn) {
      router.push("/professional-dashboard")
    }
  }

  return (
    <div className="min-h-screen bg-background pt-16 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-80 h-80 gradient-purple opacity-20 organic-shape"></div>
        <div className="absolute top-20 -right-32 w-64 h-64 gradient-purple opacity-15 organic-shape-alt"></div>
        <div className="absolute bottom-20 left-1/4 w-48 h-48 gradient-purple opacity-10 organic-shape"></div>
      </div>

      {/* Hero Section */}
      <section className="relative bg-background">
        <div className="container py-16 md:py-24 lg:py-32 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="space-y-8">
              <div className="flex items-center gap-2 bg-gradient-purple-light rounded-full px-4 py-2 border border-primary/20 shadow-lg backdrop-blur-sm w-fit">
                <Brain className="h-4 w-4 text-primary" />
                <span className="text-xs font-semibold text-primary">Powered by AI</span>
              </div>

              <div className="flex bg-gradient-purple-light rounded-2xl p-2 border border-primary/20 shadow-lg backdrop-blur-sm">
                <button
                  onClick={() => setActiveTab("client")}
                  className={`flex-1 flex items-center justify-center gap-3 px-4 md:px-6 py-3 md:py-4 rounded-xl text-sm md:text-base font-semibold transition-all ${
                    activeTab === "client"
                      ? "bg-white text-primary shadow-lg border border-primary/30"
                      : "text-primary/70 hover:text-primary"
                  }`}
                >
                  <Home className="h-4 w-4 md:h-5 md:w-5" />
                  For Homeowners
                </button>
                <button
                  onClick={() => setActiveTab("professional")}
                  className={`flex-1 flex items-center justify-center gap-3 px-4 md:px-6 py-3 md:py-4 rounded-xl text-sm md:text-base font-semibold transition-all ${
                    activeTab === "professional"
                      ? "bg-white text-primary shadow-lg border border-primary/30"
                      : "text-primary/70 hover:text-primary"
                  }`}
                >
                  <Briefcase className="h-4 w-4 md:h-5 md:w-5" />
                  For Professionals
                </button>
              </div>

              {/* Tab Content */}
              {activeTab === "client" ? (
                <div className="space-y-8">
                  <div className="space-y-6">
                    <h2 className="text-primary/100 text-foreground">
                    Instant AI Repair Help
                    </h2>
                    <p className="text-pretty text-muted-foreground max-w-2xl text-lg">
                      Connect with professional tradies for instant video guidance powered by AI analysis. No waiting,
                      no expensive call-out fees.
                    </p>
                  </div>

                  {/* Key Benefits for Clients */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <Clock className="h-5 w-5 text-primary flex-shrink-0" />
                      <span className="font-medium">Instant Matching</span>
                    </div>
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <Video className="h-5 w-5 text-primary flex-shrink-0" />
                      <span className="font-medium">Live Video Help</span>
                    </div>
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <DollarSign className="h-5 w-5 text-primary flex-shrink-0" />
                      <span className="font-medium">Save Money</span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    {isSignedIn ? (
                      <Button
                        size="lg"
                        className="text-base md:text-lg px-8 py-6 shadow-xl gradient-purple border-0 hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                        onClick={handleJoinWaitlist}
                      >
                        Start Fixing
                      </Button>
                    ) : (
                      <SignInButton mode="modal" forceRedirectUrl="/dashboard">
                        <Button
                          size="lg"
                          className="text-base md:text-lg px-8 py-6 shadow-xl gradient-purple border-0 hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                        >
                          Join as Homeowner
                        </Button>
                      </SignInButton>
                    )}
                    <Button
                      size="lg"
                      variant="outline"
                      className="text-base md:text-lg px-8 py-6 bg-white/80 backdrop-blur-sm border-2 border-primary/30 text-primary hover:bg-primary/5"
                      onClick={() => setIsDemoOpen(true)}
                    >
                      <Zap className="h-5 w-5 mr-2" />
                      Watch Demo
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-8">
                  <div className="space-y-6">
                    <h2 className="text-primary/100 text-foreground">
                    Fix, and Grow with AI
                    </h2>
                    <p className="text-pretty text-muted-foreground max-w-2xl text-lg">
                      Share your expertise through video calls. AI matches you with the right jobs. Flexible schedule,
                      instant payments, growing client base.
                    </p>
                  </div>

                  {/* Key Benefits for Professionals */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <DollarSign className="h-5 w-5 text-primary flex-shrink-0" />
                      <span className="font-medium">Instant Payments</span>
                    </div>
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <Clock className="h-5 w-5 text-primary flex-shrink-0" />
                      <span className="font-medium">Flexible Hours</span>
                    </div>
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <Users className="h-5 w-5 text-primary flex-shrink-0" />
                      <span className="font-medium">Growing Network</span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    {isSignedIn ? (
                      <Button
                        size="lg"
                        className="text-base md:text-lg px-8 py-6 shadow-xl gradient-purple border-0 hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                        onClick={handleJoinAsProfessional}
                      >
                        Fix as Professional
                      </Button>
                    ) : (
                      <SignInButton mode="modal" forceRedirectUrl="/professional-dashboard">
                        <Button
                          size="lg"
                          className="text-base md:text-lg px-8 py-6 shadow-xl gradient-purple border-0 hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                        >
                          Join as Professional
                        </Button>
                      </SignInButton>
                    )}
                    <Button
                      size="lg"
                      variant="outline"
                      className="text-base md:text-lg px-8 py-6 bg-white/80 backdrop-blur-sm border-2 border-primary/30 text-primary hover:bg-primary/5"
                      onClick={() => setIsDemoOpen(true)}
                    >
                      <Zap className="h-5 w-5 mr-2" />
                      Watch Demo
                    </Button>
                  </div>
                </div>
              )}
            </div>

            <div className="relative">
              <div className="gradient-purple-blue rounded-2xl p-6 text-primary-foreground shadow-2xl transform hover:scale-105 transition-all duration-300 relative overflow-hidden">
                {/* Animated background elements */}
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute top-4 right-4 w-20 h-20 bg-white/10 rounded-full animate-pulse"></div>
                  <div className="absolute bottom-8 left-8 w-16 h-16 bg-white/10 rounded-full animate-pulse delay-700"></div>
                </div>

                <div className="aspect-video bg-white/10 rounded-xl overflow-hidden mb-6 backdrop-blur-sm border border-white/20 relative">
                  <img
                    src="/woman-getting-help-with-plumbing-repair-via-video-.jpg"
                    alt="Woman getting help with plumbing repair via video call"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4 flex items-center gap-2 bg-black/40 backdrop-blur-sm px-3 py-2 rounded-full border border-white/20">
                    <Zap className="h-4 w-4 text-yellow-300 animate-pulse" />
                    <span className="text-xs font-semibold text-white">AI Powered</span>
                  </div>
                </div>

                <div className="space-y-4 relative z-10">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/30 relative">
                      <Users className="h-6 w-6 text-white" />
                      <div className="absolute -top-1 -right-1 h-4 w-4 bg-yellow-300 rounded-full animate-pulse border border-white/50"></div>
                    </div>
                    <div>
                      <p className="font-semibold text-white text-lg">
                        {activeTab === "client" ? "Connected to Expert Plumber" : "Helping Sarah with Plumbing"}
                      </p>
                      <p className="text-white/80">Live video session in progress</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-white/90">
                    <CheckCircle className="h-5 w-5 text-white" />
                    <span>
                      {activeTab === "client" ? "Problem diagnosed in 5 minutes" : "Earning $45 for 15-minute session"}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-white/90 pt-2 border-t border-white/20">
                    <Brain className="h-5 w-5 text-yellow-300" />
                    <span className="text-sm">AI-powered analysis & matching</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Video Modal */}
      <DemoVideoModal isOpen={isDemoOpen} onClose={() => setIsDemoOpen(false)} />

      {/* How It Works Section */}
      <HowItWorksSection />

      {/* Value Proposition */}
      <section id="why-choose-us" className="py-16 md:py-24 relative">
        <div className="absolute bottom-0 left-0 w-64 h-64 gradient-purple opacity-5 organic-shape-alt"></div>

        <div className="container relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-foreground mb-8">Why Choose Fixo AI?</h2>
              <div className="space-y-8">
                <div className="flex gap-6">
                  <div className="h-12 w-12 gradient-blue rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                    <Sparkles className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="mb-3">AI-Powered Matching</h3>
                    <p className="text-muted-foreground">
                      Get instant access to professional tradies matched by AI. No scheduling, no delays.
                    </p>
                  </div>
                </div>

                <div className="flex gap-6">
                  <div className="h-12 w-12 gradient-purple-blue rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                    <DollarSign className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="mb-3">Save Money</h3>
                    <p className="text-muted-foreground">
                      Avoid expensive call-out fees. Pay only for the help you need.
                    </p>
                  </div>
                </div>

                <div className="flex gap-6">
                  <div className="h-12 w-12 gradient-blue rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                    <CheckCircle className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="mb-3">Verified Professionals</h3>
                    <p className="text-muted-foreground">All tradies are verified experts with proven track records.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="gradient-purple-light rounded-3xl p-10 border border-primary/20 shadow-xl organic-shape-alt">
              <div className="text-center">
                <div className="text-6xl font-bold text-primary mb-4">85%</div>
                <p className="text-muted-foreground mb-10 text-lg">
                  Average cost savings vs traditional repair services
                </p>

                <div className="grid grid-cols-2 gap-8 text-center">
                  <div>
                    <div className="text-3xl font-bold text-foreground mb-2">{"< 10 min"}</div>
                    <p className="text-muted-foreground">Average wait time</p>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-foreground mb-2">4.9★</div>
                    <p className="text-muted-foreground">Customer rating</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
