import { defineSchema, defineTable } from "convex/server"
import { v } from "convex/values"

export default defineSchema({
  users: defineTable({
    name: v.string(),
    email: v.string(),
    picture: v.string(),
    uid: v.string(),
    token: v.optional(v.number()),
    createdAt: v.string(),
  }),

  requests: defineTable({
    userId: v.id("users"),
    type: v.string(), // "instant-help" or "handyman"
    title: v.string(),
    description: v.string(),
    status: v.string(), // "logged", "in-analysis", "fixing", "completed"

    // Common fields
    attachments: v.optional(v.any()), // Array of file info
    createdAt: v.string(),
    updatedAt: v.string(),

    // Instant help specific
    problemType: v.optional(v.string()),

    // Handyman specific
    serviceType: v.optional(v.string()),
    preferredDate: v.optional(v.string()),
    preferredTime: v.optional(v.string()),

    // Professional assignment
    professionalAssigned: v.boolean(),
    professionalId: v.optional(v.string()),
  }),

  conversations: defineTable({
    requestId: v.id("requests"),
    userId: v.id("users"),
    messages: v.any(), // Array of message objects
    updatedAt: v.string(),
  }),
})
