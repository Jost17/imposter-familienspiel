import { Category, Difficulty } from '../types';

const word = (text: string, difficulty: Difficulty = 'easy') => ({ text, difficulty });

export const defaultCategories: Category[] = [
  {
    id: 'tiere',
    name: 'Tiere',
    icon: '🦁',
    words: [
      word('Hund'),
      word('Katze'),
      word('Elefant'),
      word('Löwe'),
      word('Pinguin'),
      word('Delfin', 'medium'),
      word('Schmetterling', 'medium'),
      word('Krokodil'),
      word('Pferd'),
      word('Schnecke'),
    ],
  },
  {
    id: 'essen',
    name: 'Essen & Trinken',
    icon: '🍕',
    words: [
      word('Pizza'),
      word('Spaghetti'),
      word('Hamburger'),
      word('Eis'),
      word('Schokolade'),
      word('Apfel'),
      word('Pommes'),
      word('Suppe', 'medium'),
      word('Kuchen'),
      word('Salat'),
    ],
  },
  {
    id: 'berufe',
    name: 'Berufe',
    icon: '👨‍⚕️',
    words: [
      word('Arzt'),
      word('Feuerwehrmann'),
      word('Polizist'),
      word('Lehrer'),
      word('Koch'),
      word('Pilot', 'medium'),
      word('Astronaut', 'medium'),
      word('Bäcker'),
      word('Tierarzt'),
      word('Mechaniker', 'hard'),
    ],
  },
  {
    id: 'orte',
    name: 'Orte',
    icon: '🏠',
    words: [
      word('Schule'),
      word('Krankenhaus'),
      word('Supermarkt'),
      word('Zoo'),
      word('Strand'),
      word('Flughafen', 'medium'),
      word('Museum', 'medium'),
      word('Spielplatz'),
      word('Schwimmbad'),
      word('Kino'),
    ],
  },
  {
    id: 'fahrzeuge',
    name: 'Fahrzeuge',
    icon: '🚗',
    words: [
      word('Auto'),
      word('Fahrrad'),
      word('Flugzeug'),
      word('Schiff'),
      word('Zug'),
      word('Motorrad', 'medium'),
      word('Hubschrauber', 'medium'),
      word('Bus'),
      word('Rakete'),
      word('U-Boot', 'hard'),
    ],
  },
  {
    id: 'sport',
    name: 'Sport',
    icon: '⚽',
    words: [
      word('Fußball'),
      word('Schwimmen'),
      word('Tennis'),
      word('Basketball'),
      word('Skifahren'),
      word('Turnen', 'medium'),
      word('Eishockey', 'medium'),
      word('Laufen'),
      word('Reiten'),
      word('Volleyball'),
    ],
  },
  {
    id: 'kleidung',
    name: 'Kleidung',
    icon: '👕',
    words: [
      word('T-Shirt'),
      word('Hose'),
      word('Schuhe'),
      word('Jacke'),
      word('Mütze'),
      word('Socken'),
      word('Kleid', 'medium'),
      word('Pullover'),
      word('Handschuhe'),
      word('Schal'),
    ],
  },
  {
    id: 'wetter',
    name: 'Wetter',
    icon: '☀️',
    words: [
      word('Sonne'),
      word('Regen'),
      word('Schnee'),
      word('Wolken'),
      word('Regenbogen'),
      word('Gewitter', 'medium'),
      word('Nebel', 'medium'),
      word('Wind'),
      word('Hagel', 'hard'),
      word('Tornado', 'hard'),
    ],
  },
  {
    id: 'maerchen',
    name: 'Märchen',
    icon: '🏰',
    words: [
      word('Prinzessin'),
      word('Drache'),
      word('Zauberer'),
      word('König'),
      word('Hexe'),
      word('Ritter', 'medium'),
      word('Zwerg'),
      word('Einhorn'),
      word('Fee'),
      word('Schloss'),
    ],
  },
  {
    id: 'schule',
    name: 'Schule',
    icon: '📚',
    words: [
      word('Buch'),
      word('Stift'),
      word('Tafel'),
      word('Lineal'),
      word('Radiergummi'),
      word('Schere'),
      word('Kleber'),
      word('Hausaufgaben', 'medium'),
      word('Zeugnis', 'medium'),
      word('Rucksack'),
    ],
  },
  {
    id: 'koerper',
    name: 'Körper',
    icon: '🖐️',
    words: [
      word('Kopf'),
      word('Hand'),
      word('Fuß'),
      word('Auge'),
      word('Nase'),
      word('Ohr'),
      word('Mund'),
      word('Bauch'),
      word('Knie'),
      word('Ellbogen', 'medium'),
    ],
  },
  {
    id: 'musik',
    name: 'Musik',
    icon: '🎵',
    words: [
      word('Gitarre'),
      word('Klavier'),
      word('Trompete', 'medium'),
      word('Trommel'),
      word('Flöte'),
      word('Geige', 'medium'),
      word('Mikrofon'),
      word('Sänger'),
      word('Konzert'),
      word('Chor', 'hard'),
    ],
  },
  {
    id: 'natur',
    name: 'Natur',
    icon: '🌳',
    words: [
      word('Baum'),
      word('Blume'),
      word('Berg'),
      word('Fluss'),
      word('See'),
      word('Wald'),
      word('Wiese'),
      word('Wasserfall', 'medium'),
      word('Vulkan', 'hard'),
      word('Höhle', 'medium'),
    ],
  },
  {
    id: 'obst-gemuese',
    name: 'Obst & Gemüse',
    icon: '🍎',
    words: [
      word('Apfel'),
      word('Banane'),
      word('Erdbeere'),
      word('Karotte'),
      word('Tomate'),
      word('Gurke'),
      word('Orange'),
      word('Kirsche'),
      word('Brokkoli', 'medium'),
      word('Ananas', 'medium'),
    ],
  },
  {
    id: 'spielzeug',
    name: 'Spielzeug',
    icon: '🧸',
    words: [
      word('Teddybär'),
      word('Lego'),
      word('Ball'),
      word('Puppe'),
      word('Puzzle'),
      word('Spielkarten'),
      word('Drachen'),
      word('Kreisel', 'medium'),
      word('Murmeln'),
      word('Brettspiel'),
    ],
  },
];

export const getRandomWord = (category: Category, difficulty?: Difficulty): string => {
  const filteredWords = difficulty
    ? category.words.filter((w) => w.difficulty === difficulty)
    : category.words;
  const randomIndex = Math.floor(Math.random() * filteredWords.length);
  return filteredWords[randomIndex]?.text || category.words[0].text;
};

export const getRandomCategory = (): Category => {
  const randomIndex = Math.floor(Math.random() * defaultCategories.length);
  return defaultCategories[randomIndex];
};

export const getCategoryById = (id: string): Category | undefined => {
  return defaultCategories.find((c) => c.id === id);
};

export const getDifficultyEmoji = (difficulty: Difficulty): string => {
  switch (difficulty) {
    case 'easy':
      return '🟢';
    case 'medium':
      return '🟡';
    case 'hard':
      return '🔴';
  }
};
