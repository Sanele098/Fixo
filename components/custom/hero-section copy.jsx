"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Brain, Wrench, Camera, CheckCircle, Loader2, ArrowRight, Plus, Wand2 } from "lucide-react"
import { useState } from "react"
import { useAuth, SignInButton } from "@clerk/nextjs"
import { useRouter } from "next/navigation"

export default function HomePage() {
  const [inputValue, setInputValue] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisStage, setAnalysisStage] = useState(0)
  const { isSignedIn, isLoaded } = useAuth()
  const router = useRouter()

  const analysisStages = [
    { icon: Camera, label: "Analyzing Issue", color: "text-blue-600" },
    { icon: Brain, label: "AI Processing", color: "text-purple-600" },
    { icon: CheckCircle, label: "Solution Ready", color: "text-green-600" },
  ]

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!inputValue.trim()) return

    // Show analysis animation
    setIsAnalyzing(true)

    // Animate through stages
    for (let i = 0; i < analysisStages.length; i++) {
      setAnalysisStage(i)
      await new Promise((resolve) => setTimeout(resolve, 800))
    }

    // Check authentication and redirect
    if (isSignedIn) {
      // Redirect to AI chat with the message as a query parameter
      router.push(`/ai-chat?initialMessage=${encodeURIComponent(inputValue)}`)
    } else {
      // Store the message and trigger sign in
      sessionStorage.setItem("fixo_initial_message", inputValue)
      // The sign in will be handled by the SignInButton below
    }
  }

  const handleSignInAndContinue = () => {
    // Message is already stored in sessionStorage
    // After sign in, we'll redirect to ai-chat and retrieve it
  }

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 relative overflow-hidden">
      {/* Main Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-gray-200 bg-white">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
                  <Wrench className="h-6 w-6 text-white" />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  Fixo
                </span>
              </div>

              {!isSignedIn && (
                <SignInButton mode="modal" forceRedirectUrl="/ai-chat">
                  <Button variant="outline" className="border-gray-300 hover:bg-gray-100 bg-transparent">
                    Sign In
                  </Button>
                </SignInButton>
              )}
            </div>
          </div>
        </header>

        {/* Hero Section - Split Screen Layout */}
        <div className="container mx-auto px-6 py-12 md:py-16 lg:py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
            {/* Left Side - Text Content */}
            <div className="space-y-8">
              <div className="space-y-6">
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight">
                  Fix at the speed of thought
                </h1>
                <p className="text-xl md:text-2xl text-gray-600 leading-relaxed max-w-xl">
                  Describe your home repair issue and watch our AI provide instant diagnosis, step-by-step guidance, and
                  interactive 3D tutorials.
                </p>
              </div>

              <Button
                size="lg"
                className="bg-black hover:bg-gray-800 text-white px-8 py-6 text-lg rounded-xl shadow-lg"
                onClick={() => document.getElementById("repair-input")?.focus()}
              >
                Start fixing
              </Button>

              {/* Feature List */}
              <div className="pt-8 space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-gray-900">Instant AI Diagnosis</h3>
                    <p className="text-gray-600">Get immediate problem analysis and repair estimates</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-gray-900">Interactive 3D Guides</h3>
                    <p className="text-gray-600">Follow along with immersive visual instructions</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-gray-900">Photo & Video Analysis</h3>
                    <p className="text-gray-600">Upload media for precise identification and solutions</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Interactive Card with Gradient Background */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200 rounded-[2.5rem] transform rotate-1"></div>
              <div className="relative bg-gradient-to-br from-blue-300/80 via-purple-300/80 via-pink-300/80 to-orange-300/80 rounded-[2.5rem] p-8 md:p-12 min-h-[600px] flex flex-col">
                {/* Logo and Title */}
                <div className="bg-white rounded-2xl px-4 py-3 inline-flex items-center gap-3 self-start mb-6 shadow-sm">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
                    <Wrench className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-xl font-bold text-gray-700">Fixo</span>
                </div>

                {!isAnalyzing ? (
                  <>
                    {/* Input Card */}
                    <Card className="bg-white rounded-2xl p-6 shadow-xl flex-1 flex flex-col">
                      <div className="mb-4">
                        <textarea
                          id="repair-input"
                          value={inputValue}
                          onChange={(e) => setInputValue(e.target.value)}
                          placeholder="Describe your home repair issue here... For example: My kitchen faucet is dripping and there's water pooling underneath the sink."
                          rows={6}
                          className="w-full border-0 focus:ring-0 resize-none text-gray-700 placeholder:text-gray-400 text-base"
                        />
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-100">
                        <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm text-gray-600">
                          <Plus className="h-4 w-4" />
                          Add photo
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 border border-orange-200 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors text-sm text-orange-700">
                          <Wand2 className="h-4 w-4" />
                          Get AI help
                        </button>
                        <button
                          onClick={handleSubmit}
                          disabled={!inputValue.trim()}
                          className="ml-auto flex items-center gap-2 px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors text-sm font-medium shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <ArrowRight className="h-4 w-4" />
                        </button>
                      </div>
                    </Card>

                    {/* Example Prompts */}
                    <div className="mt-6">
                      <p className="text-sm text-gray-700 mb-3 font-medium">Try an example:</p>
                      <div className="flex flex-wrap gap-2">
                        {["Leaking faucet", "Broken door hinge", "Cracked wall"].map((example) => (
                          <button
                            key={example}
                            onClick={() => setInputValue(example)}
                            className="px-4 py-2 bg-white/80 hover:bg-white text-gray-700 rounded-lg text-sm transition-colors border border-gray-200 shadow-sm"
                          >
                            {example}
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <Card className="bg-white rounded-2xl p-8 shadow-xl flex-1 flex flex-col justify-center">
                    <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">Analyzing your issue...</h3>

                    {/* Progress Steps */}
                    <div className="relative mb-12">
                      {/* Progress Line */}
                      <div className="absolute top-8 left-0 right-0 h-1 bg-gray-200">
                        <div
                          className="h-full bg-gradient-to-r from-purple-600 to-blue-600 transition-all duration-700"
                          style={{ width: `${((analysisStage + 1) / analysisStages.length) * 100}%` }}
                        />
                      </div>

                      {/* Steps */}
                      <div className="relative flex justify-between">
                        {analysisStages.map((stage, index) => {
                          const StageIcon = stage.icon
                          const isActive = index <= analysisStage
                          const isCurrent = index === analysisStage

                          return (
                            <div key={index} className="flex flex-col items-center">
                              <div
                                className={`w-16 h-16 rounded-full flex items-center justify-center border-4 border-white shadow-lg transition-all duration-500 ${
                                  isActive ? "bg-gradient-to-br from-purple-600 to-blue-600" : "bg-gray-200"
                                } ${isCurrent ? "scale-110" : "scale-100"}`}
                              >
                                <StageIcon className={`h-7 w-7 ${isActive ? "text-white" : "text-gray-400"}`} />
                              </div>
                              <p className={`mt-3 text-sm font-medium ${isActive ? stage.color : "text-gray-400"}`}>
                                {stage.label}
                              </p>
                            </div>
                          )
                        })}
                      </div>
                    </div>

                    {/* User's message preview */}
                    <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-6 border border-purple-200">
                      <p className="text-gray-700 italic">"{inputValue}"</p>
                    </div>

                    {/* Authentication prompt if needed */}
                    {!isSignedIn && analysisStage === analysisStages.length - 1 && (
                      <div className="mt-8 text-center animate-fade-in">
                        <p className="text-gray-600 mb-4">Sign in to continue with your personalized repair guide</p>
                        <SignInButton mode="modal" forceRedirectUrl="/ai-chat" signUpForceRedirectUrl="/ai-chat">
                          <Button
                            size="lg"
                            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 shadow-lg"
                            onClick={handleSignInAndContinue}
                          >
                            Sign In to Continue
                            <ArrowRight className="h-5 w-5 ml-2" />
                          </Button>
                        </SignInButton>
                      </div>
                    )}
                  </Card>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom animations */}
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
      `}</style>
    </div>
  )
}
