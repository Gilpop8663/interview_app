import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Audio } from 'expo-av';
import { Ionicons } from '@expo/vector-icons'; // 아이콘 추가
import Slider from '@react-native-community/slider';

const AudioPlayer = ({ uri }: { uri: string }) => {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0); // 총 녹음 시간 (초)
  const [position, setPosition] = useState(0); // 현재 재생 위치 (초)

  const loadSound = async () => {
    try {
      const soundUri = uri.startsWith('file://') ? uri : `file://${uri}`; // `file://` 프로토콜 추가

      const { sound, status } = await Audio.Sound.createAsync(
        { uri: soundUri },
        { shouldPlay: true }
      );

      setSound(sound);

      if (status.isLoaded) {
        setDuration(status.durationMillis! / 1000); // 밀리초 → 초 변환
      }

      sound.setOnPlaybackStatusUpdate((status) => {
        if (!status.isLoaded) {
          return;
        }

        setPosition(status.positionMillis / 1000);
        setIsPlaying(status.isPlaying);

        if (status.didJustFinish) {
          sound.setPositionAsync(0); // 재생 위치를 0초로 이동
          setIsPlaying(false);
        }
      });
    } catch (error) {
      console.error('Error loading sound', error);
    }
  };

  const playPauseSound = async () => {
    if (!sound) {
      await loadSound();
    }

    if (sound) {
      const status = await sound.getStatusAsync();

      if (!status.isLoaded) {
        return;
      }

      if (!isPlaying) {
        sound.playAsync();
        setIsPlaying(true);
        return;
      }

      // 재생 중이면 일시정지
      await sound.pauseAsync();
      setIsPlaying(false);
    }
  };

  // 사용자가 슬라이더를 움직일 때 호출됨
  const seekTo = async (value: number) => {
    if (sound) {
      await sound.setPositionAsync(value * 1000); // 초 → 밀리초 변환
      setPosition(value);
    }
  };

  // 초 → MM:SS 변환 함수
  const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  };

  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync(); // 컴포넌트 언마운트 시 사운드 정리
      }
    };
  }, [sound]);

  return (
    <View style={styles.audioInfo}>
      <Text style={styles.recordedText}>녹음된 답변</Text>

      {/* 재생 / 일시정지 버튼 */}
      <TouchableOpacity style={styles.playButton} onPress={playPauseSound}>
        <Ionicons
          name={isPlaying ? 'pause-circle' : 'play-circle'}
          size={32}
          color="#007bff"
        />
        <Text style={styles.playButtonText}>
          {isPlaying ? '일시정지' : '듣기'}
        </Text>
      </TouchableOpacity>

      {/* 프로그레스 바 */}
      <View style={styles.progressContainer}>
        <Text style={styles.timeText}>{formatTime(position)}</Text>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={duration}
          value={position}
          onSlidingComplete={seekTo} // 사용자가 원하는 위치로 이동 가능
          minimumTrackTintColor="#007bff"
          maximumTrackTintColor="#ccc"
          thumbTintColor="#007bff"
        />
        <Text style={styles.timeText}>{formatTime(duration)}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  playButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 50,
    backgroundColor: '#f0f0f0',
    elevation: 2,
  },
  playButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginLeft: 8,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginTop: 10,
    paddingHorizontal: 10,
  },
  slider: {
    flex: 1,
    marginHorizontal: 10,
  },
  timeText: {
    fontSize: 14,
    color: '#666',
  },
  audioInfo: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
    marginBottom: 20,
  },
  recordedText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 16,
  },
});

export default AudioPlayer;
