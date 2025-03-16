import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { Link, useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import Checkbox from 'expo-checkbox';
import { useLogin } from '@hooks/mutate/user/useLogin';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '@constants/storage';
import { useAuth } from '@contexts/AuthContext';

interface FormData {
  email: string;
  password: string;
}

const LoginScreen = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();
  const { login } = useLogin();
  const router = useRouter();
  const { setToken } = useAuth();

  const [rememberMe, setRememberMe] = useState(true);

  const handleLogin = async (data: { email: string; password: string }) => {
    const { email, password } = data;

    console.log('로그인 시도:', { email, password });
    const result = await login({ email, password, rememberMe });

    if (result?.ok) {
      const { token, refreshToken } = result;

      if (token) {
        await SecureStore.setItemAsync(ACCESS_TOKEN, token ?? '');
      }
      if (refreshToken) {
        await SecureStore.setItemAsync(REFRESH_TOKEN, refreshToken ?? '');
      }

      setToken(token ?? null);
      router.push('/(tabs)');
      Alert.alert('로그인 성공', '로그인에 성공했습니다!');
      return;
    }

    Alert.alert('로그인 실패', '이메일 또는 비밀번호가 잘못되었습니다.');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>로그인</Text>

      {/* 이메일 입력 */}
      <Controller
        control={control}
        name="email"
        rules={{
          required: '이메일은 필수 입력 항목입니다.',
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
              onChangeText={(text) => {
                onChange(text.toLocaleLowerCase());
              }}
              value={value}
            />
            {errors.email && (
              <Text style={styles.errorText}>{errors.email.message}</Text>
            )}
          </>
        )}
      />

      {/* 비밀번호 입력 */}
      <Controller
        control={control}
        name="password"
        rules={{
          required: '비밀번호는 필수 항목입니다.',
          minLength: {
            value: 8,
            message: '비밀번호는 8자 이상이어야 합니다.',
          },
          maxLength: {
            value: 64,
            message: '비밀번호는 64자 이하이어야 합니다.',
          },
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <>
            <TextInput
              style={styles.input}
              placeholder="비밀번호"
              secureTextEntry
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
            {errors.password && (
              <Text style={styles.errorText}>{errors.password.message}</Text>
            )}
          </>
        )}
      />

      {/* rememberMe 체크박스 */}
      <View style={styles.subContainer}>
        <View style={styles.checkboxContainer}>
          <Checkbox value={rememberMe} onValueChange={setRememberMe} />
          <Text style={styles.checkboxText}>자동 로그인</Text>
        </View>
        <View style={styles.forgotPasswordContainer}>
          <Link href="/forgotPassword">
            <Text style={styles.forgotPasswordText}>
              비밀번호를 잊으셨나요?
            </Text>
          </Link>
        </View>
      </View>

      {/* 로그인 버튼 */}
      <TouchableOpacity
        style={styles.loginButton}
        onPress={handleSubmit(handleLogin)}
      >
        <Text style={styles.loginButtonText}>로그인</Text>
      </TouchableOpacity>

      {/* 로그인 또는 */}
      <View style={styles.orContainer}>
        <View style={styles.orLine} />
        <Text style={styles.orText}>또는</Text>
        <View style={styles.orLine} />
      </View>

      {/* 회원가입 */}
      <View style={styles.signupContainer}>
        <Link style={styles.signUp} href="/signUp">
          <Text style={styles.signUpText}>계정이 없으신가요? 회원가입</Text>
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
    fontSize: 36,
    fontWeight: '700',
    color: '#333',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  checkboxText: {
    fontSize: 16,
    color: '#333',
  },
  forgotPasswordContainer: {},
  forgotPasswordText: {
    fontSize: 16,
    color: '#0066CC',
    fontWeight: '600',
  },
  signupContainer: {
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
  },
  signupText: {
    fontSize: 16,
    color: '#666',
  },
  signUp: {
    marginTop: 10,
  },
  signUpText: {
    fontSize: 16,
    color: '#0066CC',
    fontWeight: '600',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 5,
  },
  subContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  loginButton: {
    backgroundColor: '#007bff',
    width: '100%',
    paddingVertical: 14,
    borderRadius: 8,
    marginBottom: 20,
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  orContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  orText: {
    fontSize: 16,
    color: '#666',
    marginHorizontal: 10,
  },
  orLine: {
    width: '30%',
    height: 1,
    backgroundColor: '#ccc',
  },
});

export default LoginScreen;
