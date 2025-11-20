"use client"

import { Calendar, Clock, ArrowRight, TrendingUp, Lightbulb, Wrench } from "lucide-react"
import { Button } from "@/components/ui/button"
import Navbar from "@/components/custom/navbar"

export default function BlogsPage() {
  const blogPosts = [
    {
      id: 1,
      title: "How AI is Revolutionizing Home Repairs",
      excerpt:
        "Discover how artificial intelligence is transforming the way homeowners connect with professionals and solve repair issues faster than ever before.",
      category: "Technology",
      date: "March 15, 2024",
      readTime: "5 min read",
      image: "/ai-technology-home-repairs.jpg",
      icon: Lightbulb,
      featured: true,
    },
    {
      id: 2,
      title: "5 Common Plumbing Issues You Can Fix with Video Guidance",
      excerpt:
        "Learn about the most common plumbing problems that homeowners face and how video consultations can help you fix them without expensive call-outs.",
      category: "DIY Tips",
      date: "March 12, 2024",
      readTime: "7 min read",
      image: "/plumbing-repair-tools.jpg",
      icon: Wrench,
      featured: false,
    },
    {
      id: 3,
      title: "The Future of Remote Professional Services",
      excerpt:
        "Explore how video-based professional services are changing the gig economy and creating new opportunities for skilled tradespeople.",
      category: "Industry News",
      date: "March 10, 2024",
      readTime: "6 min read",
      image: "/video-call-professional-service.jpg",
      icon: TrendingUp,
      featured: false,
    },
    {
      id: 4,
      title: "Maximizing Your Earnings as a Fixo Handymen",
      excerpt:
        "Tips and strategies for professionals to optimize their time, build their reputation, and increase their income on the Fixo platform.",
      category: "For Professionals",
      date: "March 8, 2024",
      readTime: "8 min read",
      image: "/professional-earning-money-online.jpg",
      icon: TrendingUp,
      featured: false,
    },
    {
      id: 5,
      title: "Understanding Home Electrical Safety Basics",
      excerpt:
        "Essential electrical safety tips every homeowner should know before attempting any DIY repairs or calling for professional help.",
      category: "Safety",
      date: "March 5, 2024",
      readTime: "6 min read",
      image: "/electrical-safety-home.jpg",
      icon: Lightbulb,
      featured: false,
    },
    /**{
      id: 6,
      title: "Success Stories: Real Homeowners, Real Savings",
      excerpt:
        "Read inspiring stories from homeowners who saved thousands of dollars using Fixo's AI-powered video consultation service.",
      category: "Case Studies",
      date: "March 1, 2024",
      readTime: "5 min read",
      image: "/happy-homeowner-success.jpg",
      icon: TrendingUp,
      featured: false,
    },**/
  ]

  const featuredPost = blogPosts.find((post) => post.featured)
  const regularPosts = blogPosts.filter((post) => !post.featured)

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-32 pb-16 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -left-40 w-80 h-80 gradient-purple opacity-20 organic-shape"></div>
          <div className="absolute top-20 -right-32 w-64 h-64 gradient-purple opacity-15 organic-shape-alt"></div>
        </div>

        <div className="container relative z-10">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-gradient-purple-light rounded-full px-4 py-2 border border-primary/20 shadow-lg backdrop-blur-sm mb-6">
              <Lightbulb className="h-4 w-4 text-primary" />
              <span className="text-xs font-semibold text-primary">Insights & Updates</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
              Fixo{" "}
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Blog</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Stay updated with the latest tips, news, and insights about home repairs and AI-powered solutions
            </p>
          </div>

          {/* Featured Post */}
          {featuredPost && (
            <div className="mb-16">
              <div className="gradient-purple-blue rounded-3xl overflow-hidden shadow-2xl transform hover:scale-[1.02] transition-all duration-300">
                <div className="grid lg:grid-cols-2 gap-0">
                  <div className="relative h-64 lg:h-auto">
                    <img
                      src={featuredPost.image || "/placeholder.svg"}
                      alt={featuredPost.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 left-4 bg-yellow-400 text-gray-900 px-3 py-1 rounded-full text-xs font-bold">
                      FEATURED
                    </div>
                  </div>
                  <div className="p-8 lg:p-12 flex flex-col justify-center text-white">
                    <div className="flex items-center gap-4 mb-4">
                      <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold">
                        {featuredPost.category}
                      </span>
                      <div className="flex items-center gap-2 text-white/80 text-sm">
                        <Calendar className="h-4 w-4" />
                        <span>{featuredPost.date}</span>
                      </div>
                    </div>
                    <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-white">{featuredPost.title}</h2>
                    <p className="text-white/90 text-lg mb-6 leading-relaxed">{featuredPost.excerpt}</p>
                    <div className="flex items-center gap-4">
                      <Button className="bg-white text-purple-600 hover:bg-white/90 font-semibold" size="lg">
                        Read Article
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                      <div className="flex items-center gap-2 text-white/80">
                        <Clock className="h-4 w-4" />
                        <span className="text-sm">{featuredPost.readTime}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Blog Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {regularPosts.map((post) => {
              const IconComponent = post.icon
              return (
                <div
                  key={post.id}
                  className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border border-gray-100"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={post.image || "/placeholder.svg"}
                      alt={post.title}
                      className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-purple-600">
                      {post.category}
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-3 text-muted-foreground text-sm">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>{post.date}</span>
                      </div>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        <span>{post.readTime}</span>
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-3 leading-tight">{post.title}</h3>
                    <p className="text-muted-foreground mb-4 leading-relaxed">{post.excerpt}</p>
                    <Button
                      variant="ghost"
                      className="text-purple-600 hover:text-purple-700 hover:bg-purple-50 p-0 h-auto font-semibold group"
                    >
                      Read More
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Newsletter CTA */}
          <div className="mt-20 gradient-purple-light rounded-3xl p-12 border border-primary/20 shadow-xl text-center">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold text-foreground mb-4">Stay in the Loop</h2>
              <p className="text-muted-foreground text-lg mb-8">
                Get the latest tips, news, and exclusive insights delivered straight to your inbox
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="px-6 py-3 rounded-xl border-2 border-primary/30 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 text-foreground bg-white flex-1 max-w-md"
                />
                <Button size="lg" className="gradient-purple text-white font-semibold px-8 shadow-lg hover:shadow-xl">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-8">
        <div className="container text-center text-muted-foreground">
          <p>© 2025 Fixo. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
