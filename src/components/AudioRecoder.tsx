import { useEffect } from "react";
import { View, Button, Alert } from "react-native";
import { useAudioRecorder, AudioModule, RecordingPresets } from "expo-audio";

const AudioRecorder = () => {
  const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);

  const record = async () => {
    await audioRecorder.prepareToRecordAsync();
    audioRecorder.record();
  };

  const stopRecording = async () => {
    // The recording will be available on `audioRecorder.uri`.
    await audioRecorder.stop();
  };

  useEffect(() => {
    (async () => {
      const status = await AudioModule.requestRecordingPermissionsAsync();
      if (!status.granted) {
        Alert.alert("Permission to access microphone was denied");
      }
    })();
  }, []);

  return (
    <View>
      <Button
        title={audioRecorder.isRecording ? "녹음 중지" : "녹음 시작"}
        onPress={audioRecorder.isRecording ? stopRecording : record}
      />
    </View>
  );
};

export default AudioRecorder;
