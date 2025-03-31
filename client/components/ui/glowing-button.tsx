import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const glowingButtonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 relative group",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        outline: "border border-primary/20 bg-primary/5 hover:bg-primary/10 text-foreground",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

export interface GlowingButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof glowingButtonVariants> {
  asChild?: boolean
}

const GlowingButton = React.forwardRef<HTMLButtonElement, GlowingButtonProps>(
  ({ className, variant, size, asChild = false, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"

    return (
      <div className="relative group">
        <div className="absolute -inset-0.5 rounded-lg bg-gradient-to-r from-primary/50 to-primary-foreground/50 opacity-0 blur transition group-hover:opacity-70 group-hover:blur-md"></div>
        <Comp className={cn(glowingButtonVariants({ variant, size, className }))} ref={ref} {...props}>
          {children}
        </Comp>
      </div>
    )
  },
)
GlowingButton.displayName = "GlowingButton"

export { GlowingButton }

