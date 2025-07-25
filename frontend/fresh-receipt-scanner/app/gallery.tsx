import { View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { useEffect } from 'react';

export default function GalleryScreen() {
  useEffect(() => {
    pickImage();
  }, []);

  const pickImage = async () => {
    console.log('[Gallery] Starting image picker...');
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
        base64: true,
      });
      console.log('[Gallery] Picker result:', {
        canceled: result.canceled,
        assets: result.assets ? result.assets.length : 0
      });

      if (!result.canceled) {
        const selectedImage = result.assets[0];
        console.log('[Gallery] Image selected:', {
          uri: selectedImage.uri,
          width: selectedImage.width,
          height: selectedImage.height,
          type: selectedImage.type,
          hasBase64: !!selectedImage.base64,
          base64Length: selectedImage.base64?.length,
          fileSize: selectedImage.fileSize
        });
        
        console.log('[Gallery] Navigating to results with image data');
        router.push({
          pathname: "/results",
          params: { 
            image: selectedImage.uri,
            base64: selectedImage.base64
          }
        });
      } else {
        console.log('[Gallery] Image picker cancelled');
        router.back();
      }
    } catch (error) {
      console.error('[Gallery] Error in image picker:', error);
      router.back();
    }

  return <View />;
}
}
