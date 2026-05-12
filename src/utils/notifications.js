import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

// Tell the app to show alerts and play sounds even if it's in the foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function requestNotificationPermissions() {
  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return false;
    }
    return true;
  } else {
    console.log('Must use physical device for Push Notifications');
    return false;
  }
}

// Function to schedule the daily prompts based on the Blueprint
export async function scheduleDailyTriggers() {
  await Notifications.cancelAllScheduledNotificationsAsync(); // Clear old ones

  // Example: 07:20 AM Warning for 07:30 AM Wake [cite: 14, 15]
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'APEX Protocol',
      body: 'Wake & Hydrate in 10 minutes. Prepare 500ml water.',
      sound: true,
    },
    trigger: {
      hour: 7,
      minute: 20,
      repeats: true,
    },
  });

  // Example: 09:20 PM Warning for 09:30 PM Tech Curfew [cite: 14, 25]
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Tech Curfew Approaching',
      body: 'Wind down begins in 10 minutes. Finish up.',
      sound: true,
    },
    trigger: {
      hour: 21,
      minute: 20,
      repeats: true,
    },
  });
  
  // You will expand this function for all 10 phases later.
}