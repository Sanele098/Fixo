import { v } from "convex/values"
import { mutation, query } from "./_generated/server"

// Create a new professional application
export const createApplication = mutation({
  args: {
    uid: v.string(),
    email: v.string(),
    fullName: v.string(),
    phoneNumber: v.string(),
    phoneVerified: v.boolean(),
    tradeCategory: v.string(),
    yearsOfExperience: v.number(),
    hourlyRate: v.number(),
    serviceArea: v.string(),
    bio: v.string(),
    profilePhoto: v.optional(v.string()),
    idDocument: v.optional(v.string()),
    tradeLicense: v.optional(v.string()),
    certifications: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    // Check if professional already exists
    const existing = await ctx.db
      .query("professionals")
      .withIndex("by_uid", (q) => q.eq("uid", args.uid))
      .first()

    if (existing) {
      throw new Error("Application already exists")
    }

    const professionalId = await ctx.db.insert("professionals", {
      uid: args.uid,
      email: args.email,
      fullName: args.fullName,
      phoneNumber: args.phoneNumber,
      phoneVerified: args.phoneVerified,
      tradeCategory: args.tradeCategory,
      yearsOfExperience: args.yearsOfExperience,
      hourlyRate: args.hourlyRate,
      serviceArea: args.serviceArea,
      bio: args.bio,
      profilePhoto: args.profilePhoto,
      idDocument: args.idDocument,
      tradeLicense: args.tradeLicense,
      certifications: args.certifications,
      applicationStatus: "pending",
      appliedAt: new Date().toISOString(),
      isAvailable: false,
      totalJobs: 0,
      completedJobs: 0,
      earnings: 0,
    })

    return professionalId
  },
})

// Get professional by Clerk UID
export const getByUid = query({
  args: { uid: v.string() },
  handler: async (ctx, args) => {
    const professional = await ctx.db
      .query("professionals")
      .withIndex("by_uid", (q) => q.eq("uid", args.uid))
      .first()

    return professional
  },
})

// Get professional by ID
export const getById = query({
  args: { id: v.id("professionals") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id)
  },
})

// Update professional availability
export const updateAvailability = mutation({
  args: {
    professionalId: v.id("professionals"),
    isAvailable: v.boolean(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.professionalId, {
      isAvailable: args.isAvailable,
    })
  },
})

// Update professional profile
export const updateProfile = mutation({
  args: {
    professionalId: v.id("professionals"),
    bio: v.optional(v.string()),
    hourlyRate: v.optional(v.number()),
    serviceArea: v.optional(v.string()),
    profilePhoto: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { professionalId, ...updates } = args
    await ctx.db.patch(professionalId, updates)
  },
})

// Admin: Review application
export const reviewApplication = mutation({
  args: {
    professionalId: v.id("professionals"),
    status: v.string(), // "approved" or "rejected"
    reviewNotes: v.optional(v.string()),
    reviewedBy: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.professionalId, {
      applicationStatus: args.status,
      reviewNotes: args.reviewNotes,
      reviewedAt: new Date().toISOString(),
      reviewedBy: args.reviewedBy,
      isAvailable: args.status === "approved",
    })
  },
})

// Get all pending applications (for admin)
export const getPendingApplications = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("professionals")
      .withIndex("by_status", (q) => q.eq("applicationStatus", "pending"))
      .collect()
  },
})

// Get all approved professionals
export const getApprovedProfessionals = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("professionals")
      .withIndex("by_status", (q) => q.eq("applicationStatus", "approved"))
      .collect()
  },
})

// Get available professionals by trade category
export const getAvailableByTrade = query({
  args: { tradeCategory: v.string() },
  handler: async (ctx, args) => {
    const professionals = await ctx.db
      .query("professionals")
      .withIndex("by_status", (q) => q.eq("applicationStatus", "approved"))
      .collect()

    return professionals.filter((p) => p.tradeCategory === args.tradeCategory && p.isAvailable)
  },
})

// Update job stats
export const updateJobStats = mutation({
  args: {
    professionalId: v.id("professionals"),
    jobCompleted: v.boolean(),
    earnings: v.number(),
  },
  handler: async (ctx, args) => {
    const professional = await ctx.db.get(args.professionalId)
    if (!professional) throw new Error("Professional not found")

    await ctx.db.patch(args.professionalId, {
      totalJobs: professional.totalJobs + 1,
      completedJobs: args.jobCompleted ? professional.completedJobs + 1 : professional.completedJobs,
      earnings: professional.earnings + args.earnings,
    })
  },
})

// Update professional rating
export const updateRating = mutation({
  args: {
    professionalId: v.id("professionals"),
    newRating: v.number(),
  },
  handler: async (ctx, args) => {
    const professional = await ctx.db.get(args.professionalId)
    if (!professional) throw new Error("Professional not found")

    // Calculate average rating
    const currentRating = professional.rating || 0
    const totalJobs = professional.totalJobs
    const averageRating = (currentRating * (totalJobs - 1) + args.newRating) / totalJobs

    await ctx.db.patch(args.professionalId, {
      rating: averageRating,
    })
  },
})
