import React, { useState, useContext } from "react";
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  StatusBar, KeyboardAvoidingView, Platform, Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { DataContext } from "../../context/DataContext";
import { AuthContext } from "../../context/AuthContext";
import { Button, Input } from "../../components/index";
import { colors, spacing, typography, borderRadius, shadows } from "../../theme";
import { LinearGradient } from "expo-linear-gradient";

const DURATIONS = ["1 mois", "2 mois", "3 mois", "4 mois", "5 mois", "6 mois", "1 an"];

export default function AddOfferScreen({ navigation }) {
  const { addOffer } = useContext(DataContext);
  const { user } = useContext(AuthContext);
  const [form, setForm] = useState({
    title: "", location: "", type: "Stage", duration: "3 mois",
    desc: "", requirements: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const set = (k, v) => { setForm({ ...form, [k]: v }); setError(""); };

  const validate = () => {
    if (!form.title.trim()) return "Le titre est requis.";
    if (!form.location.trim()) return "La localisation est requise.";
    if (!form.desc.trim()) return "La description est requise.";
    if (!form.requirements.trim()) return "Les compétences sont requises.";
    return null;
  };

  const handleSubmit = async () => {
    const err = validate();
    if (err) { setError(err); return; }

    setLoading(true);
    const res = await addOffer({ ...form, company: user?.name });
    setLoading(false);

    if (res.success) {
      Alert.alert("✅ Offre publiée !", "Votre offre est maintenant visible par les étudiants.", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } else {
      setError(res.message || "Erreur lors de la publication.");
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Publier une offre</Text>
        <View style={{ width: 38 }} />
      </View>

      <ScrollView style={styles.body} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {error ? (
          <View style={styles.errorBox}>
            <Ionicons name="alert-circle" size={16} color={colors.danger} />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        <Input label="Titre du poste *" value={form.title} onChangeText={(v) => set("title", v)}
          placeholder="Ex: Développeur web front-end" autoCapitalize="sentences"
          icon={<Ionicons name="briefcase-outline" size={18} color={colors.textMuted} />} />

        <Input label="Localisation *" value={form.location} onChangeText={(v) => set("location", v)}
          placeholder="Ex: Tunis, Sfax, Remote..." autoCapitalize="words"
          icon={<Ionicons name="location-outline" size={18} color={colors.textMuted} />} />

        {/* Type selector */}
        <Text style={styles.fieldLabel}>Type *</Text>
        <View style={styles.typeRow}>
          {["Stage", "PFE"].map((t) => (
            <TouchableOpacity key={t} onPress={() => set("type", t)}
              style={[styles.typeBtn, form.type === t && styles.typeBtnActive]}>
              <Text style={[styles.typeBtnText, form.type === t && styles.typeBtnTextActive]}>{t}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Duration selector */}
        <Text style={styles.fieldLabel}>Durée *</Text>
        <View style={styles.durationGrid}>
          {DURATIONS.map((d) => (
            <TouchableOpacity key={d} onPress={() => set("duration", d)}
              style={[styles.durationBtn, form.duration === d && styles.durationBtnActive]}>
              <Text style={[styles.durationText, form.duration === d && styles.durationTextActive]}>{d}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Input label="Description du poste *" value={form.desc} onChangeText={(v) => set("desc", v)}
          placeholder="Décrivez le poste, les missions, les responsabilités..."
          multiline numberOfLines={5} autoCapitalize="sentences" />

        <Input label="Compétences requises *" value={form.requirements} onChangeText={(v) => set("requirements", v)}
          placeholder="Ex: React, Node.js, MongoDB, bonne communication..."
          multiline numberOfLines={4} autoCapitalize="sentences" />

        <Button title="Publier l'offre" onPress={handleSubmit} loading={loading} size="lg" style={{ marginTop: spacing.sm }} />
        <View style={{ height: 60 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingHorizontal: spacing.md, paddingTop: 56, paddingBottom: spacing.sm, backgroundColor: colors.bg,
  },
  backBtn: { width: 38, height: 38, borderRadius: 19, backgroundColor: colors.border + "80", alignItems: "center", justifyContent: "center" },
  headerTitle: { ...typography.h4, color: colors.textPrimary },
  body: { flex: 1, backgroundColor: colors.bg },
  content: { paddingHorizontal: spacing.md, paddingBottom: spacing.xl },
  errorBox: {
    flexDirection: "row", alignItems: "center", gap: 8,
    backgroundColor: colors.dangerLight, borderRadius: borderRadius.md, padding: 12, marginBottom: spacing.md,
  },
  errorText: { ...typography.sm, color: colors.danger, flex: 1 },
  fieldLabel: { ...typography.label, color: colors.textSecondary, marginBottom: 8 },
  typeRow: { flexDirection: "row", gap: spacing.sm, marginBottom: spacing.md },
  typeBtn: {
    flex: 1, paddingVertical: 12, borderRadius: borderRadius.md, borderWidth: 1.5,
    borderColor: colors.border, alignItems: "center", backgroundColor: "#fff",
  },
  typeBtnActive: { borderColor: colors.primary, backgroundColor: colors.primaryLight },
  typeBtnText: { ...typography.bodyMd, color: colors.textSecondary },
  typeBtnTextActive: { color: colors.primary, fontWeight: "700" },
  durationGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: spacing.md },
  durationBtn: {
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: borderRadius.full,
    borderWidth: 1.5, borderColor: colors.border, backgroundColor: "#fff",
  },
  durationBtnActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  durationText: { ...typography.smMd, color: colors.textSecondary },
  durationTextActive: { color: "#fff" },
});