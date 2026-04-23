import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, typography, borderRadius, shadows } from "../theme";

export default function StatCard({ value, label }) {
  return (
    <View style={styles.card}>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: "#1a1a24",
    padding: 16,
    borderRadius: 14,
    margin: 6,
  },
  value: {
    color: "#00ff88",
    fontSize: 22,
    fontWeight: "bold",
  },
  label: {
    color: "#aaa",
    marginTop: 4,
  },
});