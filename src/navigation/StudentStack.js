import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import OffersScreen from "../screens/shared/OffersScreen";
import OfferDetailsScreen from "../screens/shared/OfferDetailsScreen";
import ApplyScreen from "../screens/shared/ApplyScreen";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, typography, borderRadius, shadows } from "../theme";

const Stack = createNativeStackNavigator();

export default function StudentStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Offers" component={OffersScreen} />
      <Stack.Screen name="OfferDetails" component={OfferDetailsScreen} />
      <Stack.Screen name="Apply" component={ApplyScreen} />
    </Stack.Navigator>
  );
}