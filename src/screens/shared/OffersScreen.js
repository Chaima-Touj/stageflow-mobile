import React, { useState, useContext, useRef } from "react";
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  TextInput, RefreshControl, StatusBar, Animated, Alert, ScrollView
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { DataContext } from "../../context/DataContext";
import { AuthContext } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { Loader } from "../../components/index";
import * as Animatable from "react-native-animatable";

const TYPES = ["Tous", "Stage", "PFE"];

function OfferCard({ offer, onPress, onApply, onDelete, role, userId, theme, isDark }) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const isAdmin = role === "admin";
  const isOwner = role === "entreprise" && offer.companyId === userId;
  const isStudent = role === "étudiant";

  const onPressIn  = () => Animated.spring(scaleAnim, { toValue: 0.97, useNativeDriver: true }).start();
  const onPressOut = () => Animated.spring(scaleAnim, { toValue: 1,    useNativeDriver: true }).start();

  const s = cardStyles(theme);
  const typeColor = offer.type === "PFE" ? theme.info : theme.accent;

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity onPress={onPress} onPressIn={onPressIn} onPressOut={onPressOut} activeOpacity={1} style={s.card}>
        {/* Top row */}
        <View style={s.cardTop}>
          <View style={[s.typePill, { backgroundColor: typeColor + "18", borderColor: typeColor + "40" }]}>
            <View style={[s.typeDot, { backgroundColor: typeColor }]} />
            <Text style={[s.typeText, { color: typeColor }]}>{offer.type}</Text>
          </View>
          <View style={s.locChip}>
            <Ionicons name="location-sharp" size={12} color={theme.textSub} />
            <Text style={s.locText}>{offer.location}</Text>
          </View>
        </View>

        <Text style={s.cardTitle} numberOfLines={2}>{offer.title}</Text>

        <View style={s.companyRow}>
          <View style={[s.companyIcon, { backgroundColor: theme.info + "18" }]}>
            <Ionicons name="business-outline" size={14} color={theme.info} />
          </View>
          <Text style={s.companyName}>{offer.company}</Text>
        </View>

        {/* Footer */}
        <View style={s.cardFooter}>
          <TouchableOpacity style={s.detailsBtn} onPress={onPress}>
            <Text style={[s.detailsBtnText, { color: theme.accent }]}>Voir plus</Text>
            <Ionicons name="arrow-forward" size={14} color={theme.accent} />
          </TouchableOpacity>

          <View style={s.footerRight}>
            {(isAdmin || isOwner) && (
              <TouchableOpacity style={[s.iconAction, { backgroundColor: theme.dangerDim }]} onPress={() => onDelete(offer._id)}>
                <Ionicons name="trash-outline" size={17} color={theme.danger} />
              </TouchableOpacity>
            )}
            {isStudent && (
              <TouchableOpacity style={s.applyBtn} onPress={() => onApply(offer)}>
                <LinearGradient colors={[theme.accent, isDark ? "#00D4A0" : "#009955"]}
                  start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={s.applyGrad}>
                  <Text style={[s.applyText, { color: isDark ? "#070B14" : "#fff" }]}>Postuler</Text>
                </LinearGradient>
              </TouchableOpacity>
            )}
            {isOwner && (
              <View style={[s.countBadge, { backgroundColor: theme.bgElevated, borderColor: theme.border }]}>
                <Ionicons name="people-outline" size={12} color={theme.textSub} />
                <Text style={s.countText}>{offer.applicationsCount || 0}</Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function OffersScreen({ navigation }) {
  const { offers, loadingOffers, loadOffers, deleteOffer } = useContext(DataContext);
  const { user } = useContext(AuthContext);
  const { theme, isDark } = useTheme();
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("Tous");
  const [refreshing, setRefreshing] = useState(false);

  const role = user?.role || "étudiant";
  const s = makeStyles(theme);

  const handleRefresh = async () => { setRefreshing(true); await loadOffers(); setRefreshing(false); };
  const handleDelete  = (id) => {
    Alert.alert("Supprimer", "Voulez-vous supprimer cette offre ?", [
      { text: "Annuler", style: "cancel" },
      { text: "Supprimer", style: "destructive", onPress: () => deleteOffer(id) }
    ]);
  };

  const filtered = (offers || []).filter(o => {
    const matchType = filterType === "Tous" || o.type === filterType;
    const q = search.toLowerCase();
    return matchType && (!q || o.title?.toLowerCase().includes(q) || o.company?.toLowerCase().includes(q));
  });

  return (
    <View style={s.root}>
      <StatusBar barStyle={theme.statusBar} backgroundColor={theme.bg} />

      {/* Header */}
      <View style={s.header}>
        <View>
          <Text style={s.headerTitle}>Offres disponibles</Text>
          <Text style={s.headerSub}>{filtered.length} opportunité{filtered.length !== 1 ? "s" : ""}</Text>
        </View>
        {(role === "entreprise" || role === "admin") && (
          <TouchableOpacity style={s.addBtn} onPress={() => navigation.navigate("AddOffer")}>
            <LinearGradient colors={[theme.accent, isDark ? "#00D4A0" : "#009955"]} style={s.addBtnInner}>
              <Ionicons name="add" size={26} color={isDark ? "#070B14" : "#fff"} />
            </LinearGradient>
          </TouchableOpacity>
        )}
      </View>

      {/* Search */}
      <View style={s.searchWrap}>
        <Ionicons name="search-outline" size={18} color={theme.textSub} />
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Poste, entreprise, ville..."
          placeholderTextColor={theme.textMuted}
          style={s.searchInput}
        />
        {!!search && (
          <TouchableOpacity onPress={() => setSearch("")}>
            <Ionicons name="close-circle" size={18} color={theme.textMuted} />
          </TouchableOpacity>
        )}
      </View>

      {/* Filter chips */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.filterRow}>
        {TYPES.map(tp => (
          <TouchableOpacity key={tp} onPress={() => setFilterType(tp)}
            style={[s.filterChip, filterType === tp && { backgroundColor: theme.accent, borderColor: theme.accent }]}>
            <Text style={[s.filterChipText, { color: filterType === tp ? (isDark ? "#070B14" : "#fff") : theme.text }]}>{tp}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {loadingOffers ? (
        <Loader />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={item => item._id}
          contentContainerStyle={s.list}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => (
            <Animatable.View animation="fadeInUp" delay={index * 50} duration={400}>
              <OfferCard
                offer={item}
                role={role}
                userId={user?._id}
                theme={theme}
                isDark={isDark}
                onPress={() => navigation.navigate("OfferDetails", { offer: item })}
                onApply={o => navigation.navigate("Apply", { offer: o })}
                onDelete={handleDelete}
              />
            </Animatable.View>
          )}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={theme.accent} />}
          ListEmptyComponent={
            <View style={s.empty}>
              <Text style={s.emptyIcon}>🔍</Text>
              <Text style={s.emptyTitle}>Aucune offre trouvée</Text>
              <Text style={s.emptySub}>Essayez de modifier vos filtres</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const cardStyles = (t) => StyleSheet.create({
  card:       { backgroundColor: t.bgCard, borderRadius: 24, marginBottom: 16, padding: 20, borderWidth: 1, borderColor: t.border },
  cardTop:    { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 14 },
  typePill:   { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20, borderWidth: 1 },
  typeDot:    { width: 6, height: 6, borderRadius: 3 },
  typeText:   { fontSize: 11, fontWeight: "700" },
  locChip:    { flexDirection: "row", alignItems: "center", gap: 4 },
  locText:    { fontSize: 12, color: t.textSub },
  cardTitle:  { fontSize: 17, fontWeight: "800", color: t.text, marginBottom: 12, lineHeight: 23 },
  companyRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 18 },
  companyIcon:{ width: 28, height: 28, borderRadius: 8, justifyContent: "center", alignItems: "center" },
  companyName:{ fontSize: 13, color: t.textSub, fontWeight: "600" },
  cardFooter: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingTop: 14, borderTopWidth: 1, borderTopColor: t.border },
  detailsBtn: { flexDirection: "row", alignItems: "center", gap: 5 },
  detailsBtnText:{ fontWeight: "700", fontSize: 13 },
  footerRight:{ flexDirection: "row", alignItems: "center", gap: 10 },
  iconAction: { width: 38, height: 38, borderRadius: 11, justifyContent: "center", alignItems: "center" },
  applyBtn:   { borderRadius: 12, overflow: "hidden" },
  applyGrad:  { paddingHorizontal: 18, paddingVertical: 10 },
  applyText:  { fontWeight: "800", fontSize: 13 },
  countBadge: { flexDirection: "row", alignItems: "center", gap: 5, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10, borderWidth: 1 },
  countText:  { fontSize: 12, fontWeight: "700", color: "#fff" },
});

const makeStyles = (t) => StyleSheet.create({
  root:       { flex: 1, backgroundColor: t.bg },
  header:     { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingTop: 58, paddingHorizontal: 22, paddingBottom: 18 },
  headerTitle:{ fontSize: 24, fontWeight: "900", color: t.text },
  headerSub:  { fontSize: 13, color: t.textSub, marginTop: 2 },
  addBtn:     { borderRadius: 16, overflow: "hidden" },
  addBtnInner:{ width: 48, height: 48, justifyContent: "center", alignItems: "center" },
  searchWrap: { flexDirection: "row", alignItems: "center", gap: 10, backgroundColor: t.bgCard, borderRadius: 18, paddingHorizontal: 16, height: 52, marginHorizontal: 22, marginBottom: 14, borderWidth: 1, borderColor: t.border },
  searchInput:{ flex: 1, fontSize: 14, color: t.text },
  filterRow:  { paddingHorizontal: 22, gap: 10, marginBottom: 14 },
  filterChip: { paddingHorizontal: 20, paddingVertical: 9, borderRadius: 20, backgroundColor: t.bgElevated, borderWidth: 1.5, borderColor: t.borderLight },
  filterChipText:{ fontSize: 13, fontWeight: "700", color: t.text },
  list:       { paddingHorizontal: 22, paddingBottom: 100 },
  empty:      { alignItems: "center", paddingTop: 60 },
  emptyIcon:  { fontSize: 48, marginBottom: 16 },
  emptyTitle: { fontSize: 18, fontWeight: "700", color: t.text, marginBottom: 8 },
  emptySub:   { fontSize: 14, color: t.textSub },
});