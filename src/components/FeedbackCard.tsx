import React from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';

const formatFeedback = (feedback: string) => {
  const formattedText = feedback.split('**').map((item, index) => {
    if (index % 2 === 1) {
      // 짝수 인덱스일 때는 볼드 스타일 적용
      return (
        <Text key={index} style={{ fontWeight: 'bold' }}>
          {item}
        </Text>
      );
    } else {
      return <Text key={index}>{item}</Text>;
    }
  });

  return formattedText;
};

interface Props {
  title: string;
  feedback: string;
}

export const FeedbackCard = ({ title, feedback }: Props) => {
  const { width } = Dimensions.get('window'); // 화면의 너비와 높이를 가져옵니다.

  return (
    <View style={[styles.feedbackSection, { width: width - 40 }]}>
      <Text style={styles.feedbackTitle}>{title}</Text>
      <Text style={styles.feedback}>{formatFeedback(feedback)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  feedback: {
    marginTop: 20,
    fontSize: 16,
    color: 'green',
    textAlign: 'justify', // 양쪽 정렬
    flexWrap: 'wrap', // 자동 줄바꿈
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
});
