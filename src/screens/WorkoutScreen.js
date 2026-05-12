import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { WORKOUT_DATABASE } from '../data/workouts';
import TempoMetronome from '../components/TempoMetronome';
import * as Haptics from 'expo-haptics';

const getTodayWorkout = () => {
  const day = new Date().getDay(); // 0 is Sunday, 1 is Monday
  const map = { 1: 'day1', 2: 'day2', 3: 'day3', 4: 'day4', 5: 'day5', 6: 'day6', 0: 'day7' };
  return WORKOUT_DATABASE[map[day]];
};

export default function WorkoutScreen() {
  const currentWorkout = getTodayWorkout();
  const [activeTempoExercise, setActiveTempoExercise] = useState(null);
  const [completedSets, setCompletedSets] = useState({});

  const logSet = (exerciseId, totalSets) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setCompletedSets(prev => ({
      ...prev,
      [exerciseId]: (prev[exerciseId] || 0) + 1
    }));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>{currentWorkout.title}</Text>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {activeTempoExercise && (
          <TempoMetronome 
            isActive={true} 
            onClose={() => setActiveTempoExercise(null)} 
          />
        )}

        {currentWorkout.exercises.map((ex) => {
          const setsDone = completedSets[ex.id] || 0;
          const isComplete = setsDone >= ex.sets;

          return (
            <View key={ex.id} style={[styles.card, isComplete && styles.cardComplete]}>
              <View style={styles.cardHeader}>
                <Text style={styles.exerciseName}>{ex.name}</Text>
                <Text style={styles.repScheme}>
                  {ex.type === 'failure' ? 'To Failure' : `${ex.reps} Reps`} | {setsDone}/{ex.sets} Sets
                </Text>
              </View>

              <View style={styles.actionRow}>
                {!isComplete && (
                  <TouchableOpacity 
                    style={styles.logBtn} 
                    onPress={() => logSet(ex.id, ex.sets)}
                  >
                    <Text style={styles.logBtnText}>
                      {ex.type === 'failure' ? 'TAP WHEN FAILED' : 'LOG SET'}
                    </Text>
                  </TouchableOpacity>
                )}

                {ex.requiresTempo && !isComplete && (
                  <TouchableOpacity 
                    style={styles.tempoBtn} 
                    onPress={() => setActiveTempoExercise(ex.id)}
                  >
                    <Text style={styles.tempoBtnText}>START TEMPO</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a', paddingTop: 60 },
  headerTitle: { color: '#f39c12', fontSize: 28, fontWeight: '900', letterSpacing: 1, paddingHorizontal: 20, marginBottom: 20, textTransform: 'uppercase' },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },
  card: { backgroundColor: '#121212', borderRadius: 10, padding: 20, marginBottom: 15, borderWidth: 1, borderColor: '#222' },
  cardComplete: { opacity: 0.5, borderColor: '#2ecc71' },
  cardHeader: { marginBottom: 15 },
  exerciseName: { color: '#fff', fontSize: 20, fontWeight: 'bold', marginBottom: 5 },
  repScheme: { color: '#888', fontSize: 14, fontWeight: '600' },
  actionRow: { flexDirection: 'row', justifyContent: 'space-between' },
  logBtn: { backgroundColor: '#333', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 6, flex: 1, marginRight: 10, alignItems: 'center' },
  logBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
  tempoBtn: { backgroundColor: '#f39c12', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 6, flex: 1, alignItems: 'center' },
  tempoBtnText: { color: '#000', fontWeight: 'bold', fontSize: 12 },
});