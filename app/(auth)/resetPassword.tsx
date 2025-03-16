import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { useRouter } from 'expo-router';
import { useSearchParams } from 'expo-router/build/hooks';
import { useResetPassword } from '@hooks/mutate/user/useResetPassword';
import { ROUTES } from '@src/routes';

interface FormData {
  password: string;
  confirmPassword: string;
}

const ResetPasswordScreen = () => {
  const { token } = useSearchParams() as { token?: string };
  const {
    control,
    handleSubmit,
    getValues,
    setError,
    formState: { errors },
  } = useForm<FormData>();
  const { resetPassword } = useResetPassword();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const isValidPassword = (password: string) => {
    const regex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  };

  const handleResetPassword = async (data: FormData) => {
    const { confirmPassword, password } = data;

    const errors: string[] = [];

    if (!token) {
      Alert.alert('오류', '유효하지 않은 요청입니다.');
      return;
    }

    if (password !== confirmPassword) {
      errors.push('비밀번호가 일치하지 않습니다.');

      setError('confirmPassword', {
        type: 'manual',
        message: '비밀번호가 일치하지 않습니다.',
      });
    }

    if (!isValidPassword(password)) {
      errors.push(
        '비밀번호는 최소 8자 이상이어야 하며, 숫자와 특수 문자를 포함해야 합니다.'
      );

      setError('password', {
        type: 'manual',
        message:
          '비밀번호는 최소 8자 이상이어야 하며, 숫자와 특수 문자를 포함해야 합니다.',
      });
    }

    if (errors.length > 0) {
      Alert.alert('회원가입 오류', errors.join('\n'));
      return;
    }

    setLoading(true);
    const result = await resetPassword({
      code: String(token),
      password: data.password,
    });

    setLoading(false);

    if (result?.ok) {
      Alert.alert('완료', '비밀번호가 재설정되었습니다. 로그인하세요.');
      router.push(ROUTES.LOGIN);
    } else {
      Alert.alert('오류', '비밀번호 변경에 실패했습니다.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>비밀번호 재설정</Text>
      <Text style={styles.subtitle}>새로운 비밀번호를 입력해주세요.</Text>

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
          pattern: {
            value:
              /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
            message:
              '비밀번호는 최소 8자 이상이어야 하며, 숫자와 특수 문자를 포함해야 합니다.',
          },
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <>
            <TextInput
              style={styles.input}
              placeholder="새 비밀번호"
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

      <Controller
        control={control}
        name="confirmPassword"
        rules={{
          required: '비밀번호 재확인은 필수 항목입니다.',
          validate: (value) =>
            value === getValues('password') || '비밀번호가 일치하지 않습니다.',
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <>
            <TextInput
              style={styles.input}
              placeholder="비밀번호 확인"
              secureTextEntry
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
            {errors.confirmPassword && (
              <Text style={styles.errorText}>
                {errors.confirmPassword.message}
              </Text>
            )}
          </>
        )}
      />

      <Button
        title={loading ? '처리 중...' : '비밀번호 변경'}
        onPress={handleSubmit(handleResetPassword)}
        disabled={loading}
      />
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

export default ResetPasswordScreen;
