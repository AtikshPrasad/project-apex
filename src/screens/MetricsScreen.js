import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useApexStore } from '../store/apexStore';

export default function MetricsScreen({ navigation }) {
  const { metrics, logMetric } = useApexStore();
  
  const [weight, setWeight] = useState('');
  const [waist, setWaist] = useState('');
  const [energy, setEnergy] = useState('5'); // 1-10 scale

  const handleLog = () => {
    // Basic validation to ensure at least one metric is logged
    if (!weight && !waist && !energy) {
        Alert.alert("NO DATA", "Please enter at least one metric to log.");
        return;
    }

    const today = new Date().toLocaleDateString();
    
    if (weight) logMetric('weight', parseFloat(weight), today);
    if (waist) logMetric('waist', parseFloat(waist), today);
    if (energy) logMetric('energyDrive', parseInt(energy), today);

    Alert.alert("METRICS SECURED", "Data logged for the 10-week progression.");
    setWeight('');
    setWaist('');
    setEnergy('5');
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.headerTitle}>WEEKLY METRICS</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backBtn}>BACK</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.inputCard}>
        <Text style={styles.label}>BODY WEIGHT (KG)</Text>
        <TextInput 
          style={styles.input} 
          keyboardType="decimal-pad" 
          value={weight} 
          onChangeText={setWeight} 
          placeholder="Target: 86kg"
          placeholderTextColor="#555"
        />

        <Text style={styles.label}>WAIST MEASUREMENT (CM)</Text>
        <TextInput 
          style={styles.input} 
          keyboardType="decimal-pad" 
          value={waist} 
          onChangeText={setWaist} 
          placeholder="Indicator of 15% BF"
          placeholderTextColor="#555"
        />

        <Text style={styles.label}>ENERGY & DRIVE (1-10)</Text>
        <View style={styles.sliderRow}>
          <Text style={styles.sliderValue}>{energy}</Text>
          <TextInput 
            style={[styles.input, {flex: 1, marginLeft: 15}]} 
            keyboardType="number-pad" 
            maxLength={2}
            value={energy} 
            onChangeText={(val) => {
              if (val === '' || (parseInt(val) >= 1 && parseInt(val) <= 10)) {
                setEnergy(val);
              }
            }} 
          />
        </View>

        <TouchableOpacity style={styles.submitBtn} onPress={handleLog}>
          <Text style={styles.submitBtnText}>COMMIT DATA</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.historyContainer}>
        <Text style={styles.historyTitle}>LOG HISTORY</Text>
        
        {/* Render Weight Logs as a primary example */}
        {metrics.weightLogs.length === 0 ? (
          <Text style={styles.emptyText}>No data logged yet.</Text>
        ) : (
          metrics.weightLogs.slice().reverse().map((log, index) => (
            <View key={index} style={styles.historyRow}>
              <Text style={styles.historyDate}>{log.date}</Text>
              <Text style={styles.historyData}>Weight: {log.value} kg</Text>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a', padding: 20, paddingTop: 60 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  headerTitle: { color: '#f39c12', fontSize: 24, fontWeight: '900', letterSpacing: 2 },
  backBtn: { color: '#fff', fontSize: 14, fontWeight: 'bold' },
  inputCard: { backgroundColor: '#121212', padding: 20, borderRadius: 10, borderWidth: 1, borderColor: '#222' },
  label: { color: '#888', fontSize: 12, fontWeight: 'bold', marginBottom: 5, marginTop: 15 },
  input: { backgroundColor: '#000', color: '#fff', padding: 15, borderRadius: 5, fontSize: 18, borderWidth: 1, borderColor: '#333' },
  sliderRow: { flexDirection: 'row', alignItems: 'center' },
  sliderValue: { color: '#fff', fontSize: 28, fontWeight: 'bold', width: 40, textAlign: 'center' },
  submitBtn: { backgroundColor: '#f39c12', paddingVertical: 15, borderRadius: 8, marginTop: 25, alignItems: 'center' },
  submitBtnText: { color: '#000', fontSize: 16, fontWeight: 'bold' },
  historyContainer: { marginTop: 30 },
  historyTitle: { color: '#555', fontSize: 14, fontWeight: 'bold', marginBottom: 10 },
  historyRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#222' },
  historyDate: { color: '#888' },
  historyData: { color: '#fff', fontWeight: 'bold' },
  emptyText: { color: '#444', fontStyle: 'italic', marginTop: 10 }
});