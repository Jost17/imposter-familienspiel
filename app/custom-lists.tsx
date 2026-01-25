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
  Divider,
  Portal,
  Modal,
  Chip,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGameStore } from '../src/store/gameStore';

const EMOJI_OPTIONS = ['📚', '🎮', '🎬', '🎵', '🍕', '🏠', '🌍', '⭐', '🎨', '🔧', '💡', '🎯'];

export default function CustomListsScreen() {
  const theme = useTheme();

  const customCategories = useGameStore((state) => state.customCategories);
  const addCustomCategory = useGameStore((state) => state.addCustomCategory);
  const updateCustomCategory = useGameStore((state) => state.updateCustomCategory);
  const removeCustomCategory = useGameStore((state) => state.removeCustomCategory);

  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('📚');
  const [words, setWords] = useState<string[]>(['', '', '', '', '']);

  const resetForm = () => {
    setName('');
    setIcon('📚');
    setWords(['', '', '', '', '']);
    setEditingId(null);
  };

  const openCreateModal = () => {
    resetForm();
    setModalVisible(true);
  };

  const openEditModal = (categoryId: string) => {
    const category = customCategories.find((c) => c.id === categoryId);
    if (!category) return;

    setEditingId(categoryId);
    setName(category.name);
    setIcon(category.icon);
    setWords([...category.words, '', '', '', '', ''].slice(0, Math.max(category.words.length + 2, 5)));
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    resetForm();
  };

  const updateWord = (index: number, value: string) => {
    const newWords = [...words];
    newWords[index] = value;
    setWords(newWords);
  };

  const addWordField = () => {
    if (words.length < 20) {
      setWords([...words, '']);
    }
  };

  const removeWordField = (index: number) => {
    if (words.length > 3) {
      const newWords = words.filter((_, i) => i !== index);
      setWords(newWords);
    }
  };

  const handleSave = () => {
    const trimmedName = name.trim();
    const filledWords = words.filter((w) => w.trim());

    if (!trimmedName || filledWords.length < 3) {
      return;
    }

    if (editingId) {
      updateCustomCategory(editingId, trimmedName, icon, filledWords);
    } else {
      addCustomCategory(trimmedName, icon, filledWords);
    }

    closeModal();
  };

  const handleDelete = (id: string) => {
    removeCustomCategory(id);
  };

  const filledWordsCount = words.filter((w) => w.trim()).length;
  const canSave = name.trim() && filledWordsCount >= 3;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['bottom']}>
      <ScrollView style={styles.flex} contentContainerStyle={styles.scrollContent}>
        {customCategories.length === 0 ? (
          <Card style={styles.emptyCard}>
            <Card.Content style={styles.emptyContent}>
              <Text variant="titleMedium" style={styles.emptyTitle}>
                📝 Keine eigenen Listen
              </Text>
              <Text variant="bodyMedium" style={styles.emptyText}>
                Erstelle deine eigenen Wortlisten für mehr Spielspaß!
              </Text>
            </Card.Content>
          </Card>
        ) : (
          customCategories.map((category) => (
            <Card key={category.id} style={styles.categoryCard}>
              <Card.Content>
                <View style={styles.categoryHeader}>
                  <View style={styles.categoryInfo}>
                    <Text variant="titleMedium">
                      {category.icon} {category.name}
                    </Text>
                    <Text variant="bodySmall" style={styles.wordCount}>
                      {category.words.length} Wörter
                    </Text>
                  </View>
                  <View style={styles.categoryActions}>
                    <IconButton
                      icon="pencil"
                      size={20}
                      onPress={() => openEditModal(category.id)}
                    />
                    <IconButton
                      icon="delete"
                      size={20}
                      onPress={() => handleDelete(category.id)}
                    />
                  </View>
                </View>
                <View style={styles.wordPreview}>
                  {category.words.slice(0, 5).map((word, index) => (
                    <Chip key={index} compact style={styles.previewChip}>
                      {word}
                    </Chip>
                  ))}
                  {category.words.length > 5 && (
                    <Chip compact style={styles.previewChip}>
                      +{category.words.length - 5}
                    </Chip>
                  )}
                </View>
              </Card.Content>
            </Card>
          ))
        )}
      </ScrollView>

      <View style={styles.footer}>
        <Button
          mode="contained"
          onPress={openCreateModal}
          style={styles.createButton}
          icon="plus"
        >
          Neue Wortliste erstellen
        </Button>
      </View>

      {/* Create/Edit Modal */}
      <Portal>
        <Modal
          visible={modalVisible}
          onDismiss={closeModal}
          contentContainerStyle={[styles.modal, { backgroundColor: theme.colors.background }]}
        >
          <Text variant="titleLarge" style={styles.modalTitle}>
            {editingId ? 'Liste bearbeiten' : 'Neue Wortliste'}
          </Text>

          <ScrollView style={styles.modalScrollView} showsVerticalScrollIndicator>
            <TextInput
              mode="outlined"
              label="Name der Liste"
              value={name}
              onChangeText={setName}
              style={styles.input}
            />

            <Text variant="labelMedium" style={styles.label}>
              Icon wählen
            </Text>
            <View style={styles.emojiPicker}>
              {EMOJI_OPTIONS.map((emoji) => (
                <Chip
                  key={emoji}
                  selected={icon === emoji}
                  onPress={() => setIcon(emoji)}
                  style={styles.emojiChip}
                >
                  {emoji}
                </Chip>
              ))}
            </View>

            <Divider style={styles.divider} />

            <Text variant="labelMedium" style={styles.label}>
              Wörter ({filledWordsCount} eingetragen, min. 3)
            </Text>

            {words.map((word, index) => (
              <View key={index} style={styles.wordRow}>
                <TextInput
                  mode="outlined"
                  label={`Wort ${index + 1}`}
                  value={word}
                  onChangeText={(text) => updateWord(index, text)}
                  style={styles.wordInput}
                  dense
                />
                {words.length > 3 && (
                  <IconButton
                    icon="close"
                    size={18}
                    onPress={() => removeWordField(index)}
                  />
                )}
              </View>
            ))}

            {words.length < 20 && (
              <Button
                mode="text"
                onPress={addWordField}
                icon="plus"
                style={styles.addWordButton}
              >
                Wort hinzufügen
              </Button>
            )}
          </ScrollView>

          {/* Sticky Footer - AUSSERHALB des ScrollViews */}
          <View style={styles.modalFooter}>
            <Button mode="outlined" onPress={closeModal} style={styles.modalButton}>
              Abbrechen
            </Button>
            <Button
              mode="contained"
              onPress={handleSave}
              disabled={!canSave}
              style={styles.modalButton}
            >
              Speichern
            </Button>
          </View>
        </Modal>
      </Portal>
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
  emptyCard: {
    marginTop: 40,
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
  categoryCard: {
    marginBottom: 12,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryInfo: {
    flex: 1,
  },
  wordCount: {
    opacity: 0.6,
    marginTop: 2,
  },
  categoryActions: {
    flexDirection: 'row',
  },
  wordPreview: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 12,
  },
  previewChip: {
    height: 28,
  },
  footer: {
    padding: 16,
    paddingBottom: 8,
  },
  createButton: {
    borderRadius: 12,
  },
  modal: {
    margin: 20,
    borderRadius: 12,
    maxHeight: '85%',
    overflow: 'hidden',
  },
  modalTitle: {
    padding: 20,
    paddingBottom: 16,
  },
  modalScrollView: {
    flexShrink: 1,
    paddingHorizontal: 20,
  },
  input: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 8,
    opacity: 0.7,
  },
  emojiPicker: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  emojiChip: {
    marginBottom: 4,
  },
  divider: {
    marginVertical: 16,
  },
  wordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  wordInput: {
    flex: 1,
  },
  addWordButton: {
    marginTop: 8,
    marginBottom: 8,
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    padding: 20,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  modalButton: {
    minWidth: 100,
  },
});
