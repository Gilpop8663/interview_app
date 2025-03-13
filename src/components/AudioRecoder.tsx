import { useEffect, useState } from 'react';
import {
  View,
  Button,
  Alert,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { useAudioRecorder, AudioModule, RecordingPresets } from 'expo-audio';
import AudioPlayer from './AudioPlayer';
import * as FileSystem from 'expo-file-system'; // 파일 읽기 용도
import { useProcessInterviewAudio } from '../hooks/mutate/useUploadSpeechFile';
import { Ionicons } from '@expo/vector-icons'; // 아이콘 추가

interface Props {
  question: string;
}

const AudioRecorder = ({ question }: Props) => {
  const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const [recordedUri, setRecordedUri] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { processInterviewAudio, data } = useProcessInterviewAudio();

  const record = async () => {
    await audioRecorder.prepareToRecordAsync();
    audioRecorder.record();
    setIsRecording(true);
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
    await audioRecorder.stop();
    setRecordedUri(audioRecorder.uri);
    setIsRecording(false);
    Alert.alert('녹음이 완료되었습니다!', `파일 경로: ${audioRecorder.uri}`);
  };

  useEffect(() => {
    (async () => {
      const status = await AudioModule.requestRecordingPermissionsAsync();
      if (!status.granted) {
        Alert.alert('Permission to access microphone was denied');
      }
    })();
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

      {recordedUri && (
        <View style={styles.audioInfo}>
          <Text style={styles.recordedText}>녹음 파일 경로:</Text>
          <Text style={styles.uriText}>{recordedUri}</Text>
          <AudioPlayer uri={recordedUri} />
        </View>
      )}

      <TouchableOpacity
        style={[
          styles.uploadButton,
          !recordedUri && styles.uploadButtonDisabled,
        ]}
        onPress={uploadAudio}
        disabled={!recordedUri || isLoading}
      >
        {isLoading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.uploadButtonText}>답변 제출</Text>
        )}
      </TouchableOpacity>

      {data?.processInterviewAudio.feedback && (
        <Text style={styles.feedback}>
          {data?.processInterviewAudio.feedback}
        </Text>
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
});

export default AudioRecorder;
