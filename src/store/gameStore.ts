import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GameStore, GameSession, Player, SavedPlayer, CustomCategory, Category } from '../types';
import { defaultCategories, getRandomWord } from '../data/categories';

const STORAGE_KEY = 'imposter_game_data';

const generateId = () => Math.random().toString(36).substring(2, 9);

const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const useGameStore = create<GameStore>((set, get) => ({
  currentGame: null,
  savedPlayers: [],
  customCategories: [],

  startNewGame: (playerNames: string[], categoryId: string, imposterCount: number) => {
    // Find category (default or custom)
    const defaultCat = defaultCategories.find((c) => c.id === categoryId);
    const customCat = get().customCategories.find((c) => c.id === categoryId);

    let category: Category;
    if (defaultCat) {
      category = defaultCat;
    } else if (customCat) {
      category = {
        id: customCat.id,
        name: customCat.name,
        icon: customCat.icon,
        words: customCat.words.map((w) => ({ text: w, difficulty: 'easy' as const })),
        isCustom: true,
      };
    } else {
      category = defaultCategories[0];
    }

    const selectedWord = getRandomWord(category);

    // Create players with avatarIndex preserved before shuffling
    const players: Player[] = playerNames.map((name, index) => ({
      id: generateId(),
      name,
      isImposter: false,
      hasSeenRole: false,
      avatarIndex: index,
    }));

    // Randomly assign imposters
    const shuffledIndices = shuffleArray([...Array(players.length).keys()]);
    for (let i = 0; i < imposterCount && i < players.length; i++) {
      players[shuffledIndices[i]].isImposter = true;
    }

    // Shuffle player order for reveal
    const shuffledPlayers = shuffleArray(players);

    const gameSession: GameSession = {
      id: generateId(),
      players: shuffledPlayers,
      category,
      selectedWord,
      imposterCount,
      currentPlayerIndex: 0,
      phase: 'reveal',
      createdAt: Date.now(),
    };

    // Update saved players usage
    playerNames.forEach((name) => get().incrementPlayerUsage(name));

    set({ currentGame: gameSession });
    get().saveToStorage();
  },

  setCurrentPlayerIndex: (index: number) => {
    set((state) => ({
      currentGame: state.currentGame
        ? { ...state.currentGame, currentPlayerIndex: index }
        : null,
    }));
  },

  markPlayerAsSeen: (playerId: string) => {
    set((state) => {
      if (!state.currentGame) return state;

      const updatedPlayers = state.currentGame.players.map((p) =>
        p.id === playerId ? { ...p, hasSeenRole: true } : p
      );

      return {
        currentGame: {
          ...state.currentGame,
          players: updatedPlayers,
        },
      };
    });
  },

  setPhase: (phase: GameSession['phase']) => {
    set((state) => ({
      currentGame: state.currentGame
        ? { ...state.currentGame, phase }
        : null,
    }));
  },

  endGame: () => {
    set({ currentGame: null });
    get().saveToStorage();
  },

  addSavedPlayer: (name: string) => {
    const trimmedName = name.trim();
    if (!trimmedName) return;

    const existing = get().savedPlayers.find(
      (p) => p.name.toLowerCase() === trimmedName.toLowerCase()
    );

    if (existing) return;

    set((state) => ({
      savedPlayers: [
        ...state.savedPlayers,
        {
          id: generateId(),
          name: trimmedName,
          usageCount: 0,
          lastUsed: Date.now(),
        },
      ],
    }));
    get().saveToStorage();
  },

  removeSavedPlayer: (id: string) => {
    set((state) => ({
      savedPlayers: state.savedPlayers.filter((p) => p.id !== id),
    }));
    get().saveToStorage();
  },

  incrementPlayerUsage: (name: string) => {
    const trimmedName = name.trim();

    set((state) => {
      const existing = state.savedPlayers.find(
        (p) => p.name.toLowerCase() === trimmedName.toLowerCase()
      );

      if (existing) {
        return {
          savedPlayers: state.savedPlayers.map((p) =>
            p.id === existing.id
              ? { ...p, usageCount: p.usageCount + 1, lastUsed: Date.now() }
              : p
          ),
        };
      }

      // Auto-add new player
      return {
        savedPlayers: [
          ...state.savedPlayers,
          {
            id: generateId(),
            name: trimmedName,
            usageCount: 1,
            lastUsed: Date.now(),
          },
        ],
      };
    });
  },

  addCustomCategory: (name: string, icon: string, words: string[]) => {
    const newCategory: CustomCategory = {
      id: generateId(),
      name: name.trim(),
      icon,
      words: words.filter((w) => w.trim()),
      createdAt: Date.now(),
    };

    set((state) => ({
      customCategories: [...state.customCategories, newCategory],
    }));
    get().saveToStorage();
  },

  updateCustomCategory: (id: string, name: string, icon: string, words: string[]) => {
    set((state) => ({
      customCategories: state.customCategories.map((c) =>
        c.id === id
          ? { ...c, name: name.trim(), icon, words: words.filter((w) => w.trim()) }
          : c
      ),
    }));
    get().saveToStorage();
  },

  removeCustomCategory: (id: string) => {
    set((state) => ({
      customCategories: state.customCategories.filter((c) => c.id !== id),
    }));
    get().saveToStorage();
  },

  loadFromStorage: async () => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        set({
          savedPlayers: parsed.savedPlayers || [],
          customCategories: parsed.customCategories || [],
        });
      }
    } catch (error) {
      console.error('Failed to load from storage:', error);
    }
  },

  saveToStorage: async () => {
    try {
      const { savedPlayers, customCategories } = get();
      await AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ savedPlayers, customCategories })
      );
    } catch (error) {
      console.error('Failed to save to storage:', error);
    }
  },
}));

// Helper functions
export const getRecommendedImposterCount = (playerCount: number): number => {
  if (playerCount <= 4) return 1;
  if (playerCount <= 7) return 2;
  if (playerCount <= 10) return 3;
  return Math.floor(playerCount / 4);
};

export const getAllCategories = (customCategories: CustomCategory[]): Category[] => {
  const customAsCats: Category[] = customCategories.map((c) => ({
    id: c.id,
    name: c.name,
    icon: c.icon,
    words: c.words.map((w) => ({ text: w, difficulty: 'easy' as const })),
    isCustom: true,
  }));

  return [...defaultCategories, ...customAsCats];
};
