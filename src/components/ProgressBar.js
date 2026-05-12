import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ProgressBar({ label, current, max, color, unit }) {
  // Calculate percentage, cap it at 100% so the bar doesn't break the UI
  const fillPercentage = Math.min((current / max) * 100, 100);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.values}>
          {current} / {max} {unit}
        </Text>
      </View>
      
      <View style={styles.track}>
        <View 
          style={[
            styles.fill, 
            { width: `${fillPercentage}%`, backgroundColor: color }
          ]} 
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 15 },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
  label: { color: '#fff', fontSize: 14, fontWeight: 'bold' },
  values: { color: '#888', fontSize: 12, fontWeight: 'bold' },
  track: { height: 12, backgroundColor: '#222', borderRadius: 6, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 6 },
});