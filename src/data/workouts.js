export const WORKOUT_DATABASE = {
  day1: {
    title: 'Upper Body PUSH',
    exercises: [
      { id: '1_1', name: 'Decline Push-ups', sets: 3, type: 'failure', requiresTempo: false },
      { id: '1_2', name: 'Pike Push-ups', sets: 3, type: 'failure', requiresTempo: false },
      { id: '1_3', name: '5kg DB Lateral Raises', sets: 4, reps: '15-20', type: 'reps', requiresTempo: true },
      { id: '1_4', name: '5kg DB Overhead Tricep Extensions', sets: 3, reps: '20', type: 'reps', requiresTempo: true },
      { id: '1_5', name: 'Standard Push-ups', sets: 2, type: 'failure', requiresTempo: false },
    ]
  },
  day2: {
    title: 'Lower Body (Legs & Core)',
    exercises: [
      { id: '2_1', name: 'Bulgarian Split Squats', sets: 4, reps: '12-15/leg', type: 'reps', requiresTempo: true },
      { id: '2_2', name: 'Jump Squats', sets: 3, reps: '15', type: 'reps', requiresTempo: false, cue: 'Explosive' },
      { id: '2_3', name: 'DB Goblet Squats (2x 5kg)', sets: 3, reps: '20', type: 'reps', requiresTempo: true },
      { id: '2_4', name: 'Plank Hold', sets: 3, type: 'timer', duration: 60, requiresTempo: false },
    ]
  },
  day3: {
    title: 'Upper Body PULL',
    exercises: [
      { id: '3_1', name: 'Pull-ups / Inverted Rows', sets: 4, type: 'failure', requiresTempo: false },
      { id: '3_2', name: '5kg DB Concentration Curls', sets: 4, reps: '15/arm', type: 'reps', requiresTempo: true },
      { id: '3_3', name: '5kg DB Reverse Flyes', sets: 4, reps: '15', type: 'reps', requiresTempo: true },
      { id: '3_4', name: 'Towel Curls (Isometric)', sets: 3, type: 'failure', requiresTempo: false },
    ]
  },
  day4: {
    title: 'Lower Body (Legs & Calves)',
    exercises: [
      { id: '4_1', name: 'Reverse Lunges (with DBs)', sets: 4, reps: '15/leg', type: 'reps', requiresTempo: true },
      { id: '4_2', name: 'Nordic Hamstring Curls', sets: 3, type: 'failure', requiresTempo: true },
      { id: '4_3', name: 'Single-Leg Calf Raises', sets: 4, reps: '20/leg', type: 'reps', requiresTempo: true },
      { id: '4_4', name: 'Bicycle Crunches', sets: 3, reps: '30', type: 'reps', requiresTempo: false },
    ]
  },
  day5: {
    title: '"The Pump" (Full Body)',
    exercises: [
      { id: '5_1', name: '5kg DB Arnold Presses', sets: 4, reps: '15', type: 'reps', requiresTempo: true },
      { id: '5_2', name: '5kg DB Hammer Curls', sets: 4, reps: '20', type: 'reps', requiresTempo: true },
      { id: '5_3', name: 'Diamond Push-ups', sets: 3, type: 'failure', requiresTempo: false },
      { id: '5_4', name: 'Hollow Body Holds', sets: 3, type: 'timer', duration: 45, requiresTempo: false },
    ]
  },
  day6: {
    title: 'Active Recovery',
    isRestDay: true,
    message: 'Lock out resistance workouts. Light walk, stretch, or casual bike ride.'
  },
  day7: {
    title: 'Active Recovery',
    isRestDay: true,
    message: 'Lock out resistance workouts. Light walk, stretch, or casual bike ride.'
  }
};