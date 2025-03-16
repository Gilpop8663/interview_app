import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useSendVerifyEmail } from '@hooks/mutate/user/useSendVerifyEmail';
import { useVerifyEmail } from '@hooks/mutate/user/useVerifyEmail';
import { useCreateAccount } from '@hooks/mutate/user/useCreateAccount';
import { useRouter } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import * as SecureStore from 'expo-secure-store';
import { ACCESS_TOKEN } from '@constants/storage';

interface FormData {
  email: string;
  password: string;
  confirmPassword: string;
  nickname: string;
  verificationCode: string;
}

const SignupScreen = () => {
  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<FormData>(); // react-hook-form 사용
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isVerificationCodeSent, setIsVerificationCodeSent] = useState(false); // 이메일 인증 코드 발송 여부
  const { sendVerifyEmail } = useSendVerifyEmail();
  const { verifyEmail } = useVerifyEmail();
  const { createAccount, loading } = useCreateAccount();
  const router = useRouter();

  const isValidPassword = (password: string) => {
    const regex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  };

  const isValidEmail = (email: string) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return regex.test(email);
  };

  const isValidNickname = (nickname: string) => {
    const regex = /^[a-zA-Z0-9가-힣]*$/;
    return regex.test(nickname);
  };

  const handleSignup = async (data: FormData) => {
    const { confirmPassword, email, nickname, password } = data;

    if (loading) return;

    const errors: string[] = [];

    if (password !== confirmPassword) {
      errors.push('비밀번호가 일치하지 않습니다.');

      setError('confirmPassword', {
        type: 'manual',
        message: '비밀번호가 일치하지 않습니다.',
      });
    }

    if (!isEmailVerified) {
      errors.push('이메일 인증이 필요합니다.');

      setError('email', {
        type: 'manual',
        message: '이메일 인증이 필요합니다.',
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

    if (!isValidNickname(nickname)) {
      errors.push(
        '닉네임은 최소 2자 이상이어야 하며, 한글과 숫자만 포함해야 합니다.'
      );

      setError('nickname', {
        type: 'manual',
        message:
          '닉네임은 최소 2자 이상이어야 하며, 한글과 숫자만 포함해야 합니다.',
      });
    }

    if (errors.length > 0) {
      Alert.alert('회원가입 오류', errors.join('\n'));
      return;
    }

    const result = await createAccount({
      email,
      nickname,
      password,
    });

    if (result?.ok) {
      Alert.alert('회원가입 성공', '회원가입에 성공했습니다');

      if (result.token) {
        await SecureStore.setItemAsync(ACCESS_TOKEN, result.token);
      }
      router.push('/(tabs)');
      return;
    }

    Alert.alert('회원가입 실패', result?.error);
  };

  const handleVerifyEmail = async () => {
    const { email, verificationCode } = getValues();
    const result = await verifyEmail({ email, code: verificationCode });

    if (result?.ok) {
      setIsEmailVerified(true);
      clearErrors('verificationCode');
      Alert.alert('이메일 인증 완료', '이메일 인증이 완료되었습니다.');

      return;
    }

    setError('verificationCode', {
      type: 'manual',
      message: result?.error || '잘못된 인증번호입니다.',
    });
    Alert.alert('인증 실패', result?.error || '잘못된 인증번호입니다.');
  };

  const handleEmailChange = () => {
    setValue('verificationCode', '');
    clearErrors('verificationCode');

    setIsVerificationCodeSent(false);
    setIsEmailVerified(false);
  };

  const handleSendVerificationCode = async () => {
    const email = getValues('email');

    if (!isValidEmail(email)) {
      Alert.alert('잘못된 이메일 형식', '올바른 이메일 주소를 입력해 주세요.');
      return;
    }

    const result = await sendVerifyEmail(email);

    if (result?.ok) {
      setIsVerificationCodeSent(true);
      Alert.alert(
        '이메일 인증 번호 전송',
        '이메일로 인증 번호를 전송했습니다.'
      );
      return;
    }

    const errorMessage =
      result?.error || '이미 해당 이메일로 가입된 계정이 있습니다.';

    setError('email', {
      type: 'manual',
      message: errorMessage,
    });
    Alert.alert('이메일 인증 번호 전송 실패', errorMessage);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>회원가입</Text>

      <Controller
        control={control}
        name="email"
        rules={{
          required: '이메일은 필수 항목입니다.',
          pattern: {
            value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
            message: '유효한 이메일 주소를 입력해주세요.',
          },
        }}
        render={({ field: { onChange, value } }) => (
          <>
            <TextInput
              style={styles.input}
              placeholder="이메일"
              value={value}
              onChangeText={(text) => {
                onChange(text.toLocaleLowerCase());
                handleEmailChange();
              }}
            />
            {errors.email && (
              <Text style={styles.error}>
                {typeof errors.email.message === 'string'
                  ? errors.email.message
                  : '이메일 입력에 오류가 있습니다.'}
              </Text>
            )}
          </>
        )}
      />

      {!isVerificationCodeSent && (
        <Button
          title="이메일 인증 받기"
          onPress={handleSendVerificationCode}
          disabled={isVerificationCodeSent} // 인증을 보낸 후 버튼 비활성화
        />
      )}

      {isVerificationCodeSent && (
        <>
          <View style={styles.row}>
            <Controller
              control={control}
              name="verificationCode"
              rules={{
                required: '인증번호는 필수 항목입니다.',
              }}
              render={({ field: { onChange, value } }) => (
                <>
                  <TextInput
                    style={[
                      styles.input,
                      styles.inputVerification,
                      isEmailVerified && styles.disabledInput,
                    ]}
                    placeholder="이메일 인증번호 입력"
                    value={value}
                    onChangeText={onChange}
                    editable={!isEmailVerified} // isVerified가 true일 경우 비활성화됨
                  />
                </>
              )}
            />

            <Button
              title="이메일 인증"
              onPress={handleVerifyEmail}
              disabled={isEmailVerified}
            />
          </View>
          {errors.verificationCode && (
            <Text style={styles.error}>
              {typeof errors.verificationCode.message === 'string'
                ? errors.verificationCode.message
                : '인증번호 입력에 오류가 있습니다.'}
            </Text>
          )}
          {isEmailVerified && (
            <Text style={styles.success}>이메일 인증 완료</Text>
          )}
        </>
      )}

      <Controller
        control={control}
        name="nickname"
        rules={{
          required: '닉네임은 필수 항목입니다.',
          minLength: {
            value: 2,
            message: '닉네임은 2자 이상이어야 합니다.',
          },
          maxLength: {
            value: 20,
            message: '닉네임은 20자 이하이어야 합니다.',
          },
          pattern: {
            value: /^[a-zA-Z0-9가-힣]*$/, // 영문, 숫자, 한글만 허용 (특수문자는 허용하지 않음)
            message: '닉네임에 특수문자는 사용할 수 없습니다.',
          },
        }}
        render={({ field: { onChange, value } }) => (
          <>
            <TextInput
              style={styles.input}
              placeholder="닉네임"
              value={value}
              onChangeText={onChange}
            />
            {errors.nickname && (
              <Text style={styles.error}>
                {typeof errors.nickname.message === 'string'
                  ? errors.nickname.message
                  : '닉네임 입력에 오류가 있습니다.'}
              </Text>
            )}
          </>
        )}
      />
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
        render={({ field: { onChange, value } }) => (
          <>
            <TextInput
              style={styles.input}
              placeholder="비밀번호"
              secureTextEntry
              value={value}
              onChangeText={onChange}
            />
            {errors.password && (
              <Text style={styles.error}>{errors.password.message}</Text>
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
        render={({ field: { onChange, value } }) => (
          <>
            <TextInput
              style={styles.input}
              placeholder="비밀번호 재확인"
              secureTextEntry
              value={value}
              onChangeText={onChange}
            />
            {errors.confirmPassword && (
              <Text style={styles.error}>{errors.confirmPassword.message}</Text>
            )}
          </>
        )}
      />

      {/* 이메일 인증 받기 버튼 */}
      <Button title="회원가입" onPress={handleSubmit(handleSignup)} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
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
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
  },
  inputVerification: {
    flex: 1, // 입력칸이 버튼과 동일한 비율로 차지하도록 함
    marginRight: 10, // 버튼과 입력칸 사이에 간격을 줌
  },
  row: {
    flexDirection: 'row', // 수평으로 배치
    alignItems: 'center', // 세로 정렬
    width: '100%', // 부모의 너비를 다 채우도록
  },
  success: {
    color: 'green',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 15,
    paddingHorizontal: 30,
    marginVertical: 10,
    width: '80%',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4, // 그림자 효과 추가
  },
  disabledInput: {
    backgroundColor: '#f0f0f0', // 비활성화 시 배경색을 회색으로 변경
    color: '#bbb', // 글자색을 회색으로 변경
    borderColor: '#ddd', // 테두리 색을 더 밝은 회색으로 변경
  },
  error: {
    color: 'red', // 오류 메시지를 빨간색으로
    fontSize: 14, // 폰트 크기
    marginTop: 5, // 입력 필드와 오류 메시지 간의 간격
  },
});

export default SignupScreen;
