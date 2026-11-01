"use client"

import * as React from "react"
import type { UsageKind } from "@/db/schema"
import type { Feature } from "@/lib/billing"

// Features are free for now: allow everything without paywalls
export function usePaywall() {
  const checkPlan = React.useCallback((_feature: Feature) => true, [])
  const showUsageLimit = React.useCallback((_kind: UsageKind) => {}, [])
  const checkUsage = React.useCallback(async (_kind: UsageKind) => true, [])

  return { checkPlan, checkUsage, showUsageLimit }
}
