import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { requestNotificationPermissions, scheduleDailyTriggers } from '../utils/notifications';
import MacroDashboard from '../components/MacroDashboard';
import { useApexStore } from '../store/apexStore';
import { WORKOUT_DATABASE } from '../data/workouts';
import { MaterialCommunityIcons } from '@expo/vector-icons'; // Standard in Expo

const DAILY_SCHEDULE = [
  { id: '1', time: '07:30 AM', title: 'Wake & Hydrate', desc: 'Log 500ml water' },
  { id: '2', time: '07:45 AM', title: 'Morning Cardio', desc: 'HIIT / LISS Module' },
  { id: '3', time: '08:30 AM', title: 'Anabolic Breakfast', desc: 'Focus: Fats/Cholesterol/Complex Carbs' },
  { id: '4', time: '09:30 AM', title: 'Focus Block', desc: '2-Hour Deep Work Lock' },
  { id: '5', time: '12:00 PM', title: 'Lunch', desc: 'Focus: High Protein/Moderate Carb' },
  { id: '6', time: '04:30 PM', title: 'Hypertrophy', desc: 'Daily Resistance Engine' },
  { id: '7', time: '05:30 PM', title: 'Post-Workout', desc: 'Fast digesting protein + carbs' },
  { id: '8', time: '07:30 PM', title: 'Dinner', desc: 'Focus: High Protein/Low Carb/High Fat' },
  { id: '9', time: '09:30 PM', title: 'Tech Curfew', desc: 'Begin wind down' },
  { id: '10', time: '11:00 PM', title: 'Sleep', desc: 'End of day logging' }
];

const timeToMinutes = (timeStr) => {
  const [time, modifier] = timeStr.split(' ');
  let [hours, minutes] = time.split(':').map(Number);
  if (hours === 12 && modifier === 'AM') hours = 0;
  if (hours !== 12 && modifier === 'PM') hours += 12;
  return hours * 60 + minutes;
};

