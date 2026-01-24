import { useState } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Button, TextInput, Chip, Text, useTheme, IconButton } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGameStore } from '../src/store/gameStore';

const MIN_PLAYERS = 3;
const MAX_PLAYERS = 12;

export default function PlayersScreen() {
  const router = useRouter();
  const theme = useTheme();
  const savedPlayers = useGameStore((state) => state.savedPlayers);

  const [players, setPlayers] = useState<string[]>(['', '', '']);
  const [error, setError] = useState<string>('');

  const updatePlayer = (index: number, name: string) => {
    const newPlayers = [...players];
    newPlayers[index] = name;
    setPlayers(newPlayers);
    setError('');
  };

  const addPlayer = () => {
    if (players.length < MAX_PLAYERS) {
      setPlayers([...players, '']);
    }
  };

  const removePlayer = (index: number) => {
    if (players.length > MIN_PLAYERS) {
      const newPlayers = players.filter((_, i) => i !== index);
      setPlayers(newPlayers);
    }
  };

  const addSavedPlayer = (name: string) => {
    // Find first empty slot or add new
    const emptyIndex = players.findIndex((p) => !p.trim());
    if (emptyIndex !== -1) {
      updatePlayer(emptyIndex, name);
    } else if (players.length < MAX_PLAYERS) {
      setPlayers([...players, name]);
    }
  };

  const handleContinue = () => {
    const filledPlayers = players.filter((p) => p.trim());

    if (filledPlayers.length < MIN_PLAYERS) {
      setError(`Mindestens ${MIN_PLAYERS} Spieler benötigt`);
      return;
    }

    // Check for duplicate names
    const lowerNames = filledPlayers.map((p) => p.trim().toLowerCase());
    const uniqueNames = new Set(lowerNames);
    if (uniqueNames.size !== lowerNames.length) {
      setError('Jeder Spieler braucht einen eindeutigen Namen');
      return;
    }

    // Store player names in URL params
    router.push({
      pathname: '/setup',
      params: { players: filledPlayers.map((p) => p.trim()).join(',') },
    });
  };

  // Sort saved players by usage
  const sortedSavedPlayers = [...savedPlayers]
    .sort((a, b) => b.usageCount - a.usageCount)
    .slice(0, 10);

  // Filter out already added players
  const availableSavedPlayers = sortedSavedPlayers.filter(
    (sp) => !players.some((p) => p.trim().toLowerCase() === sp.name.toLowerCase())
  );

  const filledCount = players.filter((p) => p.trim()).length;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <ScrollView style={styles.flex} contentContainerStyle={styles.scrollContent}>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Spieler ({filledCount}/{MAX_PLAYERS})
          </Text>

          {players.map((player, index) => (
            <View key={index} style={styles.inputRow}>
              <TextInput
                mode="outlined"
                label={`Spieler ${index + 1}`}
                value={player}
                onChangeText={(text) => updatePlayer(index, text)}
                style={styles.input}
                autoCapitalize="words"
              />
              {players.length > MIN_PLAYERS && (
                <IconButton
                  icon="close"
                  size={20}
                  onPress={() => removePlayer(index)}
                />
              )}
            </View>
          ))}

          {players.length < MAX_PLAYERS && (
            <Button
              mode="text"
              onPress={addPlayer}
              icon="plus"
              style={styles.addButton}
            >
              Spieler hinzufügen
            </Button>
          )}

          {availableSavedPlayers.length > 0 && (
            <View style={styles.savedSection}>
              <Text variant="titleSmall" style={styles.savedTitle}>
                💾 Gespeicherte Spieler
              </Text>
              <View style={styles.chipContainer}>
                {availableSavedPlayers.map((sp) => (
                  <Chip
                    key={sp.id}
                    onPress={() => addSavedPlayer(sp.name)}
                    style={styles.chip}
                  >
                    {sp.name}
                  </Chip>
                ))}
              </View>
            </View>
          )}

          {error && (
            <Text variant="bodyMedium" style={[styles.error, { color: theme.colors.error }]}>
              {error}
            </Text>
          )}
        </ScrollView>

        <View style={styles.footer}>
          <Button
            mode="contained"
            onPress={handleContinue}
            disabled={filledCount < MIN_PLAYERS}
            style={styles.continueButton}
            contentStyle={styles.continueButtonContent}
          >
            Alle eingegeben →
          </Button>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  input: {
    flex: 1,
  },
  addButton: {
    marginTop: 8,
  },
  savedSection: {
    marginTop: 24,
  },
  savedTitle: {
    marginBottom: 12,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    marginBottom: 4,
  },
  error: {
    marginTop: 16,
    textAlign: 'center',
  },
  footer: {
    padding: 16,
    paddingBottom: 8,
  },
  continueButton: {
    borderRadius: 12,
  },
  continueButtonContent: {
    paddingVertical: 6,
  },
});
