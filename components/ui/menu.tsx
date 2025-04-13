"use client"

import * as React from "react"
import { GripVertical } from "lucide-react"
import { cn } from "@/lib/utils"

interface MenuProps extends React.HTMLAttributes<HTMLDivElement> {}

const Menu = React.forwardRef<HTMLDivElement, MenuProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("inline-flex", className)}
        {...props}
      >
        <GripVertical className="h-4 w-4" />
      </div>
    )
  }
)
Menu.displayName = "Menu"

export { Menu } 