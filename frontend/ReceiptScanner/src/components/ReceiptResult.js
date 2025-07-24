
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
export default function ReceiptResult({ result }) {
  if (!result || result.error) {
    return <Text style={styles.error}>Error: {result?.error || 'Failed to process receipt.'}</Text>;
  }
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Receipt Data</Text>
      <Text selectable>{JSON.stringify(result, null, 2)}</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { margin: 16, padding: 16, backgroundColor: '#f5f5f5', borderRadius: 8 },
  title: { fontWeight: 'bold', fontSize: 18, marginBottom: 8 },
  error: { color: 'red', margin: 16 },
});
