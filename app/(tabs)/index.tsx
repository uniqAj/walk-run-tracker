import { useEffect, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

type Workout = {
  time: string;
  steps: number;
  calories: number;
};

export default function HomeScreen() {
  const [running, setRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [steps, setSteps] = useState(0);
  const [calories, setCalories] = useState(0);

  const [history, setHistory] = useState<Workout[]>([]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (running) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
        setSteps((prev) => prev + 3);
        setCalories((prev) => prev + 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [running]);

  const formatTime = () => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;

    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const stopWorkout = () => {
    setRunning(false);

    const newWorkout = {
      time: formatTime(),
      steps,
      calories,
    };

    setHistory((prev) => [newWorkout, ...prev]);
  };

  const resetWorkout = () => {
    setRunning(false);
    setSeconds(0);
    setSteps(0);
    setCalories(0);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Run Tracker</Text>

      <Text style={styles.timer}>{formatTime()}</Text>

      <View style={styles.statsContainer}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>👣 Steps</Text>
          <Text style={styles.cardValue}>{steps}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>🔥 Calories</Text>
          <Text style={styles.cardValue}>{calories}</Text>
        </View>
      </View>

      {!running ? (
        <TouchableOpacity
          style={styles.startButton}
          onPress={() => setRunning(true)}>
          <Text style={styles.buttonText}>START RUN</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={styles.stopButton}
          onPress={stopWorkout}>
          <Text style={styles.buttonText}>STOP RUN</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        style={styles.resetButton}
        onPress={resetWorkout}>
        <Text style={styles.resetText}>RESET</Text>
      </TouchableOpacity>

      <Text style={styles.historyTitle}>Workout History</Text>

      {history.map((workout, index) => (
        <View key={index} style={styles.historyCard}>
          <Text style={styles.historyText}>
            ⏱ {workout.time}
          </Text>

          <Text style={styles.historyText}>
            👣 {workout.steps} steps
          </Text>

          <Text style={styles.historyText}>
            🔥 {workout.calories} cal
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
    paddingTop: 80,
    paddingHorizontal: 20,
  },

  title: {
    color: 'white',
    fontSize: 34,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
  },

  timer: {
    color: '#00ff99',
    fontSize: 72,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 40,
  },

  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
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
    marginBottom: 40,
  },

  resetText: {
    color: '#999',
    fontSize: 18,
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