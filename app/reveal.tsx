import { useState } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Button, Card, Text, useTheme } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGameStore } from '../src/store/gameStore';

type RevealState = 'waiting' | 'revealing' | 'confirmed';

export default function RevealScreen() {
  const router = useRouter();
  const theme = useTheme();

  const currentGame = useGameStore((state) => state.currentGame);
  const markPlayerAsSeen = useGameStore((state) => state.markPlayerAsSeen);
  const setCurrentPlayerIndex = useGameStore((state) => state.setCurrentPlayerIndex);
  const setPhase = useGameStore((state) => state.setPhase);

  const [revealState, setRevealState] = useState<RevealState>('waiting');

  if (!currentGame) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.center}>
          <Text>Kein aktives Spiel</Text>
          <Button onPress={() => router.replace('/')}>Zurück zum Start</Button>
        </View>
      </SafeAreaView>
    );
  }

  const currentPlayer = currentGame.players[currentGame.currentPlayerIndex];
  const isLastPlayer = currentGame.currentPlayerIndex === currentGame.players.length - 1;
  const allPlayersSeen = currentGame.players.every((p) => p.hasSeenRole);

  const handleTapToReveal = () => {
    setRevealState('revealing');
  };

  const handleConfirm = () => {
    markPlayerAsSeen(currentPlayer.id);

    if (isLastPlayer) {
      setPhase('discussion');
      router.replace('/discussion');
    } else {
      setCurrentPlayerIndex(currentGame.currentPlayerIndex + 1);
      setRevealState('waiting');
    }
  };

  const progressText = `${currentGame.currentPlayerIndex + 1} / ${currentGame.players.length}`;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.content}>
        {/* Progress */}
        <View style={styles.progress}>
          <Text variant="bodyMedium" style={styles.progressText}>
            {progressText}
          </Text>
        </View>

        {revealState === 'waiting' && (
          <>
            <View style={styles.center}>
              <Text variant="headlineMedium" style={styles.playerName}>
                {currentPlayer.name}
              </Text>
              <Text variant="bodyLarge" style={styles.instruction}>
                nimm das Handy
              </Text>
            </View>

            <Pressable
              onPress={handleTapToReveal}
              style={[styles.tapArea, { backgroundColor: theme.colors.primaryContainer }]}
            >
              <Text variant="titleLarge" style={{ color: theme.colors.onPrimaryContainer }}>
                👆 Tippe zum Aufdecken
              </Text>
            </Pressable>
          </>
        )}

        {revealState === 'revealing' && (
          <View style={styles.revealContent}>
            {currentPlayer.isImposter ? (
              <Card style={[styles.roleCard, { backgroundColor: theme.colors.errorContainer }]}>
                <Card.Content style={styles.roleCardContent}>
                  <Text variant="displaySmall" style={styles.roleEmoji}>
                    🕵️
                  </Text>
                  <Text
                    variant="headlineMedium"
                    style={[styles.roleText, { color: theme.colors.onErrorContainer }]}
                  >
                    Du bist der Imposter!
                  </Text>
                  <Text
                    variant="bodyLarge"
                    style={[styles.roleHint, { color: theme.colors.onErrorContainer }]}
                  >
                    Du kennst das Wort nicht.{'\n'}
                    Versuche unentdeckt zu bleiben!
                  </Text>
                </Card.Content>
              </Card>
            ) : (
              <Card style={[styles.roleCard, { backgroundColor: theme.colors.primaryContainer }]}>
                <Card.Content style={styles.roleCardContent}>
                  <Text variant="displaySmall" style={styles.roleEmoji}>
                    {currentGame.category.icon}
                  </Text>
                  <Text
                    variant="bodyMedium"
                    style={[styles.categoryLabel, { color: theme.colors.onPrimaryContainer }]}
                  >
                    Das geheime Wort ist:
                  </Text>
                  <Text
                    variant="displaySmall"
                    style={[styles.wordText, { color: theme.colors.onPrimaryContainer }]}
                  >
                    {currentGame.selectedWord}
                  </Text>
                  <Text
                    variant="bodyMedium"
                    style={[styles.roleHint, { color: theme.colors.onPrimaryContainer }]}
                  >
                    Hilf den anderen, den Imposter zu finden!
                  </Text>
                </Card.Content>
              </Card>
            )}

            <Button
              mode="contained"
              onPress={handleConfirm}
              style={styles.confirmButton}
              contentStyle={styles.confirmButtonContent}
            >
              ✓ Verstanden, weiter
            </Button>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progress: {
    alignItems: 'center',
    marginBottom: 20,
  },
  progressText: {
    opacity: 0.6,
  },
  playerName: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  instruction: {
    opacity: 0.7,
  },
  tapArea: {
    padding: 40,
    borderRadius: 20,
    alignItems: 'center',
    marginTop: 40,
  },
  revealContent: {
    flex: 1,
    justifyContent: 'center',
  },
  roleCard: {
    marginBottom: 24,
  },
  roleCardContent: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  roleEmoji: {
    marginBottom: 16,
  },
  roleText: {
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
  },
  categoryLabel: {
    opacity: 0.8,
    marginBottom: 8,
  },
  wordText: {
    fontWeight: 'bold',
    marginBottom: 16,
  },
  roleHint: {
    textAlign: 'center',
    opacity: 0.8,
    lineHeight: 22,
  },
  confirmButton: {
    borderRadius: 12,
  },
  confirmButtonContent: {
    paddingVertical: 8,
  },
});
