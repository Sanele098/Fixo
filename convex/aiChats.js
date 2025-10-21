import { v } from "convex/values"
import { mutation, query } from "./_generated/server"

// Create a new AI chat
export const CreateAIChat = mutation({
  args: {
    userId: v.id("users"),
    title: v.string(),
    firstMessage: v.string(),
  },
  handler: async (ctx, args) => {
    const chatId = await ctx.db.insert("aiChats", {
      userId: args.userId,
      title: args.title,
      messages: [
        {
          id: Date.now(),
          role: "user",
          content: args.firstMessage,
          timestamp: new Date().toISOString(),
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })

    return chatId
  },
})

// Get all AI chats for a user
export const GetUserAIChats = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const chats = await ctx.db
      .query("aiChats")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect()

    return chats
  },
})

// Get a specific AI chat by ID
export const GetAIChatById = query({
  args: { chatId: v.id("aiChats") },
  handler: async (ctx, args) => {
    const chat = await ctx.db.get(args.chatId)
    return chat
  },
})

// Add a message to an existing chat
export const AddMessageToChat = mutation({
  args: {
    chatId: v.id("aiChats"),
    role: v.string(), // "user" or "assistant"
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const chat = await ctx.db.get(args.chatId)
    if (!chat) {
      throw new Error("Chat not found")
    }

    const newMessage = {
      id: Date.now(),
      role: args.role,
      content: args.content,
      timestamp: new Date().toISOString(),
    }

    const updatedMessages = [...chat.messages, newMessage]

    await ctx.db.patch(args.chatId, {
      messages: updatedMessages,
      updatedAt: new Date().toISOString(),
    })

    return newMessage
  },
})

// Delete an AI chat
export const DeleteAIChat = mutation({
  args: { chatId: v.id("aiChats") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.chatId)
  },
})
