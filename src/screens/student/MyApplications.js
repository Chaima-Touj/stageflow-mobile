import React, { useContext, useState } from "react";
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  RefreshControl, StatusBar, Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { DataContext } from "../../context/DataContext";
import { AuthContext } from "../../context/AuthContext";
import { Loader, EmptyState } from "../../components/index";
import { colors, spacing, typography, borderRadius, shadows } from "../../theme";
const STATUS_FILTERS = ["Tous", "En attente", "Acceptée", "Refusée", "En cours"];
import { getStatusColor } from "../../theme/colors";
export default function MyApplicationsScreen({ navigation }) {
  const { applications, loadApplications, loadingApps, deleteApplication } = useContext(DataContext);
  const { user } = useContext(AuthContext);
  const [filter, setFilter] = useState("Tous");
  const [refreshing, setRefreshing] = useState(false);

  const myApps = applications.filter((a) => {
    const mine = a.userId === user?._id;
    const matchFilter = filter === "Tous" || a.status === filter;
    return mine && matchFilter;
  });

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadApplications();
    setRefreshing(false);
  };

  const handleDelete = (id) => {
    Alert.alert("Retirer la candidature ?", "Cette action est irréversible.", [
      { text: "Annuler", style: "cancel" },
      { text: "Retirer", style: "destructive", onPress: () => deleteApplication(id) },
    ]);
  };

  const renderItem = ({ item }) => {
    const sc = getStatusColor(item.status);
    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={[styles.typeBadge, item.type === "Stage" ? styles.stageBadge : styles.pfeBadge]}>
            <Text style={[styles.typeText, item.type === "Stage" ? styles.stageText : styles.pfeText]}>
              {item.type || "Stage"}
            </Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: sc.bg }]}>
            <View style={[styles.statusDot, { backgroundColor: sc.dot }]} />
            <Text style={[styles.statusText, { color: sc.text }]}>{item.status}</Text>
          </View>
        </View>

        <Text style={styles.offerTitle} numberOfLines={2}>{item.offerTitle}</Text>
        <Text style={styles.company}>{item.company}</Text>

        <View style={styles.meta}>
          <View style={styles.metaItem}>
            <Ionicons name="location-outline" size={13} color={colors.textMuted} />
            <Text style={styles.metaText}>{item.location || "Non précisé"}</Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons name="calendar-outline" size={13} color={colors.textMuted} />
            <Text style={styles.metaText}>{new Date(item.createdAt).toLocaleDateString("fr-FR")}</Text>
          </View>
        </View>

        {item.supervisorName ? (
          <View style={styles.supervisorBadge}>
            <Ionicons name="person-circle-outline" size={14} color={colors.primary} />
            <Text style={styles.supervisorText}>Encadrant : {item.supervisorName}</Text>
          </View>
        ) : null}

        <View style={styles.cardActions}>
          {item.cvFileName ? (
            <View style={styles.cvIndicator}>
              <Ionicons name="document-text-outline" size={14} color={colors.primary} />
              <Text style={styles.cvText}>CV joint</Text>
            </View>
          ) : null}
          {item.status === "En attente" && (
            <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDelete(item._id)}>
              <Ionicons name="trash-outline" size={15} color={colors.danger} />
              <Text style={styles.deleteBtnText}>Retirer</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mes candidatures</Text>
        <Text style={styles.headerCount}>{myApps.length}</Text>
      </View>

      {/* Filters */}
      <View style={styles.filterScroll}>
        {STATUS_FILTERS.map((f) => (
          <TouchableOpacity key={f} onPress={() => setFilter(f)}
            style={[styles.filterChip, filter === f && styles.filterChipActive]}>
            <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>{f}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {loadingApps ? (
        <Loader message="Chargement de vos candidatures..." />
      ) : (
        <FlatList
          data={myApps}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={colors.primary} />}
          ListEmptyComponent={
            <EmptyState icon="📭" title="Aucune candidature"
              subtitle={filter === "Tous" ? "Vous n'avez pas encore postulé à des offres." : `Aucune candidature avec le statut "${filter}".`}
              action={filter === "Tous" ? () => navigation.navigate("Offers") : undefined}
              actionLabel="Explorer les offres" />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingHorizontal: spacing.md, paddingTop: 56, paddingBottom: spacing.sm, backgroundColor: colors.bg,
  },
  backBtn: { width: 38, height: 38, borderRadius: 19, backgroundColor: colors.border + "80", alignItems: "center", justifyContent: "center" },
  headerTitle: { ...typography.h4, color: colors.textPrimary, flex: 1, marginLeft: 12 },
  headerCount: {
    ...typography.smMd, color: colors.primary,
    backgroundColor: colors.primaryLight, paddingHorizontal: 10, paddingVertical: 4, borderRadius: borderRadius.full,
  },
  filterScroll: { flexDirection: "row", paddingHorizontal: spacing.md, gap: 8, marginBottom: spacing.md, flexWrap: "wrap" },
  filterChip: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: borderRadius.full, backgroundColor: "#fff", borderWidth: 1.5, borderColor: colors.border },
  filterChipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  filterText: { ...typography.smMd, color: colors.textSecondary },
  filterTextActive: { color: "#fff" },
  list: { paddingHorizontal: spacing.md, paddingBottom: 100 },
  card: {
    backgroundColor: "#fff", borderRadius: borderRadius.lg,
    padding: spacing.md, marginBottom: spacing.md, ...shadows.sm,
    borderWidth: 1, borderColor: colors.border,
  },
  cardHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 10 },
  typeBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: borderRadius.full },
  stageBadge: { backgroundColor: "#DBEAFE" },
  pfeBadge: { backgroundColor: "#EDE9FE" },
  typeText: { fontSize: 11, fontWeight: "700" },
  stageText: { color: "#2563EB" },
  pfeText: { color: "#7C3AED" },
  statusBadge: { flexDirection: "row", alignItems: "center", gap: 5, paddingHorizontal: 10, paddingVertical: 4, borderRadius: borderRadius.full },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  statusText: { fontSize: 11, fontWeight: "700" },
  offerTitle: { ...typography.h4, color: colors.textPrimary, marginBottom: 4 },
  company: { ...typography.smMd, color: colors.primary, marginBottom: 8 },
  meta: { flexDirection: "row", gap: 12, marginBottom: 8 },
  metaItem: { flexDirection: "row", alignItems: "center", gap: 4 },
  metaText: { ...typography.xs, color: colors.textMuted },
  supervisorBadge: {
    flexDirection: "row", alignItems: "center", gap: 6,
    backgroundColor: colors.primaryLight, borderRadius: borderRadius.sm, padding: 8, marginBottom: 8,
  },
  supervisorText: { ...typography.smMd, color: colors.primary },
  cardActions: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 4 },
  cvIndicator: { flexDirection: "row", alignItems: "center", gap: 4 },
  cvText: { ...typography.xs, color: colors.primary },
  deleteBtn: {
    flexDirection: "row", alignItems: "center", gap: 6,
    backgroundColor: colors.dangerLight, paddingHorizontal: 12, paddingVertical: 6, borderRadius: borderRadius.full,
  },
  deleteBtnText: { ...typography.xs, color: colors.danger, fontWeight: "700" },
});