"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Brain, Wrench, Camera, CheckCircle, Loader2, ArrowRight, ImagePlus, X } from "lucide-react"
import { useState, useRef } from "react"
import { useAuth, SignInButton } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import Image from "next/image"

export default function HomePage() {
  const [inputValue, setInputValue] = useState("")
  const [attachedImage, setAttachedImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisStage, setAnalysisStage] = useState(0)
  const { isSignedIn, isLoaded } = useAuth()
  const router = useRouter()
  const fileInputRef = useRef(null)

  const analysisStages = [
    { icon: Camera, label: "Analyzing Issue", color: "text-blue-600" },
    { icon: Brain, label: "AI Processing", color: "text-indigo-600" },
    { icon: CheckCircle, label: "Solution Ready", color: "text-emerald-600" },
  ]

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0]
    if (file && file.type.startsWith("image/")) {
      setAttachedImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setAttachedImage(null)
    setImagePreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!inputValue.trim() && !attachedImage) return

    // Show analysis animation
    setIsAnalyzing(true)

    // Animate through stages
    for (let i = 0; i < analysisStages.length; i++) {
      setAnalysisStage(i)
      await new Promise((resolve) => setTimeout(resolve, 800))
    }

    const chatData = {
      message: inputValue,
      image: imagePreview, // Base64 image data
      hasImage: !!attachedImage,
      timestamp: Date.now(),
    }
    sessionStorage.setItem("fixo_initial_chat", JSON.stringify(chatData))

    // Check authentication and redirect
    if (isSignedIn) {
      router.push("/ai-chat")
    }
    // If not signed in, the sign-in button will redirect after authentication
  }

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden">
      {/* Main Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-slate-200 bg-white/80 backdrop-blur-sm">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-blue-600 rounded-xl flex items-center justify-center">
                  <Wrench className="h-6 w-6 text-white" />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
                  Fixo
                </span>
              </div>

              {!isSignedIn && (
                <SignInButton mode="modal" forceRedirectUrl="/ai-chat">
                  <Button variant="outline" className="border-slate-300 hover:bg-slate-100 bg-transparent">
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
            {/* Left Side - Modern Text Content */}
            <div className="space-y-8">
              <div className="space-y-6">
                <h1 className="text-5xl md:text-5xl lg:text-5xl font-bold leading-tight">
                  <span className="inline-block animate-fade-in-up">
                    <span className="bg-gradient-to-r from-slate-900 via-indigo-900 to-slate-900 bg-clip-text text-transparent">
                      Meet Fixo - Your AI
                    </span>
                  </span>
                  <br />
                  <span className="inline-block animate-fade-in-up animation-delay-200">
                    <span className="bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent animate-gradient">
                      Home repair Genius
                    </span>
                  </span>
                </h1>
                <p className="text-md md:text-md text-slate-600 leading-relaxed max-w-xl animate-fade-in-up animation-delay-400">
                Describe your home repair issue or upload a photo. Fixo instantly diagnoses the problem and guides you with clear, step-by-step instructions and interactive 3D visuals.
                </p>
               
              </div>

              {/* Empowerment Card */}
              <Card className="bg-gradient-to-br from-indigo-100 via-blue-100 to-cyan-100 border-indigo-200 rounded-4xl p-8 shadow-lxl animate-fade-in-up animation-delay-600">
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-blue-600 rounded-xl flex items-center justify-center">
                      <Wrench className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-xl text-white-600">Fixo Empowers You</h3>
                  </div>

                  <div className="space-y-4 text-slate-700">
                    <p className="leading-relaxed text-sm">
                    Fixo gives you the power to fix things yourself — with instant AI insights, simple step-by-step guidance, and interactive 3D support for every repair.
                    </p>
                    
                  </div>

                  <div className="grid grid-cols-3 gap-4 pt-4 border-t border-indigo-200">
                    <div className="text-center">
                      <div className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
                        10s
                      </div>
                      <div className="text-xs text-slate-600 mt-1">Average response time</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
                        AI
                      </div>
                      <div className="text-xs text-slate-600 mt-1">Problem solved rate</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
                        3D
                      </div>
                      <div className="text-xs text-slate-600 mt-1">Interactive guides</div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Right Side - Interactive Card with Modern Gradient */}
            <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200 rounded-[2.5rem] transform rotate-1"></div>
              <div className="relative bg-gradient-to-br from-blue-300/80 via-purple-300/80 via-pink-300/80 to-orange-300/80 rounded-[2.5rem] p-8 md:p-12 min-h-[600px] flex flex-col">
                {/* Logo and Title */}
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl px-4 py-3 inline-flex items-center gap-3 self-start mb-6 shadow-lg border border-slate-200">
                  <div className="w-9 h-9 bg-gradient-to-br from-indigo-600 to-blue-600 rounded-lg flex items-center justify-center">
                    <Wrench className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-lg font-bold text-slate-800">Fixo AI</span>
                </div>

                {!isAnalyzing ? (
                  <>
                    <Card className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-xl border-0">
                      <div className="space-y-4">
                        <textarea
                          id="repair-input"
                          value={inputValue}
                          onChange={(e) => setInputValue(e.target.value)}
                          placeholder="Describe your repair issue or upload a photo... For example: My kitchen faucet is dripping continuously"
                          rows={5}
                          className="w-full border-0 focus:ring-0 resize-none text-slate-800 placeholder:text-slate-400 text-base bg-transparent"
                        />

                        {imagePreview && (
                          <div className="relative rounded-xl overflow-hidden border-2 border-indigo-200 bg-slate-50">
                            <Image
                              src={imagePreview || "/placeholder.svg"}
                              alt="Attached image"
                              width={400}
                              height={300}
                              className="w-full h-48 object-cover"
                            />
                            <button
                              onClick={removeImage}
                              className="absolute top-2 right-2 w-8 h-8 bg-slate-900/80 hover:bg-slate-900 text-white rounded-full flex items-center justify-center transition-colors"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-100 mt-4">
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleImageSelect}
                          className="hidden"
                        />
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors text-sm font-medium text-slate-700"
                        >
                          <ImagePlus className="h-4 w-4" />
                          Add photo
                        </button>
                        <button
                          onClick={handleSubmit}
                          disabled={!inputValue.trim() && !attachedImage}
                          className="ml-auto flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white rounded-xl transition-all text-sm font-medium shadow-lg shadow-indigo-500/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                        >
                          Analyze
                          <ArrowRight className="h-4 w-4" />
                        </button>
                      </div>
                    </Card>

                    {/* Example Prompts */}
                    <div className="mt-6 space-y-3">
                      <p className="text-sm text-slate-700 font-medium">Try an example:</p>
                      <div className="flex flex-wrap gap-2">
                        {["Leaking faucet", "Broken door hinge", "Cracked drywall"].map((example) => (
                          <button
                            key={example}
                            onClick={() => setInputValue(example)}
                            className="px-3 py-2 bg-white/80 hover:bg-white text-slate-700 rounded-lg text-sm transition-all border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-300"
                          >
                            {example}
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <Card className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 shadow-xl border-0 min-h-[400px] flex flex-col justify-center">
                    <h3 className="text-2xl font-bold text-slate-900 mb-8 text-center">Analyzing your issue...</h3>

                    {/* Progress Steps */}
                    <div className="relative mb-12">
                      {/* Progress Line */}
                      <div className="absolute top-8 left-0 right-0 h-1 bg-slate-200 rounded-full">
                        <div
                          className="h-full bg-gradient-to-r from-indigo-600 to-blue-600 rounded-full transition-all duration-700"
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
                                  isActive ? "bg-gradient-to-br from-indigo-600 to-blue-600" : "bg-slate-200"
                                } ${isCurrent ? "scale-110" : "scale-100"}`}
                              >
                                <StageIcon className={`h-7 w-7 ${isActive ? "text-white" : "text-slate-400"}`} />
                              </div>
                              <p className={`mt-3 text-sm font-medium ${isActive ? stage.color : "text-slate-400"}`}>
                                {stage.label}
                              </p>
                            </div>
                          )
                        })}
                      </div>
                    </div>

                    {/* User's content preview */}
                    <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl p-6 border border-indigo-200 space-y-3">
                      {inputValue && <p className="text-slate-700 italic">"{inputValue}"</p>}
                      {imagePreview && (
                        <div className="rounded-lg overflow-hidden border border-indigo-200">
                          <Image
                            src={imagePreview || "/placeholder.svg"}
                            alt="Analyzing"
                            width={300}
                            height={200}
                            className="w-full h-32 object-cover"
                          />
                        </div>
                      )}
                    </div>

                    {/* Authentication prompt if needed */}
                    {!isSignedIn && analysisStage === analysisStages.length - 1 && (
                      <div className="mt-8 text-center animate-fade-in">
                        <p className="text-slate-600 mb-4">Sign in to continue with your personalized repair guide</p>
                        <SignInButton mode="modal" forceRedirectUrl="/ai-chat" signUpForceRedirectUrl="/ai-chat">
                          <Button
                            size="lg"
                            className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white px-8 py-4 shadow-lg"
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

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out both;
        }

        .animation-delay-200 {
          animation-delay: 0.2s;
        }

        .animation-delay-400 {
          animation-delay: 0.4s;
        }

        .animation-delay-600 {
          animation-delay: 0.6s;
        }

        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </div>
  )
}
