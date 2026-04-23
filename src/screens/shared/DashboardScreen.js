import React, { useContext } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as Animatable from "react-native-animatable";
import { AuthContext } from "../../context/AuthContext";
import { DataContext } from "../../context/DataContext";
import { useTheme } from "../../context/ThemeContext";

const { width } = Dimensions.get("window");

const ROLE_CONFIG = {
  admin:     { label: "ADMIN PANEL",    icon: "shield-half",  gradient: ["#3D8EFF","#5B6BFF"] },
  entreprise:{ label: "RECRUTEUR",      icon: "business",     gradient: ["#8B5CF6","#6D28D9"] },
  étudiant:  { label: "STUDENT SPACE",  icon: "school",       gradient: ["#00FF94","#00D4A0"] },
  encadrant: { label: "ENCADRANT",      icon: "people-circle",gradient: ["#F59E0B","#D97706"] },
};

export default function DashboardScreen({ navigation }) {
  const { user } = useContext(AuthContext);
  const { offers = [], applications = [], users = [] } = useContext(DataContext);
  const { theme, isDark, toggleTheme } = useTheme();

  const role = user?.role || "étudiant";
  const rc = ROLE_CONFIG[role] || ROLE_CONFIG.étudiant;

  const myApps = applications.filter(a => a.userId === user?._id);

  const getStats = () => {
    if (role === "admin") return [
      { label: "Utilisateurs", val: users.length, icon: "people",    col: theme.info },
      { label: "Offres",       val: offers.length, icon: "briefcase", col: theme.accent },
      { label: "Candidatures", val: applications.length, icon: "layers", col: "#8B5CF6" },
      { label: "Alertes",      val: "2",           icon: "warning",  col: theme.warning },
    ];
    if (role === "entreprise") return [
      { label: "Mes Offres",  val: offers.filter(o => o.companyId === user?._id).length, icon: "document-text", col: theme.info },
      { label: "Candidats",   val: applications.length, icon: "people",    col: theme.accent },
      { label: "Entretiens",  val: "2",  icon: "calendar",  col: "#8B5CF6" },
      { label: "Messages",    val: "5",  icon: "chatbubbles",col: theme.warning },
    ];
    if (role === "encadrant") return [
      { label: "Stagiaires",   val: applications.filter(a => a.status === "Acceptée").length, icon: "people",       col: theme.info },
      { label: "Évaluations",  val: "0",  icon: "clipboard",    col: theme.warning },
      { label: "Rapports",     val: "0",  icon: "document-text",col: "#8B5CF6" },
      { label: "Messages",     val: "0",  icon: "chatbubbles",  col: theme.accent },
    ];
    return [
      { label: "Candidatures", val: myApps.length, icon: "layers",          col: theme.info },
      { label: "Acceptées",    val: myApps.filter(a => a.status === "Acceptée").length, icon: "shield-checkmark", col: theme.accent },
      { label: "Offres",       val: offers.length, icon: "briefcase",        col: "#8B5CF6" },
      { label: "Assistant",    val: "Actif",       icon: "sparkles",         col: theme.warning },
    ];
  };

  const s = makeStyles(theme);

  return (
    <View style={s.root}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>

        {/* Header */}
        <View style={s.header}>
          <View>
            <Text style={[s.topLabel, { color: rc.gradient[0] }]}>{rc.label}</Text>
            <Text style={s.title}>
              StageFlow <Text style={{ color: rc.gradient[0] }}>AI</Text>
            </Text>
          </View>
          <View style={s.headerRight}>
            <TouchableOpacity style={s.iconBtn} onPress={toggleTheme}>
              <Ionicons name={isDark ? "sunny-outline" : "moon-outline"} size={18} color={theme.textSub} />
            </TouchableOpacity>
            <TouchableOpacity style={s.avatarBtn} onPress={() => navigation.navigate("ProfileTab")}>
              <LinearGradient colors={rc.gradient} style={s.avatarGrad}>
                <Text style={s.avatarText}>{user?.name?.substring(0, 2).toUpperCase() || "SF"}</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>

        {/* Welcome Card */}
        <Animatable.View animation="zoomIn" duration={700} style={s.welcomeCard}>
          <LinearGradient colors={[rc.gradient[0] + "18", rc.gradient[1] + "08"]}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={s.welcomeGrad}>
            <View style={s.welcomeLeft}>
              <Text style={s.welcomeGreet}>Bonjour, {user?.name?.split(" ")[0] || "User"} 👋</Text>
              <Text style={s.welcomeSub}>Gérez vos activités en temps réel</Text>
              <View style={[s.rolePill, { backgroundColor: rc.gradient[0] + "22", borderColor: rc.gradient[0] + "40" }]}>
                <Ionicons name={rc.icon} size={12} color={rc.gradient[0]} />
                <Text style={[s.rolePillText, { color: rc.gradient[0] }]}>{role.toUpperCase()}</Text>
              </View>
            </View>
            <View style={[s.welcomeOrb, { backgroundColor: rc.gradient[0] }]} />
          </LinearGradient>
        </Animatable.View>

        {/* Stats */}
        <Text style={s.sectionTitle}>Chiffres Clés</Text>
        <View style={s.statsGrid}>
          {getStats().map((item, i) => (
            <Animatable.View key={i} animation="fadeInUp" delay={i * 80} style={s.statCard}>
              <View style={[s.statIconWrap, { backgroundColor: item.col + "18" }]}>
                <Ionicons name={item.icon} size={20} color={item.col} />
              </View>
              <Text style={s.statVal}>{String(item.val)}</Text>
              <Text style={s.statLabel}>{item.label}</Text>
            </Animatable.View>
          ))}
        </View>

        {/* AI Shortcut */}
        <Animatable.View animation="fadeInUp" delay={400} style={s.aiWrap}>
          <TouchableOpacity onPress={() => navigation.navigate("ChatbotTab")} activeOpacity={0.85} style={s.aiBtn}>
            <LinearGradient colors={rc.gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={s.aiBtnGrad}>
              <View style={s.aiBtnLeft}>
                <Ionicons name="sparkles" size={22} color={isDark ? "#070B14" : "#fff"} />
                <View style={{ marginLeft: 14 }}>
                  <Text style={[s.aiBtnTitle, { color: isDark ? "#070B14" : "#fff" }]}>Assistant IA</Text>
                  <Text style={[s.aiBtnSub, { color: isDark ? "rgba(0,0,0,0.5)" : "rgba(255,255,255,0.7)" }]}>Posez une question</Text>
                </View>
              </View>
              <Ionicons name="arrow-forward-circle" size={26} color={isDark ? "rgba(0,0,0,0.25)" : "rgba(255,255,255,0.6)"} />
            </LinearGradient>
          </TouchableOpacity>
        </Animatable.View>

        <View style={{ height: 30 }} />
      </ScrollView>
    </View>
  );
}

const makeStyles = (t) => StyleSheet.create({
  root:         { flex: 1, backgroundColor: t.bg },
  scroll:       { paddingHorizontal: 22, paddingTop: 58, paddingBottom: 20 },

  header:       { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 28 },
  topLabel:     { fontSize: 10, fontWeight: "800", letterSpacing: 2, marginBottom: 2 },
  title:        { fontSize: 26, fontWeight: "900", color: t.text },
  headerRight:  { flexDirection: "row", alignItems: "center", gap: 10 },
  iconBtn:      { width: 38, height: 38, borderRadius: 11, backgroundColor: t.bgElevated, justifyContent: "center", alignItems: "center", borderWidth: 1, borderColor: t.border },
  avatarBtn:    { width: 42, height: 42, borderRadius: 14, overflow: "hidden" },
  avatarGrad:   { flex: 1, justifyContent: "center", alignItems: "center" },
  avatarText:   { fontSize: 15, fontWeight: "900", color: t.mode === "dark" ? "#070B14" : "#fff" },

  welcomeCard:  { borderRadius: 26, overflow: "hidden", marginBottom: 30, borderWidth: 1, borderColor: t.border },
  welcomeGrad:  { padding: 24, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  welcomeLeft:  { flex: 1 },
  welcomeGreet: { fontSize: 20, fontWeight: "800", color: t.text, marginBottom: 4 },
  welcomeSub:   { fontSize: 13, color: t.textSub, marginBottom: 14, lineHeight: 18 },
  rolePill:     { flexDirection: "row", alignItems: "center", gap: 5, alignSelf: "flex-start", paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20, borderWidth: 1 },
  rolePillText: { fontSize: 10, fontWeight: "800", letterSpacing: 0.5 },
  welcomeOrb:   { width: 80, height: 80, borderRadius: 40, opacity: 0.12, marginLeft: 10 },

  sectionTitle: { fontSize: 16, fontWeight: "800", color: t.text, marginBottom: 16 },
  statsGrid:    { flexDirection: "row", flexWrap: "wrap", gap: 12, marginBottom: 28 },
  statCard:     { width: (width - 56) / 2, backgroundColor: t.bgCard, borderRadius: 22, padding: 20, borderWidth: 1, borderColor: t.border },
  statIconWrap: { width: 40, height: 40, borderRadius: 13, justifyContent: "center", alignItems: "center", marginBottom: 14 },
  statVal:      { fontSize: 28, fontWeight: "900", color: t.text, marginBottom: 4 },
  statLabel:    { fontSize: 12, color: t.textSub, fontWeight: "600" },

  aiWrap:       { marginBottom: 8 },
  aiBtn:        { borderRadius: 22, overflow: "hidden" },
  aiBtnGrad:    { flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 20 },
  aiBtnLeft:    { flexDirection: "row", alignItems: "center" },
  aiBtnTitle:   { fontSize: 16, fontWeight: "800" },
  aiBtnSub:     { fontSize: 12, marginTop: 2 },
});