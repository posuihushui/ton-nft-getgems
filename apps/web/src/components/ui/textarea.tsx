import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-28 w-full rounded-[11px] border border-black/5 bg-white/90 px-4 py-3 text-[15px] tracking-[-0.016em] text-foreground shadow-[inset_0_0_0_1px_rgba(255,255,255,0.6)] transition-all outline-none placeholder:text-black/45 focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-primary/15 disabled:cursor-not-allowed disabled:bg-black/[0.03] disabled:text-black/35 disabled:opacity-100 aria-invalid:border-destructive aria-invalid:ring-4 aria-invalid:ring-destructive/15 md:text-[15px]",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
