import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';

export default function DeepWorkScreen({ navigation }) {
  // 7200 seconds = 2 hours
  const [timeLeft, setTimeLeft] = useState(7200); 
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval = null;
    
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      clearInterval(interval);
      Alert.alert("MISSION ACCOMPLISHED", "Deep work session complete. Cortisol lowered. Mind sharpened.");
      setIsActive(false);
    }
    
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const formatTime = () => {
    const h = Math.floor(timeLeft / 3600);
    const m = Math.floor((timeLeft % 3600) / 60);
    const s = timeLeft % 60;
    return `${h}:${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleGiveUp = () => {
    Alert.alert(
      "BREAKING DISCIPLINE?",
      "Are you sure you want to abort the Deep Work session?",
      [
        { text: "STAY FOCUSED", style: "cancel" },
        { 
          text: "ABORT", 
          style: "destructive", 
          onPress: () => navigation.goBack() 
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>DEEP WORK ZONE</Text>
      <Text style={styles.subtext}>Put your phone face down. Do the work.</Text>
      
      <View style={styles.timerContainer}>
        <Text style={[styles.timer, isActive && styles.timerActive]}>
          {formatTime()}
        </Text>
      </View>

      {!isActive ? (
        <TouchableOpacity style={styles.startBtn} onPress={() => setIsActive(true)}>
          <Text style={styles.startBtnText}>ENGAGE LOCK</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.abortBtn} onPress={handleGiveUp}>
          <Text style={styles.abortBtnText}>ABORT SESSION</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000000', justifyContent: 'center', alignItems: 'center', padding: 20 },
  header: { color: '#555', fontSize: 24, fontWeight: '900', letterSpacing: 4, marginBottom: 10 },
  subtext: { color: '#444', fontSize: 14, marginBottom: 50 },
  timerContainer: { marginBottom: 60 },
  timer: { color: '#fff', fontSize: 80, fontWeight: 'bold', fontVariant: ['tabular-nums'] },
  timerActive: { color: '#f39c12' },
  startBtn: { backgroundColor: '#f39c12', paddingVertical: 18, paddingHorizontal: 50, borderRadius: 10 },
  startBtnText: { color: '#000', fontSize: 16, fontWeight: '900', letterSpacing: 1 },
  abortBtn: { backgroundColor: 'transparent', borderWidth: 1, borderColor: '#e74c3c', paddingVertical: 15, paddingHorizontal: 40, borderRadius: 10 },
  abortBtnText: { color: '#e74c3c', fontSize: 14, fontWeight: 'bold' }
});