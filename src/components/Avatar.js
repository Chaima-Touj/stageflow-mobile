import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, typography, borderRadius, shadows } from "../theme";

export default function Avatar({ name = "U" }) {
  return (
    <View style={styles.avatar}>
      <Text style={styles.text}>{name.charAt(0).toUpperCase()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#7F77DD",
    justifyContent: "center",
    alignItems: "center",
  },
  text: { color: "#fff", fontWeight: "bold" },
});