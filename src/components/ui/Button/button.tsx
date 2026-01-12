import React from "react";
import { TouchableOpacity, Text, ActivityIndicator } from "react-native";
import { tv, type VariantProps } from "tailwind-variants";

/**
 * Button variants defined using Uniwind's cva (Class Variance Authority)
 */
const buttonVariants = tv({
  base: "flex flex-row items-center justify-center rounded-xl px-4 py-3 active:opacity-70 transition-all",
  variants: {
    variant: {
      primary: "bg-green-600",
      secondary: "bg-blue-600",
      outline: "border-2 border-green-600 bg-transparent",
      ghost: "bg-transparent",
      danger: "bg-red-500",
    },
    size: {
      sm: "px-3 py-2",
      md: "px-4 py-3",
      lg: "px-6 py-4",
    },
    fullWidth: {
      true: "w-full",
    },
  },
  defaultVariants: {
    variant: "primary",
    size: "md",
  },
});

const textVariants = tv({
  base: "font-semibold text-center",
  variants: {
    variant: {
      primary: "text-white",
      secondary: "text-white",
      outline: "text-green-600",
      ghost: "text-green-600",
      danger: "text-white",
    },
    size: {
      sm: "text-sm",
      md: "text-base",
      lg: "text-lg",
    },
  },
  defaultVariants: {
    variant: "primary",
    size: "md",
  },
});

interface ButtonProps
  extends
    React.ComponentPropsWithoutRef<typeof TouchableOpacity>,
    VariantProps<typeof buttonVariants> {
  children: React.ReactNode;
  isLoading?: boolean;
  textClassName?: string;
}

const Button = ({
  children,
  variant,
  size,
  fullWidth,
  isLoading,
  className,
  textClassName,
  disabled,
  ...props
}: ButtonProps) => {
  const isDisabled = disabled || isLoading;

  return (
    <TouchableOpacity
      className={buttonVariants({ variant, size, fullWidth, className })}
      disabled={isDisabled}
      activeOpacity={0.7}
      {...props}
    >
      {isLoading ? (
        <ActivityIndicator
          size="small"
          color={
            variant === "outline" || variant === "ghost" ? "#16a34a" : "#ffffff"
          }
        />
      ) : (
        <Text
          className={textVariants({ variant, size, className: textClassName })}
        >
          {children}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export { Button, buttonVariants };
