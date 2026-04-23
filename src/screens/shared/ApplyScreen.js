import React, { useState, useContext } from "react";
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  StatusBar, Alert, KeyboardAvoidingView, Platform, Dimensions, TextInput
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import { DataContext } from "../../context/DataContext";
import { AuthContext } from "../../context/AuthContext";
import { LinearGradient } from "expo-linear-gradient";
import * as Animatable from 'react-native-animatable';

export default function ApplyScreen({ route, navigation }) {
  const { offer } = route.params;
  const { addApplication, applications } = useContext(DataContext);
  const { user } = useContext(AuthContext);
  const [motivation, setMotivation] = useState("");
  const [cv, setCv] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const alreadyApplied = applications.some(
    (a) => a.userId === user?._id && a.offerId === offer._id
  );

  const pickDocument = async () => {
    try {
      const res = await DocumentPicker.getDocumentAsync({
        type: ["application/pdf", "application/msword", 
               "application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
        copyToCacheDirectory: true,
      });
      if (!res.canceled && res.assets?.[0]) {
        const file = res.assets[0];
        if (file.size > 5 * 1024 * 1024) {
          Alert.alert("Fichier trop volumineux", "Maximum 5 MB autorisé.");
          return;
        }
        setCv(file);
        setError("");
      }
    } catch {
      Alert.alert("Erreur", "Impossible de sélectionner le fichier.");
    }
  };

  const handleSubmit = async () => {
    if (!motivation.trim()) { setError("La lettre de motivation est requise."); return; }
    if (!cv) { setError("Le CV est requis."); return; }
    setLoading(true);
    const res = await addApplication(offer._id, motivation, cv);
    setLoading(false);
    if (res.success) {
      Alert.alert("Succès", "Candidature envoyée !");
      navigation.goBack();
    } else {
      setError(res.message || "Erreur lors de l'envoi.");
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.glow} />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          
          <View style={styles.header}>
            <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={22} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.title}>Postuler</Text>
            <View style={{ width: 42 }} />
          </View>

          <Animatable.View animation="fadeInDown" style={styles.glassCard}>
            <View style={styles.cardTop}>
              <View style={styles.typeBadge}><Text style={styles.typeText}>{offer.type}</Text></View>
              <Text style={styles.durationText}>{offer.duration}</Text>
            </View>
            <Text style={styles.offerTitle}>{offer.title}</Text>
            <View style={styles.companyRow}>
              <Ionicons name="business" size={14} color="#00ff88" />
              <Text style={styles.companyName}>{offer.company}</Text>
            </View>
          </Animatable.View>

          {alreadyApplied ? (
            <View style={styles.statusBox}>
              <Ionicons name="checkmark-circle" size={50} color="#00ff88" />
              <Text style={styles.statusTitle}>Déjà postulé</Text>
              <Text style={styles.statusSub}>Votre candidature est en cours d'examen.</Text>
            </View>
          ) : (
            <Animatable.View animation="fadeInUp" delay={200}>
              <Text style={styles.sectionLabel}>Lettre de motivation</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.textArea}
                  placeholder="Expliquez votre motivation..."
                  placeholderTextColor="#475569"
                  multiline
                  value={motivation}
                  onChangeText={(t) => { setMotivation(t); if(error) setError(""); }}
                />
              </View>

              <Text style={styles.sectionLabel}>Votre CV (PDF)</Text>
              <TouchableOpacity style={[styles.uploadBox, cv && styles.uploadBoxActive]} onPress={pickDocument}>
                {cv ? (
                  <View style={styles.fileInfo}>
                    <Ionicons name="document-attach" size={24} color="#00ff88" />
                    <Text style={styles.fileName} numberOfLines={1}>{cv.name}</Text>
                    <TouchableOpacity onPress={() => setCv(null)}>
                      <Ionicons name="close-circle" size={20} color="#EF4444" />
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View style={styles.uploadPlaceholder}>
                    <Ionicons name="cloud-upload-outline" size={28} color="#94A3B8" />
                    <Text style={styles.uploadText}>Importer mon CV</Text>
                  </View>
                )}
              </TouchableOpacity>

              {/* ✅ Hedhi adhmen tariqa bech ma ya3malch Text error */}
              {!!error && <Text style={styles.errorText}>{error}</Text>}

              <TouchableOpacity style={styles.aiButton} onPress={handleSubmit} disabled={loading}>
                <LinearGradient colors={["#00ff88", "#00e676"]} style={styles.aiGradient}>
                  <Text style={styles.aiText}>{loading ? "Envoi..." : "Envoyer"}</Text>
                </LinearGradient>
              </TouchableOpacity>
            </Animatable.View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#060B18" },
  glow: { position: 'absolute', top: -50, right: -50, width: 250, height: 250, opacity: 0.1, borderRadius: 125, backgroundColor: '#00ff88' },
  scrollContent: { padding: 25, paddingTop: 60, paddingBottom: 40 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 },
  iconBtn: { width: 42, height: 42, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.05)', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  title: { color: '#fff', fontSize: 22, fontWeight: 'bold' },
  glassCard: { backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 25, padding: 20, marginBottom: 30, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  typeBadge: { backgroundColor: 'rgba(0, 255, 136, 0.1)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  typeText: { color: '#00ff88', fontSize: 10, fontWeight: 'bold' },
  durationText: { color: '#94A3B8', fontSize: 12 },
  offerTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
  companyRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  companyName: { color: '#94A3B8', fontSize: 14 },
  sectionLabel: { color: '#fff', fontSize: 14, fontWeight: '600', marginBottom: 12 },
  inputWrapper: { backgroundColor: '#0F172A', borderRadius: 20, padding: 15, marginBottom: 20, borderWidth: 1, borderColor: '#1E293B' },
  textArea: { color: '#fff', fontSize: 15, minHeight: 100, textAlignVertical: 'top' },
  uploadBox: { backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: 20, padding: 20, marginBottom: 25, borderWidth: 1, borderColor: '#1E293B', borderStyle: 'dashed' },
  uploadBoxActive: { borderColor: '#00ff88', borderStyle: 'solid' },
  uploadPlaceholder: { alignItems: 'center', gap: 8 },
  uploadText: { color: '#94A3B8', fontSize: 14 },
  fileInfo: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  fileName: { color: '#fff', flex: 1, fontSize: 14 },
  aiButton: { borderRadius: 20, overflow: 'hidden', marginTop: 10 },
  aiGradient: { padding: 18, alignItems: 'center' },
  aiText: { color: '#0F172A', fontWeight: 'bold', fontSize: 16 },
  errorText: { color: '#EF4444', textAlign: 'center', marginBottom: 15, fontSize: 13 },
  statusBox: { alignItems: 'center', marginTop: 40 },
  statusTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold', marginTop: 15 },
  statusSub: { color: '#94A3B8', fontSize: 14, textAlign: 'center' }
});