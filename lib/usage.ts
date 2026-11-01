import { and, eq, gte, sql } from "drizzle-orm"

import { db } from "@/db"
import { usageEntries, type NewUsageEntry, type UsageKind } from "@/db/schema"

// What one billing period includes (used for display/limits only)
export const usageLimits: Record<UsageKind, number> = {
  // $10 of model spend, in millionths of a dollar
  ai: 10_000_000,
  // 50 hours of running sandboxes, in seconds
  sandbox: 50 * 60 * 60,
}

// Fixed free period: rolling 30-day window from now
function getFreePeriod() {
  const now = new Date()
  const start = new Date(now)
  start.setDate(start.getDate() - 30)
  const end = new Date(now)
  end.setDate(end.getDate() + 30)
  return { start, end }
}

// What the user has used. Always returns data (no paid plan required).
export async function getUsage(userId: string) {
  const period = getFreePeriod()

  const rows = await db
    .select({
      kind: usageEntries.kind,
      amount: sql`sum(${usageEntries.amount})`.mapWith(Number),
    })
    .from(usageEntries)
    .where(
      and(
        eq(usageEntries.userId, userId),
        gte(usageEntries.createdAt, period.start)
      )
    )
    .groupBy(usageEntries.kind)

  const used: Record<UsageKind, number> = { ai: 0, sandbox: 0 }
  for (const row of rows) used[row.kind] = row.amount

  return {
    period,
    used,
    remaining: {
      ai: Math.max(0, usageLimits.ai - used.ai),
      sandbox: Math.max(0, usageLimits.sandbox - used.sandbox),
    },
  }
}

export type Usage = NonNullable<Awaited<ReturnType<typeof getUsage>>>

// Adds to the ledger. An entry whose key is already there is left out.
export async function recordUsage(entries: NewUsageEntry[]) {
  if (entries.length === 0) return

  await db
    .insert(usageEntries)
    .values(entries)
    .onConflictDoNothing({ target: usageEntries.idempotencyKey })
}
