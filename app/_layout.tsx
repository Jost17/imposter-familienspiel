import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { PaperProvider, MD3DarkTheme, MD3LightTheme } from 'react-native-paper';
import { useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useGameStore } from '../src/store/gameStore';

const customLightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#4ECDC4',
    primaryContainer: '#E0F7F5',
    secondary: '#FFE66D',
    secondaryContainer: '#FFF8DC',
  },
};

const customDarkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#4ECDC4',
    primaryContainer: '#1A4744',
    secondary: '#FFE66D',
    secondaryContainer: '#4A4520',
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
    <SafeAreaProvider>
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
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="players"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="setup"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="reveal"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="discussion"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="result"
          options={{
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
    </SafeAreaProvider>
  );
}
