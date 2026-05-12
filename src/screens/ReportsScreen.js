import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useApexStore } from '../store/apexStore';

export default function ReportsScreen({ navigation }) {
  const { historicalStreaks, metrics } = useApexStore();

  // Robust month name helper for Android Hermes
  const getMonthName = () => {
    const months = ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", 
                    "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"];
    return months[new Date().getMonth()];
  };

  // --- CALENDAR LOGIC ---
  const calendarData = useMemo(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    
    const firstDay = new Date(year, month, 1).getDay(); 
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const days = [];
    for (let i = 0; i < firstDay; i++) days.push({ padding: true });
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = new Date(year, month, d).toLocaleDateString();
      days.push({ day: d, dateStr });
    }
    return days;
  }, []);

  const getDayStyle = (dateStr) => {
    const score = historicalStreaks[dateStr];
    if (score === undefined) return styles.dayEmpty;
    if (score >= 0.9) return styles.dayPerfect; 
    if (score >= 0.7) return styles.dayGood;    
    return styles.dayFail;                      
  };

  // --- ANALYTICS ---
  const latestWeight = metrics.weightLogs.length > 0 ? metrics.weightLogs[metrics.weightLogs.length - 1].value : 90;
  const weightDiff = (90 - latestWeight).toFixed(1);
  const avgEnergy = metrics.energyDriveLogs.length > 0 
    ? (metrics.energyDriveLogs.reduce((a, b) => a + b.value, 0) / metrics.energyDriveLogs.length).toFixed(1)
    : "N/A";

  const latestWaist = metrics.waistLogs.length > 0 
    ? metrics.waistLogs[metrics.waistLogs.length - 1].value 
    : '---';

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.headerTitle}>COMMAND CENTER</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}><Text style={styles.backBtn}>CLOSE</Text></TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* 1. CALENDAR SECTION */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{getMonthName()} DISCIPLINE</Text>
          <View style={styles.calendarHeader}>
            {['S','M','T','W','T','F','S'].map((d, i) => <Text key={i} style={styles.dayLabel}>{d}</Text>)}
          </View>
          <View style={styles.calendarGrid}>
            {calendarData.map((item, index) => (
              <View key={index} style={[styles.dayBox, item.padding ? styles.dayPadding : getDayStyle(item.dateStr)]}>
                {!item.padding && <Text style={styles.dayText}>{item.day}</Text>}
              </View>
            ))}
          </View>
        </View>

        {/* 2. BODY RECOMPOSITION */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>COMPOSITION TRACKER</Text>
          <View style={styles.statRow}>
            <View style={styles.statDetail}>
              <Text style={styles.statMain}>{latestWeight}kg</Text>
              <Text style={styles.statSub}>Weight ({weightDiff}kg lost)</Text>
            </View>
            <View style={styles.statDetail}>
              <Text style={styles.statMain}>{latestWaist}cm</Text>
              <Text style={styles.statSub}>Latest Waist</Text>
            </View>
          </View>
          
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: `${Math.max(0, (weightDiff/4)*100)}%` }]} />
          </View>
          <Text style={styles.progressText}>{Math.max(0, (weightDiff/4)*100).toFixed(0)}% of 86kg Goal</Text>
          
          <Text style={[styles.statSub, {marginTop: 15, color: '#444'}]}>
             Average Energy & Drive: {avgEnergy}/10
          </Text>
        </View>

        {/* 3. HYPERTROPHY INTEGRITY */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>HYPERTROPHY STATUS</Text>
          <Text style={{color: '#fff', fontSize: 14, fontWeight: 'bold'}}>Strict 4-sec Eccentric Tempo</Text>
          <Text style={{color: '#555', fontSize: 11, marginTop: 5}}>Adherence to mechanical tension is the only path with 5kg weights.</Text>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a', paddingTop: 60 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, marginBottom: 20 },
  headerTitle: { color: '#fff', fontSize: 22, fontWeight: '900' },
  backBtn: { color: '#555', fontWeight: 'bold' },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },
  card: { backgroundColor: '#121212', padding: 20, borderRadius: 12, marginBottom: 20, borderWidth: 1, borderColor: '#222' },
  cardTitle: { color: '#f39c12', fontSize: 14, fontWeight: '900', marginBottom: 15, letterSpacing: 1 },
  calendarHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  dayLabel: { color: '#444', width: 35, textAlign: 'center', fontWeight: 'bold', fontSize: 10 },
  calendarGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  dayBox: { width: 35, height: 35, borderRadius: 4, marginBottom: 8, justifyContent: 'center', alignItems: 'center' },
  dayText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
  dayPadding: { backgroundColor: 'transparent' },
  dayEmpty: { backgroundColor: '#1a1a1a' },
  dayPerfect: { backgroundColor: '#2ecc71' }, 
  dayGood: { backgroundColor: '#f39c12' },    
  dayFail: { backgroundColor: '#e74c3c' },    
  statRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  statDetail: { alignItems: 'flex-start' },
  statMain: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
  statSub: { color: '#888', fontSize: 10, fontWeight: 'bold', marginTop: 2 },
  progressBarBg: { height: 6, backgroundColor: '#222', borderRadius: 3, marginTop: 20 },
  progressBarFill: { height: '100%', backgroundColor: '#f39c12', borderRadius: 3 },
  progressText: { color: '#888', fontSize: 10, marginTop: 8, textAlign: 'right', fontWeight: 'bold' }
});