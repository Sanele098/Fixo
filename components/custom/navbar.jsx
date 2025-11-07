"use client"

import { Button } from "@/components/ui/button"
import { Menu, X, Wrench } from "lucide-react"
import { useState } from "react"
import DemoVideoModal from "./demo-video-modal"
import Link from "next/link"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showDemoModal, setShowDemoModal] = useState(false)

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
    setIsMenuOpen(false)
  }

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200/50 shadow-sm">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl shadow-lg">
                <Wrench className="h-5 w-5 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Fixo
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-10">
              <button
                onClick={() => scrollToSection("home")}
                className="relative text-gray-700 hover:text-purple-600 transition-all duration-300 font-medium group"
              >
                Home
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-blue-600 group-hover:w-full transition-all duration-300"></span>
              </button>
              <button
                onClick={() => scrollToSection("how-it-works")}
                className="relative text-gray-700 hover:text-purple-600 transition-all duration-300 font-medium group"
              >
                How It Works
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-blue-600 group-hover:w-full transition-all duration-300"></span>
              </button>
              <button
                  onClick={() => scrollToSection("why-choose-us")}
                  className="text-left text-gray-700 hover:text-purple-600 transition-colors duration-200 font-medium py-2"
                >
                  Why choose us?
                </button>
              <Link
                href="/blogs"
                className="relative text-gray-700 hover:text-purple-600 transition-all duration-300 font-medium group"
              >
                Blog
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-blue-600 group-hover:w-full transition-all duration-300"></span>
              </Link>
            </div>

            {/* Desktop CTA */}
            <div className="hidden lg:flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => scrollToSection("waitlist")}
                className="text-gray-700 hover:text-purple-600 hover:bg-purple-50 transition-all duration-300 font-medium"
              >
                Newsletter
              </Button>
              <Button
                onClick={() => setShowDemoModal(true)}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium px-6 py-2.5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
              >
                Watch Demo
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors duration-200"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6 text-gray-700" /> : <Menu className="h-6 w-6 text-gray-700" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="lg:hidden py-6 border-t border-gray-200/50 bg-white/95 backdrop-blur-sm">
              <div className="flex flex-col space-y-4">
                <button
                  onClick={() => scrollToSection("home")}
                  className="text-left text-gray-700 hover:text-purple-600 transition-colors duration-200 font-medium py-2"
                >
                  Home
                </button>
                <button
                  onClick={() => scrollToSection("how-it-works")}
                  className="text-left text-gray-700 hover:text-purple-600 transition-colors duration-200 font-medium py-2"
                >
                  How It Works
                </button>
                <button
                  onClick={() => scrollToSection("why-choose-us")}
                  className="text-left text-gray-700 hover:text-purple-600 transition-colors duration-200 font-medium py-2"
                >
                  Why choose us?
                </button>
                <Link
                  href="/blogs"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-left text-gray-700 hover:text-purple-600 transition-colors duration-200 font-medium py-2"
                >
                  Blog
                </Link>
                <button
                  onClick={() => scrollToSection("waitlist")}
                  className="text-left text-gray-700 hover:text-purple-600 transition-colors duration-200 font-medium py-2"
                >
                  Join Waitlist
                </button>
                <div className="flex flex-col space-y-3 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => scrollToSection("waitlist")}
                    className="border-purple-200 text-purple-600 hover:bg-purple-50"
                  >
                    Newsletter
                  </Button>
                  <Button
                    onClick={() => {
                      setShowDemoModal(true)
                      setIsMenuOpen(false)
                    }}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg"
                  >
                    Watch Demo
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      <DemoVideoModal isOpen={showDemoModal} onClose={() => setShowDemoModal(false)} />
    </>
  )
}
