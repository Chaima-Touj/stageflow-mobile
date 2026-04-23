import React, { useContext } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar } from "react-native";
import { DataContext } from "../../context/DataContext";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { Avatar } from "../../components/index"; // Ista3mel el Avatar elli 3andek
import * as Animatable from 'react-native-animatable';

export default function UsersScreen() {
  const { users } = useContext(DataContext);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={["#0F172A", "#020617"]} style={StyleSheet.absoluteFill} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Header Section */}
        <Animatable.View animation="fadeInDown" style={styles.header}>
          <View>
            <Text style={styles.title}>Membres</Text>
            <Text style={styles.subtitle}>{users.length} Utilisateurs actifs</Text>
          </View>
          <TouchableOpacity style={styles.filterBtn}>
            <Ionicons name="filter" size={20} color="#3B82F6" />
          </TouchableOpacity>
        </Animatable.View>

        {/* Users List */}
        {users.map((u, i) => {
          const roleColor = getRoleColor(u.role);
          return (
            <Animatable.View 
              key={u._id} 
              animation="fadeInRight" 
              delay={i * 100} 
              style={styles.cardWrapper}
            >
              <TouchableOpacity style={styles.card}>
                <View style={[styles.statusIndicator, { backgroundColor: roleColor }]} />
                
                <Avatar name={u.name} size={50} />

                <View style={styles.info}>
                  <Text style={styles.name}>{u.name}</Text>
                  <View style={styles.roleContainer}>
                    <Ionicons name="shield-checkmark" size={12} color={roleColor} style={{marginRight: 4}} />
                    <Text style={[styles.role, { color: roleColor }]}>{u.role.toUpperCase()}</Text>
                  </View>
                </View>

                <TouchableOpacity style={styles.moreBtn}>
                  <Ionicons name="chevron-forward" size={20} color="#475569" />
                </TouchableOpacity>
              </TouchableOpacity>
            </Animatable.View>
          );
        })}
      </ScrollView>
    </View>
  );
}

// Function bech ta3ti loun l-kol Role
const getRoleColor = (role) => {
  switch (role?.toLowerCase()) {
    case 'admin': return '#EF4444'; // Red
    case 'étudiant': return '#3B82F6'; // Blue
    case 'entreprise': return '#A855F7'; // Purple
    default: return '#94A3B8';
  }
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 20, paddingTop: 60 },
  
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 30 
  },
  title: { color: '#fff', fontSize: 32, fontWeight: '900' },
  subtitle: { color: '#64748B', fontSize: 14, fontWeight: '600', marginTop: 4 },
  
  filterBtn: { 
    width: 45, height: 45, borderRadius: 15, 
    backgroundColor: 'rgba(59, 130, 246, 0.1)', 
    justifyContent: 'center', alignItems: 'center' 
  },

  cardWrapper: { marginBottom: 15 },
  card: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: 'rgba(30, 41, 59, 0.5)', 
    padding: 15, 
    borderRadius: 24, 
    borderWidth: 1, 
    borderColor: 'rgba(255,255,255,0.05)',
    overflow: 'hidden'
  },
  statusIndicator: { 
    position: 'absolute', 
    left: 0, top: 20, bottom: 20, 
    width: 4, borderTopRightRadius: 4, borderBottomRightRadius: 4 
  },
  
  info: { flex: 1, marginLeft: 15 },
  name: { color: '#fff', fontSize: 17, fontWeight: '700' },
  roleContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  role: { fontSize: 11, fontWeight: '800', letterSpacing: 1 },
  
  moreBtn: { 
    width: 35, height: 35, borderRadius: 12, 
    backgroundColor: 'rgba(255,255,255,0.03)', 
    justifyContent: 'center', alignItems: 'center' 
  }
});