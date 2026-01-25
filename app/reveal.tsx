import { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, Pressable, Animated } from 'react-native';
import { Text, Surface } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGameStore } from '../src/store/gameStore';
import { PlayerAvatar, getPlayerAvatarName } from '../components/PlayerAvatar';

type RevealState = 'waiting' | 'revealing';

export default function RevealScreen() {
  const router = useRouter();

  const currentGame = useGameStore((state) => state.currentGame);
  const markPlayerAsSeen = useGameStore((state) => state.markPlayerAsSeen);
  const setCurrentPlayerIndex = useGameStore((state) => state.setCurrentPlayerIndex);
  const setPhase = useGameStore((state) => state.setPhase);

  const [revealState, setRevealState] = useState<RevealState>('waiting');

  const pulseAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    // Pulse animation for tap area
    if (revealState === 'waiting') {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.05, duration: 800, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
        ])
      ).start();
    }
  }, [revealState, pulseAnim]);

  useEffect(() => {
    // Reveal animation
    if (revealState === 'revealing') {
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.spring(scaleAnim, { toValue: 1, friction: 6, useNativeDriver: true }),
      ]).start();
    } else {
      fadeAnim.setValue(0);
      scaleAnim.setValue(0.8);
    }
  }, [revealState, fadeAnim, scaleAnim]);

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

  const currentPlayer = currentGame.players[currentGame.currentPlayerIndex];
  const isLastPlayer = currentGame.currentPlayerIndex === currentGame.players.length - 1;

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

  const progress = currentGame.currentPlayerIndex + 1;
  const total = currentGame.players.length;

  return (
    <View style={[styles.container, currentPlayer.isImposter && revealState === 'revealing' ? styles.containerImposter : null]}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          {/* Progress Bar */}
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${(progress / total) * 100}%` }]} />
            </View>
            <Text style={styles.progressText}>{progress} von {total}</Text>
          </View>

          {revealState === 'waiting' && (
            <View style={styles.waitingContent}>
              <View style={styles.playerCallout}>
                <PlayerAvatar playerIndex={currentPlayer.avatarIndex} size={80} style={styles.calloutAvatar} />
                <Text style={styles.playerName}>{currentPlayer.name}</Text>
                <Text style={styles.instruction}>Nimm das Handy!</Text>
              </View>

              <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
                <Pressable onPress={handleTapToReveal} style={styles.tapArea}>
                  <Text style={styles.tapEmoji}>👆</Text>
                  <Text style={styles.tapText}>Tippe hier!</Text>
                  <Text style={styles.tapHint}>um deine Rolle zu sehen</Text>
                </Pressable>
              </Animated.View>

              <View style={styles.privacyHint}>
                <Text style={styles.privacyText}>🤫 Niemand darf mitlesen!</Text>
              </View>
            </View>
          )}

          {revealState === 'revealing' && (
            <Animated.View style={[
              styles.revealContent,
              { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }
            ]}>
              {currentPlayer.isImposter ? (
                <Surface style={styles.imposterCard} elevation={4}>
                  <View style={styles.imposterHeader}>
                    <PlayerAvatar playerIndex={currentPlayer.avatarIndex} size={70} style={styles.revealAvatar} />
                    <Text style={styles.imposterTitle}>DU BIST DER</Text>
                    <Text style={styles.imposterWord}>IMPOSTER!</Text>
                  </View>
                  <View style={styles.imposterInfo}>
                    <Text style={styles.imposterHint}>
                      😱 Du kennst das geheime Wort NICHT!
                    </Text>
                    <Text style={styles.imposterTip}>
                      💡 Tu so als würdest du es kennen...
                    </Text>
                  </View>
                </Surface>
              ) : (
                <Surface style={styles.innocentCard} elevation={4}>
                  <View style={styles.innocentHeader}>
                    <PlayerAvatar playerIndex={currentPlayer.avatarIndex} size={60} style={styles.revealAvatar} />
                    <Text style={styles.innocentLabel}>Das geheime Wort ist:</Text>
                  </View>
                  <View style={styles.wordContainer}>
                    <Text style={styles.secretWord}>{currentGame.selectedWord}</Text>
                  </View>
                  <View style={styles.innocentInfo}>
                    <Text style={styles.innocentHint}>
                      🔍 Finde den Imposter!
                    </Text>
                    <Text style={styles.innocentTip}>
                      💡 Gib Hinweise, aber nicht zu offensichtlich!
                    </Text>
                  </View>
                </Surface>
              )}

              <Pressable
                onPress={handleConfirm}
                style={({ pressed }) => [
                  styles.confirmButton,
                  pressed && styles.confirmButtonPressed,
                ]}
              >
                <Text style={styles.confirmText}>
                  {isLastPlayer ? '✅ Alle bereit - Los!' : '👍 Verstanden!'}
                </Text>
              </Pressable>
            </Animated.View>
          )}
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2C3E50',
  },
  containerImposter: {
    backgroundColor: '#E74C3C',
  },
  safeArea: {
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
  progressContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FFE66D',
    borderRadius: 4,
  },
  progressText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    marginTop: 8,
  },
  waitingContent: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: 20,
  },
  playerCallout: {
    alignItems: 'center',
  },
  calloutAvatar: {
    marginBottom: 12,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  playerName: {
    fontSize: 36,
    fontWeight: '900',
    color: '#fff',
    marginBottom: 4,
  },
  instruction: {
    fontSize: 20,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '500',
  },
  tapArea: {
    backgroundColor: '#FFE66D',
    borderRadius: 100,
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
  },
  tapEmoji: {
    fontSize: 50,
    marginBottom: 8,
  },
  tapText: {
    fontSize: 22,
    fontWeight: '800',
    color: '#333',
  },
  tapHint: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  privacyHint: {
    alignItems: 'center',
  },
  privacyText: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '500',
  },
  revealContent: {
    flex: 1,
    justifyContent: 'center',
  },
  imposterCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 20,
  },
  imposterHeader: {
    backgroundColor: '#E74C3C',
    padding: 24,
    alignItems: 'center',
  },
  revealAvatar: {
    marginBottom: 8,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.6)',
  },
  imposterTitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '600',
  },
  imposterWord: {
    fontSize: 36,
    fontWeight: '900',
    color: '#fff',
  },
  imposterInfo: {
    padding: 20,
    gap: 12,
  },
  imposterHint: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  imposterTip: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
  },
  innocentCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 20,
  },
  innocentHeader: {
    backgroundColor: '#27AE60',
    padding: 20,
    alignItems: 'center',
  },
  innocentLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '500',
  },
  wordContainer: {
    padding: 24,
    backgroundColor: '#F8F9FA',
    alignItems: 'center',
  },
  secretWord: {
    fontSize: 38,
    fontWeight: '900',
    color: '#2C3E50',
  },
  innocentInfo: {
    padding: 20,
    gap: 8,
  },
  innocentHint: {
    fontSize: 17,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  innocentTip: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  confirmButton: {
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
  confirmButtonPressed: {
    transform: [{ scale: 0.98 }],
  },
  confirmText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#333',
  },
});
