import { Platform } from 'react-native';

const LOCAL_IP = '192.168.15.15';
const PORT = 8080;

export const getBaseURL = () => {
  if (__DEV__) {
    if (Platform.OS === 'android') {
      return `http://10.0.2.2:${PORT}`;
    } else if (Platform.OS === 'ios') {
      return `http://localhost:${PORT}`;
    }
  }
  return `http://${LOCAL_IP}:${PORT}`;
};

export const getAxiosConfig = () => ({
  baseURL: getBaseURL(),
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
}); 