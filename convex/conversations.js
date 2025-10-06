import { v } from "convex/values"
import { mutation, query } from "./_generated/server"

export const GetConversation = query({
  args: {
    requestId: v.id("requests"),
  },
  handler: async (ctx, args) => {
    const conversation = await ctx.db
      .query("conversations")
      .filter((q) => q.eq(q.field("requestId"), args.requestId))
      .first()
    return conversation
  },
})

export const AddMessage = mutation({
  args: {
    requestId: v.id("requests"),
    userId: v.id("users"),
    message: v.any(),
  },
  handler: async (ctx, args) => {
    const conversation = await ctx.db
      .query("conversations")
      .filter((q) => q.eq(q.field("requestId"), args.requestId))
      .first()

    if (conversation) {
      const updatedMessages = [...(conversation.messages || []), args.message]

      await ctx.db.patch(conversation._id, {
        messages: updatedMessages,
        updatedAt: new Date().toISOString(),
      })

      return { success: true }
    }

    return { success: false }
  },
})
