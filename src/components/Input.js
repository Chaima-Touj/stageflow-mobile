import React from "react";
import { TextInput, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, typography, borderRadius, shadows } from "../theme";

export default function Input(props) {
  return <TextInput placeholderTextColor="#777" style={styles.input} {...props} />;
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: "#1a1a24",
    color: "#fff",
    padding: 14,
    borderRadius: 12,
    marginVertical: 8,
  },
});