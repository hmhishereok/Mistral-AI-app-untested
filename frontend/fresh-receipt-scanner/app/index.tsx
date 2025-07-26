import { StyleSheet, View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';

const { width, height } = Dimensions.get('window');

export default function Index() {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <MaterialIcons name="receipt" size={48} color="white" />
          </View>
          <Text style={styles.title}>Receipt Scanner</Text>
          <Text style={styles.subtitle}>AI-Powered Receipt Processing</Text>
        </View>

        {/* Features Section */}
        <View style={styles.features}>
          <View style={styles.featureItem}>
            <MaterialIcons name="camera-alt" size={24} color="white" />
            <Text style={styles.featureText}>Take a photo</Text>
          </View>
          <View style={styles.featureItem}>
            <MaterialIcons name="image" size={24} color="white" />
            <Text style={styles.featureText}>Upload from gallery</Text>
          </View>
          <View style={styles.featureItem}>
            <MaterialIcons name="auto-awesome" size={24} color="white" />
            <Text style={styles.featureText}>AI extracts data</Text>
          </View>
        </View>

        {/* CTA Button */}
        <TouchableOpacity 
          style={styles.button}
          onPress={() => router.replace('/scan/page')}
          activeOpacity={0.8}
        >
          <View style={styles.buttonContent}>
            <MaterialIcons name="camera-alt" size={28} color="white" />
            <Text style={styles.buttonText}>Start Scanning</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#667eea',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  header: {
    alignItems: 'center',
    marginBottom: 60,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    fontWeight: '400',
  },
  features: {
    marginBottom: 60,
    width: '100%',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  featureText: {
    color: 'white',
    fontSize: 16,
    marginLeft: 16,
    fontWeight: '500',
  },
  button: {
    width: '100%',
    borderRadius: 16,
    backgroundColor: '#4facfe',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    paddingHorizontal: 32,
    gap: 12,
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
});
