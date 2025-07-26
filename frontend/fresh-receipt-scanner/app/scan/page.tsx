import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function Page() {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Choose Your Method</Text>
          <Text style={styles.subtitle}>Select how you'd like to scan your receipt</Text>
        </View>

        {/* Options */}
        <View style={styles.optionsContainer}>
          <TouchableOpacity 
            style={styles.optionCard}
            onPress={() => router.push('/camera')}
            activeOpacity={0.8}
          >
            <View style={styles.cardContent}>
              <View style={styles.iconContainer}>
                <MaterialIcons name="camera-alt" size={32} color="white" />
              </View>
              <Text style={styles.cardTitle}>Take Picture</Text>
              <Text style={styles.cardSubtitle}>Use your camera to capture a new receipt</Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.optionCard}
            onPress={() => router.push('/gallery')}
            activeOpacity={0.8}
          >
            <View style={styles.cardContent}>
              <View style={styles.iconContainer}>
                <MaterialIcons name="image" size={32} color="white" />
              </View>
              <Text style={styles.cardTitle}>Choose from Gallery</Text>
              <Text style={styles.cardSubtitle}>Select an existing photo from your device</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Back Button */}
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <MaterialIcons name="arrow-back" size={24} color="#667eea" />
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2d3748',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#718096',
    textAlign: 'center',
    lineHeight: 22,
  },
  optionsContainer: {
    flex: 1,
    justifyContent: 'center',
    gap: 24,
  },
  optionCard: {
    borderRadius: 20,
    backgroundColor: '#667eea',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  cardContent: {
    alignItems: 'center',
    padding: 24,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
    textAlign: 'center',
  },
  cardSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 20,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    marginTop: 20,
  },
  backButtonText: {
    fontSize: 16,
    color: '#667eea',
    fontWeight: '600',
    marginLeft: 8,
  },
});
