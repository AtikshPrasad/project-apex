import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import * as Haptics from 'expo-haptics';

export default function TempoMetronome({ isActive, onClose }) {
  const [phase, setPhase] = useState('DOWN'); 
  const [counter, setCounter] = useState(4);

  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setCounter((prev) => {
        if (phase === 'DOWN' && prev > 1) {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          return prev - 1;
        } else if (phase === 'DOWN' && prev === 1) {
          setPhase('UP');
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy); // Explode cue
          return 1;
        } else if (phase === 'UP') {
          setPhase('DOWN');
          return 4; 
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, phase]);

  if (!isActive) return null;

  return (
    <View style={styles.overlay}>
      <Text style={[styles.phaseText, { color: phase === 'DOWN' ? '#f39c12' : '#2ecc71' }]}>
        {phase === 'DOWN' ? 'LOWER SLOWLY' : 'EXPLODE UP'}
      </Text>
      <Text style={styles.timerText}>{counter}</Text>
      <TouchableOpacity style={styles.stopBtn} onPress={onClose}>
        <Text style={styles.stopBtnText}>END SET</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    backgroundColor: '#1a1a1a',
    padding: 30,
    borderRadius: 15,
    alignItems: 'center',
    marginVertical: 20,
    borderWidth: 2,
    borderColor: '#f39c12'
  },
  phaseText: { fontSize: 24, fontWeight: '900', letterSpacing: 2 },
  timerText: { color: '#fff', fontSize: 80, fontWeight: 'bold', marginVertical: 10 },
  stopBtn: { backgroundColor: '#333', paddingVertical: 10, paddingHorizontal: 30, borderRadius: 5, marginTop: 10 },
  stopBtnText: { color: '#fff', fontWeight: 'bold' }
});