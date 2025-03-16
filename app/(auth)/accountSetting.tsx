import { useMe } from '@hooks/query/user/useMe';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  View,
  Text,
  TextInput,
  Alert,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

interface FormData {
  nickname: string;
}

export default function AccountSetting() {
  const { data } = useMe();
  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<FormData>();

  const isValidNickname = (nickname: string) => {
    const regex = /^[a-zA-Z0-9가-힣]*$/;
    return regex.test(nickname);
  };

  // 닉네임 변경 처리
  const handleNicknameChange = (data: FormData) => {
    const { nickname } = data;

    if (!isValidNickname(nickname)) {
      setError('nickname', {
        type: 'manual',
        message:
          '닉네임은 최소 2자 이상이어야 하며, 한글과 숫자만 포함해야 합니다.',
      });
      return;
    }

    if (nickname.trim()) {
      Alert.alert('닉네임 변경', `닉네임이 변경되었습니다: ${nickname}`);
      // 서버에 닉네임 업데이트 요청을 여기에 추가
    } else {
      Alert.alert('알림', '유효한 닉네임을 입력해 주세요.');
    }
  };

  // 회원 탈퇴 처리
  const handleDeleteAccount = () => {
    Alert.alert('계정 삭제', '정말로 계정을 삭제하시겠습니까?', [
      { text: '취소', style: 'cancel' },
      {
        text: '확인',
        onPress: () => Alert.alert('알림', '계정이 삭제되었습니다.'),
      },
    ]);
  };

  // 로그아웃 처리
  const handleLogout = () => {
    Alert.alert('알림', '로그아웃되었습니다.');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>계정 설정</Text>

      {/* 이메일 정보 */}
      <View style={styles.settingItem}>
        <Text style={styles.emailText}>이메일: {data.me.email}</Text>
      </View>

      {/* 이메일 정보 */}
      <View style={styles.settingItem}>
        <Text style={styles.emailText}>
          서비스 타입:{' '}
          {data.me.subscriptionType === 'PREMIUM' ? '프리미엄' : '무료'}
        </Text>
      </View>

      {/* 닉네임 변경 */}
      <View style={styles.settingItem}>
        <Controller
          control={control}
          name="nickname"
          defaultValue={data.me.nickname}
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

        <TouchableOpacity
          style={styles.button}
          onPress={handleSubmit(handleNicknameChange)}
        >
          <Text style={styles.buttonText}>닉네임 변경</Text>
        </TouchableOpacity>
      </View>

      {/* 회원 탈퇴 */}
      <View style={styles.settingItem}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#dc3545' }]}
          onPress={handleDeleteAccount}
        >
          <Text style={styles.buttonText}>회원 탈퇴</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f9f9f9',
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  settingItem: {
    marginBottom: 20,
  },
  emailText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
  },
  input: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 10,
    fontSize: 16,
  },
  button: {
    width: '100%',
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#007bff',
    borderRadius: 4, // 네모 모양으로 설정
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  error: {
    color: 'red', // 오류 메시지를 빨간색으로
    fontSize: 14, // 폰트 크기
    marginTop: 5, // 입력 필드와 오류 메시지 간의 간격
  },
});
