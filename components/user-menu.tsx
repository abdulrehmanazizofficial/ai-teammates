"use client"

import * as React from "react"
import { UserButton } from "@clerk/nextjs"
import { GaugeIcon } from "lucide-react"

// The account button in the sidebar footer, with the usage page in its menu.
// A client component, as the menu's parts only exist on the client.
function UserMenu() {
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div
        aria-hidden="true"
        className="flex h-8 w-full items-center gap-2 rounded-md p-2 group-data-[collapsible=icon]:p-1"
      >
        <span className="size-6 shrink-0 rounded-full bg-sidebar-accent" />
        <span className="h-3 w-24 rounded bg-sidebar-accent group-data-[collapsible=icon]:hidden" />
      </div>
    )
  }

  return (
    // Clerk's own styles beat plain utilities, so the SidebarMenuButton classes are mirrored here as important.
    <UserButton
      showName
      appearance={{
        elements: {
          rootBox: "flex! w-full!",
          userButtonTrigger:
            "flex! h-8! w-full! items-center! justify-start! gap-2! overflow-hidden! rounded-md! p-2! text-left! text-sm! text-sidebar-foreground! shadow-none! ring-sidebar-ring! outline-hidden! hover:bg-sidebar-accent! hover:text-sidebar-accent-foreground! focus-visible:ring-2! active:bg-sidebar-accent! active:text-sidebar-accent-foreground! aria-expanded:bg-sidebar-accent! aria-expanded:text-sidebar-accent-foreground! group-data-[collapsible=icon]:p-1!",
          userButtonBox: "min-w-0! flex-1! gap-2!",
          userButtonAvatarBox: "order-first! size-6! shrink-0!",
          userButtonOuterIdentifier:
            "truncate! ps-0! text-left! text-sm! font-normal! text-inherit!",
        },
      }}
    >
      <UserButton.MenuItems>
        <UserButton.Action label="manageAccount" />
        <UserButton.Link
          label="Usage"
          labelIcon={<GaugeIcon className="size-4" />}
          href="/usage"
        />
        <UserButton.Action label="signOut" />
      </UserButton.MenuItems>
    </UserButton>
  )
}

export { UserMenu }
