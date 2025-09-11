"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { CheckCircle, Mail, Users, Zap } from "lucide-react"
import { useState } from "react"

export default function WaitlistSection() {
  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (email) {
      // Here you would typically send the email to your backend
      console.log("Waitlist signup:", email)
      setIsSubmitted(true)
      setEmail("")
    }
  }

  return (
    <section id="waitlist" className="py-20 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">Join the Fixo Waitlist</h2>
            <p className="text-xl text-primary-foreground/90 max-w-2xl mx-auto mb-8">
              Be among the first to experience instant expert help for your home repairs. Join thousands of homeowners
              already on our waitlist.
            </p>
          </div>

          {/* Benefits Grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card className="p-6 bg-primary-foreground/10 border-primary-foreground/20">
              <div className="flex items-center justify-center mb-4">
                <div className="h-12 w-12 bg-primary-foreground/20 rounded-full flex items-center justify-center">
                  <Zap className="h-6 w-6 text-primary-foreground" />
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-primary-foreground">Early Access</h3>
              <p className="text-primary-foreground/80 text-sm">Get priority access when we launch in your area</p>
            </Card>

            <Card className="p-6 bg-primary-foreground/10 border-primary-foreground/20">
              <div className="flex items-center justify-center mb-4">
                <div className="h-12 w-12 bg-primary-foreground/20 rounded-full flex items-center justify-center">
                  <Users className="h-6 w-6 text-primary-foreground" />
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-primary-foreground">Exclusive Perks</h3>
              <p className="text-primary-foreground/80 text-sm">
                Special launch pricing and bonus credits for early members
              </p>
            </Card>

            <Card className="p-6 bg-primary-foreground/10 border-primary-foreground/20">
              <div className="flex items-center justify-center mb-4">
                <div className="h-12 w-12 bg-primary-foreground/20 rounded-full flex items-center justify-center">
                  <Mail className="h-6 w-6 text-primary-foreground" />
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-primary-foreground">Stay Updated</h3>
              <p className="text-primary-foreground/80 text-sm">
                Get the latest updates on features and launch timeline
              </p>
            </Card>
          </div>

          {/* Signup Form */}
          <div className="max-w-md mx-auto">
            {isSubmitted ? (
              <div className="bg-primary-foreground/10 rounded-lg p-6 border border-primary-foreground/20">
                <div className="flex items-center justify-center mb-4">
                  <CheckCircle className="h-8 w-8 text-primary-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-primary-foreground">You're on the list!</h3>
                <p className="text-primary-foreground/80 text-sm">
                  We'll notify you as soon as Fixo launches in your area.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <Input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="flex-1 bg-primary-foreground text-primary border-primary-foreground/20 placeholder:text-primary/60"
                  />
                  <Button
                    type="submit"
                    size="lg"
                    className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 font-semibold"
                  >
                    Join Waitlist
                  </Button>
                </div>
                <p className="text-xs text-primary-foreground/70">No spam, ever. Unsubscribe at any time.</p>
              </form>
            )}
          </div>

          {/* Social Proof */}
          <div className="mt-12 pt-8 border-t border-primary-foreground/20">
            <div className="flex items-center justify-center gap-8 text-primary-foreground/80">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-foreground">5,000+</div>
                <div className="text-sm">On Waitlist</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-foreground">50+</div>
                <div className="text-sm">Expert Tradies</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-foreground">24/7</div>
                <div className="text-sm">Support</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
