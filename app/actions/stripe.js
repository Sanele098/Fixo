"use server"

import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-12-18.acacia",
})

export async function createPaymentSession(jobId, amount, professionalName, serviceName) {
  try {
    const session = await stripe.checkout.sessions.create({
      ui_mode: "embedded",
      redirect_on_completion: "never",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `${serviceName} - ${professionalName}`,
              description: `Payment for job #${jobId}`,
            },
            unit_amount: Math.round(amount * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      metadata: {
        jobId: jobId.toString(),
      },
    })

    return session.client_secret
  } catch (error) {
    console.error("[v0] Error creating payment session:", error)
    throw new Error("Failed to create payment session")
  }
}
