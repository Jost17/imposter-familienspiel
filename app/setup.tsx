import { useState, useMemo } from 'react';
import { View, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Text, Surface } from 'react-native-paper';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGameStore, getRecommendedImposterCount, getAllCategories } from '../src/store/gameStore';
import { defaultCategories, getDifficultyEmoji } from '../src/data/categories';
import { Category, Difficulty } from '../src/types';

export default function SetupScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ players: string }>();
  const playerNames = params.players?.split(',') || [];
  const playerCount = playerNames.length;

  const customCategories = useGameStore((state) => state.customCategories);
  const startNewGame = useGameStore((state) => state.startNewGame);

  const allCategories = useMemo(
    () => getAllCategories(customCategories),
    [customCategories]
  );

  const recommendedImposters = getRecommendedImposterCount(playerCount);
  const maxImposters = Math.floor(playerCount / 2);

  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [imposterCount, setImposterCount] = useState<number>(recommendedImposters);

  const selectRandomCategory = () => {
    const randomIndex = Math.floor(Math.random() * allCategories.length);
    setSelectedCategory(allCategories[randomIndex].id);
  };

  const handleStartGame = () => {
    if (!selectedCategory) return;
    startNewGame(playerNames, selectedCategory, imposterCount);
    router.push('/reveal');
  };

  const getCategoryDifficulty = (category: Category): Difficulty => {
    const difficulties = category.words.map((w) => w.difficulty);
    const hardCount = difficulties.filter((d) => d === 'hard').length;
    const mediumCount = difficulties.filter((d) => d === 'medium').length;

    if (hardCount >= 3) return 'hard';
    if (mediumCount >= 3 || hardCount >= 1) return 'medium';
    return 'easy';
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['bottom']}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerEmoji}>⚙️</Text>
          <Text style={styles.headerTitle}>Spieleinstellungen</Text>
          <Text style={styles.headerSubtitle}>{playerCount} Spieler dabei</Text>
        </View>

        <ScrollView style={styles.flex} contentContainerStyle={styles.scrollContent}>
          {/* Imposter Count */}
          <Surface style={styles.card} elevation={2}>
            <Text style={styles.cardTitle}>🕵️ Wie viele Imposter?</Text>
            <Text style={styles.hint}>
              Empfohlen: {recommendedImposters} {recommendedImposters === 1 ? 'Imposter' : 'Imposter'}
            </Text>

            <View style={styles.imposterOptions}>
              {Array.from({ length: maxImposters }, (_, i) => i + 1).map((num) => (
                <Pressable
                  key={num}
                  onPress={() => setImposterCount(num)}
                  style={[
                    styles.imposterChip,
                    imposterCount === num && styles.imposterChipSelected,
                  ]}
                >
                  <Text style={styles.imposterNumber}>{num}</Text>
                  <Text style={[
                    styles.imposterLabel,
                    imposterCount === num && styles.imposterLabelSelected,
                  ]}>
                    {num === 1 ? 'Imposter' : 'Imposter'}
                  </Text>
                  {num === recommendedImposters && (
                    <Text style={styles.recommendedBadge}>⭐</Text>
                  )}
                </Pressable>
              ))}
            </View>
          </Surface>

          {/* Category Selection */}
          <Surface style={styles.card} elevation={2}>
            <View style={styles.categoryHeader}>
              <Text style={styles.cardTitle}>📚 Wähle ein Thema!</Text>
              <Pressable onPress={selectRandomCategory} style={styles.randomButton}>
                <Text style={styles.randomButtonText}>🎲 Zufall</Text>
              </Pressable>
            </View>

            {/* Custom Categories */}
            {customCategories.length > 0 && (
              <>
                <Text style={styles.categoryGroupLabel}>⭐ Deine Wortlisten</Text>
                <View style={styles.categoryGrid}>
                  {customCategories.map((cat) => (
                    <Pressable
                      key={cat.id}
                      onPress={() => setSelectedCategory(cat.id)}
                      style={[
                        styles.categoryCard,
                        selectedCategory === cat.id && styles.categoryCardSelected,
                      ]}
                    >
                      <Text style={styles.categoryIcon}>{cat.icon}</Text>
                      <Text style={styles.categoryName}>{cat.name}</Text>
                      <Text style={styles.categoryCount}>{cat.words.length} Wörter</Text>
                    </Pressable>
                  ))}
                </View>
              </>
            )}

            <Text style={styles.categoryGroupLabel}>🎯 Kategorien</Text>
            <View style={styles.categoryGrid}>
              {defaultCategories.map((cat) => {
                const difficulty = getCategoryDifficulty(cat);
                return (
                  <Pressable
                    key={cat.id}
                    onPress={() => setSelectedCategory(cat.id)}
                    style={[
                      styles.categoryCard,
                      selectedCategory === cat.id && styles.categoryCardSelected,
                    ]}
                  >
                    <Text style={styles.categoryIcon}>{cat.icon}</Text>
                    <Text style={styles.categoryName}>{cat.name}</Text>
                    <Text style={styles.categoryDifficulty}>
                      {getDifficultyEmoji(difficulty)}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <View style={styles.legend}>
              <Text style={styles.legendText}>🟢 Einfach  🟡 Mittel  🔴 Schwer</Text>
            </View>
          </Surface>
        </ScrollView>

        {/* Start Button */}
        <View style={styles.footer}>
          <Pressable
            onPress={handleStartGame}
            disabled={!selectedCategory}
            style={({ pressed }) => [
              styles.startButton,
              !selectedCategory && styles.startButtonDisabled,
              pressed && styles.startButtonPressed,
            ]}
          >
            <Text style={[
              styles.startButtonText,
              !selectedCategory && styles.startButtonTextDisabled,
            ]}>
              🚀 Los geht's!
            </Text>
          </Pressable>
          {!selectedCategory && (
            <Text style={styles.selectHint}>Wähle erst ein Thema aus!</Text>
          )}
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#45B7D1',
  },
  safeArea: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  headerEmoji: {
    fontSize: 36,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 24,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  hint: {
    fontSize: 13,
    color: '#666',
    marginBottom: 14,
  },
  imposterOptions: {
    flexDirection: 'row',
    gap: 10,
  },
  imposterChip: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'transparent',
  },
  imposterChipSelected: {
    backgroundColor: '#FFE66D',
    borderColor: '#FFC107',
  },
  imposterNumber: {
    fontSize: 28,
    fontWeight: '800',
    color: '#333',
  },
  imposterLabel: {
    fontSize: 11,
    color: '#666',
    fontWeight: '600',
  },
  imposterLabelSelected: {
    color: '#333',
  },
  recommendedBadge: {
    position: 'absolute',
    top: 4,
    right: 6,
    fontSize: 14,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  randomButton: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  randomButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2E7D32',
  },
  categoryGroupLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginTop: 12,
    marginBottom: 10,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  categoryCard: {
    width: '30%',
    backgroundColor: '#F5F5F5',
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'transparent',
  },
  categoryCardSelected: {
    backgroundColor: '#E3F2FD',
    borderColor: '#2196F3',
  },
  categoryIcon: {
    fontSize: 28,
    marginBottom: 4,
  },
  categoryName: {
    fontSize: 11,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  categoryCount: {
    fontSize: 9,
    color: '#666',
    marginTop: 2,
  },
  categoryDifficulty: {
    fontSize: 10,
    marginTop: 2,
  },
  legend: {
    alignItems: 'center',
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#EEE',
  },
  legendText: {
    fontSize: 12,
    color: '#888',
  },
  footer: {
    padding: 16,
    paddingBottom: 8,
  },
  startButton: {
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
  startButtonDisabled: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    shadowOpacity: 0,
    elevation: 0,
  },
  startButtonPressed: {
    transform: [{ scale: 0.98 }],
  },
  startButtonText: {
    fontSize: 22,
    fontWeight: '800',
    color: '#333',
  },
  startButtonTextDisabled: {
    color: 'rgba(255,255,255,0.7)',
  },
  selectHint: {
    textAlign: 'center',
    color: 'rgba(255,255,255,0.8)',
    marginTop: 8,
    fontSize: 14,
  },
});
