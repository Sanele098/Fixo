"use client"

import { useState, useEffect } from "react"
import { X, Play, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function DemoVideoModal({ isOpen, onClose }) {
  const [isLoading, setIsLoading] = useState(false)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true)
      setHasError(false)
      // Simulate video loading for 3 seconds
      const timer = setTimeout(() => {
        setIsLoading(false)
        setHasError(true)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-background rounded-2xl shadow-2xl max-w-2xl w-full border border-primary/20 overflow-hidden animate-in fade-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-primary/10">
          <h2 className="text-2xl font-bold text-foreground">Fixo AI Demo</h2>
          <button onClick={onClose} className="p-2 hover:bg-primary/10 rounded-lg transition-colors">
            <X className="h-6 w-6 text-muted-foreground" />
          </button>
        </div>

        {/* Content */}
        <div className="p-8">
          <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary/5 rounded-xl border border-primary/20 flex items-center justify-center overflow-hidden relative">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center gap-4">
                <div className="relative w-16 h-16">
                  <div className="absolute inset-0 rounded-full border-4 border-primary/20"></div>
                  <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary animate-spin"></div>
                </div>
                <p className="text-muted-foreground font-medium">Loading demo video...</p>
              </div>
            ) : hasError ? (
              <div className="flex flex-col items-center justify-center gap-4 text-center">
                <div className="h-16 w-16 bg-red-500/20 rounded-full flex items-center justify-center">
                  <AlertCircle className="h-8 w-8 text-red-500" />
                </div>
                <div>
                  <p className="text-lg font-semibold text-foreground mb-2">Demo Video Unavailable</p>
                  <p className="text-muted-foreground">
                    The demo video could not be loaded at this time. Please try again later.
                  </p>
                </div>
              </div>
            ) : null}
          </div>

          {/* Description */}
          <div className="mt-6 space-y-4">
            <h3 className="text-lg font-semibold text-foreground">How Fixo AI Works</h3>
            <p className="text-muted-foreground leading-relaxed">
              Upload a photo or video of your home repair issue. Fixo AI analyzes the problem and instantly
              generates a step-by-step animated video showing exactly how to fix it. 
            </p>
          </div>

          {/* Actions */}
          <div className="mt-8 flex gap-4">
            <Button variant="outline" onClick={onClose} className="flex-1 bg-transparent">
              Close
            </Button>
            <Button
              className="flex-1 gradient-purple border-0"
              onClick={() => {
                setIsLoading(true)
                setHasError(false)
                setTimeout(() => {
                  setIsLoading(false)
                  setHasError(true)
                }, 3000)
              }}
            >
              <Play className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
