import React, { useContext } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";

import { AuthContext } from "../context/AuthContext";

/* Screens */
import OffersScreen from "../screens/shared/OffersScreen";
import DashboardScreen from "../screens/shared/DashboardScreen";
import ProfileScreen from "../screens/shared/ProfileScreen";
import OfferDetailsScreen from "../screens/shared/OfferDetailsScreen";
import ApplyScreen from "../screens/shared/ApplyScreen";

// Importi el AdminDashboard mte3ek hna
import AdminDashboard from "../screens/admin/AdminDashboard"; 
import StudentDashboard from "../screens/student/StudentDashboard";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const HIDDEN_HEADER = { headerShown: false };

// 1. El Bottom Tabs mte3ek (Khallihom kima homa)
function AppTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Offers" component={OffersScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

// 2. EL FIX HNA: Na3mlou Stack Navigator i-لمّ kol chay
export default function AppNavigator() {
  const { user } = useContext(AuthContext);

  return (
    <Stack.Navigator screenOptions={HIDDEN_HEADER}>
      
      {/* Thabbet: Ken el user Admin, awwel page t-7el hiya el AdminDashboard */}
      {user?.role === 'admin' ? (
        <Stack.Screen name="AdminDashboard" component={AdminDashboard} />
      ) : (
        <Stack.Screen name="MainTabs" component={AppTabs} />

      )}

      {/* ⚠️ HNA EL SERR: Lezem t-hot el OffreDetails hna bech el Dashboard y-choufha */}
      <Stack.Screen 
        name="OffreDetails" 
        component={OfferDetailsScreen} 
      />
      
      
      <Stack.Screen name="Apply" component={ApplyScreen} />
      

    </Stack.Navigator>
  );
}