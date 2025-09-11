import { Mail, MapPin, Phone } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-sidebar text-sidebar-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-sidebar-primary">Fixo</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Connecting homeowners with expert tradies for instant video repair guidance.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sidebar-foreground">Quick Links</h3>
            <div className="space-y-2 text-sm">
              <a href="#home" className="block text-muted-foreground hover:text-sidebar-primary transition-colors">
                Home
              </a>
              <a
                href="#how-it-works"
                className="block text-muted-foreground hover:text-sidebar-primary transition-colors"
              >
                How It Works
              </a>
              <a
                href="#why-choose-us"
                className="block text-muted-foreground hover:text-sidebar-primary transition-colors"
              >
                Why Choose Us
              </a>
              <a href="#faq" className="block text-muted-foreground hover:text-sidebar-primary transition-colors">
                FAQ
              </a>
            </div>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sidebar-foreground">Services</h3>
            <div className="space-y-2 text-sm">
              <div className="text-muted-foreground">Plumbing Help</div>
              <div className="text-muted-foreground">Electrical Support</div>
              <div className="text-muted-foreground">HVAC Guidance</div>
              <div className="text-muted-foreground">General Repairs</div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sidebar-foreground">Contact</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4 text-sidebar-primary" />
                <span>Perth, Australia</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4 text-sidebar-primary" />
                <a href="mailto:support@fixo.services" className="hover:text-sidebar-primary transition-colors">
                  support@fixo.services
                </a>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-4 w-4 text-sidebar-primary" />
                <span>24/7 Support</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-sidebar-border mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <div>© 2024 Fixo. All rights reserved.</div>
            <div className="flex gap-6">
              <a href="#" className="hover:text-sidebar-primary transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-sidebar-primary transition-colors">
                Terms of Service
              </a>
              <a href="#" className="hover:text-sidebar-primary transition-colors">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
