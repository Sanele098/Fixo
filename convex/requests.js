import { v } from "convex/values"
import { mutation, query } from "./_generated/server"

export const CreateRequest = mutation({
  args: {
    userId: v.id("users"),
    type: v.string(),
    title: v.string(),
    description: v.string(),
    problemType: v.optional(v.string()),
    serviceType: v.optional(v.string()),
    preferredDate: v.optional(v.string()),
    preferredTime: v.optional(v.string()),
    attachments: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const requestId = await ctx.db.insert("requests", {
      userId: args.userId,
      type: args.type,
      title: args.title,
      description: args.description,
      status: "logged",
      problemType: args.problemType,
      serviceType: args.serviceType,
      preferredDate: args.preferredDate,
      preferredTime: args.preferredTime,
      attachments: args.attachments,
      professionalAssigned: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })

    // Create empty conversation for this request
    await ctx.db.insert("conversations", {
      requestId: requestId,
      userId: args.userId,
      messages: [],
      updatedAt: new Date().toISOString(),
    })

    return requestId
  },
})

export const GetUserRequests = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const requests = await ctx.db
      .query("requests")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .order("desc")
      .collect()
    return requests
  },
})

export const GetRequestById = query({
  args: {
    requestId: v.id("requests"),
  },
  handler: async (ctx, args) => {
    const request = await ctx.db.get(args.requestId)
    return request
  },
})

export const UpdateRequestStatus = mutation({
  args: {
    requestId: v.id("requests"),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    const statusFlow = {
      logged: "in-analysis",
      "in-analysis": "fixing",
      fixing: "completed",
    }

    const newStatus = args.status || statusFlow[args.status] || "completed"
    const professionalAssigned = newStatus !== "logged"

    const result = await ctx.db.patch(args.requestId, {
      status: newStatus,
      professionalAssigned: professionalAssigned,
      updatedAt: new Date().toISOString(),
    })

    return result
  },
})

export const DeleteRequest = mutation({
  args: {
    requestId: v.id("requests"),
  },
  handler: async (ctx, args) => {
    const request = await ctx.db.get(args.requestId)

    if (!request) {
      throw new Error("Request not found")
    }

    if (request.status === "completed") {
      throw new Error("Cannot delete completed requests")
    }

    // Delete associated conversation
    const conversations = await ctx.db
      .query("conversations")
      .filter((q) => q.eq(q.field("requestId"), args.requestId))
      .collect()

    for (const conversation of conversations) {
      await ctx.db.delete(conversation._id)
    }

    // Delete the request
    await ctx.db.delete(args.requestId)
    return { success: true }
  },
})

export const GetAvailableRequests = query({
  args: {},
  handler: async (ctx) => {
    // Get all requests that don't have a professional assigned yet
    const requests = await ctx.db
      .query("requests")
      .filter((q) => q.eq(q.field("professionalAssigned"), false))
      .order("desc")
      .collect()

    // Fetch user details for each request
    const requestsWithUsers = await Promise.all(
      requests.map(async (request) => {
        const user = await ctx.db.get(request.userId)
        return {
          ...request,
          clientName: user?.name || "Unknown Client",
          clientEmail: user?.email || "",
        }
      }),
    )

    return requestsWithUsers
  },
})

export const AcceptRequest = mutation({
  args: {
    requestId: v.id("requests"),
    professionalId: v.id("professionals"),
  },
  handler: async (ctx, args) => {
    // Update the request with professional assignment
    await ctx.db.patch(args.requestId, {
      professionalAssigned: true,
      professionalId: args.professionalId,
      professionalAcceptedAt: new Date().toISOString(),
      status: "in-analysis",
      updatedAt: new Date().toISOString(),
    })

    // Update professional stats
    const professional = await ctx.db.get(args.professionalId)
    if (professional) {
      await ctx.db.patch(args.professionalId, {
        totalJobs: professional.totalJobs + 1,
      })
    }

    return { success: true }
  },
})

export const GetProfessionalRequests = query({
  args: {
    professionalId: v.id("professionals"),
  },
  handler: async (ctx, args) => {
    const requests = await ctx.db
      .query("requests")
      .withIndex("by_professional", (q) => q.eq("professionalId", args.professionalId))
      .order("desc")
      .collect()

    // Fetch user details for each request
    const requestsWithUsers = await Promise.all(
      requests.map(async (request) => {
        const user = await ctx.db.get(request.userId)
        return {
          ...request,
          clientName: user?.name || "Unknown Client",
          clientEmail: user?.email || "",
        }
      }),
    )

    return requestsWithUsers
  },
})

export const UpdateRequestStatusByProfessional = mutation({
  args: {
    requestId: v.id("requests"),
    status: v.string(),
    professionalId: v.id("professionals"),
  },
  handler: async (ctx, args) => {
    // Verify the professional is assigned to this request
    const request = await ctx.db.get(args.requestId)
    if (!request || request.professionalId !== args.professionalId) {
      throw new Error("Unauthorized: You are not assigned to this request")
    }

    await ctx.db.patch(args.requestId, {
      status: args.status,
      updatedAt: new Date().toISOString(),
    })

    // If job is completed, update professional stats
    if (args.status === "completed") {
      const professional = await ctx.db.get(args.professionalId)
      if (professional) {
        await ctx.db.patch(args.professionalId, {
          completedJobs: professional.completedJobs + 1,
          earnings: professional.earnings + professional.hourlyRate,
        })
      }
    }

    return { success: true }
  },
})

export const RequestVideoCall = mutation({
  args: {
    requestId: v.id("requests"),
    requestedBy: v.string(), // "client" or "professional"
  },
  handler: async (ctx, args) => {
    const request = await ctx.db.get(args.requestId)

    if (!request) {
      throw new Error("Request not found")
    }

    await ctx.db.patch(args.requestId, {
      videoCallRequested: true,
      videoCallRequestedBy: args.requestedBy,
      videoCallApproved: false,
      updatedAt: new Date().toISOString(),
    })

    return { success: true }
  },
})

export const ApproveVideoCall = mutation({
  args: {
    requestId: v.id("requests"),
  },
  handler: async (ctx, args) => {
    const request = await ctx.db.get(args.requestId)

    if (!request) {
      throw new Error("Request not found")
    }

    // Generate Google Meet link (in production, use Google Meet API)
    const meetingId = Math.random().toString(36).substring(7)
    const videoCallLink = `https://meet.google.com/${meetingId}`

    await ctx.db.patch(args.requestId, {
      videoCallApproved: true,
      videoCallLink: videoCallLink,
      updatedAt: new Date().toISOString(),
    })

    return { success: true, videoCallLink }
  },
})
