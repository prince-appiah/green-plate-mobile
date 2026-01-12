import React from "react";
import {
  Modal as RNModal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { tv, type VariantProps } from "tailwind-variants";
import { Ionicons } from "@expo/vector-icons";

// Base container styles for the modal backdrop and content
const modalContainerVariants = tv({
  base: "flex-1 justify-center items-center bg-black bg-opacity-50",

  variants: {
    size: {
      sm: "p-4", // Padding for smaller modals
      md: "p-6", // Standard padding
      lg: "p-8", // Larger padding
    },
  },
  defaultVariants: {
    size: "md",
  },
});

// Styles for the modal content card
const modalCardVariants = tv({
  base: "bg-white rounded-xl shadow-xl overflow-hidden w-full",

  variants: {
    size: {
      sm: "max-w-sm", // Max width for small modals
      md: "max-w-md", // Max width for medium modals
      lg: "max-w-lg", // Max width for large modals
    },
  },
  defaultVariants: {
    size: "md",
  },
});

// Styles for the modal header
const modalHeaderVariants = tv({
  base: "flex-row justify-between items-center px-5 py-4 border-b border-gray-200",
  variants: {
    hasCloseButton: {
      true: "", // No extra styling needed if close button is present
      false: "justify-center", // Center content if no close button
    },
  },
  defaultVariants: {
    hasCloseButton: true,
  },
});

// Styles for the modal title
const modalTitleVariants = tv({ base: "text-xl font-bold text-gray-800" });

// Styles for modal body content padding
const modalBodyVariants = tv({ base: "px-5 py-4" });

// Styles for modal footer
const modalFooterVariants = tv({
  base: "flex-row justify-end px-5 py-4 border-t border-gray-200 space-x-3",
});

interface ModalProps
  extends
    VariantProps<typeof modalContainerVariants>,
    VariantProps<typeof modalCardVariants> {
  isVisible: boolean;
  onClose?: () => void;
  children: React.ReactNode;
  title?: string;
  showCloseButton?: boolean;
  footer?: React.ReactNode; // For custom footer content like buttons
  transparent?: boolean; // Whether the modal should be transparent (no backdrop)
}

const Modal: React.FC<ModalProps> = ({
  isVisible,
  onClose,
  children,
  title,
  showCloseButton = true,
  footer,
  size,
  transparent,
}) => {
  return (
    <RNModal
      animationType="fade" // You can change this to 'slide' or 'none'
      transparent={transparent ?? !onClose} // Make modal transparent if no onClose handler is provided, or if explicitly set
      visible={isVisible}
      onRequestClose={onClose} // For Android back button
    >
      <View className={modalContainerVariants({ size: size ?? "md" })}>
        <View className={modalCardVariants({ size: size ?? "md" })}>
          {/* Modal Header */}
          {(title || showCloseButton) && (
            <View
              className={modalHeaderVariants({
                hasCloseButton: showCloseButton,
              })}
            >
              {title && <Text className={modalTitleVariants()}>{title}</Text>}
              {showCloseButton && (
                <TouchableOpacity onPress={onClose} activeOpacity={0.7}>
                  <Ionicons name="close-circle" size={24} color="#9CA3AF" />
                </TouchableOpacity>
              )}
            </View>
          )}

          {/* Modal Body */}
          <View className={modalBodyVariants()}>{children}</View>

          {/* Modal Footer */}
          {footer && <View className={modalFooterVariants()}>{footer}</View>}
        </View>
      </View>
    </RNModal>
  );
};

export { Modal };
