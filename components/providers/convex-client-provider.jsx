"use client"

import { ConvexReactClient } from "convex/react"
import { ConvexProvider } from "convex/react"

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL || ""

const convex = new ConvexReactClient(convexUrl)

export function ConvexClientProvider({ children }) {
  if (!convexUrl) {
    console.error("Missing NEXT_PUBLIC_CONVEX_URL environment variable")
  }

  return <ConvexProvider client={convex}>{children}</ConvexProvider>
}
