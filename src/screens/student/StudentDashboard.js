import React, { useContext, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, ImageBackground } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import * as Animatable from 'react-native-animatable';
import { AuthContext } from "../../context/AuthContext";
import { DataContext } from "../../context/DataContext";

const { width } = Dimensions.get("window");

export default function StudentDashboard({ navigation }) {
  const { user } = useContext(AuthContext);
  const { offers = [], applications = [] } = useContext(DataContext);

  const myApps = applications.filter((a) => a.userId === user?._id);

  return (
    <View style={styles.container}>
      {/* Background Effect: Mesh Gradient sghir l-fou9 */}
      <View style={styles.meshGradient} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Header Section: Minimalist & Clean */}
        <Animatable.View animation="fadeInDown" style={styles.header}>
          <View>
            <Text style={styles.topLabel}>ORBITAL DASHBOARD</Text>
            <Text style={styles.title}>StageFlow <Text style={{color: '#00ff88'}}>AI</Text></Text>
          </View>
          <TouchableOpacity style={styles.glassProfile}>
             <Text style={styles.avatarText}>{user?.name?.substring(0, 2).toUpperCase()}</Text>
          </TouchableOpacity>
        </Animatable.View>

        {/* Highlight Card: Glassmorphism Effect */}
        <Animatable.View animation="zoomIn" duration={800} style={styles.glassCardContainer}>
          <LinearGradient colors={['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.02)']} style={styles.glassCard}>
            <View style={styles.glassRow}>
              <View>
                <Text style={styles.glassLabel}>Progression du Profil</Text>
                <Text style={styles.glassValue}>85% Complet</Text>
              </View>
              <Ionicons name="rocket-outline" size={32} color="#00ff88" />
            </View>
            <View style={styles.progressBarBg}>
               <Animatable.View animation="stretch" style={[styles.progressFill, { width: '85%' }]} />
            </View>
          </LinearGradient>
        </Animatable.View>

        {/* Stats Grid: B-alwen Vibrant */}
        <Text style={styles.sectionTitle}>Chiffres Clés</Text>
        <View style={styles.statsGrid}>
          <StatBox label="Candidats" value={myApps.length} icon="layers" color="#3B82F6" delay={300} />
          <StatBox label="Acceptées" value={myApps.filter(a => a.status === "Acceptée").length} icon="shield-checkmark" color="#8B5CF6" delay={500} />
          <StatBox label="Offres" value={offers.length} icon="flash" color="#10B981" delay={700} />
          <StatBox label="Assistant" value="Actif" icon="sparkles" color="#F59E0B" delay={900} />
        </View>

        {/* Quick Access: Buttons stylés */}
        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.mainAction} onPress={() => navigation.navigate("OffersTab")}>
            <LinearGradient colors={['#00ff88', '#00bd6e']} style={styles.actionGrad}>
              <Ionicons name="search" size={22} color="#0F172A" />
              <Text style={styles.actionText}>Trouver Stage</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

// Reusable StatBox with "Glass" border
function StatBox({ label, value, icon, color, delay }) {
  return (
    <Animatable.View animation="fadeInUp" delay={delay} style={styles.statBox}>
      <View style={[styles.statIconWrapper, { backgroundColor: color + '15' }]}>
        <Ionicons name={icon} size={20} color={color} />
      </View>
      <Text style={styles.statNumber}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </Animatable.View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#060B18" }, // Black Deep Space
  meshGradient: { position: 'absolute', top: -100, left: -100, width: 400, height: 400, backgroundColor: '#10B981', opacity: 0.1, borderRadius: 200, filter: 'blur(80px)' },
  scrollContent: { padding: 25, paddingTop: 60 },
  
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 35 },
  topLabel: { color: '#10B981', fontSize: 10, fontWeight: '800', letterSpacing: 2 },
  title: { color: '#fff', fontSize: 28, fontWeight: 'bold' },
  glassProfile: { width: 45, height: 45, borderRadius: 15, backgroundColor: 'rgba(255,255,255,0.05)', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  avatarText: { color: '#00ff88', fontWeight: 'bold' },

  glassCardContainer: { marginBottom: 35 },
  glassCard: { padding: 25, borderRadius: 30, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  glassRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  glassLabel: { color: '#94A3B8', fontSize: 13 },
  glassValue: { color: '#fff', fontSize: 22, fontWeight: 'bold' },
  progressBarBg: { height: 8, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 10 },
  progressFill: { height: '100%', backgroundColor: '#00ff88', borderRadius: 10, shadowColor: '#00ff88', shadowOpacity: 0.5, shadowRadius: 10 },

  sectionTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginBottom: 20 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  statBox: { width: '47%', backgroundColor: '#0F172A', padding: 20, borderRadius: 24, marginBottom: 15, borderWidth: 1, borderColor: '#1E293B' },
  statIconWrapper: { width: 35, height: 35, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  statNumber: { color: '#fff', fontSize: 22, fontWeight: 'bold' },
  statLabel: { color: '#64748B', fontSize: 12, marginTop: 4 },

  actionRow: { marginTop: 10 },
  mainAction: { width: '100%', borderRadius: 20, overflow: 'hidden' },
  actionGrad: { padding: 18, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  actionText: { color: '#0F172A', fontWeight: 'bold', marginLeft: 10, fontSize: 16 }
});