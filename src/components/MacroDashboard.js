import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, TextInput, ActivityIndicator, Alert } from 'react-native';
import { useApexStore } from '../store/apexStore';
import ProgressBar from './ProgressBar';
import { extractMacros } from '../utils/gemini';

export default function MacroDashboard() {
  const { macros, macroTargets, logWater, logMeal, resetDailyMacros } = useApexStore();
  const [mealInput, setMealInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAiLog = async () => {
    if (!mealInput.trim()) return;
    
    setIsAnalyzing(true);
    const data = await extractMacros(mealInput);
    
    if (data) {
      // Log food macros
      if (data.calories > 0 || data.protein > 0) {
        logMeal(data.protein || 0, data.carbs || 0, data.fats || 0, data.calories || 0);
      }
      // Log water if the AI caught a drink
      if (data.water > 0) {
        logWater(data.water);
      }
      
      Alert.alert("DATA SECURED", `+${data.calories} kcal | ${data.protein}g P | ${data.carbs}g C | ${data.fats}g F`);
      setMealInput('');
    } else {
      Alert.alert("ERROR", "Failed to parse the data. Try again.");
    }
    
    setIsAnalyzing(false);
  };

  // Safe fallbacks for targets
  const tWater = macroTargets?.water || 4000;
  const tCal = macroTargets?.calories || 2000;
  const tPro = macroTargets?.protein || 180;
  const tCarb = macroTargets?.carbs || 150;
  const tFat = macroTargets?.fats || 70;

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>NUTRITION ENGINE</Text>
        <TouchableOpacity onPress={resetDailyMacros}>
          <Text style={styles.resetText}>RESET</Text>
        </TouchableOpacity>
      </View>
      
      {/* MACRO BARS */}
      <ProgressBar label="CALORIES" current={macros.calories} max={tCal} unit="kcal" color="#f39c12" />
      <ProgressBar label="PROTEIN" current={macros.protein} max={tPro} unit="g" color="#e74c3c" />
      
      {/* Compact Row for Carbs & Fats to save space */}
      <View style={styles.compactRow}>
        <View style={{flex: 1, marginRight: 10}}>
            <ProgressBar label="CARBS" current={macros.carbs} max={tCarb} unit="g" color="#2ecc71" />
        </View>
        <View style={{flex: 1}}>
            <ProgressBar label="FATS" current={macros.fats} max={tFat} unit="g" color="#9b59b6" />
        </View>
      </View>

      <View style={styles.divider} />

      <ProgressBar label="HYDRATION" current={macros.water} max={tWater} unit="ml" color="#3498db" />

      {/* QUICK WATER ADD & AI LOGGING */}
      <View style={styles.aiContainer}>
        
        {/* Tactical Quick Water Button */}
        <TouchableOpacity style={styles.quickWaterBtn} onPress={() => logWater(500)}>
          <Text style={styles.quickWaterText}>+ 500ml WATER</Text>
        </TouchableOpacity>

        <TextInput
          style={styles.input}
          placeholder="e.g. '200g chicken breast and rice'"
          placeholderTextColor="#555"
          value={mealInput}
          onChangeText={setMealInput}
          multiline
        />
        
        <TouchableOpacity 
          style={[styles.btn, isAnalyzing && styles.btnDisabled]} 
          onPress={handleAiLog}
          disabled={isAnalyzing}
        >
          {isAnalyzing ? (
            <ActivityIndicator color="#000" size="small" />
          ) : (
            <Text style={styles.btnText}>AI LOG MEAL</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#121212', padding: 20, borderRadius: 10, borderWidth: 1, borderColor: '#222', marginBottom: 20 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  title: { color: '#f39c12', fontSize: 14, fontWeight: '900', letterSpacing: 1 },
  resetText: { color: '#555', fontSize: 10, fontWeight: 'bold' },
  compactRow: { flexDirection: 'row', justifyContent: 'space-between' },
  divider: { height: 1, backgroundColor: '#222', marginVertical: 15 },
  aiContainer: { marginTop: 5 },
  quickWaterBtn: { backgroundColor: '#1a2530', paddingVertical: 10, borderRadius: 6, borderWidth: 1, borderColor: '#3498db', alignItems: 'center', marginBottom: 15 },
  quickWaterText: { color: '#3498db', fontSize: 12, fontWeight: '900', letterSpacing: 1 },
  input: { backgroundColor: '#000', color: '#fff', padding: 12, borderRadius: 6, borderWidth: 1, borderColor: '#333', minHeight: 50, marginBottom: 10, fontSize: 14 },
  btn: { backgroundColor: '#f39c12', paddingVertical: 12, borderRadius: 6, alignItems: 'center' },
  btnDisabled: { opacity: 0.5 },
  btnText: { color: '#000', fontSize: 14, fontWeight: 'bold' }
});