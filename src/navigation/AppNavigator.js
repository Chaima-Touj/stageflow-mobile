import React, { useContext } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { AuthContext } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";

import DashboardScreen      from "../screens/shared/DashboardScreen";
import ProfileScreen        from "../screens/shared/ProfileScreen";
import OffersScreen         from "../screens/shared/OffersScreen";
import OfferDetailsScreen   from "../screens/shared/OfferDetailsScreen";
import ApplyScreen          from "../screens/shared/ApplyScreen";
import ChatScreen           from "../screens/chatbot/ChatScreen";
import LoginScreen          from "../screens/auth/LoginScreen";
import RegisterScreen       from "../screens/auth/RegisterScreen";
import AddOfferScreen       from "../screens/company/AddOfferScreen";
import ApplicationsReceived from "../screens/company/ApplicationsReceived";

const Tab   = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
const NO_HEADER = { headerShown: false };

function HomeStack() {
  return (
    <Stack.Navigator screenOptions={NO_HEADER}>
      <Stack.Screen name="Dashboard"        component={DashboardScreen} />
      <Stack.Screen name="OfferDetails"     component={OfferDetailsScreen} />
      <Stack.Screen name="Apply"            component={ApplyScreen} />
      <Stack.Screen name="ApplicationsList" component={ApplicationsReceived} />
    </Stack.Navigator>
  );
}

function OffersStack() {
  return (
    <Stack.Navigator screenOptions={NO_HEADER}>
      <Stack.Screen name="OffersList"       component={OffersScreen} />
      <Stack.Screen name="OfferDetails"     component={OfferDetailsScreen} />
      <Stack.Screen name="Apply"            component={ApplyScreen} />
      <Stack.Screen name="AddOffer"         component={AddOfferScreen} />
      <Stack.Screen name="ApplicationsList" component={ApplicationsReceived} />
    </Stack.Navigator>
  );
}

function ChatStack() {
  return (
    <Stack.Navigator screenOptions={NO_HEADER}>
      <Stack.Screen name="Chat" component={ChatScreen} />
    </Stack.Navigator>
  );
}

function ProfileStack() {
  return (
    <Stack.Navigator screenOptions={NO_HEADER}>
      <Stack.Screen name="Profile" component={ProfileScreen} />
    </Stack.Navigator>
  );
}

function MainTabs() {
  const { theme, isDark } = useTheme();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor:   theme.accent,
        tabBarInactiveTintColor: theme.textMuted,
        tabBarStyle: {
          backgroundColor: theme.tabBar,
          borderTopWidth: 1,
          borderTopColor: theme.border,
          height: 70,
          paddingBottom: 12,
          paddingTop: 8,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: "700" },
        tabBarIcon: ({ focused, color, size }) => {
          const icons = {
            Home:       focused ? "grid"          : "grid-outline",
            OffersTab:  focused ? "briefcase"     : "briefcase-outline",
            ChatbotTab: focused ? "sparkles"      : "sparkles-outline",
            ProfileTab: focused ? "person-circle" : "person-circle-outline",
          };
          return <Ionicons name={icons[route.name]} size={size + 1} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home"       component={HomeStack}    options={{ title: "Stats" }} />
      <Tab.Screen name="OffersTab"  component={OffersStack}  options={{ title: "Stages" }} />
      <Tab.Screen name="ChatbotTab" component={ChatStack}    options={{ title: "AI" }} />
      <Tab.Screen name="ProfileTab" component={ProfileStack} options={{ title: "Profil" }} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const { user, loading } = useContext(AuthContext);
  if (loading) return null;
  return (
    <Stack.Navigator screenOptions={NO_HEADER}>
      {user ? (
        <Stack.Screen name="MainApp" component={MainTabs} />
      ) : (
        <>
          <Stack.Screen name="Login"    component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}