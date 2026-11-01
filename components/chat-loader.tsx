"use client"

import dynamic from "next/dynamic"

import { Spinner } from "@/components/ui/spinner"

const Chat = dynamic(
  () => import("@/components/chat").then((module) => module.Chat),
  {
    ssr: false,
    loading: () => (
      <div className="flex min-h-0 flex-1 items-center justify-center gap-2 text-sm text-muted-foreground">
        <Spinner />
        Opening conversation…
      </div>
    ),
  }
)

export { Chat }
