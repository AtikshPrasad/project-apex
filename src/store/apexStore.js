import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useApexStore = create(
  persist(
    (set, get) => ({
      // --- IDENTITY & AUTH ---
      userProfile: {
        name: '',
        age: null,
        height: null,
        startingWeight: null,
        targetWeight: null,
        isSetupComplete: false,
      },
      security: { pin: null, isLocked: true },

      // --- NEW ACTIONS ---
      setProfile: (data) => set((state) => ({
        userProfile: { ...state.userProfile, ...data, isSetupComplete: true }
      })),
      
      setPin: (newPin) => set((state) => ({
        security: { ...state.security, pin: newPin, isLocked: false }
      })),

      unlockApp: () => set((state) => ({
        security: { ...state.security, isLocked: false }
      })),

      lockApp: () => set((state) => ({
        security: { ...state.security, isLocked: true }
      })),
      // --- UPDATE FACTORY RESET TO WIPE EVERYTHING ---
      factoryReset: () => set({
        userProfile: { name: '', age: null, height: null, startingWeight: null, targetWeight: null, isSetupComplete: false },
        security: { pin: null, isLocked: true },
        macros: { protein: 0, carbs: 0, fats: 0, calories: 0, water: 0 },
        macroTargets: { protein: 180, carbs: 150, fats: 70, calories: 2000, water: 4000 },
        completedBlocks: [],
        historicalStreaks: {},
        metrics: { weightLogs: [], waistLogs: [], energyDriveLogs: [] }
      }),
      // --- NUTRITION & MACROS ---
      macros: { protein: 0, carbs: 0, fats: 0, calories: 0, water: 0 },
      macroTargets: { protein: 180, carbs: 150, fats: 70, calories: 2000, water: 4000 },
      
      // --- DAILY TIMELINE ---
      currentPhase: 'wake', 
      
      // --- ACCOUNTABILITY & STREAKS ---
      completedBlocks: [], // Tracks IDs of blocks finished today
      historicalStreaks: {}, // Format: { "YYYY-MM-DD": percentageComplete }
      
      // --- METRICS (10-WEEK GOAL) ---
      metrics: {
        weightLogs: [], 
        waistLogs: [],
        energyDriveLogs: [],
      },

      // --- DYNAMIC SETUP ACTION ---
      setProfile: (data) => set((state) => {
        const currentW = parseFloat(data.startingWeight);
        const targetW = parseFloat(data.targetWeight);

        // Advanced Recomp Math: 
        // Protein = 2.2g per kg of target weight
        // Fats = 1g per kg of target weight
        // Calories = Aggressive cut at 24 kcal per kg of target weight
        const tProtein = Math.round(targetW * 2.2);
        const tFats = Math.round(targetW * 1.0);
        const tCalories = Math.round(targetW * 24); 
        // Carbs fill the rest of the calories: (Total - Protein Cals - Fat Cals) / 4
        const tCarbs = Math.round((tCalories - (tProtein * 4) - (tFats * 9)) / 4);
        const tWater = Math.round(currentW * 40);

        return {
          userProfile: { ...state.userProfile, ...data, isSetupComplete: true },
          macroTargets: { protein: tProtein, carbs: tCarbs, fats: tFats, calories: tCalories, water: tWater }
        };
      }),

      // --- LOGGING ACTIONS ---
      logWater: (amount) => set((state) => ({ 
          macros: { ...state.macros, water: state.macros.water + amount } 
      })),
      
      logMeal: (p, c, f, cal) => set((state) => ({ 
          macros: { 
              ...state.macros, 
              // We force Number conversion and default to 0 if something is weird
              protein: Number(state.macros.protein || 0) + Number(p || 0),
              carbs: Number(state.macros.carbs || 0) + Number(c || 0),
              fats: Number(state.macros.fats || 0) + Number(f || 0),
              calories: Number(state.macros.calories || 0) + Number(cal || 0)
          } 
      })),

      resetDailyMacros: () => set({
          macros: { protein: 0, carbs: 0, fats: 0, calories: 0, water: 0 }
      }),

      logMetric: (type, value, date) => set((state) => {
        const newLog = { date, value };
        return {
          metrics: {
            ...state.metrics,
            [`${type}Logs`]: [...state.metrics[`${type}Logs`], newLog]
          }
        };
      }),

      // --- ACCOUNTABILITY ACTIONS ---
      toggleBlockCompletion: (blockId) => set((state) => {
        const isDone = state.completedBlocks.includes(blockId);
        const newBlocks = isDone 
          ? state.completedBlocks.filter(id => id !== blockId)
          : [...state.completedBlocks, blockId];
        return { completedBlocks: newBlocks };
      }),

      // Call this at 11:59 PM or on first open of a new day
      archiveDailyProgress: (dateString, totalBlocks) => set((state) => {
        const score = state.completedBlocks.length / totalBlocks;
        return {
          historicalStreaks: { ...state.historicalStreaks, [dateString]: score },
          completedBlocks: [], // Reset blocks for the new day
          macros: { protein: 0, carbs: 0, fats: 0, calories: 0, water: 0 } // Auto-reset macros for the new day
        };
      }),

    }),
    {
      name: 'apex-local-storage', // The key used in AsyncStorage
      storage: createJSONStorage(() => AsyncStorage), 
    }
  )
);