import React from "react";
import { TextInput, View, Text, TextInputProps } from "react-native";
import {
  useController,
  FieldValues,
  UseControllerProps,
  Path,
} from "react-hook-form";
import { tv, type VariantProps } from "tailwind-variants";

/**
 * Input variants defined using Uniwind's cva (Class Variance Authority)
 */
const inputVariants = tv({
  base: "border rounded-xl px-4 py-3 text-base focus:border-green-500",
  variants: {
    hasError: {
      true: "border-red-500",
      false: "border-gray-300",
    },
    disabled: {
      true: "bg-gray-100 text-gray-400",
      false: "bg-white text-gray-900",
    },
  },
});

interface InputProps<TFieldValues extends FieldValues>
  extends Omit<
      TextInputProps,
      | "defaultValue"
      | "value"
      | "onChange"
      | "onChangeText"
      | "onBlur"
      | "disabled"
    >,
    Omit<VariantProps<typeof inputVariants>, "disabled">,
    Omit<UseControllerProps<TFieldValues>, "disabled"> {
  label?: React.ReactNode;
  placeholder?: string;
  name: Path<TFieldValues>; // Ensure name is always required for react-hook-form
  className?: string;
  labelClassName?: string;
  disabled?: boolean;
}

const Input = <TFieldValues extends FieldValues>({
  label,
  placeholder,
  name,
  control,
  rules,
  defaultValue,
  hasError,
  disabled,
  className,
  labelClassName,
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
    <View className="mb-4">
      {label && (
        <Text className={`text-sm  font-medium mb-2 ${labelClassName || ""}`}>
          {label}
        </Text>
      )}
      <TextInput
        className={inputVariants({ hasError: showError, disabled, className })}
        placeholder={placeholder}
        onChangeText={field.onChange}
        onBlur={field.onBlur}
        value={field.value}
        editable={!disabled}
        placeholderTextColor="#9CA3AF" // Default gray-400 for placeholders
        {...props}
      />
      {showError && error?.message && (
        <Text className="mt-1 text-sm text-red-500">{error.message}</Text>
      )}
    </View>
  );
};

export { Input };
