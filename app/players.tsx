import { useState } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Pressable } from 'react-native';
import { TextInput, Text, Surface } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGameStore } from '../src/store/gameStore';
import { PlayerAvatar } from '../components/PlayerAvatar';

const MIN_PLAYERS = 3;
const MAX_PLAYERS = 12;

export default function PlayersScreen() {
  const router = useRouter();
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

    const lowerNames = filledPlayers.map((p) => p.trim().toLowerCase());
    const uniqueNames = new Set(lowerNames);
    if (uniqueNames.size !== lowerNames.length) {
      setError('Jeder Spieler braucht einen eindeutigen Namen');
      return;
    }

    router.push({
      pathname: '/setup',
      params: { players: filledPlayers.map((p) => p.trim()).join(',') },
    });
  };

  const sortedSavedPlayers = [...savedPlayers]
    .sort((a, b) => b.usageCount - a.usageCount)
    .slice(0, 10);

  const availableSavedPlayers = sortedSavedPlayers.filter(
    (sp) => !players.some((p) => p.trim().toLowerCase() === sp.name.toLowerCase())
  );

  const filledCount = players.filter((p) => p.trim()).length;

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['bottom']}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.flex}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerEmoji}>👥</Text>
            <Text style={styles.headerTitle}>Wer spielt mit?</Text>
            <View style={styles.counterBadge}>
              <Text style={styles.counterText}>{filledCount} / {MAX_PLAYERS}</Text>
            </View>
          </View>

          <ScrollView style={styles.flex} contentContainerStyle={styles.scrollContent}>
            {/* Player Inputs */}
            {players.map((player, index) => (
              <Surface key={index} style={styles.playerCard} elevation={2}>
                <View style={styles.playerRow}>
                  <PlayerAvatar playerIndex={index} size={44} />
                  <TextInput
                    mode="flat"
                    placeholder={`Spieler ${index + 1}`}
                    value={player}
                    onChangeText={(text) => updatePlayer(index, text)}
                    style={styles.input}
                    autoCapitalize="words"
                    underlineColor="transparent"
                    activeUnderlineColor="#4ECDC4"
                  />
                  {players.length > MIN_PLAYERS && (
                    <Pressable
                      onPress={() => removePlayer(index)}
                      style={styles.removeButton}
                    >
                      <Text style={styles.removeText}>✕</Text>
                    </Pressable>
                  )}
                </View>
              </Surface>
            ))}

            {/* Add Player Button */}
            {players.length < MAX_PLAYERS && (
              <Pressable onPress={addPlayer} style={styles.addButton}>
                <Text style={styles.addButtonEmoji}>➕</Text>
                <Text style={styles.addButtonText}>Noch jemand!</Text>
              </Pressable>
            )}

            {/* Saved Players */}
            {availableSavedPlayers.length > 0 && (
              <View style={styles.savedSection}>
                <Text style={styles.savedTitle}>⭐ Bekannte Gesichter</Text>
                <View style={styles.chipContainer}>
                  {availableSavedPlayers.map((sp) => (
                    <Pressable
                      key={sp.id}
                      onPress={() => addSavedPlayer(sp.name)}
                      style={({ pressed }) => [
                        styles.savedChip,
                        pressed && styles.savedChipPressed,
                      ]}
                    >
                      <Text style={styles.savedChipText}>{sp.name}</Text>
                    </Pressable>
                  ))}
                </View>
              </View>
            )}

            {/* Error */}
            {error && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>⚠️ {error}</Text>
              </View>
            )}
          </ScrollView>

          {/* Continue Button */}
          <View style={styles.footer}>
            <Pressable
              onPress={handleContinue}
              disabled={filledCount < MIN_PLAYERS}
              style={({ pressed }) => [
                styles.continueButton,
                filledCount < MIN_PLAYERS && styles.continueButtonDisabled,
                pressed && styles.continueButtonPressed,
              ]}
            >
              <Text style={[
                styles.continueText,
                filledCount < MIN_PLAYERS && styles.continueTextDisabled,
              ]}>
                Weiter zum Spiel! 🎯
              </Text>
            </Pressable>
            {filledCount < MIN_PLAYERS && (
              <Text style={styles.hintText}>
                Noch {MIN_PLAYERS - filledCount} Spieler nötig
              </Text>
            )}
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4ECDC4',
  },
  safeArea: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  headerEmoji: {
    fontSize: 40,
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 8,
  },
  counterBadge: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  counterText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 24,
  },
  playerCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 12,
    overflow: 'hidden',
  },
  playerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 12,
    gap: 8,
  },
  input: {
    flex: 1,
    backgroundColor: 'transparent',
    fontSize: 18,
  },
  removeButton: {
    padding: 16,
  },
  removeText: {
    fontSize: 18,
    color: '#FF6B6B',
    fontWeight: '600',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: 16,
    paddingVertical: 16,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.4)',
    borderStyle: 'dashed',
    gap: 8,
  },
  addButtonEmoji: {
    fontSize: 20,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  savedSection: {
    marginTop: 24,
  },
  savedTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 12,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  savedChip: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  savedChipPressed: {
    backgroundColor: '#FFE66D',
    transform: [{ scale: 0.95 }],
  },
  savedChipText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
  errorContainer: {
    backgroundColor: '#FF6B6B',
    borderRadius: 12,
    padding: 14,
    marginTop: 16,
  },
  errorText: {
    color: '#fff',
    fontWeight: '600',
    textAlign: 'center',
    fontSize: 15,
  },
  footer: {
    padding: 16,
    paddingBottom: 8,
  },
  continueButton: {
    backgroundColor: '#FFE66D',
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  continueButtonDisabled: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    shadowOpacity: 0,
    elevation: 0,
  },
  continueButtonPressed: {
    transform: [{ scale: 0.98 }],
  },
  continueText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#333',
  },
  continueTextDisabled: {
    color: 'rgba(255,255,255,0.7)',
  },
  hintText: {
    textAlign: 'center',
    color: 'rgba(255,255,255,0.8)',
    marginTop: 8,
    fontSize: 14,
  },
});
