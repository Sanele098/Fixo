"use client"

import { useState } from "react"
import { CheckCircle, Wrench, Shield, Clock, Users, MapPin, Video, Star, ChevronDown, ChevronUp } from "lucide-react"

const faqs = [
  {
    question: "How quickly can I get help with my repair?",
    answer:
      "Most connections happen within 2-5 minutes. Our tradies are available 24/7 to help with urgent repairs, and you'll be matched with an expert based on your specific problem.",
    icon: Clock,
    borderColor: "border-l-blue-500",
  },
  {
    question: "What types of repairs can Fixo help with?",
    answer:
      "We cover all major home repairs including plumbing, electrical, HVAC, carpentry, appliance repairs, and general maintenance. If it's a home repair issue, we likely have an expert who can help.",
    icon: Wrench,
    borderColor: "border-l-red-500",
  },
  {
    question: "How much does it cost to use Fixo?",
    answer:
      "Video consultations start from $15 for basic guidance. This is significantly cheaper than traditional call-out fees which can range from $80-200. You only pay for the help you need.",
    icon: CheckCircle,
    borderColor: "border-l-blue-500",
  },
  {
    question: "Are the tradies on Fixo verified and licensed?",
    answer:
      "Yes, all professionals on our platform are thoroughly vetted. We verify licenses, insurance, and check references. Each tradie also maintains a rating system based on customer feedback.",
    icon: Shield,
    borderColor: "border-l-red-500",
  },
  {
    question: "What if I can't fix the problem myself after the video call?",
    answer:
      "No problem! If the issue requires hands-on work, we can connect you with local tradies in your area who can complete the job. Many of our video experts also offer in-person services.",
    icon: Users,
    borderColor: "border-l-blue-500",
  },
  {
    question: "Do you offer services in Perth, Australia?",
    answer:
      "Yes! Fixo is available across Australia, including Perth and surrounding areas. Our local tradies understand Australian building standards and regulations.",
    icon: MapPin,
    borderColor: "border-l-red-500",
  },
  {
    question: "Can I record the video session for future reference?",
    answer:
      "Yes, with the tradie's permission, you can record sessions for your personal reference. This is helpful for complex repairs you might need to repeat in the future.",
    icon: Video,
    borderColor: "border-l-blue-500",
  },
  {
    question: "What if I'm not satisfied with the help I received?",
    answer:
      "We offer a satisfaction guarantee. If you're not happy with your session, we'll provide a full refund or connect you with another expert at no additional cost.",
    icon: Star,
    borderColor: "border-l-red-500",
  },
]

export default function FAQSection() {
  const [openItems, setOpenItems] = useState({})

  const toggleItem = (index) => {
    setOpenItems((prev) => ({
      ...prev,
      [index]: !prev[index],
    }))
  }

  return (
    <section id="faq" className="py-20 bg-slate-50">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">FAQ</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Here are some of the Fixo frequently asked questions
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {faqs.map((faq, index) => {
            const IconComponent = faq.icon
            const isOpen = openItems[index]

            return (
              <div
                key={index}
                className={`bg-white rounded-lg shadow-sm border-l-4 ${faq.borderColor} hover:shadow-md transition-all duration-200`}
              >
                <button
                  onClick={() => toggleItem(index)}
                  className="w-full p-6 text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900 pr-4">{faq.question}</h3>
                        <div className="flex-shrink-0">
                          {isOpen ? (
                            <ChevronUp className="w-5 h-5 text-gray-500" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-gray-500" />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </button>

                <div
                  className={`overflow-hidden transition-all duration-300 ${isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}
                >
                  <div className="px-6 pb-6">
                    <div className="ml-16">
                      <p className="text-gray-600 text-sm leading-relaxed">{faq.answer}</p>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
