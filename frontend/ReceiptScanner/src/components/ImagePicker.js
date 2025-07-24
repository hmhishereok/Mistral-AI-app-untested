import React from 'react';
import { Button, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function ImagePickerComponent({ onImageSelected, loading }) {
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 1 });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      onImageSelected(result.assets[0].uri);
    }
  };
import React from 'react';
import { Button, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function ImagePickerComponent({ onImageSelected, loading }) {
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 1 });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      onImageSelected(result.assets[0].uri);
    }
  };
  const takePhoto = async () => {
    let result = await ImagePicker.launchCameraAsync({ quality: 1 });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      onImageSelected(result.assets[0].uri);
    }
  };
  return (
    <View style={{ flexDirection: 'row', margin: 16 }}>
      <Button title="Pick Image" onPress={pickImage} disabled={loading} />
      <View style={{ width: 16 }} />
      <Button title="Take Photo" onPress={takePhoto} disabled={loading} />
    </View>
  );
}