const { GoogleGenerativeAI } = require("@google/generative-ai");

const apiKey = 'AIzaSyA4hvvAxRZ4ZLWhbY1NatQiV8AdNR8Pm4o';
if (!apiKey) {
  throw new Error("GOOGLE_API_KEY environment variable is required");
}

async function main() {
  const genAI = new GoogleGenerativeAI(apiKey);

  try {
    // genAI.models is an object keyed by model name
    const models = genAI.models;

    console.log("Available models that support generateContent:");
    for (const modelName in models) {
      const m = models[modelName];
      if (m.supportedMethods.includes("generateContent")) {
        console.log(`- ${modelName} | ${m.description || "No description"}`);
      }
    }
  } catch (err) {
    console.error("Failed to list models:", err);
  }
}

main();
