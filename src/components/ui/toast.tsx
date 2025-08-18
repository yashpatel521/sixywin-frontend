import * as React from "react";
import * as ToastPrimitives from "@radix-ui/react-toast";
import { cva, type VariantProps } from "class-variance-authority";
import { Icons } from "@/components/ui/icons";
import { cn } from "@/libs/utils";

const ToastProvider = ToastPrimitives.Provider;

const ToastViewport = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Viewport>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Viewport
    ref={ref}
    className={cn(
      // 📱 Mobile: small, centered bottom
      "fixed bottom-2 left-1/2 z-[100] flex -translate-x-1/2 flex-col space-y-2 p-2 w-auto max-w-[90%]",
      // 💻 Desktop: stacked bottom-right
      "sm:left-auto sm:right-0 sm:bottom-0 sm:max-w-[420px] sm:translate-x-0 sm:p-4",
      className
    )}
    {...props}
  />
));
ToastViewport.displayName = ToastPrimitives.Viewport.displayName;

// Variants (color styles)
const toastVariants = cva(
  "glassmorphism group pointer-events-auto relative flex items-center justify-between overflow-hidden border shadow-lg transition-all data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full sm:data-[state=open]:slide-in-from-bottom-full",
  {
    variants: {
      variant: {
        default: "border-border/20 text-foreground",
        destructive:
          "destructive border-destructive/30 bg-destructive/50 text-destructive-foreground",
        success:
          "border-[hsl(var(--success)/0.3)] bg-[hsl(var(--success)/0.5)] text-[hsl(var(--success-foreground))]",
        info: "border-[hsl(var(--info)/0.3)] bg-[hsl(var(--info)/0.5)] text-[hsl(var(--info-foreground))]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const variantIcons = {
  default: null,
  destructive: (
    <Icons.alertCircle className="h-4 w-4 text-destructive-foreground" />
  ),
  success: (
    <Icons.checkCircle className="h-4 w-4 text-[hsl(var(--success-foreground))]" />
  ),
  info: <Icons.info className="h-4 w-4 text-[hsl(var(--info-foreground))]" />,
};

const Toast = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root> &
    VariantProps<typeof toastVariants> & {
      title?: string;
      description?: string;
    }
>(({ className, variant, title, description, children, ...props }, ref) => {
  return (
    <ToastPrimitives.Root
      ref={ref}
      className={cn(
        toastVariants({ variant }),
        // 📱 Mobile: very compact
        "p-2 rounded-md text-xs gap-2",
        // 💻 Desktop: normal size
        "sm:p-6 sm:pr-8 sm:rounded-md sm:text-sm sm:gap-3",
        className
      )}
      {...props}
    >
      <div className="flex items-start gap-2 sm:gap-3">
        {variant && variantIcons[variant]}
        <div className="flex flex-col gap-0.5 sm:gap-1">
          {title && <ToastTitle>{title}</ToastTitle>}
          {description && <ToastDescription>{description}</ToastDescription>}
          {children}
        </div>
      </div>
      <ToastClose />
    </ToastPrimitives.Root>
  );
});
Toast.displayName = ToastPrimitives.Root.displayName;

const ToastAction = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Action>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Action>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Action
    ref={ref}
    className={cn(
      // 📱 Mobile: tiny button
      "inline-flex h-6 px-2 text-xs rounded border bg-transparent font-medium",
      // 💻 Desktop: normal button
      "sm:h-8 sm:px-3 sm:text-sm",
      className
    )}
    {...props}
  />
));
ToastAction.displayName = ToastPrimitives.Action.displayName;

const ToastClose = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Close>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Close>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Close
    ref={ref}
    className={cn(
      // 📱 Mobile: small button
      "absolute right-1 top-1 rounded p-1 text-foreground/70",
      // 💻 Desktop: subtle with hover/focus
      "sm:right-2 sm:top-2 sm:text-foreground/50 sm:opacity-0 sm:transition-opacity sm:hover:text-foreground sm:focus:opacity-100 sm:group-hover:opacity-100",
      className
    )}
    toast-close=""
    {...props}
  >
    <Icons.x className="h-3 w-3 sm:h-4 sm:w-4" />
  </ToastPrimitives.Close>
));
ToastClose.displayName = ToastPrimitives.Close.displayName;

const ToastTitle = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Title>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Title>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Title
    ref={ref}
    className={cn("font-medium text-xs sm:text-sm", className)}
    {...props}
  />
));
ToastTitle.displayName = ToastPrimitives.Title.displayName;

const ToastDescription = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Description>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Description>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Description
    ref={ref}
    className={cn("opacity-90 text-[10px] sm:text-xs", className)}
    {...props}
  />
));
ToastDescription.displayName = ToastPrimitives.Description.displayName;

type ToastProps = React.ComponentPropsWithoutRef<typeof Toast>;
type ToastActionElement = React.ReactElement<typeof ToastAction>;

export {
  type ToastProps,
  type ToastActionElement,
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
};
