import React, { useContext, useState, useEffect } from "react";
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  RefreshControl, StatusBar, TextInput, Dimensions, Alert
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { AuthContext } from "../../context/AuthContext";
import { DataContext } from "../../context/DataContext";
import { useTheme } from "../../context/ThemeContext";
import { usersAPI } from "../../api/usersAPI";
import { Avatar, Loader } from "../../components/index";
import * as Animatable from "react-native-animatable";
import ChatScreen from "../chatbot/ChatScreen";

const { width } = Dimensions.get("window");
const TABS = [
  { id: "stats",  label: "Stats",   icon: "analytics" },
  { id: "users",  label: "Membres", icon: "people" },
  { id: "offers", label: "Offres",  icon: "briefcase" },
  { id: "ai",     label: "AI",      icon: "sparkles" },
];

export default function AdminDashboard({ navigation }) {
  const { user } = useContext(AuthContext);
  const { offers = [], applications = [], loadOffers, loadApplications } = useContext(DataContext) || {};
  const { theme, isDark, toggleTheme } = useTheme();

  const [users, setUsers]       = useState([]);
  const [stats, setStats]       = useState(null);
  const [loading, setLoading]   = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch]     = useState("");
  const [activeTab, setActiveTab] = useState("stats");

  const s = makeStyles(theme, isDark);

  const fetchData = async () => {
    try {
      const [usersRes, statsRes] = await Promise.all([usersAPI.getAll(), usersAPI.getStats()]);
      if (usersRes?.users)  setUsers(usersRes.users);
      if (statsRes?.stats)  setStats(statsRes.stats);
    } catch (err) { console.log("Admin fetch error:", err.message); }
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await Promise.all([fetchData(), loadOffers?.(), loadApplications?.()]);
      setLoading(false);
    };
    init();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([fetchData(), loadOffers?.(), loadApplications?.()]);
    setRefreshing(false);
  };

  const handleDeleteUser = (id, name) => {
    Alert.alert("Supprimer", `Supprimer ${name} ?`, [
      { text: "Annuler" },
      { text: "Supprimer", style: "destructive", onPress: async () => {
        try { await usersAPI.delete(id); fetchData(); } catch (e) {}
      }},
    ]);
  };

  const filteredUsers = users.filter(u => u.name?.toLowerCase().includes(search.toLowerCase()));

  if (loading) return <Loader />;

  const STAT_CARDS = [
    { label: "Utilisateurs", val: stats?.totalUsers || 0, icon: "people",    col: theme.info },
    { label: "Entreprises",  val: stats?.companies || 0,  icon: "business",  col: "#8B5CF6" },
    { label: "Candidatures", val: applications?.length || 0, icon: "layers", col: theme.warning },
    { label: "Offres",       val: offers?.length || 0,    icon: "briefcase", col: theme.accent },
  ];

  return (
    <View style={s.root}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <LinearGradient colors={["#0B1120", "#111827"]} style={s.header}>
        <View style={s.headerRow}>
          <View>
            <Text style={s.adminLabel}>ADMIN PANEL</Text>
            <Text style={s.headerTitle}>StageFlow AI</Text>
          </View>
          <View style={s.headerActions}>
            <TouchableOpacity style={s.headerBtn} onPress={toggleTheme}>
              <Ionicons name={isDark ? "sunny-outline" : "moon-outline"} size={18} color="rgba(255,255,255,0.6)" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate("ProfileTab")}>
              <Avatar name={user?.name || "Admin"} size={44} color={theme.accent} />
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>

      {/* Content */}
      <View style={{ flex: 1 }}>
        {activeTab === "ai" ? (
          <View style={{ flex: 1, marginBottom: 80 }}>
            <ChatScreen />
          </View>
        ) : (
          <ScrollView
            key={activeTab}
            contentContainerStyle={s.scrollContent}
            showsVerticalScrollIndicator={false}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={theme.accent} />}
          >
            {activeTab === "stats" && (
              <Animatable.View animation="fadeInUp">
                <Text style={s.sectionTitle}>Chiffres Clés</Text>
                <View style={s.statsGrid}>
                  {STAT_CARDS.map((sc, i) => (
                    <Animatable.View key={i} animation="fadeInUp" delay={i * 80} style={s.statCard}>
                      <View style={[s.statIcon, { backgroundColor: sc.col + "20" }]}>
                        <Ionicons name={sc.icon} size={20} color={sc.col} />
                      </View>
                      <Text style={s.statVal}>{String(sc.val)}</Text>
                      <Text style={s.statLabel}>{sc.label}</Text>
                    </Animatable.View>
                  ))}
                </View>

                {/* Mini chart bar */}
                <View style={s.chartCard}>
                  <Text style={s.chartTitle}>Flux de candidatures</Text>
                  <View style={s.chartBars}>
                    {[40, 70, 45, 90, 65, 80, 95].map((h, i) => (
                      <View key={i} style={s.barCol}>
                        <Animatable.View animation="slideInUp" delay={600 + i * 80}
                          style={[s.bar, { height: h * 0.9, backgroundColor: i === 6 ? theme.accent : theme.bgElevated }]} />
                        <Text style={s.barDay}>{["L","M","M","J","V","S","D"][i]}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              </Animatable.View>
            )}

            {activeTab === "users" && (
              <Animatable.View animation="fadeIn">
                <View style={s.searchBox}>
                  <Ionicons name="search-outline" size={16} color={theme.textSub} />
                  <TextInput
                    placeholder="Chercher un membre..."
                    style={s.searchInput}
                    onChangeText={setSearch}
                    placeholderTextColor={theme.textMuted}
                  />
                </View>
                {filteredUsers.map((u, i) => (
                  <Animatable.View key={u._id} animation="fadeInRight" delay={i * 60} style={s.userCard}>
                    <View style={[s.userRoleBar, { backgroundColor: getRoleColor(u.role, theme) }]} />
                    <Avatar name={u.name} size={44} color={getRoleColor(u.role, theme)} />
                    <View style={s.userInfo}>
                      <Text style={s.userName}>{u.name || "Inconnu"}</Text>
                      <Text style={[s.userRole, { color: getRoleColor(u.role, theme) }]}>{u.role?.toUpperCase()}</Text>
                    </View>
                    <TouchableOpacity style={s.deleteBtn} onPress={() => handleDeleteUser(u._id, u.name)}>
                      <Ionicons name="trash-outline" size={18} color={theme.danger} />
                    </TouchableOpacity>
                  </Animatable.View>
                ))}
              </Animatable.View>
            )}

            {activeTab === "offers" && (
              <Animatable.View animation="fadeIn">
                <Text style={s.sectionTitle}>{offers?.length} Offres publiées</Text>
                {offers.map((o, i) => (
                  <Animatable.View key={o._id} animation="fadeInUp" delay={i * 60}>
                    <TouchableOpacity style={s.offerCard}
                      onPress={() => navigation.navigate("OfferDetails", { offer: o })}>
                      <View style={[s.offerIcon, { backgroundColor: theme.accentDim }]}>
                        <Ionicons name="briefcase-outline" size={20} color={theme.accent} />
                      </View>
                      <View style={{ flex: 1, marginLeft: 14 }}>
                        <Text style={s.offerTitle}>{o.title}</Text>
                        <Text style={s.offerComp}>{o.company}</Text>
                      </View>
                      <Ionicons name="chevron-forward" size={18} color={theme.textMuted} />
                    </TouchableOpacity>
                  </Animatable.View>
                ))}
              </Animatable.View>
            )}
          </ScrollView>
        )}
      </View>

      {/* Bottom Nav */}
      <View style={s.bottomNav}>
        {TABS.map(t => (
          <TouchableOpacity key={t.id} onPress={() => setActiveTab(t.id)} style={s.navItem}>
            <Animatable.View
              animation={activeTab === t.id ? "bounceIn" : undefined}
              style={[s.navIconWrap, activeTab === t.id && { backgroundColor: theme.accent }]}>
              <Ionicons
                name={activeTab === t.id ? t.icon : `${t.icon}-outline`}
                size={20}
                color={activeTab === t.id ? (isDark ? "#070B14" : "#fff") : theme.textSub}
              />
            </Animatable.View>
            <Text style={[s.navLabel, activeTab === t.id && { color: theme.accent }]}>{t.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

function getRoleColor(role, theme) {
  switch (role?.toLowerCase()) {
    case "admin":     return theme.danger;
    case "étudiant":  return theme.info;
    case "entreprise":return "#8B5CF6";
    default:          return theme.textSub;
  }
}

const makeStyles = (t, isDark) => StyleSheet.create({
  root:       { flex: 1, backgroundColor: t.bg },
  header:     { paddingTop: 50, paddingHorizontal: 22, paddingBottom: 22, borderBottomLeftRadius: 30, borderBottomRightRadius: 30 },
  headerRow:  { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  adminLabel: { color: t.accent, fontSize: 10, fontWeight: "900", letterSpacing: 2, marginBottom: 2 },
  headerTitle:{ fontSize: 24, fontWeight: "900", color: "#fff" },
  headerActions:{ flexDirection: "row", alignItems: "center", gap: 12 },
  headerBtn:  { width: 38, height: 38, borderRadius: 11, backgroundColor: "rgba(255,255,255,0.07)", justifyContent: "center", alignItems: "center" },

  scrollContent:{ padding: 22, paddingBottom: 110 },

  sectionTitle:{ fontSize: 17, color: t.text, fontWeight: "800", marginBottom: 18 },
  statsGrid:  { flexDirection: "row", flexWrap: "wrap", gap: 12, marginBottom: 24 },
  statCard:   { width: (width - 56) / 2, backgroundColor: t.bgCard, padding: 20, borderRadius: 22, borderWidth: 1, borderColor: t.border },
  statIcon:   { width: 40, height: 40, borderRadius: 13, justifyContent: "center", alignItems: "center", marginBottom: 14 },
  statVal:    { fontSize: 28, fontWeight: "900", color: t.text, marginBottom: 4 },
  statLabel:  { fontSize: 12, color: t.textSub, fontWeight: "600" },

  chartCard:  { backgroundColor: t.bgCard, borderRadius: 22, padding: 22, borderWidth: 1, borderColor: t.border },
  chartTitle: { fontSize: 14, fontWeight: "700", color: t.text, marginBottom: 20 },
  chartBars:  { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end", height: 100 },
  barCol:     { alignItems: "center", flex: 1 },
  bar:        { width: 10, borderRadius: 5, marginBottom: 8 },
  barDay:     { fontSize: 10, color: t.textMuted, fontWeight: "700" },

  searchBox:  { flexDirection: "row", alignItems: "center", gap: 10, backgroundColor: t.bgCard, borderRadius: 16, paddingHorizontal: 14, height: 48, marginBottom: 18, borderWidth: 1, borderColor: t.border },
  searchInput:{ flex: 1, color: t.text, fontSize: 14 },

  userCard:   { flexDirection: "row", alignItems: "center", backgroundColor: t.bgCard, padding: 14, borderRadius: 20, marginBottom: 12, borderWidth: 1, borderColor: t.border, overflow: "hidden" },
  userRoleBar:{ position: "absolute", left: 0, top: 14, bottom: 14, width: 4, borderTopRightRadius: 4, borderBottomRightRadius: 4 },
  userInfo:   { flex: 1, marginLeft: 14 },
  userName:   { color: t.text, fontWeight: "700", fontSize: 15 },
  userRole:   { fontSize: 10, fontWeight: "800", marginTop: 4, letterSpacing: 0.5 },
  deleteBtn:  { width: 38, height: 38, borderRadius: 11, backgroundColor: t.dangerDim, justifyContent: "center", alignItems: "center" },

  offerCard:  { flexDirection: "row", alignItems: "center", backgroundColor: t.bgCard, padding: 16, borderRadius: 20, marginBottom: 12, borderWidth: 1, borderColor: t.border },
  offerIcon:  { width: 46, height: 46, borderRadius: 15, justifyContent: "center", alignItems: "center" },
  offerTitle: { color: t.text, fontWeight: "700", fontSize: 15, marginBottom: 2 },
  offerComp:  { color: t.textSub, fontSize: 12 },

  bottomNav:  { position: "absolute", bottom: 0, width: "100%", flexDirection: "row", backgroundColor: t.tabBar, paddingBottom: 24, paddingTop: 12, borderTopLeftRadius: 28, borderTopRightRadius: 28, borderTopWidth: 1, borderTopColor: t.border, justifyContent: "space-around" },
  navItem:    { alignItems: "center", width: width / 4 },
  navIconWrap:{ width: 44, height: 34, borderRadius: 12, justifyContent: "center", alignItems: "center" },
  navLabel:   { fontSize: 10, color: t.textSub, marginTop: 4, fontWeight: "700" },
});