import { cn } from "@/lib/utils";
import React, { ReactNode } from "react";
import { FieldValues, Path, useController, UseControllerProps } from "react-hook-form";
import { Text, TextInput, TextInputProps, View } from "react-native";
import { tv, type VariantProps } from "tailwind-variants";
import { Typography } from "../text";

/**
 * Input variants defined using Uniwind's cva (Class Variance Authority)
 */
const inputVariants = tv({
  base: "bg-[#f9fafb] rounded-lg border border-[#e5e7eb] px-4 py-3 text-base text-[#1a2e1f] rounded-xl px-4 py-3 text-base  ",
  variants: {
    hasError: {
      true: "border-red-500",
      false: "border-gray-300",
    },
    disabled: "bg-gray-100 text-gray-400",
  },
});

interface InputProps<TFieldValues extends FieldValues>
  extends
    Omit<TextInputProps, "defaultValue" | "value" | "onChange" | "onChangeText" | "onBlur" | "disabled">,
    Omit<VariantProps<typeof inputVariants>, "disabled">,
    Omit<UseControllerProps<TFieldValues>, "disabled"> {
  label?: ReactNode;
  placeholder?: string;
  name: Path<TFieldValues>; // Ensure name is always required for react-hook-form
  className?: string;
  labelClassName?: string;
  disabled?: boolean;
  required?: boolean;
  addons?: {
    left?: ReactNode;
    right?: ReactNode;
  };
  wrapperClassName?: string;
}

const Input = <TFieldValues extends FieldValues>({
  label,
  placeholder,
  name,
  control,
  rules,
  defaultValue,
  hasError,
  disabled = false,
  className,
  labelClassName,
  required = false,
  multiline = false,
  wrapperClassName,
  addons,
  ...props
}: InputProps<TFieldValues>) => {
  const {
    field,
    fieldState: { error },
  } = useController({
    name,
    control,
    rules,
    defaultValue,
  });

  const showError = hasError || !!error;

  return (
    <View className={cn("mb-4  w-full flex-1", wrapperClassName)}>
      {label && (
        <Typography className={cn("text-sm text-[#1a2e1f] font-medium mb-2", labelClassName)}>
          {label}
          {required && <Typography className="text-red-500"> *</Typography>}
        </Typography>
      )}
      <TextInput
        className={inputVariants({ hasError: showError, className })}
        placeholder={placeholder}
        editable={!disabled}
        multiline={multiline}
        placeholderTextColor="#9CA3AF"
        onChangeText={field.onChange}
        onBlur={field.onBlur}
        value={field.value}
        {...props}
      />
      {showError && error?.message && <Text className="mt-1 text-sm text-red-500">{error.message}</Text>}
    </View>
  );
};

export { Input };
