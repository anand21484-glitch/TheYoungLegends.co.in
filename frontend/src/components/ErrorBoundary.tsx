// Catches unexpected JS errors anywhere in the app so a single bug
// (a bad tap, a missing bit of data, a timing glitch) shows a friendly
// "Try Again" screen instead of force-closing the whole app.
// This directly targets Google Play's "App stability" rejection:
// "make sure the app runs properly and doesn't crash, freeze, or show errors."
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { C, FF } from "../theme";

type Props = { children: React.ReactNode };
type State = { hasError: boolean };

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("ErrorBoundary caught:", error, info?.componentStack);
  }

  handleReset = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <Text style={styles.emoji}>🦁</Text>
          <Text style={styles.title}>Oops! Something went wrong</Text>
          <Text style={styles.subtitle}>
            Don't worry, warrior — let's get you back to the adventure.
          </Text>
          <TouchableOpacity style={styles.button} onPress={this.handleReset} activeOpacity={0.8}>
            <Text style={styles.buttonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: C.cream,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  emoji: { fontSize: 64, marginBottom: 16 },
  title: {
    fontFamily: FF.heading,
    fontSize: 22,
    color: C.navy,
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: FF.bodySemi,
    fontSize: 15,
    color: C.textSecondary,
    textAlign: "center",
    marginBottom: 24,
  },
  button: {
    backgroundColor: C.saffron,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 30,
  },
  buttonText: {
    fontFamily: FF.heading,
    fontSize: 16,
    color: C.white,
  },
});
