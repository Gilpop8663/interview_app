import { useEffect, useState } from 'react';
import {
  View,
  Button,
  Alert,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useAudioRecorder, AudioModule, RecordingPresets } from 'expo-audio';
import AudioPlayer from './AudioPlayer';
import * as FileSystem from 'expo-file-system'; // 파일 읽기 용도
import { useUploadSpeechFile } from '../hooks/mutate/useUploadSpeechFile';

const AudioRecorder = () => {
  const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const [recordedUri, setRecordedUri] = useState<string | null>(null); // 녹음 파일 URI 상태 추가
  const [isRecording, setIsRecording] = useState(false); // 녹음 상태 추가
  const { uploadSpeechFile, data } = useUploadSpeechFile();

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
      // 📌 파일을 Base64로 읽어와 Blob으로 변환
      const base64 = await FileSystem.readAsStringAsync(recordedUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // GraphQL로 파일 전송
      const result = await uploadSpeechFile(base64);

      console.log('업로드 성공:', result);
      Alert.alert('업로드 성공', `URL: ${result?.feedback}`);
    } catch (error) {
      console.error('업로드 실패:', error);
      Alert.alert('업로드 실패', '서버 오류');
    }
  };

  const stopRecording = async () => {
    // The recording will be available on `audioRecorder.uri`.
    await audioRecorder.stop();

    setRecordedUri(audioRecorder.uri); // 녹음 후 URI 저장
    setIsRecording(false);
    console.log(audioRecorder.uri);
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
    <View>
      <Button
        title={isRecording ? '녹음 중지' : '녹음 시작'}
        onPress={isRecording ? stopRecording : record}
      />
      {recordedUri && <Text>녹음 파일 경로: {recordedUri}</Text>}
      {/* 녹음 파일 경로 화면에 표시 */}
      {recordedUri && <AudioPlayer uri={recordedUri} />}

      <TouchableOpacity style={styles.button} onPress={uploadAudio}>
        <Button title="답변 제출" onPress={uploadAudio} />
      </TouchableOpacity>

      {data?.uploadSpeechFile.feedback && (
        <Text style={styles.feedback}>{data?.uploadSpeechFile.feedback}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    marginVertical: 10,
    width: '80%',
  },
  feedback: {
    marginTop: 20,
    fontSize: 16,
    color: 'green',
  },
});

export default AudioRecorder;
