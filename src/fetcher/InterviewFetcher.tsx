import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import AudioRecorder from '../../src/components/AudioRecoder';
import { useGetInterviewQuestions } from '../hooks/query/useGetInterviewQuestions';

export default function InterviewFetcher() {
  const { data, questionIndex, handleNextQuestion } =
    useGetInterviewQuestions();

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <AudioRecorder
          question={data.getInterviewQuestions[questionIndex].question}
        />

        <TouchableOpacity
          style={styles.nextButton}
          onPress={handleNextQuestion}
        >
          <Text style={styles.nextButtonText}>다음 질문</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingBottom: 20, // ScrollView 하단 여백 추가
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  question: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  nextButton: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
    width: '80%',
    elevation: 4, // 그림자 효과
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  feedback: {
    marginTop: 20,
    fontSize: 16,
    color: 'green',
    textAlign: 'center',
    fontWeight: '600',
  },
});
