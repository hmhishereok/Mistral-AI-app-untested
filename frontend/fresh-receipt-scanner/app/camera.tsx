import { View, StyleSheet } from 'react-native';
import { Camera, CameraType } from 'expo-camera';
import { router } from 'expo-router';
import { useState, useEffect } from 'react';

export default function CameraScreen() {
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [camera, setCamera] = useState<Camera | null>(null);

  useEffect(() => {
    requestPermission();
  }, []);

  if (!permission?.granted) {
    return null;
  }

  const takePicture = async () => {
    if (camera) {
      const photo = await camera.takePictureAsync({
        quality: 1,
        base64: true
      });
      router.push({
        pathname: "/results",
        params: { 
          image: photo.uri,
          base64: photo.base64
        }
      });
    }
  };

  return (
    <View style={styles.container}>
      <Camera
        ref={(ref) => setCamera(ref)}
        style={styles.camera}
        type={CameraType.back}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
});
