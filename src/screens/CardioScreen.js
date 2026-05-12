import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import * as Speech from 'expo-speech';
import * as Haptics from 'expo-haptics';

// Durations in seconds (Blueprint specs)
const WARMUP_TIME = 300; 
const SPRINT_TIME = 30;
const RECOVER_TIME = 90;
const TOTAL_ROUNDS = 8;

export default function CardioScreen({ navigation }) {
  const [phase, setPhase] = useState('IDLE'); // IDLE, WARMUP, SPRINT, RECOVER, DONE
  const [timeLeft, setTimeLeft] = useState(0);
  const [currentRound, setCurrentRound] = useState(1);
  const [isActive, setIsActive] = useState(false);

  // The core state machine logic
  useEffect(() => {
    let timer = null;

    if (isActive && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    } else if (isActive && timeLeft === 0) {
      transitionPhase();
    }

    return () => clearInterval(timer);
  }, [isActive, timeLeft, phase]);

  const transitionPhase = () => {
    if (phase === 'IDLE') {
      Speech.speak("Protocol initiated. Begin 5 minute warm up.");
      setPhase('WARMUP');
      setTimeLeft(WARMUP_TIME);
    } 
    else if (phase === 'WARMUP' || phase === 'RECOVER') {
      if (phase === 'RECOVER' && currentRound >= TOTAL_ROUNDS) {
        Speech.speak("Protocol complete. Excellent work. Logging session.");
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        setPhase('DONE');
        setIsActive(false);
        return;
      }
      
      if (phase === 'RECOVER') setCurrentRound(r => r + 1);
      
      Speech.speak("GO! Sprint!");
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      setPhase('SPRINT');
      setTimeLeft(SPRINT_TIME);
    } 
    else if (phase === 'SPRINT') {
      Speech.speak("Slow down. Recovery phase.");
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setPhase('RECOVER');
      setTimeLeft(RECOVER_TIME);
    }
  };

  const startProtocol = () => {
    setIsActive(true);
    transitionPhase();
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const getPhaseColor = () => {
    if (phase === 'SPRINT') return '#e74c3c'; // Red for intense
    if (phase === 'RECOVER') return '#2ecc71'; // Green for recover
    return '#f39c12'; // Orange default
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>HIIT CYCLING MODULE</Text>
      
      {phase !== 'IDLE' && phase !== 'DONE' && (
        <Text style={styles.roundText}>ROUND {currentRound} OF {TOTAL_ROUNDS}</Text>
      )}

      <View style={[styles.circle, { borderColor: getPhaseColor() }]}>
        <Text style={[styles.phaseText, { color: getPhaseColor() }]}>{phase}</Text>
        <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
      </View>

      {phase === 'IDLE' && (
        <TouchableOpacity style={styles.btn} onPress={startProtocol}>
          <Text style={styles.btnText}>INITIATE PROTOCOL</Text>
        </TouchableOpacity>
      )}

      {phase === 'DONE' && (
        <TouchableOpacity style={styles.btn} onPress={() => navigation.goBack()}>
          <Text style={styles.btnText}>RETURN TO TIMELINE</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a', justifyContent: 'center', alignItems: 'center' },
  title: { color: '#fff', fontSize: 24, fontWeight: '900', letterSpacing: 2, marginBottom: 10 },
  roundText: { color: '#888', fontSize: 16, fontWeight: 'bold', marginBottom: 40, letterSpacing: 1 },
  circle: { width: 280, height: 280, borderRadius: 140, borderWidth: 8, justifyContent: 'center', alignItems: 'center', marginBottom: 50 },
  phaseText: { fontSize: 24, fontWeight: 'bold', letterSpacing: 2, marginBottom: 10 },
  timerText: { color: '#fff', fontSize: 72, fontWeight: '900', fontVariant: ['tabular-nums'] },
  btn: { backgroundColor: '#f39c12', paddingVertical: 15, paddingHorizontal: 40, borderRadius: 8 },
  btnText: { color: '#000', fontSize: 16, fontWeight: 'bold' }
});