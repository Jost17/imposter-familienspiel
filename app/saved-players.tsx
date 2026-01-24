import { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import {
  Button,
  Card,
  Text,
  TextInput,
  useTheme,
  IconButton,
  List,
  Chip,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGameStore } from '../src/store/gameStore';

export default function SavedPlayersScreen() {
  const theme = useTheme();

  const savedPlayers = useGameStore((state) => state.savedPlayers);
  const addSavedPlayer = useGameStore((state) => state.addSavedPlayer);
  const removeSavedPlayer = useGameStore((state) => state.removeSavedPlayer);

  const [newName, setNewName] = useState('');
  const [error, setError] = useState('');

  const sortedPlayers = [...savedPlayers].sort((a, b) => b.usageCount - a.usageCount);

  const handleAddPlayer = () => {
    const trimmedName = newName.trim();

    if (!trimmedName) {
      setError('Bitte einen Namen eingeben');
      return;
    }

    const exists = savedPlayers.some(
      (p) => p.name.toLowerCase() === trimmedName.toLowerCase()
    );

    if (exists) {
      setError('Dieser Name ist bereits gespeichert');
      return;
    }

    addSavedPlayer(trimmedName);
    setNewName('');
    setError('');
  };

  const handleDelete = (id: string) => {
    removeSavedPlayer(id);
  };

  const formatLastUsed = (timestamp: number): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Heute';
    if (diffDays === 1) return 'Gestern';
    if (diffDays < 7) return `Vor ${diffDays} Tagen`;
    return date.toLocaleDateString('de-DE', { day: 'numeric', month: 'short' });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['bottom']}>
      <ScrollView style={styles.flex} contentContainerStyle={styles.scrollContent}>
        {/* Add new player */}
        <Card style={styles.addCard}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.cardTitle}>
              ➕ Spieler hinzufügen
            </Text>
            <View style={styles.addRow}>
              <TextInput
                mode="outlined"
                label="Name"
                value={newName}
                onChangeText={(text) => {
                  setNewName(text);
                  setError('');
                }}
                style={styles.addInput}
                onSubmitEditing={handleAddPlayer}
                autoCapitalize="words"
              />
              <Button
                mode="contained"
                onPress={handleAddPlayer}
                disabled={!newName.trim()}
                style={styles.addButton}
              >
                Hinzufügen
              </Button>
            </View>
            {error && (
              <Text variant="bodySmall" style={[styles.error, { color: theme.colors.error }]}>
                {error}
              </Text>
            )}
          </Card.Content>
        </Card>

        {/* Player list */}
        {sortedPlayers.length === 0 ? (
          <Card style={styles.emptyCard}>
            <Card.Content style={styles.emptyContent}>
              <Text variant="titleMedium" style={styles.emptyTitle}>
                👥 Keine gespeicherten Spieler
              </Text>
              <Text variant="bodyMedium" style={styles.emptyText}>
                Spieler werden automatisch gespeichert wenn du ein Spiel startest.
              </Text>
            </Card.Content>
          </Card>
        ) : (
          <Card style={styles.listCard}>
            <Card.Content>
              <Text variant="titleMedium" style={styles.cardTitle}>
                👥 Gespeicherte Spieler ({sortedPlayers.length})
              </Text>

              {sortedPlayers.map((player) => (
                <List.Item
                  key={player.id}
                  title={player.name}
                  description={`${player.usageCount} Spiele • ${formatLastUsed(player.lastUsed)}`}
                  right={() => (
                    <IconButton
                      icon="delete-outline"
                      size={20}
                      onPress={() => handleDelete(player.id)}
                    />
                  )}
                  style={styles.playerItem}
                />
              ))}
            </Card.Content>
          </Card>
        )}

        {/* Info */}
        <Card style={styles.infoCard}>
          <Card.Content>
            <Text variant="bodySmall" style={styles.infoText}>
              💡 Spieler werden automatisch gespeichert und bei der Spielereingabe als
              Vorschläge angezeigt. Häufig genutzte Namen erscheinen zuerst.
            </Text>
          </Card.Content>
        </Card>
      </ScrollView>
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
  addCard: {
    marginBottom: 16,
  },
  cardTitle: {
    marginBottom: 12,
  },
  addRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  addInput: {
    flex: 1,
  },
  addButton: {
    marginTop: 6,
  },
  error: {
    marginTop: 8,
  },
  emptyCard: {
    marginTop: 20,
  },
  emptyContent: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyTitle: {
    marginBottom: 8,
  },
  emptyText: {
    opacity: 0.6,
    textAlign: 'center',
  },
  listCard: {
    marginBottom: 16,
  },
  playerItem: {
    paddingVertical: 4,
  },
  infoCard: {
    backgroundColor: 'rgba(103, 80, 164, 0.05)',
  },
  infoText: {
    opacity: 0.7,
    lineHeight: 18,
  },
});
