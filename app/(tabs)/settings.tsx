import { useAuth } from '@contexts/AuthContext';
import { ROUTES } from '@src/routes';
import { Link } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity } from 'react-native';

export default function SettingsTab() {
  const { logout } = useAuth();

  const handleLogout = () => {
    // 실제 로그아웃 로직을 여기에 추가하세요.
    logout();
    alert('로그아웃되었습니다.');
  };

  const handleAppInfo = () => {
    // 앱 정보에 현재 버전을 표시
    alert('현재 버전: 0.0.1v');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>설정</Text>
      <View style={styles.settingItem}>
        <Link href={ROUTES.ACCOUNT_SETTING} style={styles.button}>
          <Text style={styles.buttonText}>계정 설정</Text>
        </Link>
      </View>

      <View style={styles.settingItem}>
        <TouchableOpacity style={styles.button} onPress={handleAppInfo}>
          <Text style={styles.buttonText}>앱 정보</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.settingItem}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#dc3545' }]} // 빨간색으로 설정
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
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 2, // 그림자 효과 추가
  },
  settingTitle: {
    fontSize: 18,
    color: '#333',
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    elevation: 4, // 그림자 효과 추가
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
});
