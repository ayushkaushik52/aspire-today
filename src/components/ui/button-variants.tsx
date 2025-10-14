import { Button } from "@/components/ui/button";
import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface HeroButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export const HeroButton = forwardRef<HTMLButtonElement, HeroButtonProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        className={cn(
          "bg-gradient-hero text-primary-foreground shadow-glow",
          "hover:scale-105 transform transition-all duration-300",
          "font-bold text-lg px-8 py-6 rounded-xl",
          className
        )}
        {...props}
      >
        {children}
      </Button>
    );
  }
);

HeroButton.displayName = "HeroButton";

export const SecondaryButton = forwardRef<HTMLButtonElement, HeroButtonProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        variant="secondary"
        className={cn(
          "hover:scale-105 transform transition-all duration-300",
          "font-semibold text-lg px-8 py-6 rounded-xl",
          className
        )}
        {...props}
      >
        {children}
      </Button>
    );
  }
);

SecondaryButton.displayName = "SecondaryButton";
