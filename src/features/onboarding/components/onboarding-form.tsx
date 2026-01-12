import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface OnboardingFormProps {
  // Define props if needed, e.g., onSubmit, currentStep, etc.
}

export function OnboardingForm({}: OnboardingFormProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Onboarding!</Text>
      <Text style={styles.subtitle}>
        This is a placeholder for your onboarding steps.
      </Text>
      {/* Add form elements, navigation buttons, etc., here */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5', // Example background
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
  },
});
