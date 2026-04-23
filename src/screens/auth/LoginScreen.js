import React, { useState, useContext, useRef } from "react";
import {
  View, Text, StyleSheet, TouchableOpacity,
  KeyboardAvoidingView, Platform, ScrollView,
  StatusBar, TextInput, Dimensions, ActivityIndicator
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { AuthContext } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import * as Animatable from "react-native-animatable";

const { width, height } = Dimensions.get("window");

export default function LoginScreen({ navigation }) {
  const { login } = useContext(AuthContext);
  const { theme, isDark, toggleTheme } = useTheme();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const cardRef = useRef(null);

  const handleLogin = async () => {
    if (!form.email || !form.password) { cardRef.current?.shake(800); return; }
    setLoading(true);
    const res = await login(form.email, form.password);
    if (!res?.success) cardRef.current?.shake(800);
    setLoading(false);
  };

  const s = makeStyles(theme);

  return (
    <View style={s.root}>
      <StatusBar barStyle={theme.statusBar} backgroundColor={theme.bg} />

      {/* Background orb */}
      <View style={s.orbTop} />
      <View style={s.orbBottom} />

      {/* Theme toggle */}
      <TouchableOpacity style={s.themeBtn} onPress={toggleTheme} activeOpacity={0.7}>
        <Ionicons name={isDark ? "sunny-outline" : "moon-outline"} size={20} color={theme.textSub} />
      </TouchableOpacity>

      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

          {/* Logo */}
          <Animatable.View animation="fadeInDown" duration={900} style={s.logoArea}>
            <Animatable.View animation="pulse" iterationCount="infinite" duration={3000} style={s.logoRing}>
              <LinearGradient colors={[theme.accentDim, "transparent"]} style={s.logoGrad}>
                <Text style={s.logoEmoji}>🎓</Text>
              </LinearGradient>
            </Animatable.View>
            <Text style={s.appName}>StageFlow</Text>
            <Text style={s.appTag}>Votre passerelle vers le monde professionnel</Text>
          </Animatable.View>

          {/* Card */}
          <Animatable.View ref={cardRef} animation="fadeInUp" duration={800} delay={200} style={s.card}>

            <Text style={s.cardTitle}>Bon retour 👋</Text>
            <Text style={s.cardSub}>Connectez-vous pour continuer</Text>

            {/* Email */}
            <View style={s.fieldWrap}>
              <Text style={s.fieldLabel}>ADRESSE EMAIL</Text>
              <View style={s.inputRow}>
                <View style={s.inputIcon}>
                  <Ionicons name="mail-outline" size={18} color={theme.accent} />
                </View>
                <TextInput
                  value={form.email}
                  onChangeText={v => setForm({ ...form, email: v })}
                  placeholder="vous@exemple.com"
                  placeholderTextColor={theme.textMuted}
                  style={s.input}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              </View>
            </View>

            {/* Password */}
            <View style={s.fieldWrap}>
              <Text style={s.fieldLabel}>MOT DE PASSE</Text>
              <View style={s.inputRow}>
                <View style={s.inputIcon}>
                  <Ionicons name="lock-closed-outline" size={18} color={theme.accent} />
                </View>
                <TextInput
                  value={form.password}
                  onChangeText={v => setForm({ ...form, password: v })}
                  placeholder="••••••••"
                  placeholderTextColor={theme.textMuted}
                  secureTextEntry={!showPassword}
                  style={s.input}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={s.eyeBtn}>
                  <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={20} color={theme.textSub} />
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity style={s.forgotRow}>
              <Text style={s.forgotText}>Mot de passe oublié ?</Text>
            </TouchableOpacity>

            {/* CTA */}
            <TouchableOpacity onPress={handleLogin} disabled={loading} activeOpacity={0.85} style={s.ctaWrap}>
              <LinearGradient
                colors={[theme.accent, isDark ? "#00D4A0" : "#009955"]}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                style={s.cta}
              >
                {loading
                  ? <ActivityIndicator color={isDark ? "#070B14" : "#fff"} />
                  : <>
                      <Text style={s.ctaText}>SE CONNECTER</Text>
                      <Ionicons name="arrow-forward" size={18} color={isDark ? "#070B14" : "#fff"} style={{ marginLeft: 8 }} />
                    </>
                }
              </LinearGradient>
            </TouchableOpacity>

            {/* Divider */}
            <View style={s.divider}>
              <View style={s.dividerLine} />
              <Text style={s.dividerText}>ou</Text>
              <View style={s.dividerLine} />
            </View>

            {/* Register link */}
            <TouchableOpacity onPress={() => navigation.navigate("Register")} style={s.registerRow}>
              <Text style={s.registerText}>Nouveau sur StageFlow ? </Text>
              <Text style={s.registerLink}>Créer un compte</Text>
            </TouchableOpacity>

          </Animatable.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const makeStyles = (t) => StyleSheet.create({
  root:        { flex: 1, backgroundColor: t.bg },
  orbTop:      { position: "absolute", top: -120, right: -80, width: 300, height: 300, borderRadius: 150, backgroundColor: t.accent, opacity: isDarkMode(t) ? 0.04 : 0.06 },
  orbBottom:   { position: "absolute", bottom: -100, left: -60, width: 250, height: 250, borderRadius: 125, backgroundColor: t.info, opacity: isDarkMode(t) ? 0.05 : 0.05 },

  themeBtn:    { position: "absolute", top: 54, right: 22, width: 40, height: 40, borderRadius: 12, backgroundColor: t.bgElevated, justifyContent: "center", alignItems: "center", zIndex: 10, borderWidth: 1, borderColor: t.border },

  scroll:      { flexGrow: 1, paddingHorizontal: 24, paddingTop: 60, paddingBottom: 40 },

  logoArea:    { alignItems: "center", marginBottom: 36, marginTop: 30 },
  logoRing:    { width: 110, height: 110, borderRadius: 55, overflow: "hidden", borderWidth: 1.5, borderColor: t.accentBorder, marginBottom: 20 },
  logoGrad:    { flex: 1, justifyContent: "center", alignItems: "center" },
  logoEmoji:   { fontSize: 52 },
  appName:     { fontSize: 30, fontWeight: "900", color: t.text, letterSpacing: -0.5 },
  appTag:      { fontSize: 13, color: t.textSub, marginTop: 6, textAlign: "center", lineHeight: 20 },

  card:        { backgroundColor: t.bgCard, borderRadius: 28, padding: 26, borderWidth: 1, borderColor: t.border, shadowColor: "#000", shadowOffset: { width: 0, height: 12 }, shadowOpacity: isDarkMode(t) ? 0.35 : 0.10, shadowRadius: 24, elevation: 12 },
  cardTitle:   { fontSize: 22, fontWeight: "800", color: t.text, marginBottom: 4 },
  cardSub:     { fontSize: 13, color: t.textSub, marginBottom: 28 },

  fieldWrap:   { marginBottom: 18 },
  fieldLabel:  { fontSize: 10, fontWeight: "700", color: t.accent, letterSpacing: 1.2, marginBottom: 8 },
  inputRow:    { flexDirection: "row", alignItems: "center", backgroundColor: t.bgInput, borderRadius: 16, borderWidth: 1.5, borderColor: t.border, minHeight: 52, overflow: "hidden" },
  inputIcon:   { width: 48, alignItems: "center", justifyContent: "center" },
  input:       { flex: 1, fontSize: 15, color: t.text, paddingVertical: 13, paddingRight: 12 },
  eyeBtn:      { padding: 14 },

  forgotRow:   { alignSelf: "flex-end", marginBottom: 24 },
  forgotText:  { fontSize: 12, color: t.textSub, fontWeight: "600" },

  ctaWrap:     { borderRadius: 18, overflow: "hidden", marginBottom: 22 },
  cta:         { height: 56, flexDirection: "row", justifyContent: "center", alignItems: "center" },
  ctaText:     { fontSize: 15, fontWeight: "900", color: isDarkMode(t) ? "#070B14" : "#fff", letterSpacing: 1 },

  divider:     { flexDirection: "row", alignItems: "center", marginBottom: 22 },
  dividerLine: { flex: 1, height: 1, backgroundColor: t.border },
  dividerText: { fontSize: 12, color: t.textMuted, marginHorizontal: 12 },

  registerRow: { flexDirection: "row", justifyContent: "center" },
  registerText:{ fontSize: 14, color: t.textSub },
  registerLink:{ fontSize: 14, color: t.accent, fontWeight: "700" },
});

function isDarkMode(t) { return t.mode === "dark"; }