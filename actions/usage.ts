"use server"

import { auth } from "@clerk/nextjs/server"

import type { UsageKind } from "@/db/schema"

// All features are free for now
export async function hasUsageLeft(_kind: UsageKind) {
  const { isAuthenticated } = await auth()
  if (!isAuthenticated) throw new Error("Unauthorized")
  return true
}
