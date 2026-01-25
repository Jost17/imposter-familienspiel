export type Difficulty = 'easy' | 'medium' | 'hard';

export interface Word {
  text: string;
  difficulty: Difficulty;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  words: Word[];
  isCustom?: boolean;
}

export interface Player {
  id: string;
  name: string;
  isImposter: boolean;
  hasSeenRole: boolean;
  avatarIndex: number;
}

export interface GameSession {
  id: string;
  players: Player[];
  category: Category;
  selectedWord: string;
  imposterCount: number;
  currentPlayerIndex: number;
  startingPlayerIndex: number;
  phase: 'setup' | 'reveal' | 'discussion' | 'result';
  createdAt: number;
}

export interface SavedPlayer {
  id: string;
  name: string;
  usageCount: number;
  lastUsed: number;
}

export interface CustomCategory {
  id: string;
  name: string;
  icon: string;
  words: string[];
  createdAt: number;
}

export interface GameStore {
  // Current Game
  currentGame: GameSession | null;

  // Saved Data
  savedPlayers: SavedPlayer[];
  customCategories: CustomCategory[];

  // Actions - Game
  startNewGame: (playerNames: string[], categoryId: string, imposterCount: number) => void;
  setCurrentPlayerIndex: (index: number) => void;
  markPlayerAsSeen: (playerId: string) => void;
  setPhase: (phase: GameSession['phase']) => void;
  endGame: () => void;

  // Actions - Saved Players
  addSavedPlayer: (name: string) => void;
  removeSavedPlayer: (id: string) => void;
  incrementPlayerUsage: (name: string) => void;

  // Actions - Custom Categories
  addCustomCategory: (name: string, icon: string, words: string[]) => void;
  updateCustomCategory: (id: string, name: string, icon: string, words: string[]) => void;
  removeCustomCategory: (id: string) => void;

  // Persistence
  loadFromStorage: () => Promise<void>;
  saveToStorage: () => Promise<void>;
}
