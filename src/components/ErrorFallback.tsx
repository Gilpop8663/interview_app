import { View, Text, Button, StyleSheet } from 'react-native';

export const ErrorFallback = ({ error, resetErrorBoundary }: any) => {
  console.log(error);
  return (
    <View style={styles.errorContainer}>
      <Text style={styles.errorText}>
        🚨 에러 발생: {error?.message || '에러가 발생했습니다.'}
      </Text>
      <Button title="다시 시도" onPress={resetErrorBoundary} />
    </View>
  );
};

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
});
