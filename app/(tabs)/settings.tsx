import { useAuth } from '@contexts/AuthContext';
import { ROUTES } from '@src/routes';
import { Link } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';

export default function SettingsTab() {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    Alert.alert('로그아웃 성공', '로그아웃되었습니다.');
  };

  const handleAppInfo = () => {
    Alert.alert('앱 정보', '현재 버전: 0.0.1v');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>설정</Text>
      <View style={styles.settingItem}>
        <Link
          href={ROUTES.ACCOUNT_SETTING}
          style={[styles.button, styles.fullWidth]}
        >
          <Text style={styles.buttonText}>계정 설정</Text>
        </Link>
      </View>

      <View style={styles.settingItem}>
        <TouchableOpacity
          style={[styles.button, styles.fullWidth]}
          onPress={handleAppInfo}
        >
          <Text style={styles.buttonText}>앱 정보</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.settingItem}>
        <TouchableOpacity
          style={[
            styles.button,
            styles.fullWidth,
            { backgroundColor: '#dc3545' },
          ]} // 빨간색으로 설정
          onPress={handleLogout}
        >
          <Text style={styles.buttonText}>로그아웃</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 60,
    textAlign: 'center',
    color: '#333',
  },
  settingItem: {
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    elevation: 4, // 그림자 효과 추가
  },
  fullWidth: {
    width: '100%', // 버튼이 전체 너비를 차지하도록 설정
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
});
