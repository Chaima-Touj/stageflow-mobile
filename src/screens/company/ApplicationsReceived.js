import React, { useContext, useEffect, useState } from "react";
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  StatusBar, ActivityIndicator, Alert
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as Animatable from "react-native-animatable";
import { DataContext } from "../../context/DataContext";
import { AuthContext } from "../../context/AuthContext";
import { Avatar } from "../../components/index";
import { applicationsAPI } from "../../api/applicationsAPI";

const STATUS_CONFIG = {
  "En attente": { color: "#F59E0B", bg: "rgba(245,158,11,0.15)", icon: "time-outline" },
  "Acceptée":   { color: "#10B981", bg: "rgba(16,185,129,0.15)", icon: "checkmark-circle-outline" },
  "Refusée":    { color: "#EF4444", bg: "rgba(239,68,68,0.15)",  icon: "close-circle-outline" },
  "En cours":   { color: "#3B82F6", bg: "rgba(59,130,246,0.15)", icon: "sync-outline" },
};

export default function ApplicationsReceived({ route, navigation }) {
  const { offerId } = route?.params || {};
  const { applications, loadApplications, updateApplicationStatus } = useContext(DataContext);
  const { user } = useContext(AuthContext);
  const [updating, setUpdating] = useState(null);

  // Filtrer par offre si offerId fourni
  const list = offerId
    ? applications.filter(a => a.offerId === offerId)
    : applications;

  useEffect(() => { loadApplications(); }, []);

  const handleStatus = (appId, newStatus, appName) => {
    Alert.alert(
      "Mettre à jour",
      `Changer le statut de ${appName} → "${newStatus}" ?`,
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Confirmer",
          onPress: async () => {
            setUpdating(appId);
            await updateApplicationStatus(appId, newStatus);
            setUpdating(null);
          }
        }
      ]
    );
  };

  const renderItem = ({ item, index }) => {
    const s = STATUS_CONFIG[item.status] || STATUS_CONFIG["En attente"];
    return (
      <Animatable.View animation="fadeInUp" delay={index * 80} style={styles.card}>
        <View style={styles.cardLeft}>
          <Avatar name={item.userName || "?"} size={48} />
          <View style={styles.cardInfo}>
            <Text style={styles.cardName}>{item.userName || "Candidat"}</Text>
            <Text style={styles.cardOffer} numberOfLines={1}>{item.offerTitle || "—"}</Text>
            <View style={[styles.statusBadge, { backgroundColor: s.bg }]}>
              <Ionicons name={s.icon} size={12} color={s.color} />
              <Text style={[styles.statusText, { color: s.color }]}>{item.status}</Text>
            </View>
          </View>
        </View>

        {updating === item._id ? (
          <ActivityIndicator color="#00ff88" />
        ) : (
          <View style={styles.actions}>
            {item.status !== "Acceptée" && (
              <TouchableOpacity
                style={[styles.actionBtn, { backgroundColor: "rgba(16,185,129,0.15)" }]}
                onPress={() => handleStatus(item._id, "Acceptée", item.userName)}
              >
                <Ionicons name="checkmark" size={18} color="#10B981" />
              </TouchableOpacity>
            )}
            {item.status !== "Refusée" && (
              <TouchableOpacity
                style={[styles.actionBtn, { backgroundColor: "rgba(239,68,68,0.15)" }]}
                onPress={() => handleStatus(item._id, "Refusée", item.userName)}
              >
                <Ionicons name="close" size={18} color="#EF4444" />
              </TouchableOpacity>
            )}
          </View>
        )}
      </Animatable.View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={["#0F172A", "#060B18"]} style={StyleSheet.absoluteFill} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Candidatures</Text>
          <Text style={styles.headerSub}>{list.length} candidat{list.length !== 1 ? "s" : ""}</Text>
        </View>
        <View style={{ width: 45 }} />
      </View>

      {list.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>📭</Text>
          <Text style={styles.emptyTitle}>Aucune candidature</Text>
          <Text style={styles.emptySub}>Les candidatures apparaîtront ici.</Text>
        </View>
      ) : (
        <FlatList
          data={list}
          keyExtractor={i => i._id}
          contentContainerStyle={styles.list}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingTop: 50, paddingBottom: 20, paddingHorizontal: 20,
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
  },
  backBtn: {
    width: 45, height: 45, borderRadius: 15,
    backgroundColor: "#1E293B", justifyContent: "center", alignItems: "center",
    borderWidth: 1, borderColor: "#334155",
  },
  headerTitle: { color: "#fff", fontSize: 22, fontWeight: "900", textAlign: "center" },
  headerSub:   { color: "#64748B", fontSize: 13, textAlign: "center", marginTop: 2 },

  list: { paddingHorizontal: 20, paddingBottom: 40 },

  card: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: "#1E293B", borderRadius: 24,
    padding: 16, marginBottom: 14,
    borderWidth: 1, borderColor: "#334155",
    justifyContent: "space-between",
  },
  cardLeft:  { flexDirection: "row", alignItems: "center", flex: 1 },
  cardInfo:  { marginLeft: 14, flex: 1 },
  cardName:  { color: "#fff", fontSize: 16, fontWeight: "700" },
  cardOffer: { color: "#64748B", fontSize: 12, marginTop: 2, marginBottom: 8 },

  statusBadge: {
    flexDirection: "row", alignItems: "center",
    alignSelf: "flex-start",
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20,
  },
  statusText: { fontSize: 11, fontWeight: "700", marginLeft: 5 },

  actions: { flexDirection: "row", gap: 8 },
  actionBtn: {
    width: 38, height: 38, borderRadius: 12,
    justifyContent: "center", alignItems: "center",
  },

  empty: { flex: 1, alignItems: "center", justifyContent: "center", padding: 40 },
  emptyIcon:  { fontSize: 52, marginBottom: 16 },
  emptyTitle: { color: "#fff", fontSize: 20, fontWeight: "bold", marginBottom: 8 },
  emptySub:   { color: "#64748B", fontSize: 14, textAlign: "center" },
});