import { useState, useMemo } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Button, Card, Text, useTheme, RadioButton, Chip, Divider } from 'react-native-paper';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGameStore, getRecommendedImposterCount, getAllCategories } from '../src/store/gameStore';
import { defaultCategories, getDifficultyEmoji } from '../src/data/categories';
import { Category } from '../src/types';

export default function SetupScreen() {
  const router = useRouter();
  const theme = useTheme();
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

  const getCategoryDifficulty = (category: Category): string => {
    const difficulties = category.words.map((w) => w.difficulty);
    const hardCount = difficulties.filter((d) => d === 'hard').length;
    const mediumCount = difficulties.filter((d) => d === 'medium').length;

    if (hardCount >= 3) return 'hard';
    if (mediumCount >= 3 || hardCount >= 1) return 'medium';
    return 'easy';
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['bottom']}>
      <ScrollView style={styles.flex} contentContainerStyle={styles.scrollContent}>
        {/* Imposter Count */}
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.cardTitle}>
              🕵️ Anzahl Imposter
            </Text>
            <Text variant="bodySmall" style={styles.hint}>
              Empfohlen für {playerCount} Spieler: {recommendedImposters}
            </Text>

            <View style={styles.imposterOptions}>
              {Array.from({ length: maxImposters }, (_, i) => i + 1).map((num) => (
                <Chip
                  key={num}
                  selected={imposterCount === num}
                  onPress={() => setImposterCount(num)}
                  style={styles.imposterChip}
                  showSelectedCheck
                >
                  {num} {num === 1 ? 'Imposter' : 'Imposter'}
                  {num === recommendedImposters ? ' ✓' : ''}
                </Chip>
              ))}
            </View>
          </Card.Content>
        </Card>

        {/* Category Selection */}
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.categoryHeader}>
              <Text variant="titleMedium" style={styles.cardTitle}>
                📚 Kategorie wählen
              </Text>
              <Button mode="text" onPress={selectRandomCategory} compact>
                🎲 Zufall
              </Button>
            </View>

            <RadioButton.Group
              onValueChange={(value) => setSelectedCategory(value)}
              value={selectedCategory}
            >
              {/* Custom Categories First */}
              {customCategories.length > 0 && (
                <>
                  <Text variant="labelMedium" style={styles.categoryGroupLabel}>
                    Eigene Wortlisten
                  </Text>
                  {customCategories.map((cat) => (
                    <RadioButton.Item
                      key={cat.id}
                      label={`${cat.icon} ${cat.name} (${cat.words.length} Wörter)`}
                      value={cat.id}
                      style={styles.radioItem}
                    />
                  ))}
                  <Divider style={styles.divider} />
                </>
              )}

              <Text variant="labelMedium" style={styles.categoryGroupLabel}>
                Vorgefertigte Kategorien
              </Text>
              {defaultCategories.map((cat) => {
                const difficulty = getCategoryDifficulty(cat);
                return (
                  <RadioButton.Item
                    key={cat.id}
                    label={`${cat.icon} ${cat.name} ${getDifficultyEmoji(difficulty)}`}
                    value={cat.id}
                    style={styles.radioItem}
                  />
                );
              })}
            </RadioButton.Group>
          </Card.Content>
        </Card>

        <View style={styles.legend}>
          <Text variant="bodySmall">
            🟢 Einfach  🟡 Mittel  🔴 Schwer
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          mode="contained"
          onPress={handleStartGame}
          disabled={!selectedCategory}
          style={styles.startButton}
          contentStyle={styles.startButtonContent}
        >
          🎮 Spiel starten
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
  scrollContent: {
    padding: 16,
  },
  card: {
    marginBottom: 16,
  },
  cardTitle: {
    marginBottom: 8,
  },
  hint: {
    opacity: 0.6,
    marginBottom: 12,
  },
  imposterOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  imposterChip: {
    marginRight: 4,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryGroupLabel: {
    marginTop: 8,
    marginBottom: 4,
    opacity: 0.6,
  },
  radioItem: {
    paddingVertical: 4,
  },
  divider: {
    marginVertical: 12,
  },
  legend: {
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  footer: {
    padding: 16,
    paddingBottom: 8,
  },
  startButton: {
    borderRadius: 12,
  },
  startButtonContent: {
    paddingVertical: 6,
  },
});
