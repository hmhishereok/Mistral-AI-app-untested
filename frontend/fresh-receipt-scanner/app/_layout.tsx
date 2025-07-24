import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: '#000',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          contentStyle: {
            backgroundColor: '#fff',
          },
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            title: 'Receipt Scanner'
          }}
        />
        <Stack.Screen
          name="scan/page"
          options={{
            title: 'Scan Receipt'
          }}
        />
        <Stack.Screen
          name="camera"
          options={{
            title: 'Take Picture',
            presentation: 'modal'
          }}
        />
        <Stack.Screen
          name="gallery"
          options={{
            title: 'Choose from Gallery',
            presentation: 'modal'
          }}
        />
        <Stack.Screen
          name="results"
          options={{
            title: 'Receipt Details',
            headerBackTitle: 'Back'
          }}
        />
      </Stack>
      <StatusBar style="light" />
    </>
  );
}