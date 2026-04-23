import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

/* Screens */
import CompanyDashboard from "../screens/company/CompanyDashboard";
import OffersScreen from "../screens/company/OffersScreen";
import AddOfferScreen from "../screens/company/AddOfferScreen";
import ApplicationsScreen from "../screens/company/ApplicationsScreen";

import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, typography, borderRadius, shadows } from "../theme";
const Stack = createNativeStackNavigator();

export default function CompanyStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: "#0b0b0f" },
      }}
    >
      {/* 🔥 Main entry */}
      <Stack.Screen name="Dashboard" component={CompanyDashboard} />

      {/* Offers management */}
      <Stack.Screen name="Offers" component={OffersScreen} />

      {/* Create offer */}
      <Stack.Screen name="AddOffer" component={AddOfferScreen} />

      {/* Applications received */}
      <Stack.Screen name="Applications" component={ApplicationsScreen} />
    </Stack.Navigator>
  );
}