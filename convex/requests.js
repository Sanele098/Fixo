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
