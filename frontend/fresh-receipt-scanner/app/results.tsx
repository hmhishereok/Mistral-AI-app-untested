import React, { useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Dimensions } from 'react-native';
import { useReceiptScanner } from '../src/hooks/useReceiptScanner';
import { MaterialIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';

const { width } = Dimensions.get('window');

export default function ResultsScreen() {
  const { result, loading, error, scanReceipt, resetScan } = useReceiptScanner();
  const params = useLocalSearchParams();

  useEffect(() => {
    if (params.image && params.base64) {
      scanReceipt(params.image as string, params.base64 as string);
    }
  }, [params.image, params.base64]);

  const handleNewScan = () => {
    resetScan();
    router.push('/scan/page');
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <View style={styles.loadingContent}>
          <View style={styles.loadingIconContainer}>
            <MaterialIcons name="auto-awesome" size={48} color="white" />
          </View>
          <ActivityIndicator size="large" color="white" style={styles.spinner} />
          <Text style={styles.loadingText}>Processing your receipt...</Text>
          <Text style={styles.loadingSubtext}>AI is extracting the data</Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <View style={styles.errorContent}>
          <View style={styles.errorIconContainer}>
            <MaterialIcons name="error-outline" size={48} color="white" />
          </View>
          <Text style={styles.errorTitle}>Oops!</Text>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.errorButton} onPress={handleNewScan}>
            <MaterialIcons name="camera-alt" size={24} color="white" />
            <Text style={styles.errorButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (!result) {
    return (
      <View style={styles.errorContainer}>
        <View style={styles.errorContent}>
          <View style={styles.errorIconContainer}>
            <MaterialIcons name="receipt" size={48} color="white" />
          </View>
          <Text style={styles.errorTitle}>No Receipt Data</Text>
          <Text style={styles.errorText}>No receipt data available</Text>
          <TouchableOpacity style={styles.errorButton} onPress={handleNewScan}>
            <MaterialIcons name="camera-alt" size={24} color="white" />
            <Text style={styles.errorButtonText}>New Scan</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Header Card */}
        <View style={styles.headerCard}>
          <View style={styles.headerContent}>
            <View style={styles.merchantIconContainer}>
              <MaterialIcons name="store" size={32} color="white" />
            </View>
            <Text style={styles.merchantName}>{result.merchant || 'Unknown Merchant'}</Text>
            <Text style={styles.date}>{result.date || 'Date not available'}</Text>
          </View>
        </View>

        {/* Items Card */}
        <View style={styles.itemsCard}>
          <View style={styles.cardHeader}>
            <MaterialIcons name="list" size={24} color="#667eea" />
            <Text style={styles.cardTitle}>Items</Text>
          </View>
          
          {result.items?.map((item: any, index: number) => (
            <View key={index} style={styles.itemRow}>
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.name}</Text>
              </View>
              <Text style={styles.itemPrice}>${Number(item.price).toFixed(2)}</Text>
            </View>
          ))}
        </View>

        {/* Totals Card */}
        <View style={styles.totalsCard}>
          <View style={styles.cardHeader}>
            <MaterialIcons name="calculate" size={24} color="#667eea" />
            <Text style={styles.cardTitle}>Summary</Text>
          </View>
          
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Subtotal</Text>
            <Text style={styles.totalAmount}>${Number(result.subtotal || 0).toFixed(2)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Tax</Text>
            <Text style={styles.totalAmount}>${Number(result.tax || 0).toFixed(2)}</Text>
          </View>
          <View style={styles.finalTotalRow}>
            <Text style={styles.finalTotalLabel}>Total</Text>
            <Text style={styles.finalTotalAmount}>${Number(result.total || 0).toFixed(2)}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity 
        style={styles.fab}
        onPress={handleNewScan}
        activeOpacity={0.8}
      >
        <View style={styles.fabContent}>
          <MaterialIcons name="camera-alt" size={24} color="white" />
          <Text style={styles.fabText}>New Scan</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  
  // Loading Styles
  loadingContainer: {
    flex: 1,
    backgroundColor: '#667eea',
  },
  loadingContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  loadingIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  spinner: {
    marginBottom: 24,
  },
  loadingText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  loadingSubtext: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },

  // Error Styles
  errorContainer: {
    flex: 1,
    backgroundColor: '#ff6b6b',
  },
  errorContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  errorIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 16,
  },
  errorText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  errorButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    gap: 8,
  },
  errorButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },

  // Success Styles
  headerCard: {
    borderRadius: 20,
    backgroundColor: '#667eea',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  headerContent: {
    alignItems: 'center',
    padding: 24,
  },
  merchantIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  merchantName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
    textAlign: 'center',
  },
  date: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },

  itemsCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2d3748',
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f7fafc',
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    color: '#2d3748',
    fontWeight: '500',
  },
  itemPrice: {
    fontSize: 16,
    color: '#2d3748',
    fontWeight: '600',
  },

  totalsCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  totalLabel: {
    fontSize: 16,
    color: '#718096',
    fontWeight: '500',
  },
  totalAmount: {
    fontSize: 16,
    color: '#2d3748',
    fontWeight: '600',
  },
  finalTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    marginTop: 8,
    borderTopWidth: 2,
    borderTopColor: '#e2e8f0',
  },
  finalTotalLabel: {
    fontSize: 18,
    color: '#2d3748',
    fontWeight: 'bold',
  },
  finalTotalAmount: {
    fontSize: 20,
    color: '#667eea',
    fontWeight: 'bold',
  },

  fab: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    borderRadius: 30,
    backgroundColor: '#4facfe',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  fabContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 8,
  },
  fabText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
