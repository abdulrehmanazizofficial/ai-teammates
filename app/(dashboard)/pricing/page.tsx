import Link from "next/link"
import { auth } from "@clerk/nextjs/server"

import { buttonVariants } from "@/components/ui/button"

export default async function Page() {
  await auth.protect()

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col items-center justify-center gap-6 p-6 py-20 text-center">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Free Access</h1>
        <p className="text-muted-foreground max-w-md">
          All features including AI bots, cloud sandboxes, and desktops are currently free. No payment or subscription required.
        </p>
      </div>
      <Link href="/" className={buttonVariants()}>
        Go to Chats
      </Link>
    </div>
  )
}
