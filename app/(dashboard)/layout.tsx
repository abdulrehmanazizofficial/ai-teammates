import { cookies } from "next/headers"
import { auth } from "@clerk/nextjs/server"

import { AppSidebar } from "@/components/app-sidebar"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // The sidebar loads the user's chats, so signed-out visitors go to sign-in first
  await auth.protect()

  // SidebarProvider writes this cookie on every toggle
  const cookieStore = await cookies()
  const defaultOpen = cookieStore.get("sidebar_state")?.value !== "false"

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar />
      <SidebarTrigger className="fixed left-3 top-3 z-40 md:hidden" />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  )
}
