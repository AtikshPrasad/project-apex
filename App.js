import React from 'react';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { useApexStore } from './src/store/apexStore';

// --- ALL PROTOCOL SCREENS ---
import AuthScreen from './src/screens/AuthScreen';
import TimelineScreen from './src/screens/TimelineScreen';
import WorkoutScreen from './src/screens/WorkoutScreen';
import DeepWorkScreen from './src/screens/DeepWorkScreen';
import CardioScreen from './src/screens/CardioScreen';
import MetricsScreen from './src/screens/MetricsScreen';
import ReportsScreen from './src/screens/ReportsScreen';
import ProfileScreen from './src/screens/ProfileScreen';

const Stack = createNativeStackNavigator();

const ApexTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: '#0a0a0a', 
    card: '#121212',       
    text: '#ffffff',       
    border: '#222222',
    primary: '#f39c12',    
  },
};

export default function App() {
  // Use a selector to pull security safely
  const security = useApexStore((state) => state.security);

  // If security object doesn't exist yet (AsyncStorage lag), default to locked
  const isLocked = security ? security.isLocked : true;

  return (
    <NavigationContainer theme={ApexTheme}>
      <StatusBar style="light" />
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isLocked ? (
          <Stack.Screen name="Auth" component={AuthScreen} />
        ) : (
          <>
            <Stack.Screen name="Timeline" component={TimelineScreen} />
            <Stack.Screen name="Workout" component={WorkoutScreen} />
            <Stack.Screen name="DeepWork" component={DeepWorkScreen} />
            <Stack.Screen name="Cardio" component={CardioScreen} />
            <Stack.Screen name="Metrics" component={MetricsScreen} />
            <Stack.Screen name="Reports" component={ReportsScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}