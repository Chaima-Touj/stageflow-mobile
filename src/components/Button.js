import React from "react";
import { Pressable, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, typography, borderRadius, shadows } from "../theme";

export default function Button({ title, onPress, type = "primary" }) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.btn,
        type === "secondary" && styles.secondary,
      ]}
    >
      <Text style={styles.text}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    backgroundColor: "#00ff88",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  secondary: {
    backgroundColor: "#1a1a24",
  },
  text: {
    color: "#000",
    fontWeight: "bold",
  },
});