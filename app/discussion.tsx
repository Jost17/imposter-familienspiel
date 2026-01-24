import { View, StyleSheet, ScrollView } from 'react-native';
import { Button, Card, Text, List, useTheme, Divider } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGameStore } from '../src/store/gameStore';

export default function DiscussionScreen() {
  const router = useRouter();
  const theme = useTheme();

  const currentGame = useGameStore((state) => state.currentGame);
  const setPhase = useGameStore((state) => state.setPhase);

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

  const handleEndVoting = () => {
    setPhase('result');
    router.replace('/result');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['bottom']}>
      <ScrollView style={styles.flex} contentContainerStyle={styles.scrollContent}>
        <Card style={styles.infoCard}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.infoTitle}>
              🗣️ Diskussionsrunde
            </Text>
            <Text variant="bodyMedium" style={styles.infoText}>
              Jeder beschreibt das Wort mit einem Hinweis.{'\n'}
              Passt auf: Der Imposter versucht unentdeckt zu bleiben!
            </Text>
          </Card.Content>
        </Card>

        <Card style={styles.playersCard}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              👥 Spieler in dieser Runde
            </Text>
            <Divider style={styles.divider} />
            {currentGame.players.map((player, index) => (
              <List.Item
                key={player.id}
                title={player.name}
                left={() => (
                  <View style={styles.playerNumber}>
                    <Text variant="bodyMedium">{index + 1}</Text>
                  </View>
                )}
                style={styles.playerItem}
              />
            ))}
          </Card.Content>
        </Card>

        <Card style={styles.tipsCard}>
          <Card.Content>
            <Text variant="titleSmall" style={styles.tipsTitle}>
              💡 Tipps für die Diskussion
            </Text>
            <Text variant="bodySmall" style={styles.tip}>
              • Jeder gibt einen Hinweis zum Wort
            </Text>
            <Text variant="bodySmall" style={styles.tip}>
              • Nicht zu offensichtlich sein!
            </Text>
            <Text variant="bodySmall" style={styles.tip}>
              • Stellt Rückfragen
            </Text>
            <Text variant="bodySmall" style={styles.tip}>
              • Achtet auf verdächtiges Verhalten
            </Text>
          </Card.Content>
        </Card>
      </ScrollView>

      <View style={styles.footer}>
        <Text variant="bodySmall" style={styles.footerHint}>
          Wenn ihr bereit seid, stimmt darüber ab, wer der Imposter ist.
        </Text>
        <Button
          mode="contained"
          onPress={handleEndVoting}
          style={styles.endButton}
          contentStyle={styles.endButtonContent}
        >
          🗳️ Abstimmung beenden
        </Button>
      </View>
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
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    padding: 16,
  },
  infoCard: {
    marginBottom: 16,
  },
  infoTitle: {
    marginBottom: 8,
  },
  infoText: {
    lineHeight: 22,
    opacity: 0.8,
  },
  playersCard: {
    marginBottom: 16,
  },
  sectionTitle: {
    marginBottom: 8,
  },
  divider: {
    marginBottom: 8,
  },
  playerItem: {
    paddingVertical: 4,
  },
  playerNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(103, 80, 164, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  tipsCard: {
    backgroundColor: 'rgba(103, 80, 164, 0.05)',
  },
  tipsTitle: {
    marginBottom: 8,
  },
  tip: {
    marginBottom: 4,
    opacity: 0.7,
  },
  footer: {
    padding: 16,
    paddingBottom: 8,
  },
  footerHint: {
    textAlign: 'center',
    opacity: 0.6,
    marginBottom: 12,
  },
  endButton: {
    borderRadius: 12,
  },
  endButtonContent: {
    paddingVertical: 6,
  },
});
