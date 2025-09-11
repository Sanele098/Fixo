import Navbar from "@/components/custom/navbar"
import HeroSection from "@/components/custom/hero-section"
import FAQSection from "@/components/custom/faq-section"
import WaitlistSection from "@/components/custom/waitlist-section"
import Footer from "@/components/custom/footer"

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <div id="home">
        <HeroSection />
      </div>
      <FAQSection />
      <WaitlistSection />
      <Footer />
    </main>
  )
}
