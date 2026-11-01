import { Spinner } from "@/components/ui/spinner"

export default function LoadingChat() {
  return (
    <div className="flex h-svh items-center justify-center gap-2 text-sm text-muted-foreground">
      <Spinner />
      Opening assistant…
    </div>
  )
}
