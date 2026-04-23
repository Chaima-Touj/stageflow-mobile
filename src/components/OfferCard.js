import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, typography, borderRadius, shadows } from "../theme";

export default function OfferCard({ offer, onPress }) {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <Text style={styles.company}>{offer.company}</Text>
      <Text style={styles.title}>{offer.title}</Text>

      <View style={styles.row}>
        <Text style={styles.meta}>📍 {offer.location}</Text>
        <Text style={styles.type}>{offer.type}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#1a1a24",
    padding: 16,
    borderRadius: 18,
    marginBottom: 12,
  },
  company: { color: "#aaa" },
  title: { color: "#fff", fontSize: 16, fontWeight: "bold", marginTop: 4 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  meta: { color: "#bbb" },
  type: { color: "#00ff88", fontWeight: "600" },
});