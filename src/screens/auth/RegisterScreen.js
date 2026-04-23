import React, { useState, useContext, useRef } from "react";
import {
  View, Text, StyleSheet, TouchableOpacity,
  KeyboardAvoidingView, Platform, ScrollView,
  StatusBar, TextInput, Dimensions, ActivityIndicator, Animated
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { AuthContext } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import * as Animatable from "react-native-animatable";

const { width } = Dimensions.get("window");

const ROLES = [
  { value: "étudiant",   label: "Étudiant",   emoji: "🎓", icon: "school-outline" },
  { value: "entreprise", label: "Entreprise", emoji: "🏢", icon: "business-outline" },
  { value: "encadrant",  label: "Encadrant",  emoji: "👨‍🏫", icon: "people-outline" },
];

export default function RegisterScreen({ navigation }) {
  const { register } = useContext(AuthContext);
  const { theme, isDark, toggleTheme } = useTheme();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "étudiant", phone: "", university: "" });
  const [showPass, setShowPass] = useState(false);
  const [error, setError]   = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setError(""); };

  const animateStep = (next) => {
    Animated.timing(fadeAnim, { toValue: 0, duration: 180, useNativeDriver: true }).start(() => {
      setStep(next);
      Animated.timing(fadeAnim, { toValue: 1, duration: 250, useNativeDriver: true }).start();
    });
  };

  const handleRegister = async () => {
    setLoading(true);
    const res = await register(form);
    setLoading(false);
    if (!res.success) setError(res.message || "Erreur d'inscription.");
  };

  const s = makeStyles(theme);

  return (
    <View style={s.root}>
      <StatusBar barStyle={theme.statusBar} backgroundColor={theme.bg} />
      <View style={s.orb} />

      {/* Header */}
      <View style={s.topRow}>
        <TouchableOpacity style={s.iconBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={20} color={theme.textSub} />
        </TouchableOpacity>
        <View style={s.stepPills}>
          {[1, 2].map(n => (
            <View key={n} style={[s.pill, step === n && s.pillActive, step > n && s.pillDone]}>
              {step > n
                ? <Ionicons name="checkmark" size={12} color={theme.bg} />
                : <Text style={[s.pillText, step === n && s.pillTextActive]}>{n}</Text>
              }
            </View>
          ))}
          <View style={[s.pillLine, step === 2 && s.pillLineFilled]} />
        </View>
        <TouchableOpacity style={s.iconBtn} onPress={toggleTheme}>
          <Ionicons name={isDark ? "sunny-outline" : "moon-outline"} size={20} color={theme.textSub} />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

          {/* Title area */}
          <Animatable.View animation="fadeInDown" duration={700} style={s.titleArea}>
            <Text style={s.appName}>StageFlow</Text>
            <Text style={s.stepLabel}>{step === 1 ? "Vos informations" : "Votre profil"}</Text>
          </Animatable.View>

          {/* Error */}
          {!!error && (
            <Animatable.View animation="shake" style={s.errorBox}>
              <Ionicons name="alert-circle-outline" size={16} color={theme.danger} />
              <Text style={s.errorText}>{error}</Text>
            </Animatable.View>
          )}

          <Animated.View style={{ opacity: fadeAnim }}>
            {step === 1 ? (
              <Animatable.View animation="fadeIn" style={s.card}>
                <Field label="NOM COMPLET" icon="person-outline" value={form.name}
                  onChangeText={v => set("name", v)} placeholder="Ahmed Ben Ali" theme={theme} />
                <Field label="EMAIL" icon="mail-outline" value={form.email}
                  onChangeText={v => set("email", v)} placeholder="vous@exemple.com"
                  keyboardType="email-address" theme={theme} />
                <Field label="MOT DE PASSE" icon="lock-closed-outline" value={form.password}
                  onChangeText={v => set("password", v)} placeholder="••••••••"
                  secureTextEntry={!showPass} theme={theme}
                  right={
                    <TouchableOpacity onPress={() => setShowPass(!showPass)} style={{ padding: 14 }}>
                      <Ionicons name={showPass ? "eye-off-outline" : "eye-outline"} size={20} color={theme.textSub} />
                    </TouchableOpacity>
                  }
                />
                <TouchableOpacity style={s.ctaWrap} onPress={() => animateStep(2)} activeOpacity={0.85}>
                  <LinearGradient colors={[theme.accent, isDark ? "#00D4A0" : "#009955"]}
                    start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={s.cta}>
                    <Text style={s.ctaText}>SUIVANT</Text>
                    <Ionicons name="arrow-forward" size={18} color={isDark ? "#070B14" : "#fff"} style={{ marginLeft: 8 }} />
                  </LinearGradient>
                </TouchableOpacity>
              </Animatable.View>
            ) : (
              <Animatable.View animation="fadeIn" style={s.card}>
                {/* Role selector */}
                <Text style={s.fieldLabel}>JE SUIS UN(E)...</Text>
                <View style={s.roleGrid}>
                  {ROLES.map(r => (
                    <TouchableOpacity key={r.value} onPress={() => set("role", r.value)}
                      style={[s.roleCard, form.role === r.value && { borderColor: theme.accent, backgroundColor: theme.accentDim }]}
                      activeOpacity={0.75}>
                      <Text style={s.roleEmoji}>{r.emoji}</Text>
                      <Text style={[s.roleName, form.role === r.value && { color: theme.accent }]}>{r.label}</Text>
                      {form.role === r.value && (
                        <View style={s.roleCheck}>
                          <Ionicons name="checkmark" size={10} color={theme.bg} />
                        </View>
                      )}
                    </TouchableOpacity>
                  ))}
                </View>

                <Field label="TÉLÉPHONE" icon="call-outline" value={form.phone}
                  onChangeText={v => set("phone", v)} placeholder="+216 -- --- ---"
                  keyboardType="phone-pad" theme={theme} />
                <Field label="UNIVERSITÉ / ÉTABLISSEMENT" icon="school-outline" value={form.university}
                  onChangeText={v => set("university", v)} placeholder="Nom de l'établissement" theme={theme} />

                <TouchableOpacity style={s.ctaWrap} onPress={handleRegister} disabled={loading} activeOpacity={0.85}>
                  <LinearGradient colors={[theme.accent, isDark ? "#00D4A0" : "#009955"]}
                    start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={s.cta}>
                    {loading
                      ? <ActivityIndicator color={isDark ? "#070B14" : "#fff"} />
                      : <Text style={s.ctaText}>CRÉER MON COMPTE</Text>}
                  </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => animateStep(1)} style={s.backLink}>
                  <Ionicons name="arrow-back" size={14} color={theme.textSub} />
                  <Text style={s.backLinkText}>Retour à l'étape 1</Text>
                </TouchableOpacity>
              </Animatable.View>
            )}
          </Animated.View>

          <TouchableOpacity onPress={() => navigation.navigate("Login")} style={s.loginRow}>
            <Text style={s.loginText}>Déjà inscrit ? </Text>
            <Text style={s.loginLink}>Se connecter</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

function Field({ label, icon, right, theme, ...props }) {
  const s = makeStyles(theme);
  return (
    <View style={s.fieldWrap}>
      {label && <Text style={s.fieldLabel}>{label}</Text>}
      <View style={s.inputRow}>
        <View style={s.inputIcon}><Ionicons name={icon} size={18} color={theme.accent} /></View>
        <TextInput {...props} style={s.input} placeholderTextColor={theme.textMuted} autoCapitalize="none" />
        {right}
      </View>
    </View>
  );
}

const makeStyles = (t) => StyleSheet.create({
  root:         { flex: 1, backgroundColor: t.bg },
  orb:          { position: "absolute", top: -80, right: -60, width: 220, height: 220, borderRadius: 110, backgroundColor: t.accent, opacity: t.mode === "dark" ? 0.04 : 0.06 },

  topRow:       { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, paddingTop: 54, marginBottom: 4 },
  iconBtn:      { width: 40, height: 40, borderRadius: 12, backgroundColor: t.bgElevated, justifyContent: "center", alignItems: "center", borderWidth: 1, borderColor: t.border },
  stepPills:    { flexDirection: "row", alignItems: "center", gap: 6 },
  pill:         { width: 28, height: 28, borderRadius: 14, backgroundColor: t.bgElevated, borderWidth: 1.5, borderColor: t.border, justifyContent: "center", alignItems: "center" },
  pillActive:   { backgroundColor: t.accent, borderColor: t.accent },
  pillDone:     { backgroundColor: t.accent, borderColor: t.accent },
  pillText:     { fontSize: 12, fontWeight: "700", color: t.textMuted },
  pillTextActive:{ color: t.mode === "dark" ? "#070B14" : "#fff" },
  pillLine:     { width: 32, height: 2, backgroundColor: t.border, borderRadius: 1 },
  pillLineFilled:{ backgroundColor: t.accent },

  scroll:       { flexGrow: 1, paddingHorizontal: 22, paddingBottom: 40 },

  titleArea:    { alignItems: "center", marginVertical: 28 },
  appName:      { fontSize: 28, fontWeight: "900", color: t.text, letterSpacing: -0.5 },
  stepLabel:    { fontSize: 14, color: t.textSub, marginTop: 6, fontWeight: "600" },

  errorBox:     { flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: t.dangerDim, borderWidth: 1, borderColor: t.danger + "40", padding: 14, borderRadius: 14, marginBottom: 16 },
  errorText:    { color: t.danger, fontSize: 13, fontWeight: "600", flex: 1 },

  card:         { backgroundColor: t.bgCard, borderRadius: 28, padding: 24, borderWidth: 1, borderColor: t.border, shadowColor: "#000", shadowOffset: { width: 0, height: 10 }, shadowOpacity: t.mode === "dark" ? 0.3 : 0.08, shadowRadius: 20, elevation: 10 },

  fieldWrap:    { marginBottom: 18 },
  fieldLabel:   { fontSize: 10, fontWeight: "700", color: t.accent, letterSpacing: 1.2, marginBottom: 8 },
  inputRow:     { flexDirection: "row", alignItems: "center", backgroundColor: t.bgInput, borderRadius: 16, borderWidth: 1.5, borderColor: t.border, minHeight: 52, overflow: "hidden" },
  inputIcon:    { width: 48, alignItems: "center", justifyContent: "center" },
  input:        { flex: 1, fontSize: 15, color: t.text, paddingVertical: 13, paddingRight: 12 },

  roleGrid:     { flexDirection: "row", gap: 10, marginBottom: 22 },
  roleCard:     { flex: 1, alignItems: "center", paddingVertical: 16, borderRadius: 18, borderWidth: 1.5, borderColor: t.border, backgroundColor: t.bgInput, position: "relative" },
  roleEmoji:    { fontSize: 24, marginBottom: 8 },
  roleName:     { fontSize: 11, fontWeight: "700", color: t.textSub },
  roleCheck:    { position: "absolute", top: 8, right: 8, width: 18, height: 18, borderRadius: 9, backgroundColor: t.accent, justifyContent: "center", alignItems: "center" },

  ctaWrap:      { borderRadius: 18, overflow: "hidden", marginTop: 8 },
  cta:          { height: 56, flexDirection: "row", justifyContent: "center", alignItems: "center" },
  ctaText:      { fontSize: 15, fontWeight: "900", color: t.mode === "dark" ? "#070B14" : "#fff", letterSpacing: 1 },

  backLink:     { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, marginTop: 18 },
  backLinkText: { fontSize: 13, color: t.textSub },

  loginRow:     { flexDirection: "row", justifyContent: "center", marginTop: 28 },
  loginText:    { fontSize: 14, color: t.textSub },
  loginLink:    { fontSize: 14, color: t.accent, fontWeight: "700" },
});