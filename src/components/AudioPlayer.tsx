import React, { useState } from 'react';
import { Alert, Button, View } from 'react-native';
import { Audio } from 'expo-av';

const AudioPlayer = ({ uri }: { uri: string }) => {
  const [sound, setSound] = useState<any>(null);

  const playSound = async () => {
    try {
      const soundUri = uri.startsWith('file://') ? uri : `file://${uri}`; // `file://` 프로토콜 추가

      const { sound } = await Audio.Sound.createAsync(
        { uri: soundUri },
        { shouldPlay: true }
      );
      setSound(sound);
      Alert.alert('재생 중', '녹음 파일을 재생할 수 있습니다.');
    } catch (error) {
      console.error('Error playing sound', error);
      Alert.alert('재생 오류', '녹음 파일을 재생할 수 없습니다.');
    }
  };

  return (
    <View>
      <Button title="녹음 듣기" onPress={playSound} />
    </View>
  );
};

export default AudioPlayer;
