import React from "react";
import { Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, typography, borderRadius, shadows } from "../theme";

export default function Badge({ text }) {
  return <Text style={styles.badge}>{text}</Text>;
}

const styles = StyleSheet.create({
  badge: {
    color: "#00ff88",
    backgroundColor: "#1a1a24",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    overflow: "hidden",
    fontSize: 12,
  },
});