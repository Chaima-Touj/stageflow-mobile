import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, ScrollView, Animated, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import * as Animatable from 'react-native-animatable';

const { width } = Dimensions.get("window");

export default function StatsScreen() {
  return (
    <View style={styles.container}>
      {/* Background avec dégradé sombre et pro */}
      <LinearGradient colors={["#0F172A", "#020617"]} style={StyleSheet.absoluteFill} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Header avec Glow effect */}
        <Animatable.View animation="fadeInDown" duration={1000} style={styles.header}>
          <View>
            <Text style={styles.headerSubtitle}>ANALYTICS SYSTEM</Text>
            <Text style={styles.headerTitle}>Tableau de Bord</Text>
          </View>
          <View style={styles.pulseContainer}>
            <Animatable.View 
              animation="pulse" 
              iterationCount="infinite" 
              style={styles.liveDot} 
            />
            <Text style={styles.liveText}>LIVE</Text>
          </View>
        </Animatable.View>

        {/* Big Performance Card */}
        <Animatable.View animation="zoomIn" duration={800} style={styles.mainCard}>
          <LinearGradient 
            colors={["rgba(16, 185, 129, 0.2)", "transparent"]} 
            start={{x: 0, y: 0}} end={{x: 1, y: 1}}
            style={styles.mainCardGradient}
          >
            <View style={styles.mainCardHeader}>
              <Text style={styles.mainCardLabel}>Taux d'acceptation</Text>
              <Ionicons name="trending-up" size={24} color="#10B981" />
            </View>
            <Text style={styles.mainCardValue}>84.5%</Text>
            <View style={styles.progressBarBg}>
              <Animatable.View 
                animation="fadeInLeft" 
                duration={2000} 
                style={[styles.progressBarFill, {width: '84.5%'}]} 
              />
            </View>
            <Text style={styles.mainCardSub}>+12% par rapport au mois dernier</Text>
          </LinearGradient>
        </Animatable.View>

        {/* Small Stats Grid */}
        <View style={styles.grid}>
          <StatBox 
            label="Stages" 
            value="128" 
            icon="briefcase" 
            color="#3B82F6" 
            delay={200}
          />
          <StatBox 
            label="Candidats" 
            value="2.4k" 
            icon="people" 
            color="#A855F7" 
            delay={400}
          />
</View>
        {/* Activity Chart Section (Stylized) */}
        <Animatable.View animation="fadeInUp" delay={600} style={styles.chartSection}>
          <Text style={styles.sectionTitle}>Flux de Candidatures</Text>
          <View style={styles.fakeChart}>
            {[40, 70, 45, 90, 65, 80, 95].map((h, i) => (
              <View key={i} style={styles.barWrapper}>
                <Animatable.View 
                  animation="slideInUp" 
                  delay={800 + (i * 100)}
                  style={[styles.chartBar, { height: h, backgroundColor: i === 6 ? '#10B981' : '#1E293B' }]} 
                />
                <Text style={styles.barDay}>{['L', 'M', 'M', 'J', 'V', 'S', 'D'][i]}</Text>
              </View>
            ))}
          </View>
        </Animatable.View>

        {/* Circular Progress Section */}
        <View style={styles.bottomRow}>
          <Animatable.View animation="fadeInLeft" delay={1000} style={styles.infoCard}>
            <Ionicons name="time-outline" size={20} color="#94A3B8" />
            <Text style={styles.infoLabel}>Temps de réponse</Text>
            <Text style={styles.infoValue}>2.4 jours</Text>
          </Animatable.View>
          
          <Animatable.View animation="fadeInRight" delay={1000} style={styles.infoCard}>
            <Ionicons name="checkmark-circle-outline" size={20} color="#94A3B8" />
            <Text style={styles.infoLabel}>Offres Clôturées</Text>
            <Text style={styles.infoValue}>42</Text>
          </Animatable.View>
        </View>

      </ScrollView>
    </View>
  );
}

function StatBox({ label, value, icon, color, delay }) {
  return (
    <Animatable.View animation="fadeInUp" delay={delay} style={styles.statBox}>
      <View style={[styles.iconCircle, { backgroundColor: color + '20' }]}>
        <Ionicons name={icon} size={20} color={color} />
      </View>
      <Text style={styles.statBoxValue}>{value}</Text>
      <Text style={styles.statBoxLabel}>{label}</Text>
    </Animatable.View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 20, paddingTop: 60 },
  
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 },
  headerSubtitle: { color: '#10B981', fontSize: 10, fontWeight: '900', letterSpacing: 2 },
  headerTitle: { color: '#fff', fontSize: 28, fontWeight: '800' },
  
  pulseContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.05)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  liveDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#EF4444', marginRight: 8 },
  liveText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },

  mainCard: { backgroundColor: '#1E293B', borderRadius: 30, overflow: 'hidden', marginBottom: 20, borderWidth: 1, borderColor: 'rgba(16, 185, 129, 0.3)' },
  mainCardGradient: { padding: 24 },
  mainCardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  mainCardLabel: { color: '#94A3B8', fontSize: 14, fontWeight: '600' },
  mainCardValue: { color: '#fff', fontSize: 42, fontWeight: '900', marginBottom: 15 },
  progressBarBg: { height: 6, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 3, marginBottom: 12 },
  progressBarFill: { height: '100%', backgroundColor: '#10B981', borderRadius: 3, shadowColor: '#10B981', shadowOpacity: 0.5, shadowRadius: 10 },
  mainCardSub: { color: '#10B981', fontSize: 12, fontWeight: '600' },

  grid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 25 },
  statBox: { width: (width - 55) / 2, backgroundColor: '#1E293B', padding: 20, borderRadius: 25, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  iconCircle: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
  statBoxValue: { color: '#fff', fontSize: 20, fontWeight: '800' },
  statBoxLabel: { color: '#94A3B8', fontSize: 12, marginTop: 4 },

  chartSection: { backgroundColor: '#1E293B', borderRadius: 30, padding: 24, marginBottom: 20 },
  sectionTitle: { color: '#fff', fontSize: 16, fontWeight: '700', marginBottom: 25 },
  fakeChart: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', height: 120 },
  barWrapper: { alignItems: 'center' },
  chartBar: { width: 12, borderRadius: 6 },
  barDay: { color: '#64748B', fontSize: 10, marginTop: 10, fontWeight: 'bold' },

  bottomRow: { flexDirection: 'row', justifyContent: 'space-between' },
  infoCard: { width: (width - 55) / 2, backgroundColor: 'rgba(255,255,255,0.03)', padding: 15, borderRadius: 20, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  infoLabel: { color: '#64748B', fontSize: 11, marginVertical: 5 },
  infoValue: { color: '#fff', fontSize: 16, fontWeight: '700' }
});