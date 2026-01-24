import { View, StyleSheet } from 'react-native';
import { Button, Card, Text, useTheme, Chip } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGameStore } from '../src/store/gameStore';

export default function ResultScreen() {
  const router = useRouter();
  const theme = useTheme();

  const currentGame = useGameStore((state) => state.currentGame);
  const endGame = useGameStore((state) => state.endGame);

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

  const imposters = currentGame.players.filter((p) => p.isImposter);
  const innocents = currentGame.players.filter((p) => !p.isImposter);

  const handlePlayAgain = () => {
    // Keep same players, go to setup
    const playerNames = currentGame.players.map((p) => p.name);
    endGame();
    router.replace({
      pathname: '/setup',
      params: { players: playerNames.join(',') },
    });
  };

  const handleNewGame = () => {
    endGame();
    router.replace('/');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.content}>
        {/* Reveal Header */}
        <View style={styles.header}>
          <Text variant="displaySmall" style={styles.emoji}>
            🎭
          </Text>
          <Text variant="headlineMedium" style={styles.title}>
            Auflösung
          </Text>
        </View>

        {/* Imposters Card */}
        <Card style={[styles.card, { backgroundColor: theme.colors.errorContainer }]}>
          <Card.Content>
            <Text
              variant="titleMedium"
              style={[styles.cardTitle, { color: theme.colors.onErrorContainer }]}
            >
              🕵️ {imposters.length === 1 ? 'Der Imposter war:' : 'Die Imposter waren:'}
            </Text>
            <View style={styles.namesList}>
              {imposters.map((player) => (
                <Chip
                  key={player.id}
                  style={[styles.nameChip, { backgroundColor: theme.colors.error }]}
                  textStyle={{ color: theme.colors.onError }}
                >
                  {player.name}
                </Chip>
              ))}
            </View>
          </Card.Content>
        </Card>

        {/* Word Card */}
        <Card style={[styles.card, { backgroundColor: theme.colors.primaryContainer }]}>
          <Card.Content>
            <Text
              variant="titleMedium"
              style={[styles.cardTitle, { color: theme.colors.onPrimaryContainer }]}
            >
              {currentGame.category.icon} Das geheime Wort war:
            </Text>
            <Text
              variant="headlineLarge"
              style={[styles.word, { color: theme.colors.onPrimaryContainer }]}
            >
              {currentGame.selectedWord}
            </Text>
            <Text
              variant="bodyMedium"
              style={[styles.categoryName, { color: theme.colors.onPrimaryContainer }]}
            >
              Kategorie: {currentGame.category.name}
            </Text>
          </Card.Content>
        </Card>

        {/* Innocents */}
        <Card style={styles.innocentsCard}>
          <Card.Content>
            <Text variant="titleSmall" style={styles.innocentsTitle}>
              ✓ Unschuldig:
            </Text>
            <View style={styles.namesList}>
              {innocents.map((player) => (
                <Chip key={player.id} style={styles.innocentChip}>
                  {player.name}
                </Chip>
              ))}
            </View>
          </Card.Content>
        </Card>

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            onPress={handlePlayAgain}
            style={styles.button}
            contentStyle={styles.buttonContent}
          >
            🔄 Nochmal spielen
          </Button>
          <Button
            mode="outlined"
            onPress={handleNewGame}
            style={styles.button}
          >
            🏠 Neues Spiel
          </Button>
        </View>
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
  header: {
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 20,
  },
  emoji: {
    marginBottom: 8,
  },
  title: {
    fontWeight: 'bold',
  },
  card: {
    marginBottom: 16,
  },
  cardTitle: {
    marginBottom: 12,
  },
  namesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  nameChip: {
    marginRight: 4,
  },
  innocentChip: {
    marginRight: 4,
  },
  word: {
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  categoryName: {
    textAlign: 'center',
    opacity: 0.8,
  },
  innocentsCard: {
    marginBottom: 24,
  },
  innocentsTitle: {
    marginBottom: 8,
    opacity: 0.7,
  },
  buttonContainer: {
    gap: 12,
    marginTop: 'auto',
  },
  button: {
    borderRadius: 12,
  },
  buttonContent: {
    paddingVertical: 6,
  },
});
