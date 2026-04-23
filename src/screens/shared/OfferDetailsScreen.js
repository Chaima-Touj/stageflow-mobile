import React, { useContext, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  StatusBar, Alert, ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';
import { DataContext } from "../../context/DataContext";
import { AuthContext } from "../../context/AuthContext";

export default function OfferDetailsScreen({ route, navigation }) {
  const { offer } = route.params || {};
  const { user } = useContext(AuthContext);
  const { deleteOffer } = useContext(DataContext);
  const [loading, setLoading] = useState(false);

  const role = user?.role || "étudiant";
  const isOwner = user?._id === offer?.companyId;

  if (!offer) return null;

  // ── Actions par rôle ──────────────────────────────────────
  const handleAction = async () => {
    if (role === "admin") {
      Alert.alert("Supprimer", "Voulez-vous supprimer cette offre ?", [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer", style: "destructive",
          onPress: async () => {
            setLoading(true);
            await deleteOffer(offer._id);
            setLoading(false);
            navigation.goBack();
          }
        }
      ]);
    } else if (role === "entreprise" && isOwner) {
      navigation.navigate("ApplicationsList", { offerId: offer._id });
    } else if (role === "étudiant") {
      navigation.navigate("Apply", { offer });
    }
  };

  // ── Config bouton selon rôle ──────────────────────────────
  const getBtnConfig = () => {
    if (role === "admin")
      return { label: "Supprimer l'offre", icon: "trash", col: "#EF4444" };
    if (role === "entreprise" && isOwner)
      return { label: "Gérer les candidats", icon: "people", col: "#3B82F6" };
    return { label: "Postuler Maintenant", icon: "paper-plane", col: "#00ff88" };
  };

  const btn = getBtnConfig();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Détails de l'offre</Text>
        <View style={{ width: 45 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Main Card */}
        <Animatable.View animation="fadeInUp" style={styles.mainCard}>
          <View style={[styles.iconContainer, { backgroundColor: btn.col + '15' }]}>
            <Ionicons name="rocket" size={30} color={btn.col} />
          </View>
          <Text style={styles.title}>{offer.title}</Text>
          <Text style={[styles.company, { color: btn.col }]}>{offer.company}</Text>

          <View style={styles.tagsRow}>
            <InfoTag icon="location" text={offer.location} />
            <InfoTag icon="calendar" text={offer.duration} />
            <InfoTag icon="flash" text={offer.type} />
          </View>
        </Animatable.View>

        {/* Description */}
        <Animatable.View animation="fadeInUp" delay={150} style={styles.section}>
          <Text style={styles.sectionLabel}>Mission</Text>
          <Text style={styles.bodyText}>{offer.description || offer.desc || "—"}</Text>
        </Animatable.View>

        {/* Compétences */}
        <Animatable.View animation="fadeInUp" delay={300} style={styles.section}>
          <Text style={styles.sectionLabel}>Stack Technique</Text>
          <View style={styles.skillsRow}>
            {(offer.requirements || "")
              .split(',')
              .filter(s => s.trim())
              .map((skill, i) => (
                <View key={i} style={[styles.skillBadge, { borderColor: btn.col + '50' }]}>
                  <Text style={[styles.skillText, { color: btn.col }]}>{skill.trim()}</Text>
                </View>
              ))}
          </View>
        </Animatable.View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Footer Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.actionBtn, { backgroundColor: btn.col }]}
          onPress={handleAction}
          disabled={loading}
          activeOpacity={0.85}
        >
          {loading ? (
            <ActivityIndicator color="#0F172A" />
          ) : (
            <>
              <Text style={styles.actionBtnText}>{btn.label}</Text>
              <Ionicons name={btn.icon} size={20} color="#0F172A" style={{ marginLeft: 10 }} />
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const InfoTag = ({ icon, text }) => (
  <View style={styles.tag}>
    <Ionicons name={icon} size={13} color="#64748B" />
    <Text style={styles.tagText}>{text}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#060B18' },

  header: {
    paddingTop: 50, paddingBottom: 20, paddingHorizontal: 20,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  },
  backBtn: {
    width: 45, height: 45, borderRadius: 15,
    backgroundColor: '#1E293B', justifyContent: 'center', alignItems: 'center',
    borderWidth: 1, borderColor: '#334155',
  },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold' },

  scrollContent: { padding: 20 },

  mainCard: {
    backgroundColor: '#0F172A', borderRadius: 32, padding: 30,
    alignItems: 'center', borderWidth: 1, borderColor: '#1E293B', marginBottom: 25,
  },
  iconContainer: {
    width: 65, height: 65, borderRadius: 22,
    justifyContent: 'center', alignItems: 'center', marginBottom: 20,
  },
  title: { color: '#fff', fontSize: 24, fontWeight: 'bold', textAlign: 'center' },
  company: { fontSize: 16, marginTop: 6, fontWeight: '700' },
  tagsRow: { flexDirection: 'row', marginTop: 25, justifyContent: 'center', flexWrap: 'wrap' },
  tag: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#1E293B', paddingHorizontal: 14, paddingVertical: 8,
    borderRadius: 12, margin: 5,
  },
  tagText: { color: '#94A3B8', fontSize: 12, marginLeft: 6 },

  section: { marginBottom: 30 },
  sectionLabel: { color: '#fff', fontSize: 17, fontWeight: 'bold', marginBottom: 12 },
  bodyText: { color: '#94A3B8', fontSize: 15, lineHeight: 26 },

  skillsRow: { flexDirection: 'row', flexWrap: 'wrap' },
  skillBadge: {
    borderWidth: 1, paddingHorizontal: 15, paddingVertical: 10,
    borderRadius: 14, marginRight: 10, marginBottom: 10,
  },
  skillText: { fontSize: 13, fontWeight: '700' },

  footer: { position: 'absolute', bottom: 30, width: '100%', paddingHorizontal: 20 },
  actionBtn: {
    flexDirection: 'row', height: 65, borderRadius: 22,
    justifyContent: 'center', alignItems: 'center',
    shadowOpacity: 0.4, shadowRadius: 15, elevation: 8,
  },
  actionBtnText: { color: '#0F172A', fontSize: 17, fontWeight: 'bold' },
});