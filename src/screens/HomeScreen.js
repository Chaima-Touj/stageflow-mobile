import React from "react";
import { View, Text, Pressable } from "react-native";
import { colors, spacing, typography, borderRadius, shadows } from "../theme";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

export default function HomeScreen({ navigation }) {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: Theme.Colors.bg,
        padding: Theme.Spacing.lg,
        justifyContent: "center",
      }}
    >
      {/* HEADER */}
      <Text style={Theme.Typography.h1}>
        🚀 StageFlow
      </Text>

      <Text
        style={{
          ...Theme.Typography.body,
          marginTop: Theme.Spacing.sm,
          marginBottom: Theme.Spacing.xl,
        }}
      >
        Find internships, apply & grow your career
      </Text>

      {/* CARD */}
      <View
        style={{
          backgroundColor: Theme.Colors.card,
          padding: Theme.Spacing.lg,
          borderRadius: 20,
          ...Theme.Shadows.soft,
        }}
      >
        <Text style={Theme.Typography.h3}>
          🔥 Featured
        </Text>

        <Text
          style={{
            ...Theme.Typography.body,
            marginTop: Theme.Spacing.sm,
            marginBottom: Theme.Spacing.lg,
          }}
        >
          Explore top internships and PFE offers
        </Text>

        {/* BUTTON */}
        <Pressable
          onPress={() => navigation.navigate("Offers")}
          style={{
            backgroundColor: Theme.Colors.primary,
            padding: Theme.Spacing.md,
            borderRadius: 14,
            alignItems: "center",
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "700" }}>
            Browse Offers
          </Text>
        </Pressable>
      </View>
    </View>
  );
}