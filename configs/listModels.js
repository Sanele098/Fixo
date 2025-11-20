// listModels.js
const { GoogleGenerativeAI } = require("@google/generative-ai");

const apiKey = process.env.GOOGLE_API_KEY;
if (!apiKey) {
  throw new Error("GOOGLE_API_KEY environment variable is required");
}

async function main() {
  const genAI = new GoogleGenerativeAI(apiKey);
  const models = await genAI.listModels();
  console.log(models);
}

main().catch(console.error);
