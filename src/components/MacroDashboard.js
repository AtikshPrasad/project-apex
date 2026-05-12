import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, TextInput, ActivityIndicator, Alert } from 'react-native';
import { useApexStore } from '../store/apexStore';
import ProgressBar from './ProgressBar';
import { extractMacros } from '../utils/gemini';

export default function MacroDashboard() {
  const { macros, macroTargets, logWater, logMeal, resetDailyMacros } = useApexStore();
  const [mealInput, setMealInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // --- DEFENSIVE DATA CASTING ---
  // We sanitize the data right here. If macros.calories is NaN, it becomes 0.
  const current = {
    cal: Number(macros?.calories) || 0,
    pro: Number(macros?.protein) || 0,
    carb: Number(macros?.carbs) || 0,
    fat: Number(macros?.fats) || 0,
    water: Number(macros?.water) || 0,
  };

  const targets = {
    cal: Number(macroTargets?.calories) || 2000,
    pro: Number(macroTargets?.protein) || 150,
    carb: Number(macroTargets?.carbs) || 200,
    fat: Number(macroTargets?.fats) || 60,
    water: Number(macroTargets?.water) || 4000,
  };

  const handleAiLog = async () => {
    if (!mealInput.trim()) return;
    
    setIsAnalyzing(true);
    try {
      const data = await extractMacros(mealInput);
      
      if (data) {
        // Sanitize AI response before sending to store
        const p = Number(data.protein) || 0;
        const c = Number(data.carbs) || 0;
        const f = Number(data.fats) || 0;
        const cal = Number(data.calories) || 0;
        const w = Number(data.water) || 0;

        if (cal > 0 || p > 0) logMeal(p, c, f, cal);
        if (w > 0) logWater(w);
        
        Alert.alert("DATA SECURED", `+${cal} kcal | ${p}g P | ${c}g C | ${f}g F`);
        setMealInput('');
      } else {
        throw new Error("Invalid Parse");
      }
    } catch (err) {
      Alert.alert("ENGINE ERROR", "Failed to parse nutrients. Check connectivity or refine input.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>NUTRITION ENGINE</Text>
        <TouchableOpacity onPress={resetDailyMacros} activeOpacity={0.7}>
          <Text style={styles.resetText}>RESET</Text>
        </TouchableOpacity>
      </View>
      
      {/* PRIMARY BARS */}
      <ProgressBar label="CALORIES" current={current.cal} max={targets.cal} unit="kcal" color="#f39c12" />
      <ProgressBar label="PROTEIN" current={current.pro} max={targets.pro} unit="g" color="#e74c3c" />
      
      {/* SECONDARY MACROS ROW */}
      <View style={styles.compactRow}>
        <View style={styles.halfWidth}>
            <ProgressBar label="CARBS" current={current.carb} max={targets.carb} unit="g" color="#2ecc71" />
        </View>
        <View style={styles.halfWidth}>
            <ProgressBar label="FATS" current={current.fat} max={targets.fat} unit="g" color="#9b59b6" />
        </View>
      </View>

      <View style={styles.divider} />

      {/* HYDRATION BAR */}
      <ProgressBar label="HYDRATION" current={current.water} max={targets.water} unit="ml" color="#3498db" />

      {/* INPUT SECTOR */}
      <View style={styles.aiContainer}>
        <TouchableOpacity 
            style={styles.quickWaterBtn} 
            onPress={() => logWater(500)}
            activeOpacity={0.8}
        >
          <Text style={styles.quickWaterText}>+ 500ml WATER</Text>
        </TouchableOpacity>

        <TextInput
          style={styles.input}
          placeholder="e.g. '300g Chicken and Rice'"
          placeholderTextColor="#444"
          value={mealInput}
          onChangeText={setMealInput}
          multiline
          blurOnSubmit={true}
        />
        
        <TouchableOpacity 
          style={[styles.btn, isAnalyzing && styles.btnDisabled]} 
          onPress={handleAiLog}
          disabled={isAnalyzing}
        >
          {isAnalyzing ? (
            <ActivityIndicator color="#000" size="small" />
          ) : (
            <Text style={styles.btnText}>AUTHENTICATE LOG</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#121212', padding: 20, borderRadius: 10, borderWidth: 1, borderColor: '#222', marginBottom: 20 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  title: { color: '#f39c12', fontSize: 13, fontWeight: '900', letterSpacing: 1.5 },
  resetText: { color: '#444', fontSize: 10, fontWeight: 'bold', padding: 5 },
  compactRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%' },
  halfWidth: { width: '48%' }, // Ensures gap and prevents overlap
  divider: { height: 1, backgroundColor: '#222', marginVertical: 15 },
  aiContainer: { marginTop: 5 },
  quickWaterBtn: { 
    backgroundColor: '#0a141d', 
    paddingVertical: 10, 
    borderRadius: 6, 
    borderWidth: 1, 
    borderColor: '#3498db', 
    alignItems: 'center', 
    marginBottom: 12 
  },
  quickWaterText: { color: '#3498db', fontSize: 11, fontWeight: '900', letterSpacing: 1 },
  input: { 
    backgroundColor: '#000', 
    color: '#fff', 
    padding: 12, 
    borderRadius: 6, 
    borderWidth: 1, 
    borderColor: '#333', 
    minHeight: 50, 
    marginBottom: 10, 
    fontSize: 14,
    textAlignVertical: 'top' 
  },
  btn: { backgroundColor: '#f39c12', paddingVertical: 14, borderRadius: 6, alignItems: 'center' },
  btnDisabled: { opacity: 0.5 },
  btnText: { color: '#000', fontSize: 13, fontWeight: '900', letterSpacing: 1 }
});