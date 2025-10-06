import { Inter } from "next/font/google"
import { ClerkProvider } from "@clerk/nextjs"
import "./globals.css"
import { ConvexClientProvider } from "@/components/providers/convex-client-provider"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

export const metadata = {
  title: "Fixo - Instant Expert Help for Home Repairs",
  description:
    "Connect with professional tradies for instant video guidance. No waiting, no expensive call-out fees. Get expert help for plumbing, electrical, HVAC and more.",
  generator: "v0.app",
}

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`font-sans ${inter.variable}`}>
          <ConvexClientProvider>{children}</ConvexClientProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
