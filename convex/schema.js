import { defineSchema, defineTable } from "convex/server"
import { v } from "convex/values"

export default defineSchema({
  users: defineTable({
    name: v.string(),
    email: v.string(),
    picture: v.string(),
    uid: v.string(),
    token: v.optional(v.number()),
    phoneNumber: v.optional(v.string()), // Added optional fields for profile management
    address: v.optional(v.string()), // Added optional fields for profile management
    createdAt: v.string(),
  }),

  professionals: defineTable({
    uid: v.string(), // Clerk user ID
    email: v.string(),
    fullName: v.string(),
    phoneNumber: v.string(),
    phoneVerified: v.boolean(),

    // Professional details
    tradeCategory: v.string(), // e.g., "Plumbing", "Electrical", "Carpentry"
    yearsOfExperience: v.number(),
    hourlyRate: v.number(),
    serviceArea: v.string(), // e.g., "Melbourne, VIC"

    // Profile
    profilePhoto: v.optional(v.string()),
    bio: v.string(),

    // Documents
    idDocument: v.optional(v.string()),
    tradeLicense: v.optional(v.string()),
    certifications: v.optional(v.any()), // Array of certification documents

    // Status
    applicationStatus: v.string(), // "pending", "approved", "rejected"
    reviewNotes: v.optional(v.string()), // Admin notes

    // Metadata
    appliedAt: v.string(),
    reviewedAt: v.optional(v.string()),
    reviewedBy: v.optional(v.string()), // Admin ID

    // Availability
    isAvailable: v.boolean(),

    // Stats
    totalJobs: v.number(),
    completedJobs: v.number(),
    rating: v.optional(v.number()),
    earnings: v.number(),
  })
    .index("by_uid", ["uid"])
    .index("by_email", ["email"])
    .index("by_status", ["applicationStatus"]),

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
    professionalId: v.optional(v.id("professionals")),
    professionalAcceptedAt: v.optional(v.string()),

    videoCallRequested: v.optional(v.boolean()),
    videoCallRequestedBy: v.optional(v.string()), // "client" or "professional"
    videoCallApproved: v.optional(v.boolean()),
    videoCallLink: v.optional(v.string()),
  })
    .index("by_user", ["userId"])
    .index("by_professional", ["professionalId"])
    .index("by_status", ["status"]),

  conversations: defineTable({
    requestId: v.id("requests"),
    userId: v.id("users"),
    professionalId: v.optional(v.id("professionals")),
    messages: v.any(), // Array of message objects with sender info
    updatedAt: v.string(),
  }),
})
