import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import * as Speech from 'expo-speech';
import AudioRecorder from '../../src/components/AudioRecoder';

const InterviewScreen = () => {
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState('');

  const questions = [
    'React에서 상태 관리는 어떻게 하나요?',
    '컴포넌트와 컨테이너의 차이점은 무엇인가요?',
    // 더 많은 질문을 여기에 추가
  ];

  const handleAnswerChange = (text: string) => {
    setAnswer(text);
  };

  const handleSubmitAnswer = () => {
    // 피드백 로직 추가 (예: 적절한 답변인지 평가)
    if (answer.toLowerCase().includes('state')) {
      setFeedback('매우 좋은 답변입니다! 상태 관리에 대한 이해가 좋네요.');
    } else {
      setFeedback('답변을 조금 더 구체적으로 설명해 주세요.');
    }
  };

  const handleSpeech = () => {
    Speech.speak(questions[0], { language: 'ko' });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.question}>{questions[0]}</Text>
      <TextInput
        style={styles.input}
        placeholder="답변을 입력하세요..."
        value={answer}
        onChangeText={handleAnswerChange}
      />
      <AudioRecorder />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  question: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '80%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 20,
    paddingLeft: 10,
  },
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

export default InterviewScreen;
