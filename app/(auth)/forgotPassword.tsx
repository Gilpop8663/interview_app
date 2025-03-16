import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { Link } from 'expo-router';

interface FormData {
  email: string;
}

const ForgotPasswordScreen = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();
  const [loading, setLoading] = useState(false);

  const handleForgotPassword = async (data: { email: string }) => {
    setLoading(true);
    // const result = await forgotPassword(data.email);
    setLoading(false);

    // if (result?.ok) {
    //   Alert.alert('이메일 전송 완료', '비밀번호 재설정 링크를 확인해주세요.');
    // } else {
    //   Alert.alert('오류', '해당 이메일이 존재하지 않거나 오류가 발생했습니다.');
    // }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>비밀번호 찾기</Text>
      <Text style={styles.subtitle}>
        비밀번호를 재설정할 수 있는 링크를 이메일로 보내드립니다.
      </Text>

      {/* 이메일 입력 */}
      <Controller
        control={control}
        name="email"
        rules={{
          required: '이메일을 입력해주세요.',
          pattern: {
            value: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
            message: '올바른 이메일 주소를 입력해 주세요.',
          },
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <>
            <TextInput
              style={styles.input}
              placeholder="이메일"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            {errors.email && (
              <Text style={styles.errorText}>{errors.email.message}</Text>
            )}
          </>
        )}
      />

      <Button
        title={loading ? '처리 중...' : '비밀번호 재설정 링크 보내기'}
        onPress={handleSubmit(handleForgotPassword)}
        disabled={loading}
      />

      {/* 로그인으로 돌아가기 */}
      <View style={styles.loginContainer}>
        <Link href="/login">
          <Text style={styles.loginText}>로그인 화면으로 돌아가기</Text>
        </Link>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f4f7fc',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    padding: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 10,
  },
  loginContainer: {
    marginTop: 20,
  },
  loginText: {
    fontSize: 16,
    color: '#0066CC',
    fontWeight: '600',
  },
});

export default ForgotPasswordScreen;
