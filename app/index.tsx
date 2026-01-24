import { View, StyleSheet } from 'react-native';
import { Button, Card, Text, useTheme } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const router = useRouter();
  const theme = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text variant="displaySmall" style={styles.title}>
            🕵️ Imposter
          </Text>
          <Text variant="bodyLarge" style={styles.subtitle}>
            Das Familien-Ratespiel
          </Text>
        </View>

        <Card style={styles.card}>
          <Card.Content>
            <Text variant="bodyMedium" style={styles.description}>
              Ein Spieler ist der Imposter und kennt das geheime Wort nicht.
              Findet heraus, wer es ist - aber Vorsicht: Der Imposter versucht
              unentdeckt zu bleiben!
            </Text>
          </Card.Content>
        </Card>

        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            onPress={() => router.push('/players')}
            style={styles.mainButton}
            contentStyle={styles.mainButtonContent}
            labelStyle={styles.mainButtonLabel}
          >
            🎮 Neues Spiel starten
          </Button>

          <Button
            mode="outlined"
            onPress={() => router.push('/custom-lists')}
            style={styles.secondaryButton}
          >
            📝 Eigene Wortlisten
          </Button>

          <Button
            mode="outlined"
            onPress={() => router.push('/saved-players')}
            style={styles.secondaryButton}
          >
            👥 Gespeicherte Spieler
          </Button>
        </View>

        <View style={styles.footer}>
          <Text variant="bodySmall" style={styles.footerText}>
            Ab 7 Jahren • 3-12 Spieler
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    marginTop: 20,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    opacity: 0.7,
  },
  card: {
    marginVertical: 20,
  },
  description: {
    textAlign: 'center',
    lineHeight: 22,
  },
  buttonContainer: {
    gap: 12,
  },
  mainButton: {
    borderRadius: 12,
  },
  mainButtonContent: {
    paddingVertical: 8,
  },
  mainButtonLabel: {
    fontSize: 18,
  },
  secondaryButton: {
    borderRadius: 12,
  },
  footer: {
    alignItems: 'center',
    marginTop: 20,
  },
  footerText: {
    opacity: 0.5,
  },
});
