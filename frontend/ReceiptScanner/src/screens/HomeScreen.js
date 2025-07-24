
import React, { useState } from 'react';
import { StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import ImagePickerComponent from '../components/ImagePicker';
import ReceiptResult from '../components/ReceiptResult';
import ReceiptService from '../services/ReceiptService';

export default function HomeScreen() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const handleImageSelected = async (imageUri) => {
    setLoading(true);
    setResult(null);
    try {
      const data = await ReceiptService.processReceipt(imageUri);
      setResult(data);
    } catch (e) {
      setResult({ error: e.message });
    } finally {
      setLoading(false);
    }
  };
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <ImagePickerComponent onImageSelected={handleImageSelected} loading={loading} />
      {loading && <ActivityIndicator size="large" color="#1976d2" />}
      {result && <ReceiptResult result={result} />}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 16 },
});
