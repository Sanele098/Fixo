"use client"

import { Button } from "@/components/ui/button"

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-16 md:py-24 bg-gray-50 relative overflow-hidden">
      <div className="container relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left side - Curved Image */}
          <div className="relative">
            <div className="relative w-full h-[500px] overflow-hidden">
              {/* Curved container for image */}
              <div
                className="absolute inset-0 bg-gradient-to-br from-gray-300 to-gray-400 overflow-hidden"
                style={{
                  clipPath: "ellipse(85% 100% at 0% 50%)",
                  borderRadius: "0 200px 200px 0",
                }}
              >
                <img
                  src="/woman-getting-help-with-plumbing-repair-via-video-.jpg"
                  alt="Professional tradie helping with home repairs"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Right side - Content */}
          <div className="space-y-8">
            {/* Header section */}
            <div className="space-y-6">
              <p className="text-gray-600 text-md leading-relaxed">
                Connect with verified professional tradies for instant help. Get expert guidance through video calls and
                save on expensive call-out fees.
              </p>
              <Button className="bg-teal-500 hover:bg-teal-600 text-white px-8 py-3 rounded-full text-lg font-medium">
                Explore
              </Button>
            </div>

            <h3 className="text-3xl font-bold text-teal-600 leading-tight">
              How Fixo Works?
            </h3>

            {/* Steps */}
            <div className="space-y-8 mt-12">
              {/* Step 01 */}
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-teal-500 rounded-2xl flex items-center justify-center">
                    <span className="text-2xl font-bold text-white">01</span>
                  </div>
                </div>
                <div className="pt-2">
                  <p className="text-gray-600 text-md leading-relaxed">
                    Describe your repair problem and get instantly matched with verified professional tradies in your
                    area who specialize in your specific issue.
                  </p>
                </div>
              </div>

              {/* Step 02 */}
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-orange-500 rounded-2xl flex items-center justify-center">
                    <span className="text-2xl font-bold text-white">02</span>
                  </div>
                </div>
                <div className="pt-2">
                  <p className="text-gray-600 text-md leading-relaxed">
                    Connect via live video call for expert diagnosis and step-by-step guidance. Get professional advice
                    without expensive call-out fees.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
