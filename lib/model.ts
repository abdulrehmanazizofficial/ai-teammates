import { google } from "@ai-sdk/google"
import type { LanguageModelUsage } from "ai"

export const CHAT_MODEL_ID = "gemini-3.1-flash-lite"

// The model the chat agent talks to
export function chatModel() {
  return google(CHAT_MODEL_ID)
}

// Standard Gemini 3.1 Flash-Lite text/image token prices per million.
const pricing = { input: 0.25, output: 1.5 }

// What a call to the chat model cost, in millionths of a dollar
export function chatModelCost(usage: LanguageModelUsage) {
  // Dollars per million tokens is millionths of a dollar per token
  return Math.ceil(
    (usage.inputTokens ?? 0) * pricing.input +
      (usage.outputTokens ?? 0) * pricing.output
  )
}
