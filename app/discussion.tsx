import { View, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Text, Surface } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGameStore } from '../src/store/gameStore';
import { PlayerAvatar } from '../components/PlayerAvatar';

export default function DiscussionScreen() {
  const router = useRouter();

  const currentGame = useGameStore((state) => state.currentGame);
  const setPhase = useGameStore((state) => state.setPhase);

  if (!currentGame) {
    return (
      <View style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.center}>
            <Text style={styles.errorText}>Kein aktives Spiel</Text>
            <Pressable onPress={() => router.replace('/')} style={styles.backButton}>
              <Text style={styles.backButtonText}>🏠 Zurück</Text>
            </Pressable>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  const handleEndVoting = () => {
    setPhase('result');
    router.replace('/result');
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['bottom']}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerEmoji}>🗣️</Text>
          <Text style={styles.headerTitle}>Diskussion!</Text>
          <Text style={styles.headerSubtitle}>Wer ist der Imposter?</Text>
        </View>

        <ScrollView style={styles.flex} contentContainerStyle={styles.scrollContent}>
          {/* Instructions */}
          <Surface style={styles.instructionCard} elevation={2}>
            <View style={styles.instructionRow}>
              <Text style={styles.instructionEmoji}>💬</Text>
              <Text style={styles.instructionText}>
                Jeder beschreibt das Wort – aber nicht zu genau!
              </Text>
            </View>
            <View style={styles.instructionRow}>
              <Text style={styles.instructionEmoji}>🕵️</Text>
              <Text style={styles.instructionText}>
                Der Imposter tut nur so als würde er es kennen...
              </Text>
            </View>
          </Surface>

          {/* Players */}
          <Text style={styles.sectionTitle}>👥 Spieler</Text>
          <View style={styles.playersGrid}>
            {currentGame.players.map((player, index) => (
              <Surface key={player.id} style={styles.playerCard} elevation={2}>
                <PlayerAvatar playerIndex={index} size={48} />
                <Text style={styles.playerName}>{player.name}</Text>
                <View style={styles.playerNumber}>
                  <Text style={styles.playerNumberText}>{index + 1}</Text>
                </View>
              </Surface>
            ))}
          </View>

          {/* Tips */}
          <Surface style={styles.tipsCard} elevation={1}>
            <Text style={styles.tipsTitle}>💡 Tipps</Text>
            <View style={styles.tipsList}>
              <Text style={styles.tipItem}>• Stellt Nachfragen!</Text>
              <Text style={styles.tipItem}>• Wer zögert verdächtig?</Text>
              <Text style={styles.tipItem}>• Wer sagt was Seltsames?</Text>
              <Text style={styles.tipItem}>• Vertraut eurem Bauchgefühl!</Text>
            </View>
          </Surface>
        </ScrollView>

        {/* Vote Button */}
        <View style={styles.footer}>
          <Text style={styles.footerHint}>
            Habt ihr den Imposter gefunden? 🤔
          </Text>
          <Pressable
            onPress={handleEndVoting}
            style={({ pressed }) => [
              styles.voteButton,
              pressed && styles.voteButtonPressed,
            ]}
          >
            <Text style={styles.voteButtonText}>🗳️ Auflösung zeigen!</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F39C12',
  },
  safeArea: {
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
  errorText: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 16,
  },
  backButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  headerEmoji: {
    fontSize: 44,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 2,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 24,
  },
  instructionCard: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 16,
    marginBottom: 20,
    gap: 12,
  },
  instructionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  instructionEmoji: {
    fontSize: 28,
  },
  instructionText: {
    flex: 1,
    fontSize: 15,
    color: '#333',
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 12,
  },
  playersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  playerCard: {
    width: '30%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    position: 'relative',
    gap: 4,
  },
  playerName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  playerNumber: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#F39C12',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playerNumberText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#fff',
  },
  tipsCard: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 16,
    padding: 16,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginBottom: 10,
  },
  tipsList: {
    gap: 6,
  },
  tipItem: {
    fontSize: 14,
    color: '#555',
  },
  footer: {
    padding: 16,
    paddingBottom: 8,
  },
  footerHint: {
    textAlign: 'center',
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 10,
    fontSize: 15,
  },
  voteButton: {
    backgroundColor: '#E74C3C',
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },
  voteButtonPressed: {
    transform: [{ scale: 0.98 }],
  },
  voteButtonText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#fff',
  },
});
