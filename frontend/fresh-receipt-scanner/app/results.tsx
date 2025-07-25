import React, { useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useReceiptScanner } from '../src/hooks/useReceiptScanner';
import { MaterialIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';

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
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Processing receipt...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.button} onPress={handleNewScan}>
          <MaterialIcons name="camera-alt" size={24} color="white" />
          <Text style={styles.buttonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!result) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No receipt data available</Text>
        <TouchableOpacity style={styles.button} onPress={handleNewScan}>
          <MaterialIcons name="camera-alt" size={24} color="white" />
          <Text style={styles.buttonText}>New Scan</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <View style={styles.headerSection}>
            <Text style={styles.merchantName}>{result.merchant || 'Unknown Merchant'}</Text>
            <Text style={styles.date}>{result.date || 'Date not available'}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.itemsSection}>
            <Text style={styles.sectionTitle}>Items</Text>
            
            {/* Table Header */}
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderText, styles.itemNameHeader]}>Item</Text>
              <Text style={[styles.tableHeaderText, styles.itemPriceHeader]}>Price</Text>
            </View>

            {/* Table Content */}
            <View style={styles.tableContent}>
              {result.items?.map((item: any, index: number) => (
                <View key={index} style={[styles.itemRow, index % 2 === 0 ? styles.evenRow : styles.oddRow]}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemPrice}>${Number(item.price).toFixed(2)}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.totalSection}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Subtotal</Text>
              <Text style={styles.totalAmount}>${Number(result.subtotal || 0).toFixed(2)}</Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Tax</Text>
              <Text style={styles.totalAmount}>${Number(result.tax || 0).toFixed(2)}</Text>
            </View>
            <View style={[styles.totalRow, styles.finalTotal]}>
              <Text style={[styles.totalLabel, styles.finalTotalLabel]}>Total</Text>
              <Text style={[styles.totalAmount, styles.finalTotalAmount]}>${Number(result.total || 0).toFixed(2)}</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <TouchableOpacity 
        style={styles.floatingButton}
        onPress={handleNewScan}
      >
        <MaterialIcons name="camera-alt" size={24} color="white" />
        <Text style={styles.buttonText}>New Scan</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 20,
    fontSize: 16,
    color: '#888',
  },
  errorText: {
    fontSize: 18,
    color: '#ff3b30',
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 10,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  card: {
    backgroundColor: '#1c1c1e',
    borderRadius: 15,
    padding: 16,
    marginBottom: 16,
  },
  headerSection: {
    marginBottom: 16,
  },
  merchantName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  date: {
    fontSize: 14,
    color: '#888',
  },
  divider: {
    height: 1,
    backgroundColor: '#333',
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  itemsSection: {
    marginBottom: 16,
  },
  tableHeader: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    marginBottom: 8,
  },
  tableHeaderText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#888',
  },
  itemNameHeader: {
    flex: 1,
  },
  itemPriceHeader: {
    width: 80,
    textAlign: 'right',
  },
  tableContent: {
    marginBottom: 16,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  evenRow: {
    backgroundColor: '#2c2c2e',
  },
  oddRow: {
    backgroundColor: '#1c1c1e',
  },
  itemName: {
    flex: 1,
    fontSize: 16,
    color: '#fff',
  },
  itemPrice: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '500',
    width: 80,
    textAlign: 'right',
  },
  totalSection: {
    gap: 8,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  totalLabel: {
    fontSize: 16,
    color: '#888',
  },
  totalAmount: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '500',
    width: 80,
    textAlign: 'right',
  },
  finalTotal: {
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  finalTotalLabel: {
    color: '#fff',
    fontWeight: 'bold',
  },
  finalTotalAmount: {
    fontWeight: 'bold',
  },
  floatingButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#007AFF',
    borderRadius: 25,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    boxShadow: '0px 2px 3.84px rgba(0, 0, 0, 0.25)',
    elevation: 5,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    color: '#888',
    fontSize: 16,
    textAlign: 'center',
  },
});
