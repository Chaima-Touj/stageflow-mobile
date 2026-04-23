import React, { useContext, useState } from "react";
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  RefreshControl, StatusBar, Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { AuthContext } from "../../context/AuthContext";
import { DataContext } from "../../context/DataContext";
import { Avatar, Button, EmptyState, Loader } from "../../components/index";
import { colors, spacing, typography, borderRadius, shadows } from "../../theme";
function StatCard({ label, value, icon, color = colors.primary, bg = colors.primaryLight }) {
  return (
    <View style={[styles.statCard, { borderTopColor: color }]}>
      <View style={[styles.statIcon, { backgroundColor: bg }]}>
        <Ionicons name={icon} size={20} color={color} />
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

export default function CompanyDashboard({ navigation }) {
  const { user } = useContext(AuthContext);
  const { offers, applications, loadingApps, loadOffers, loadApplications, deleteOffer, updateApplicationStatus } = useContext(DataContext);
  const [refreshing, setRefreshing] = useState(false);

  const myOffers = offers.filter((o) => o.companyId === user?._id);
  const companyApps = applications.filter((a) => myOffers.some((o) => o._id === a.offerId));

  const stats = {
    offers: myOffers.length,
    total: companyApps.length,
    accepted: companyApps.filter((a) => a.status === "Acceptée").length,
    pending: companyApps.filter((a) => a.status === "En attente").length,
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([loadOffers(), loadApplications()]);
    setRefreshing(false);
  };

  const handleDeleteOffer = (id, title) => {
    Alert.alert("Supprimer l'offre ?", `Supprimer "${title}" ?`, [
      { text: "Annuler", style: "cancel" },
      { text: "Supprimer", style: "destructive", onPress: () => deleteOffer(id) },
    ]);
  };

  const handleStatus = (id, status) => {
    Alert.alert("Modifier le statut", `Marquer cette candidature comme "${status}" ?`, [
      { text: "Annuler", style: "cancel" },
      { text: "Confirmer", onPress: () => updateApplicationStatus(id, status) },
    ]);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <LinearGradient colors={["#7C3AED", "#6D28D9"]} style={styles.hero}>
        <View style={styles.heroRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.greeting}>Tableau de bord</Text>
            <Text style={styles.heroName} numberOfLines={1}>{user?.name}</Text>
            <View style={styles.rolePill}>
              <Text style={styles.roleText}>Entreprise</Text>
            </View>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
            <Avatar name={user?.name} size={52} color="#fff" />
          </TouchableOpacity>
        </View>
        <View style={styles.wave} />
      </LinearGradient>

      <ScrollView
        style={styles.body}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={colors.primary} />}
      >
        {/* Stats */}
        <View style={styles.statsGrid}>
          <StatCard label="Mes offres" value={stats.offers} icon="briefcase-outline" color="#7C3AED" bg="#EDE9FE" />
          <StatCard label="Candidatures" value={stats.total} icon="people-outline" />
          <StatCard label="Acceptées" value={stats.accepted} icon="checkmark-circle-outline" color={colors.success} bg={colors.successLight} />
          <StatCard label="En attente" value={stats.pending} icon="time-outline" color={colors.warning} bg={colors.warningLight} />
        </View>

        {/* My Offers */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Mes offres publiées</Text>
          <TouchableOpacity style={styles.addBtn} onPress={() => navigation.navigate("AddOffer")}>
            <LinearGradient colors={[colors.primary, colors.primaryDark]} style={styles.addBtnGrad}>
              <Ionicons name="add" size={16} color="#fff" />
              <Text style={styles.addBtnText}>Ajouter</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {myOffers.length === 0 ? (
          <EmptyState icon="📢" title="Aucune offre publiée"
            subtitle="Publiez votre première offre de stage."
            action={() => navigation.navigate("AddOffer")} actionLabel="Publier une offre" />
        ) : (
          <View style={styles.offersList}>
            {myOffers.map((offer) => {
              const offerApps = companyApps.filter((a) => a.offerId === offer._id);
              return (
                <View key={offer._id} style={styles.offerCard}>
                  <View style={styles.offerCardTop}>
                    <View style={[styles.typeBadge, offer.type === "Stage" ? styles.stageBadge : styles.pfeBadge]}>
                      <Text style={[styles.typeText, offer.type === "Stage" ? styles.stageText : styles.pfeText]}>
                        {offer.type}
                      </Text>
                    </View>
                    <TouchableOpacity onPress={() => handleDeleteOffer(offer._id, offer.title)}>
                      <Ionicons name="trash-outline" size={18} color={colors.danger} />
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.offerTitle} numberOfLines={1}>{offer.title}</Text>
                  <View style={styles.offerMeta}>
                    <Ionicons name="location-outline" size={13} color={colors.textMuted} />
                    <Text style={styles.offerMetaText}>{offer.location}</Text>
                    <Ionicons name="people-outline" size={13} color={colors.textMuted} style={{ marginLeft: 10 }} />
                    <Text style={styles.offerMetaText}>{offerApps.length} candidature(s)</Text>
                  </View>
                </View>
              );
            })}
          </View>
        )}

        {/* Applications received */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Candidatures reçues</Text>
        </View>

        {loadingApps ? <Loader /> : companyApps.length === 0 ? (
          <EmptyState icon="📨" title="Aucune candidature" subtitle="Les candidatures apparaîtront ici." />
        ) : (
          <View style={styles.appsList}>
            {companyApps.map((app) => {
              const sc = getStatusColor(app.status);
              return (
                <View key={app._id} style={styles.appCard}>
                  <View style={styles.appCardTop}>
                    <View style={styles.appInfo}>
                      <Text style={styles.appName}>{app.userName}</Text>
                      <Text style={styles.appOffer} numberOfLines={1}>{app.offerTitle}</Text>
                      <Text style={styles.appDate}>{new Date(app.createdAt).toLocaleDateString("fr-FR")}</Text>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: sc.bg }]}>
                      <Text style={[styles.statusText, { color: sc.text }]}>{app.status}</Text>
                    </View>
                  </View>

                  {app.status === "En attente" && (
                    <View style={styles.appActions}>
                      <TouchableOpacity style={styles.acceptBtn} onPress={() => handleStatus(app._id, "Acceptée")}>
                        <Ionicons name="checkmark" size={14} color={colors.success} />
                        <Text style={styles.acceptText}>Accepter</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.refuseBtn} onPress={() => handleStatus(app._id, "Refusée")}>
                        <Ionicons name="close" size={14} color={colors.danger} />
                        <Text style={styles.refuseText}>Refuser</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  hero: { paddingTop: 52, paddingHorizontal: spacing.md, paddingBottom: 52 },
  heroRow: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 8 },
  greeting: { ...typography.sm, color: "rgba(255,255,255,0.75)", marginBottom: 2 },
  heroName: { ...typography.h3, color: "#fff", marginBottom: 8 },
  rolePill: { alignSelf: "flex-start", paddingHorizontal: 10, paddingVertical: 3, backgroundColor: "rgba(255,255,255,0.2)", borderRadius: borderRadius.full },
  roleText: { ...typography.xs, color: "#fff" },
  wave: { position: "absolute", bottom: -1, left: 0, right: 0, height: 30, backgroundColor: colors.bg, borderTopLeftRadius: 32, borderTopRightRadius: 32 },
  body: { flex: 1, backgroundColor: colors.bg },
  content: { paddingHorizontal: spacing.md, paddingTop: spacing.sm },
  statsGrid: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm, marginBottom: spacing.lg },
  statCard: { flex: 1, minWidth: "45%", backgroundColor: "#fff", borderRadius: borderRadius.lg, padding: spacing.md, ...shadows.sm, borderTopWidth: 3, alignItems: "center" },
  statIcon: { width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center", marginBottom: 8 },
  statValue: { ...typography.h3, color: colors.textPrimary },
  statLabel: { ...typography.xs, color: colors.textMuted, textAlign: "center" },
  sectionHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: spacing.sm },
  sectionTitle: { ...typography.h4, color: colors.textPrimary },
  addBtn: { borderRadius: borderRadius.md, overflow: "hidden" },
  addBtnGrad: { flexDirection: "row", alignItems: "center", gap: 5, paddingHorizontal: 12, paddingVertical: 7, borderRadius: borderRadius.md },
  addBtnText: { ...typography.smMd, color: "#fff" },
  offersList: { gap: spacing.sm, marginBottom: spacing.lg },
  offerCard: { backgroundColor: "#fff", borderRadius: borderRadius.lg, padding: spacing.md, ...shadows.sm, borderWidth: 1, borderColor: colors.border },
  offerCardTop: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 8 },
  typeBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: borderRadius.full },
  stageBadge: { backgroundColor: "#DBEAFE" },
  pfeBadge: { backgroundColor: "#EDE9FE" },
  typeText: { fontSize: 11, fontWeight: "700" },
  stageText: { color: "#2563EB" },
  pfeText: { color: "#7C3AED" },
  offerTitle: { ...typography.h4, color: colors.textPrimary, marginBottom: 6 },
  offerMeta: { flexDirection: "row", alignItems: "center" },
  offerMetaText: { ...typography.xs, color: colors.textMuted, marginLeft: 3 },
  appsList: { gap: spacing.sm, marginBottom: spacing.lg },
  appCard: { backgroundColor: "#fff", borderRadius: borderRadius.lg, padding: spacing.md, ...shadows.sm, borderWidth: 1, borderColor: colors.border },
  appCardTop: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 8 },
  appInfo: { flex: 1 },
  appName: { ...typography.bodyMd, color: colors.textPrimary },
  appOffer: { ...typography.sm, color: colors.primary, marginVertical: 2 },
  appDate: { ...typography.xs, color: colors.textMuted },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: borderRadius.full },
  statusText: { fontSize: 11, fontWeight: "700" },
  appActions: { flexDirection: "row", gap: spacing.sm },
  acceptBtn: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 5, backgroundColor: colors.successLight, paddingVertical: 8, borderRadius: borderRadius.md },
  acceptText: { ...typography.smMd, color: colors.success },
  refuseBtn: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 5, backgroundColor: colors.dangerLight, paddingVertical: 8, borderRadius: borderRadius.md },
  refuseText: { ...typography.smMd, color: colors.danger },
});