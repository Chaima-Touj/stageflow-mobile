import React, { useState, useContext } from "react";
import {
  View, Text, StyleSheet, TouchableOpacity, Alert,
  StatusBar, ScrollView, TextInput, Modal, Dimensions
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { AuthContext } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import * as Animatable from "react-native-animatable";

const { width } = Dimensions.get("window");

const ROLE_GRADIENT = {
  admin:     ["#3D8EFF", "#5B6BFF"],
  entreprise:["#8B5CF6", "#6D28D9"],
  étudiant:  ["#00FF94", "#00D4A0"],
  encadrant: ["#F59E0B", "#D97706"],
};

export default function ProfileScreen({ navigation }) {
  const { user, logout } = useContext(AuthContext);
  const { theme, isDark, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState("info");
  const [modalVisible, setModalVisible] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const roleGrad = ROLE_GRADIENT[user?.role] || ROLE_GRADIENT.étudiant;
  const initials = (user?.name || "SF").split(" ").slice(0, 2).map(w => w[0]).join("").toUpperCase();

  const handleLogout = () => Alert.alert("Déconnexion", "Voulez-vous quitter ?", [
    { text: "Annuler", style: "cancel" },
    { text: "Quitter", style: "destructive", onPress: logout },
  ]);

  const handleUpdatePassword = () => {
    if (!oldPassword || !newPassword || !confirmPassword) return Alert.alert("Erreur", "Remplissez tous les champs.");
    if (newPassword.length < 6) return Alert.alert("Erreur", "Minimum 6 caractères.");
    if (newPassword !== confirmPassword) return Alert.alert("Erreur", "Mots de passe non identiques.");
    Alert.alert("Succès", "Mot de passe modifié !");
    setModalVisible(false); setOldPassword(""); setNewPassword(""); setConfirmPassword("");
  };

  const s = makeStyles(theme);

  return (
    <View style={s.root}>
      <StatusBar barStyle="light-content" />

      {/* Hero */}
      <LinearGradient colors={[...roleGrad, roleGrad[1] + "CC"]} style={s.hero}>
        <View style={s.heroTopRow}>
          <TouchableOpacity style={s.heroBtn} onPress={() => navigation.canGoBack() ? navigation.goBack() : null}>
            {navigation.canGoBack() && <Ionicons name="arrow-back" size={20} color="rgba(255,255,255,0.8)" />}
          </TouchableOpacity>
          <TouchableOpacity style={s.heroBtn} onPress={toggleTheme}>
            <Ionicons name={isDark ? "sunny-outline" : "moon-outline"} size={20} color="rgba(255,255,255,0.8)" />
          </TouchableOpacity>
          <TouchableOpacity style={[s.heroBtn, s.heroBtnDanger]} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={20} color="#FF6B8A" />
          </TouchableOpacity>
        </View>

        <Animatable.View animation="bounceIn" duration={800} style={s.avatarWrap}>
          <View style={s.avatarRing}>
            <View style={s.avatar}>
              <Text style={s.avatarText}>{initials}</Text>
            </View>
          </View>
        </Animatable.View>
        <Text style={s.heroName}>{user?.name || "Utilisateur"}</Text>
        <View style={s.heroPill}>
          <Text style={s.heroPillText}>{(user?.role || "membre").toUpperCase()}</Text>
        </View>
      </LinearGradient>

      {/* Tab Bar */}
      <View style={s.tabBar}>
        {["info", "settings"].map(tab => (
          <TouchableOpacity key={tab} onPress={() => setActiveTab(tab)}
            style={[s.tabBtn, activeTab === tab && { backgroundColor: theme.bgElevated }]}>
            <Ionicons
              name={tab === "info" ? (activeTab === tab ? "person" : "person-outline") : (activeTab === tab ? "settings" : "settings-outline")}
              size={16} color={activeTab === tab ? theme.accent : theme.textSub}
            />
            <Text style={[s.tabLabel, activeTab === tab && { color: theme.accent }]}>
              {tab === "info" ? "Infos" : "Paramètres"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        {activeTab === "info" ? (
          <Animatable.View animation="fadeIn" duration={400}>
            <InfoRow icon="person-outline"   label="Nom complet"     value={user?.name}  theme={theme} />
            <InfoRow icon="mail-outline"     label="Email"           value={user?.email} theme={theme} />
            <InfoRow icon="shield-outline"   label="Rôle"            value={user?.role}  theme={theme} />
          </Animatable.View>
        ) : (
          <Animatable.View animation="fadeIn" duration={400}>
            <TouchableOpacity style={s.settingsRow} onPress={() => setModalVisible(true)}>
              <View style={[s.settingIcon, { backgroundColor: theme.infoDim }]}>
                <Ionicons name="lock-closed-outline" size={20} color={theme.info} />
              </View>
              <View style={s.settingMid}>
                <Text style={s.settingTitle}>Modifier le mot de passe</Text>
                <Text style={s.settingDesc}>Sécurisez votre compte</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={theme.textMuted} />
            </TouchableOpacity>

            <TouchableOpacity style={[s.settingsRow, { borderColor: theme.dangerDim }]} onPress={handleLogout}>
              <View style={[s.settingIcon, { backgroundColor: theme.dangerDim }]}>
                <Ionicons name="log-out-outline" size={20} color={theme.danger} />
              </View>
              <View style={s.settingMid}>
                <Text style={[s.settingTitle, { color: theme.danger }]}>Déconnexion</Text>
                <Text style={s.settingDesc}>Quitter votre session</Text>
              </View>
            </TouchableOpacity>
          </Animatable.View>
        )}
      </ScrollView>

      {/* Password Modal */}
      <Modal visible={modalVisible} transparent animationType="fade" onRequestClose={() => setModalVisible(false)}>
        <View style={s.modalOverlay}>
          <Animatable.View animation="zoomIn" duration={280} style={s.modalCard}>
            <View style={s.modalHeader}>
              <Text style={s.modalTitle}>Sécurité du compte</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={s.modalClose}>
                <Ionicons name="close" size={20} color={theme.textSub} />
              </TouchableOpacity>
            </View>

            {[
              { label: "Mot de passe actuel", val: oldPassword, set: setOldPassword },
              { label: "Nouveau mot de passe", val: newPassword, set: setNewPassword },
              { label: "Confirmer le nouveau", val: confirmPassword, set: setConfirmPassword },
            ].map((f, i) => (
              <View key={i} style={s.modalField}>
                <Text style={s.modalLabel}>{f.label}</Text>
                <TextInput
                  style={s.modalInput}
                  placeholder="••••••••"
                  placeholderTextColor={theme.textMuted}
                  secureTextEntry
                  value={f.val}
                  onChangeText={f.set}
                />
              </View>
            ))}

            <View style={s.modalBtns}>
              <TouchableOpacity style={s.modalCancel} onPress={() => setModalVisible(false)}>
                <Text style={s.modalCancelText}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity style={s.modalConfirmWrap} onPress={handleUpdatePassword}>
                <LinearGradient colors={[theme.accent, isDark ? "#00D4A0" : "#009955"]} style={s.modalConfirm}>
                  <Text style={[s.modalConfirmText, { color: isDark ? "#070B14" : "#fff" }]}>Mettre à jour</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </Animatable.View>
        </View>
      </Modal>
    </View>
  );
}

function InfoRow({ icon, label, value, theme }) {
  const s = rowStyles(theme);
  return (
    <View style={s.row}>
      <View style={s.rowIcon}><Ionicons name={icon} size={18} color={theme.accent} /></View>
      <View style={s.rowBody}>
        <Text style={s.rowLabel}>{label}</Text>
        <Text style={s.rowValue}>{value || "—"}</Text>
      </View>
    </View>
  );
}

const rowStyles = (t) => StyleSheet.create({
  row:       { flexDirection: "row", alignItems: "center", backgroundColor: t.bgCard, borderRadius: 18, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: t.border },
  rowIcon:   { width: 40, height: 40, borderRadius: 12, backgroundColor: t.accentDim, justifyContent: "center", alignItems: "center", marginRight: 14 },
  rowLabel:  { fontSize: 10, fontWeight: "700", color: t.textMuted, letterSpacing: 0.8, marginBottom: 4, textTransform: "uppercase" },
  rowValue:  { fontSize: 15, fontWeight: "700", color: t.text },
});

const makeStyles = (t) => StyleSheet.create({
  root:         { flex: 1, backgroundColor: t.bg },
  hero:         { paddingTop: 50, paddingBottom: 36, alignItems: "center", borderBottomLeftRadius: 36, borderBottomRightRadius: 36 },
  heroTopRow:   { flexDirection: "row", width: "100%", justifyContent: "space-between", paddingHorizontal: 20, marginBottom: 20 },
  heroBtn:      { width: 40, height: 40, borderRadius: 13, backgroundColor: "rgba(255,255,255,0.12)", justifyContent: "center", alignItems: "center" },
  heroBtnDanger:{ backgroundColor: "rgba(255,107,138,0.15)" },
  avatarWrap:   { marginBottom: 14 },
  avatarRing:   { padding: 3, borderRadius: 52, borderWidth: 2.5, borderColor: "rgba(255,255,255,0.5)" },
  avatar:       { width: 88, height: 88, borderRadius: 44, backgroundColor: "rgba(255,255,255,0.2)", justifyContent: "center", alignItems: "center" },
  avatarText:   { fontSize: 32, fontWeight: "900", color: "#fff" },
  heroName:     { fontSize: 22, fontWeight: "800", color: "#fff", marginBottom: 8 },
  heroPill:     { backgroundColor: "rgba(255,255,255,0.15)", paddingHorizontal: 14, paddingVertical: 5, borderRadius: 20, borderWidth: 1, borderColor: "rgba(255,255,255,0.25)" },
  heroPillText: { color: "#fff", fontSize: 10, fontWeight: "800", letterSpacing: 1 },

  tabBar:       { flexDirection: "row", marginHorizontal: 30, marginTop: -24, backgroundColor: t.bgCard, borderRadius: 18, padding: 5, borderWidth: 1, borderColor: t.border, shadowColor: "#000", shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.12, shadowRadius: 12, elevation: 8, zIndex: 10 },
  tabBtn:       { flex: 1, flexDirection: "row", gap: 6, justifyContent: "center", alignItems: "center", paddingVertical: 11, borderRadius: 13 },
  tabLabel:     { fontSize: 13, fontWeight: "700", color: t.textSub },

  scroll:       { padding: 22, paddingTop: 26 },

  settingsRow:  { flexDirection: "row", alignItems: "center", backgroundColor: t.bgCard, borderRadius: 18, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: t.border },
  settingIcon:  { width: 44, height: 44, borderRadius: 14, justifyContent: "center", alignItems: "center", marginRight: 14 },
  settingMid:   { flex: 1 },
  settingTitle: { fontSize: 15, fontWeight: "700", color: t.text },
  settingDesc:  { fontSize: 12, color: t.textSub, marginTop: 2 },

  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.65)", justifyContent: "center", alignItems: "center", padding: 24 },
  modalCard:    { width: "100%", backgroundColor: t.bgCard, borderRadius: 28, padding: 24, borderWidth: 1, borderColor: t.border },
  modalHeader:  { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 22 },
  modalTitle:   { fontSize: 18, fontWeight: "800", color: t.text },
  modalClose:   { width: 36, height: 36, borderRadius: 10, backgroundColor: t.bgElevated, justifyContent: "center", alignItems: "center" },
  modalField:   { marginBottom: 16 },
  modalLabel:   { fontSize: 11, fontWeight: "700", color: t.textSub, marginBottom: 8, letterSpacing: 0.5 },
  modalInput:   { backgroundColor: t.bgInput, color: t.text, padding: 14, borderRadius: 14, borderWidth: 1.5, borderColor: t.border, fontSize: 15 },
  modalBtns:    { flexDirection: "row", gap: 12, marginTop: 8 },
  modalCancel:  { flex: 1, padding: 15, alignItems: "center", borderRadius: 14, borderWidth: 1, borderColor: t.border },
  modalCancelText:{ color: t.textSub, fontWeight: "600" },
  modalConfirmWrap:{ flex: 1, borderRadius: 14, overflow: "hidden" },
  modalConfirm: { padding: 15, alignItems: "center" },
  modalConfirmText:{ fontWeight: "800", fontSize: 14 },
});