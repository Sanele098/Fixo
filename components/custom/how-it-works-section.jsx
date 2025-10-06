"use client"

import { Button } from "@/components/ui/button"
import { MessageSquare, Video, CheckCircle, UserCheck, DollarSign, Clock, Wrench } from "lucide-react"
import { useState } from "react"

export default function HowItWorksSection() {
  const [activeView, setActiveView] = useState("homeowner")

  const homeownerSteps = [
    {
      icon: <MessageSquare className="h-8 w-8" />,
      title: "Describe Your Problem",
      description: "Upload media and describe your home repair issue in detail.",
      color: "gradient-blue",
    },
    {
      icon: <UserCheck className="h-8 w-8" />,
      title: "Get Matched Instantly",
      description: "Our system connects you with the right professional within minutes.",
      color: "gradient-purple",
    },
    {
      icon: <Video className="h-8 w-8" />,
      title: "Video Consultation",
      description: "Get live guidance through video call or schedule an on-site visit.",
      color: "gradient-purple-blue",
    },
    {
      icon: <CheckCircle className="h-8 w-8" />,
      title: "Problem Solved",
      description: "Get expert guidance or have it done professionally.",
      color: "gradient-blue",
    },
  ]

  const professionalSteps = [
    {
      icon: <Clock className="h-8 w-8" />,
      title: "Browse Available Jobs",
      description: "View logged issues from homeowners and choose jobs that match your expertise.",
      color: "gradient-blue",
    },
    {
      icon: <UserCheck className="h-8 w-8" />,
      title: "Accept & Connect",
      description: "Accept jobs and start communicating with clients through our platform.",
      color: "gradient-purple",
    },
    {
      icon: <Video className="h-8 w-8" />,
      title: "Provide Expert Help",
      description: "Guide clients via video call or schedule on-site visits for complex repairs.",
      color: "gradient-purple-blue",
    },
    {
      icon: <DollarSign className="h-8 w-8" />,
      title: "Get Paid Instantly",
      description: "Receive payment immediately after completing the job successfully.",
      color: "gradient-blue",
    },
  ]

  return (
    <section id="how-it-works" className="py-16 md:py-24 bg-muted/30 relative">
      <div className="absolute top-0 right-0 w-72 h-72 gradient-purple opacity-5 organic-shape"></div>

      <div className="container relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-foreground mb-6">How Fixo Works</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-8">
            Simple, fast, and effective. Get your home repairs sorted in minutes, not days.
          </p>

          {/* Toggle between homeowner and professional views */}
          <div className="flex justify-center mb-12">
            <div className="bg-background rounded-2xl p-2 border border-primary/20 shadow-lg">
              <button
                onClick={() => setActiveView("homeowner")}
                className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all ${
                  activeView === "homeowner"
                    ? "bg-primary text-primary-foreground shadow-lg"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                For Homeowners
              </button>
              <button
                onClick={() => setActiveView("professional")}
                className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all ${
                  activeView === "professional"
                    ? "bg-primary text-primary-foreground shadow-lg"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                For Professionals
              </button>
            </div>
          </div>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {(activeView === "homeowner" ? homeownerSteps : professionalSteps).map((step, index) => (
            <div key={index} className="relative">
              {/* Connection line */}
              {index < 3 && (
                <div className="hidden lg:block absolute top-12 left-full w-full h-0.5 bg-gradient-to-r from-primary/30 to-transparent z-0"></div>
              )}

              <div className="bg-background rounded-2xl p-6 border border-primary/10 shadow-lg hover:shadow-xl transition-all duration-300 relative z-10">
                <div
                  className={`h-16 w-16 ${step.color} rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg`}
                >
                  {step.icon}
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-bold text-primary">0{index + 1}</span>
                    <h3 className="font-semibold text-foreground">{step.title}</h3>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to action */}
        <div className="text-center mt-16">
          <div className="bg-gradient-purple-light rounded-3xl p-8 border border-primary/20 shadow-xl max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="h-12 w-12 bg-primary/20 rounded-full flex items-center justify-center">
                {activeView === "homeowner" ? (
                  <Wrench className="h-6 w-6 text-primary" />
                ) : (
                  <DollarSign className="h-6 w-6 text-primary" />
                )}
              </div>
              <h3 className="text-2xl font-bold text-foreground">
                {activeView === "homeowner" ? "Ready to Fix Your Home?" : "Ready to Start Earning?"}
              </h3>
            </div>
            <p className="text-muted-foreground mb-6">
              {activeView === "homeowner"
                ? "Join thousands of homeowners who've solved their repair problems quickly and affordably."
                : "Join our network of professionals earning money by sharing their expertise."}
            </p>
            <Button
              size="lg"
              className="gradient-purple border-0 text-lg px-8 py-6 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
            >
              {activeView === "homeowner" ? "Get Started Now" : "Join as Professional"}
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
