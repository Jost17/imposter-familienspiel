import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { PaperProvider, MD3DarkTheme, MD3LightTheme } from 'react-native-paper';
import { useColorScheme } from 'react-native';
import { useGameStore } from '../src/store/gameStore';

const customLightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#6750A4',
    primaryContainer: '#EADDFF',
    secondary: '#625B71',
    secondaryContainer: '#E8DEF8',
  },
};

const customDarkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#D0BCFF',
    primaryContainer: '#4F378B',
    secondary: '#CCC2DC',
    secondaryContainer: '#4A4458',
  },
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? customDarkTheme : customLightTheme;
  const loadFromStorage = useGameStore((state) => state.loadFromStorage);

  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  return (
    <PaperProvider theme={theme}>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: theme.colors.primary,
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            title: 'Imposter',
            headerShown: true,
          }}
        />
        <Stack.Screen
          name="players"
          options={{
            title: 'Spieler eingeben',
          }}
        />
        <Stack.Screen
          name="setup"
          options={{
            title: 'Spiel einrichten',
          }}
        />
        <Stack.Screen
          name="reveal"
          options={{
            title: 'Rollen verteilen',
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="discussion"
          options={{
            title: 'Diskussion',
          }}
        />
        <Stack.Screen
          name="result"
          options={{
            title: 'Auflösung',
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="custom-lists"
          options={{
            title: 'Eigene Wortlisten',
          }}
        />
        <Stack.Screen
          name="saved-players"
          options={{
            title: 'Gespeicherte Spieler',
          }}
        />
      </Stack>
    </PaperProvider>
  );
}
