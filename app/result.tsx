import { useEffect, useRef } from 'react';
import { View, StyleSheet, Pressable, Animated } from 'react-native';
import { Text, Surface } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGameStore } from '../src/store/gameStore';
import { PlayerAvatar } from '../components/PlayerAvatar';

const CONFETTI_EMOJIS = ['🎉', '🎊', '✨', '⭐', '🌟', '💫'];

export default function ResultScreen() {
  const router = useRouter();

  const currentGame = useGameStore((state) => state.currentGame);
  const endGame = useGameStore((state) => state.endGame);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const bounceAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Dramatic reveal animation
    Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
        Animated.spring(scaleAnim, { toValue: 1, friction: 5, useNativeDriver: true }),
      ]),
      Animated.loop(
        Animated.sequence([
          Animated.timing(bounceAnim, { toValue: -10, duration: 400, useNativeDriver: true }),
          Animated.timing(bounceAnim, { toValue: 0, duration: 400, useNativeDriver: true }),
        ])
      ),
    ]).start();
  }, [fadeAnim, scaleAnim, bounceAnim]);

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

  const imposters = currentGame.players.filter((p) => p.isImposter);
  const innocents = currentGame.players.filter((p) => !p.isImposter);

  const handlePlayAgain = () => {
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
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* Confetti Header */}
        <View style={styles.confettiRow}>
          {CONFETTI_EMOJIS.map((emoji, i) => (
            <Text key={i} style={styles.confettiEmoji}>{emoji}</Text>
          ))}
        </View>

        <Animated.View style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }]
          }
        ]}>
          {/* Header */}
          <View style={styles.header}>
            <Animated.Text style={[
              styles.headerEmoji,
              { transform: [{ translateY: bounceAnim }] }
            ]}>
              🎭
            </Animated.Text>
            <Text style={styles.headerTitle}>Auflösung!</Text>
          </View>

          {/* Imposter Reveal Card */}
          <Surface style={styles.imposterCard} elevation={4}>
            <View style={styles.imposterHeader}>
              <Text style={styles.imposterEmoji}>🕵️</Text>
              <Text style={styles.imposterLabel}>
                {imposters.length === 1 ? 'Der Imposter war...' : 'Die Imposter waren...'}
              </Text>
            </View>
            <View style={styles.imposterNames}>
              {imposters.map((player) => {
                return (
                  <View key={player.id} style={styles.imposterNameBadge}>
                    <PlayerAvatar playerIndex={player.avatarIndex} size={32} />
                    <Text style={styles.imposterName}>{player.name}</Text>
                  </View>
                );
              })}
            </View>
          </Surface>

          {/* Secret Word Card */}
          <Surface style={styles.wordCard} elevation={3}>
            <Text style={styles.wordLabel}>
              {currentGame.category.icon} Das geheime Wort war:
            </Text>
            <Text style={styles.secretWord}>{currentGame.selectedWord}</Text>
            <Text style={styles.categoryName}>
              Kategorie: {currentGame.category.name}
            </Text>
          </Surface>

          {/* Innocents */}
          <View style={styles.innocentsSection}>
            <Text style={styles.innocentsTitle}>✅ Unschuldig:</Text>
            <View style={styles.innocentsGrid}>
              {innocents.map((player) => {
                return (
                  <View key={player.id} style={styles.innocentChip}>
                    <PlayerAvatar playerIndex={player.avatarIndex} size={24} />
                    <Text style={styles.innocentName}>{player.name}</Text>
                  </View>
                );
              })}
            </View>
          </View>
        </Animated.View>

        {/* Buttons */}
        <View style={styles.footer}>
          <Pressable
            onPress={handlePlayAgain}
            style={({ pressed }) => [
              styles.playAgainButton,
              pressed && styles.buttonPressed,
            ]}
          >
            <Text style={styles.playAgainText}>🔄 Nochmal spielen!</Text>
          </Pressable>
          <Pressable
            onPress={handleNewGame}
            style={({ pressed }) => [
              styles.newGameButton,
              pressed && styles.buttonPressed,
            ]}
          >
            <Text style={styles.newGameText}>🏠 Neue Spieler</Text>
          </Pressable>
        </View>

        {/* Bottom Confetti */}
        <View style={styles.confettiRow}>
          {CONFETTI_EMOJIS.slice().reverse().map((emoji, i) => (
            <Text key={i} style={styles.confettiEmoji}>{emoji}</Text>
          ))}
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#27AE60',
  },
  safeArea: {
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
  confettiRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 8,
  },
  confettiEmoji: {
    fontSize: 28,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 16,
  },
  headerEmoji: {
    fontSize: 60,
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: '#fff',
  },
  imposterCard: {
    backgroundColor: '#E74C3C',
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 16,
  },
  imposterHeader: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  imposterEmoji: {
    fontSize: 50,
    marginBottom: 4,
  },
  imposterLabel: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '600',
  },
  imposterNames: {
    backgroundColor: 'rgba(0,0,0,0.15)',
    padding: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
  },
  imposterNameBadge: {
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  imposterName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#E74C3C',
  },
  wordCard: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 18,
    alignItems: 'center',
    marginBottom: 16,
  },
  wordLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
    marginBottom: 8,
  },
  secretWord: {
    fontSize: 32,
    fontWeight: '900',
    color: '#2C3E50',
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 13,
    color: '#888',
  },
  innocentsSection: {
    marginBottom: 16,
  },
  innocentsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 10,
  },
  innocentsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  innocentChip: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  innocentName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  footer: {
    padding: 16,
    gap: 12,
  },
  playAgainButton: {
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
  playAgainText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#333',
  },
  newGameButton: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  newGameText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  buttonPressed: {
    transform: [{ scale: 0.98 }],
  },
});
