import React, { Component, ErrorInfo, ReactNode } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import ErrorBoundary from "react-native-error-boundary";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class GlobalErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  private errorHandler = (error: Error, stackTrace: string) => {
    /* Log the error to an error reporting service */
  };

  public render() {
    return (
      <ErrorBoundary
        onError={this.errorHandler}
        FallbackComponent={ErrorFallback}
      >
        {this.props.children}
      </ErrorBoundary>
    );
  }
}

interface ErrorFallbackProps {
  error: Error;
  resetError: Function;
}

const ErrorFallback = ({ error, resetError }: ErrorFallbackProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Oops! Something went wrong</Text>
      <Text style={styles.message}>
        We're sorry, but an unexpected error occurred. Please try again later.
      </Text>
      <TouchableOpacity style={styles.button} onPress={() => resetError()}>
        <Text style={styles.buttonText}>Try again</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  message: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
    color: "#666",
  },
  button: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default GlobalErrorBoundary;
