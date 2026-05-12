import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useApexStore } from '../store/apexStore';

export default function ProfileScreen({ navigation }) {
  const { userProfile, lockApp, factoryReset } = useApexStore();

  const handleNukeProtocol = () => {
    Alert.alert(
      "WARNING: PROTOCOL OVERRIDE",
      "This will permanently delete all metric history, macros, and discipline streaks. You will return to Day 1. Are you sure?",
      [
        { text: "CANCEL", style: "cancel" },
        { 
          text: "ABORT PROTOCOL", 
          style: "destructive", 
          onPress: () => factoryReset() 
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.header}>OPERATOR PROFILE</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backBtn}>CLOSE</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.statsCard}>
        <Text style={styles.name}>{userProfile.name ? userProfile.name.toUpperCase() : 'UNKNOWN OPERATOR'}</Text>
        <Text style={styles.sub}>{`AGE: ${userProfile.age} | HEIGHT: ${userProfile.height}cm`}</Text>
        
        <View style={styles.divider} />
        
        <View style={styles.row}>
          <Text style={styles.label}>STARTING WEIGHT</Text>
          <Text style={styles.val}>{`${userProfile.startingWeight}kg`}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>TARGET WEIGHT</Text>
          <Text style={styles.val}>{`${userProfile.targetWeight}kg`}</Text>
        </View>
      </View>

      <View style={{ marginTop: 'auto', gap: 15 }}>
        <TouchableOpacity style={styles.lockBtn} onPress={() => { lockApp(); }}>
          <Text style={styles.lockBtnText}>ENFORCE LOCK</Text>
        </TouchableOpacity>

        {/* --- THE NUKE BUTTON --- */}
        <TouchableOpacity style={styles.nukeBtn} onPress={handleNukeProtocol}>
          <Text style={styles.nukeBtnText}>FACTORY RESET</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a', padding: 25, paddingTop: 60 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 },
  header: { color: '#f39c12', fontSize: 24, fontWeight: '900' },
  backBtn: { color: '#555', fontWeight: 'bold', fontSize: 12 },
  statsCard: { backgroundColor: '#121212', padding: 25, borderRadius: 12, borderWidth: 1, borderColor: '#222' },
  name: { color: '#fff', fontSize: 32, fontWeight: 'bold' },
  sub: { color: '#555', fontSize: 12, fontWeight: 'bold', marginTop: 5 },
  divider: { height: 1, backgroundColor: '#222', marginVertical: 20 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  label: { color: '#888', fontSize: 12, fontWeight: 'bold' },
  val: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  lockBtn: { backgroundColor: '#1a0505', padding: 20, borderRadius: 8, borderWidth: 1, borderColor: '#e74c3c', alignItems: 'center' },
  lockBtnText: { color: '#e74c3c', fontWeight: 'bold', letterSpacing: 1 },
  nukeBtn: { padding: 15, alignItems: 'center' },
  nukeBtnText: { color: '#555', fontSize: 10, fontWeight: 'bold', letterSpacing: 2 }
});