import { useEffect, useRef, useState } from 'react';
import {
  View,
  Alert,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import AudioPlayer from './AudioPlayer';
import * as FileSystem from 'expo-file-system'; // 파일 읽기 용도
import { useProcessInterviewAudio } from '@hooks/mutate/useUploadSpeechFile';
import { Ionicons } from '@expo/vector-icons'; // 아이콘 추가
import { FeedbackCard } from './FeedbackCard';
import { useAudioRecording } from '@contexts/AudioRecordingContext';
import { Audio } from 'expo-av';
import * as MediaLibrary from 'expo-media-library';

interface Props {
  question: string;
}

const AudioRecorder = ({ question }: Props) => {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const { processInterviewAudio, data } = useProcessInterviewAudio(question);
  const {
    isRecording,
    isLoading,
    recordedUri,
    recordingTime,
    setRecordingTime,
    setIsLoading,
    setIsRecording,
    setRecordedUri,
  } = useAudioRecording();
  const recordInterval = useRef<NodeJS.Timeout | null>(null);

  const requestPermissions = async () => {
    const { status: audioStatus } = await Audio.requestPermissionsAsync();
    const { status: mediaLibStatus } =
      await MediaLibrary.requestPermissionsAsync(true); // true를 설정하여 WRITE_EXTERNAL_STORAGE 요청

    if (audioStatus !== 'granted' || mediaLibStatus !== 'granted') {
      Alert.alert('권한 필요', '필요한 권한이 모두 부여되지 않았습니다.');
      throw new Error('Permission not granted');
    }
  };

  const record = async () => {
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
      staysActiveInBackground: false,
      shouldDuckAndroid: true,
      playThroughEarpieceAndroid: false,
    });

    await requestPermissions();

    const { recording } = await Audio.Recording.createAsync(
      Audio.RecordingOptionsPresets.LOW_QUALITY
    );

    setRecording(recording);

    setIsRecording(true);
    setRecordingTime(0); // 녹음 시작 시 초기화
    setRecordedUri(null);

    recordInterval.current = setInterval(() => {
      setRecordingTime((prevTime) => prevTime + 1); // prevTime을 사용하여 이전 값을 기반으로 증가
    }, 1000);
  };

  const uploadAudio = async () => {
    if (!recordedUri) {
      Alert.alert('먼저 녹음하세요!');
      return;
    }

    const fileInfo = await FileSystem.getInfoAsync(recordedUri);
    if (!fileInfo.exists) {
      Alert.alert('파일이 존재하지 않습니다.');
      return;
    }

    try {
      setIsLoading(true);

      const base64 = await FileSystem.readAsStringAsync(recordedUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const result = await processInterviewAudio({
        file: base64,
        question,
      });

      console.log('업로드 성공:', result);
      setIsLoading(false);
    } catch (error) {
      console.error('업로드 실패:', error);
      setIsLoading(false);
      Alert.alert('업로드 실패', '서버 오류');
    }
  };

  const stopRecording = async () => {
    await recording?.stopAndUnloadAsync();
    const uri = recording?.getURI();
    console.log('녹음 끝! uri:', uri);
    setRecordedUri(uri ?? null);

    if (recordInterval.current) {
      clearInterval(recordInterval.current);
    }

    if (!uri) return;

    const fileName = `recording_${Date.now()}.wav`;
    const newUri = `${FileSystem.documentDirectory}/${fileName}`;

    await FileSystem.moveAsync({
      from: uri, // 임시 파일 경로
      to: newUri, // 이동할 목적지 경로 (영구 저장소)
    });

    await MediaLibrary.createAssetAsync(newUri);

    const fileInfo = await FileSystem.getInfoAsync(uri, {
      size: true,
    });

    if (fileInfo.exists) {
      console.log('녹음된 파일 사이즈:', fileInfo.size); // ✅ 이 시점에서 사이즈 있어야 정상
    }

    setRecordedUri(newUri);
    setIsRecording(false);
    Alert.alert('녹음이 완료되었습니다!');
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${
      remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds
    }`;
  };

  useEffect(() => {
    requestPermissions();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.question}>Q: {question}</Text>
      <View style={styles.recordingContainer}>
        <TouchableOpacity
          style={[styles.recordButton, isRecording && styles.recording]}
          onPress={isRecording ? stopRecording : record}
        >
          <Ionicons
            name={isRecording ? 'stop-circle' : 'mic'}
            size={32}
            color="#fff"
          />
          <Text style={styles.recordButtonText}>
            {isRecording ? '녹음 중지' : '녹음 시작'}
          </Text>
        </TouchableOpacity>
      </View>
      {/* ⏳ 녹음 시간 표시 */}
      {isRecording && (
        <Text style={styles.timerText}>
          ⏳ 녹음 시간: {formatTime(recordingTime)}
        </Text>
      )}
      {!isRecording && recordedUri && (
        <View style={styles.audioInfo}>
          <AudioPlayer uri={recordedUri} />
        </View>
      )}
      <TouchableOpacity
        style={[
          styles.uploadButton,
          !recordedUri && styles.uploadButtonDisabled,
        ]}
        onPress={uploadAudio}
        disabled={
          !recordedUri ||
          isLoading ||
          data?.processInterviewAudio.feedback !== undefined
        }
      >
        {isLoading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.uploadButtonText}>답변 제출</Text>
        )}
      </TouchableOpacity>
      {isLoading && (
        <Text style={styles.loadingText}>
          ⏳ 피드백을 생성하는 중입니다. 약 10~15초 정도 소요되니 잠시만 기다려
          주세요.
        </Text>
      )}
      {/* 피드백 항목들 */}
      {data?.processInterviewAudio.feedback && (
        <FeedbackCard
          title="피드백"
          feedback={data?.processInterviewAudio.feedback}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  question: {
    fontSize: 18,
    fontWeight: '600',
    marginVertical: 20,
    color: '#333',
    textAlign: 'center',
  },
  recordingContainer: {
    marginBottom: 20,
    width: '100%',
    alignItems: 'center',
  },
  recordButton: {
    backgroundColor: '#007bff',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 50,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    elevation: 4, // 그림자 효과
  },
  recording: {
    backgroundColor: '#ff4d4d',
  },
  recordButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 10,
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
  },
  uriText: {
    fontSize: 14,
    color: '#888',
    marginVertical: 10,
    textAlign: 'center',
  },
  uploadButton: {
    backgroundColor: '#28a745',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
    elevation: 4,
  },
  timerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ff4d4d',
    marginBottom: 15,
  },
  uploadButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  uploadButtonDisabled: {
    backgroundColor: '#ccc',
  },
  feedback: {
    marginTop: 20,
    fontSize: 16,
    color: 'green',
    textAlign: 'center',
  },
  feedbackSection: {
    marginTop: 20,
    width: '100%',
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  feedbackTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#007bff',
    marginBottom: 5,
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#555', // 부드러운 색상으로 가독성 확보
    textAlign: 'center',
    marginTop: 10,
    backgroundColor: '#f0f0f0', // 약간의 배경색 추가
    padding: 10,
    borderRadius: 8,
  },
});

export default AudioRecorder;
