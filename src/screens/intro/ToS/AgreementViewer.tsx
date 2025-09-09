
import React from "react";
import { SafeAreaView, Text, StyleSheet } from "react-native";

type Props = {
  message?: string;
};

export default function WhiteTextScreen({ message = "Hello, world!" }: Props) {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.text}>{message}</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 18,
    lineHeight: 24,
    color: "#111111",
  },
});
