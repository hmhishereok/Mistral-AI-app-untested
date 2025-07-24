import { View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { useEffect } from 'react';

export default function GalleryScreen() {
  useEffect(() => {
    pickImage();
  }, []);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
      base64: true,
    });

    if (!result.canceled) {
      router.push({
        pathname: "/results",
        params: { 
          image: result.assets[0].uri,
          base64: result.assets[0].base64
        }
      });
    } else {
      router.back();
    }
  };

  return <View />;
}
