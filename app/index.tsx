import { View, StyleSheet, Pressable, Animated } from 'react-native';
import { Text, Surface } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRef, useEffect } from 'react';

export default function HomeScreen() {
  const router = useRouter();
  const bounceAnim = useRef(new Animated.Value(1)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Floating animation für Logo
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -8,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [floatAnim]);

  const handlePressIn = () => {
    Animated.spring(bounceAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(bounceAnim, {
      toValue: 1,
      friction: 3,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View style={styles.container}>
      <View style={styles.gradient}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.content}>
            {/* Hero Section - Kinderfreundlich */}
            <View style={styles.hero}>
              <Animated.View
                style={[
                  styles.logoContainer,
                  { transform: [{ translateY: floatAnim }] }
                ]}
              >
                <Text style={styles.logoEmoji}>🕵️</Text>
              </Animated.View>
              <Text style={styles.title}>IMPOSTER</Text>
              <View style={styles.subtitleContainer}>
                <Text style={styles.subtitle}>🎉 Das Familien-Ratespiel 🎉</Text>
              </View>
            </View>

            {/* Info Card - Größer & bunter */}
            <Surface style={styles.infoCard} elevation={3}>
              <View style={styles.infoEmojis}>
                <Text style={styles.infoEmojiText}>🤫</Text>
                <Text style={styles.infoEmojiText}>🔍</Text>
                <Text style={styles.infoEmojiText}>🎭</Text>
              </View>
              <Text style={styles.infoText}>
                Wer ist der Imposter?{'\n'}
                Er kennt das geheime Wort nicht!{'\n'}
                Findet ihn - aber psst, er hört zu! 🤭
              </Text>
            </Surface>

            {/* Main Button - Extra groß für Kinder */}
            <Animated.View style={{ transform: [{ scale: bounceAnim }] }}>
              <Pressable
                onPress={() => router.push('/players')}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                style={styles.mainButton}
              >
                <View style={styles.mainButtonGradient}>
                  <Text style={styles.mainButtonEmoji}>🎮</Text>
                  <Text style={styles.mainButtonText}>Spielen!</Text>
                </View>
              </Pressable>
            </Animated.View>

            {/* Secondary Buttons - Größere Touch-Targets */}
            <View style={styles.secondaryButtons}>
              <Pressable
                onPress={() => router.push('/custom-lists')}
                style={({ pressed }) => [
                  styles.secondaryButton,
                  pressed && styles.secondaryButtonPressed,
                ]}
              >
                <Text style={styles.secondaryButtonIcon}>📝</Text>
                <Text style={styles.secondaryButtonText}>Eigene{'\n'}Wörter</Text>
              </Pressable>

              <Pressable
                onPress={() => router.push('/saved-players')}
                style={({ pressed }) => [
                  styles.secondaryButton,
                  pressed && styles.secondaryButtonPressed,
                ]}
              >
                <Text style={styles.secondaryButtonIcon}>👨‍👩‍👧‍👦</Text>
                <Text style={styles.secondaryButtonText}>Mitspieler</Text>
              </Pressable>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
              <View style={styles.badge}>
                <Text style={styles.badgeEmoji}>👶</Text>
                <Text style={styles.badgeText}>Ab 7 Jahren</Text>
              </View>
              <View style={styles.badge}>
                <Text style={styles.badgeEmoji}>👥</Text>
                <Text style={styles.badgeText}>3-12 Spieler</Text>
              </View>
            </View>
          </View>
        </SafeAreaView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    backgroundColor: '#4ECDC4',
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
  },
  hero: {
    alignItems: 'center',
    marginTop: 10,
  },
  logoContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 4,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  logoEmoji: {
    fontSize: 60,
  },
  title: {
    fontSize: 38,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: 3,
    marginBottom: 4,
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  subtitleContainer: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 20,
    marginVertical: 16,
  },
  infoEmojis: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 12,
  },
  infoEmojiText: {
    fontSize: 32,
  },
  infoText: {
    fontSize: 17,
    lineHeight: 26,
    textAlign: 'center',
    color: '#444',
    fontWeight: '500',
  },
  mainButton: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 8,
  },
  mainButtonGradient: {
    paddingVertical: 22,
    paddingHorizontal: 32,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    backgroundColor: '#FFE66D',
    borderRadius: 20,
  },
  mainButtonEmoji: {
    fontSize: 36,
  },
  mainButtonText: {
    fontSize: 28,
    fontWeight: '800',
    color: '#333',
  },
  secondaryButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: 18,
    paddingVertical: 18,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  secondaryButtonPressed: {
    backgroundColor: 'rgba(255,255,255,0.4)',
    transform: [{ scale: 0.98 }],
  },
  secondaryButtonIcon: {
    fontSize: 32,
    marginBottom: 6,
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginTop: 12,
  },
  badge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  badgeEmoji: {
    fontSize: 16,
  },
  badgeText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
});