export default function TimelineScreen({ navigation }) {
  const [activeBlockId, setActiveBlockId] = useState(null);
  const [menuVisible, setMenuVisible] = useState(false); // Controls the dropdown
  
  const { toggleBlockCompletion, completedBlocks, archiveDailyProgress } = useApexStore();

  // Determine Today's Workout Title for the Timeline
  const getTodayWorkoutTitle = () => {
    const day = new Date().getDay(); // 0 (Sun) to 6 (Sat)
    const map = { 1: 'day1', 2: 'day2', 3: 'day3', 4: 'day4', 5: 'day5', 6: 'day6', 0: 'day7' };
    return WORKOUT_DATABASE[map[day]]?.title || 'Hypertrophy';
  };

  useEffect(() => {
    const setupNotifications = async () => {
      const granted = await requestNotificationPermissions();
      if (granted) await scheduleDailyTriggers();
    };
    setupNotifications();

    const handleDayTransition = () => {
      const now = new Date();
      const todayStr = new Date().toISOString().split('T')[0]; // Produces "2026-05-09"
      
      // Auto-archive if it's the end of the day or first open of a new day
      // (This populates your Reports Calendar automatically)
      const currentMinutes = now.getHours() * 60 + now.getMinutes();
      if (currentMinutes > 1430) { // 11:50 PM
          archiveDailyProgress(todayStr, DAILY_SCHEDULE.length);
      }
    };

    const determineActivePhase = () => {
      const now = new Date();
      const currentMinutes = now.getHours() * 60 + now.getMinutes();
      let activeId = DAILY_SCHEDULE[0].id; 

      for (let i = 0; i < DAILY_SCHEDULE.length; i++) {
        const blockTime = timeToMinutes(DAILY_SCHEDULE[i].time);
        const nextBlockTime = i < DAILY_SCHEDULE.length - 1 
          ? timeToMinutes(DAILY_SCHEDULE[i+1].time) 
          : 1440; 

        if (currentMinutes >= blockTime && currentMinutes < nextBlockTime) {
          activeId = DAILY_SCHEDULE[i].id;
          break;
        }
      }
      setActiveBlockId(activeId);
      handleDayTransition();
    };

    determineActivePhase(); 
    const timer = setInterval(determineActivePhase, 60000); 

    return () => clearInterval(timer);
  }, []);

return (
    <View style={styles.container}>
      {/* --- REFINED COMMAND HEADER --- */}
      <View style={styles.headerRow}>
        <Text style={styles.headerTitle}>TODAY'S PROTOCOL</Text>
        
        <TouchableOpacity 
          onPress={() => setMenuVisible(!menuVisible)}
          style={styles.menuTrigger}
        >
          <MaterialCommunityIcons 
            name={menuVisible ? "close" : "dots-vertical"} 
            size={28} 
            color="#f39c12" 
          />
        </TouchableOpacity>
      </View>

      {/* --- FLOATING COMMAND MENU --- */}
      {menuVisible && (
        <View style={styles.dropdownMenu}>
          <TouchableOpacity 
            style={styles.menuItem} 
            onPress={() => { setMenuVisible(false); navigation.navigate('Profile'); }}
          >
            <MaterialCommunityIcons name="account-circle-outline" size={20} color="#f39c12" />
            <Text style={styles.menuItemText}>OPERATOR PROFILE</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.menuItem} 
            onPress={() => { setMenuVisible(false); navigation.navigate('Reports'); }}
          >
            <MaterialCommunityIcons name="Chart-timeline-variant" size={20} color="#f39c12" />
            <Text style={styles.menuItemText}>COMMAND REPORTS</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.menuItem} 
            onPress={() => { setMenuVisible(false); navigation.navigate('Metrics'); }}
          >
            <MaterialCommunityIcons name="scale-bathroom" size={20} color="#f39c12" />
            <Text style={styles.menuItemText}>BODY METRICS</Text>
          </TouchableOpacity>
        </View>
      )}
      
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        onTouchStart={() => setMenuVisible(false)} // Auto-close menu when scrolling
      >
        
        {/* ... Rest of your DAILY_SCHEDULE.map ... */}
        <MacroDashboard />

        {DAILY_SCHEDULE.map((item, index) => {
          const isActive = item.id === activeBlockId;
          const isCompleted = completedBlocks.includes(item.id);
          
          const currentMinutes = new Date().getHours() * 60 + new Date().getMinutes();
          const blockMinutes = timeToMinutes(item.time);
          const isPast = currentMinutes >= blockMinutes && !isActive;
          const isMissed = isPast && !isCompleted;

          // Aesthetic Color Logic based on State
          let cardColor = '#121212'; let borderColor = '#222'; let textColor = '#fff'; let statusLabel = '';

          if (isActive) {
            cardColor = '#1a1405'; borderColor = '#f39c12'; textColor = '#f39c12'; statusLabel = 'CURRENT';
          } else if (isCompleted) {
            cardColor = '#051a0e'; borderColor = '#2ecc71'; textColor = '#2ecc71'; statusLabel = 'DONE';
          } else if (isMissed) {
            cardColor = '#1a0505'; borderColor = '#e74c3c'; textColor = '#e74c3c'; statusLabel = 'MISSED';
          }

          return (
            <View key={item.id} style={styles.timelineBlock}>
              <View style={styles.timelineGraphics}>
                <View style={[
                    styles.node, 
                    isActive && { backgroundColor: '#f39c12', shadowColor: '#f39c12', shadowOpacity: 0.8 },
                    isCompleted && { backgroundColor: '#2ecc71' },
                    isMissed && { backgroundColor: '#e74c3c' }
                ]} />
                {index !== DAILY_SCHEDULE.length - 1 && <View style={styles.line} />}
              </View>

              <TouchableOpacity 
                style={[styles.card, { backgroundColor: cardColor, borderColor: borderColor }]} 
                activeOpacity={0.8}
                onLongPress={() => toggleBlockCompletion(item.id)}
                onPress={() => {
                    if (item.title === 'Hypertrophy') navigation.navigate('Workout');
                    else if (item.title === 'Focus Block') navigation.navigate('DeepWork');
                    else if (item.title === 'Morning Cardio') navigation.navigate('Cardio');
                    else toggleBlockCompletion(item.id);
                }}
              >
                <Text style={[styles.timeText, { color: textColor }]}>{item.time}</Text>
                <Text style={styles.titleText}>
                    {item.title === 'Hypertrophy' ? getTodayWorkoutTitle() : item.title}
                </Text>
                <Text style={styles.descText}>{item.desc}</Text>
                {(isActive || isCompleted || isMissed) && (
                    <Text style={[styles.activeLabel, { color: textColor }]}>{statusLabel}</Text>
                )}
              </TouchableOpacity>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a', paddingTop: 60 },
  headerRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: 20, 
    marginBottom: 20,
    zIndex: 10 // Ensure header stays above everything
  },
  headerTitle: { 
    color: '#fff', 
    fontSize: 24, 
    fontWeight: '900', 
    letterSpacing: 1.5 
  },
  menuTrigger: {
    padding: 5,
  },
  dropdownMenu: {
    position: 'absolute',
    top: 100, // Positioned right below the header
    right: 20,
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 10,
    zIndex: 100, // Ensure menu is on top of cards
    borderWidth: 1,
    borderColor: '#333',
    // Shadow for depth on Android
    elevation: 10,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
    minWidth: 200,
  },
  menuItemText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 15,
    letterSpacing: 1,
  },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },
  timelineBlock: { flexDirection: 'row', minHeight: 100 },
  timelineGraphics: { width: 30, alignItems: 'center' },
  node: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#333', marginTop: 15 },
  line: { width: 2, flex: 1, backgroundColor: '#222', marginTop: 5 },
  card: { flex: 1, borderRadius: 8, padding: 15, marginBottom: 15, marginLeft: 10, borderWidth: 1 }, 
  timeText: { fontSize: 12, fontWeight: 'bold', marginBottom: 4 },
  titleText: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginBottom: 4 },
  descText: { color: '#888', fontSize: 14 },
  activeLabel: { position: 'absolute', top: 15, right: 15, fontSize: 10, fontWeight: '900', letterSpacing: 1 }
});