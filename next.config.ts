import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  devIndicators: false,
}

// Keep Sentry out of the local dev startup graph; load it only for production builds.
export default async function getNextConfig(): Promise<NextConfig> {
  if (process.env.NODE_ENV !== "production") return nextConfig

  const { withSentryConfig } = await import("@sentry/nextjs/config")

  return withSentryConfig(nextConfig, {
    org: "enra-r3",
    project: "ai-teammates",

    // Uploads source maps on production builds; without it the build still succeeds.
    authToken: process.env.SENTRY_AUTH_TOKEN,

    // Railway builds have no .git to detect the commit from; locally this is unset and git HEAD is used.
    release: { name: process.env.RAILWAY_GIT_COMMIT_SHA },

    widenClientFileUpload: true,

    // Proxies browser events through the app so ad-blockers don't drop them.
    tunnelRoute: "/monitoring",

    silent: !process.env.CI,
  })
}
