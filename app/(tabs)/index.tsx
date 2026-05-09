import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

type ActivityType = 'run' | 'walk';

type Workout = {
  type: ActivityType;
  time: string;
  steps: number;
  calories: number;
};

const STORAGE_KEY = 'workout_history';

export default function HomeScreen() {
  const [activityType, setActivityType] = useState<ActivityType>('run');
  const [running, setRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [steps, setSteps] = useState(0);
  const [calories, setCalories] = useState(0);
  const [history, setHistory] = useState<Workout[]>([]);

  useEffect(() => {
    loadHistory();
  }, []);

  useEffect(() => {
    saveHistory();
  }, [history]);

  const loadHistory = async () => {
    try {
      const savedHistory = await AsyncStorage.getItem(STORAGE_KEY);

      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      }
    } catch (error) {
      console.log('Error loading history:', error);
    }
  };

  const saveHistory = async () => {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(history)
      );
    } catch (error) {
      console.log('Error saving history:', error);
    }
  };

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;

    if (running) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);

        if (activityType === 'run') {
          setSteps((prev) => prev + 3);
          setCalories((prev) => prev + 1);
        } else {
          setSteps((prev) => prev + 2);
          setCalories((prev) => prev + 0.5);
        }
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [running, activityType]);

  const formatTime = () => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;

    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const stopWorkout = () => {
    setRunning(false);

    const newWorkout = {
      type: activityType,
      time: formatTime(),
      steps,
      calories,
    };

    setHistory((prev) => [newWorkout, ...prev]);

    setSeconds(0);
    setSteps(0);
    setCalories(0);
  };

  const resetWorkout = () => {
    setRunning(false);
    setSeconds(0);
    setSteps(0);
    setCalories(0);
  };

  const clearHistory = async () => {
    await AsyncStorage.removeItem(STORAGE_KEY);
    setHistory([]);
  };

  const activityLabel = activityType === 'run' ? '🏃 Run' : '🚶 Walk';

  const totalRuns = history.filter((item) => item.type === 'run').length;
  const totalWalks = history.filter((item) => item.type === 'walk').length;
  const totalSteps = history.reduce((sum, item) => sum + item.steps, 0);
  const totalCalories = history.reduce((sum, item) => sum + item.calories, 0);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Walk & Run Tracker</Text>

      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Total Stats</Text>

        <Text style={styles.summaryText}>
          🏃 Runs: {totalRuns}
        </Text>

        <Text style={styles.summaryText}>
          🚶 Walks: {totalWalks}
        </Text>

        <Text style={styles.summaryText}>
          👣 Steps: {totalSteps}
        </Text>

        <Text style={styles.summaryText}>
          🔥 Calories: {Math.round(totalCalories)}
        </Text>
      </View>

      <View style={styles.activitySelector}>
        <TouchableOpacity
          style={[
            styles.activityButton,
            activityType === 'run' && styles.activeButton,
          ]}
          onPress={() => setActivityType('run')}
          disabled={running}>
          <Text style={styles.activityButtonText}>
            🏃 RUN
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.activityButton,
            activityType === 'walk' && styles.activeButton,
          ]}
          onPress={() => setActivityType('walk')}
          disabled={running}>
          <Text style={styles.activityButtonText}>
            🚶 WALK
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.currentActivity}>
        {activityLabel}
      </Text>

      <Text style={styles.timer}>
        {formatTime()}
      </Text>

      <View style={styles.statsContainer}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            👣 Steps
          </Text>

          <Text style={styles.cardValue}>
            {steps}
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            🔥 Calories
          </Text>

          <Text style={styles.cardValue}>
            {Math.round(calories)}
          </Text>
        </View>
      </View>

      {!running ? (
        <TouchableOpacity
          style={styles.startButton}
          onPress={() => setRunning(true)}>
          <Text style={styles.buttonText}>
            START
          </Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={styles.stopButton}
          onPress={stopWorkout}>
          <Text style={styles.buttonText}>
            STOP
          </Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        style={styles.resetButton}
        onPress={resetWorkout}>
        <Text style={styles.resetText}>
          RESET CURRENT
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.clearButton}
        onPress={clearHistory}>
        <Text style={styles.clearButtonText}>
          CLEAR HISTORY
        </Text>
      </TouchableOpacity>

      <Text style={styles.historyTitle}>
        Activity History
      </Text>

      {history.map((workout, index) => (
        <View key={index} style={styles.historyCard}>
          <Text style={styles.historyText}>
            {workout.type === 'run'
              ? '🏃 Run'
              : '🚶 Walk'}
          </Text>

          <Text style={styles.historyText}>
            ⏱ {workout.time}
          </Text>

          <Text style={styles.historyText}>
            👣 {workout.steps} steps
          </Text>

          <Text style={styles.historyText}>
            🔥 {Math.round(workout.calories)} cal
          </Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f0f',
    paddingTop: 70,
    paddingHorizontal: 20,
  },

  title: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 25,
  },

  summaryCard: {
    backgroundColor: '#161616',
    borderRadius: 20,
    padding: 18,
    marginBottom: 25,
  },

  summaryTitle: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },

  summaryText: {
    color: '#ddd',
    fontSize: 17,
    marginBottom: 5,
  },

  activitySelector: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 25,
  },

  activityButton: {
    flex: 1,
    backgroundColor: '#1c1c1c',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
  },

  activeButton: {
    backgroundColor: '#00cc66',
  },

  activityButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },

  currentActivity: {
    color: '#aaa',
    fontSize: 22,
    textAlign: 'center',
    marginBottom: 15,
  },

  timer: {
    color: '#00ff99',
    fontSize: 72,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 35,
  },

  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 35,
  },

  card: {
    backgroundColor: '#1c1c1c',
    width: '48%',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
  },

  cardTitle: {
    color: '#aaa',
    fontSize: 18,
    marginBottom: 10,
  },

  cardValue: {
    color: 'white',
    fontSize: 30,
    fontWeight: 'bold',
  },

  startButton: {
    backgroundColor: '#00cc66',
    padding: 18,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 15,
  },

  stopButton: {
    backgroundColor: '#ff4444',
    padding: 18,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 15,
  },

  buttonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },

  resetButton: {
    alignItems: 'center',
    marginBottom: 15,
  },

  resetText: {
    color: '#999',
    fontSize: 18,
  },

  clearButton: {
    backgroundColor: '#333',
    padding: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginBottom: 40,
  },

  clearButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },

  historyTitle: {
    color: 'white',
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
  },

  historyCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 18,
    padding: 18,
    marginBottom: 15,
  },

  historyText: {
    color: 'white',
    fontSize: 18,
    marginBottom: 6,
  },
});