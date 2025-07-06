import { Platform } from 'react-native';

// Função para obter o IP da máquina (simulada)
// Em um ambiente real, você pode usar bibliotecas como 'react-native-network-info'
export const getLocalIP = () => {
  // Lista de IPs comuns para testar
  const commonIPs = [
    '192.168.1.100',
    '192.168.1.101',
    '192.168.15.15',
    '192.168.0.100',
    '10.0.2.2', // Emulador Android
    'localhost', // Emulador iOS
  ];
  
  // Por enquanto, retorna o IP configurado
  // Você pode implementar detecção automática aqui
  return '192.168.15.15';
};

// Função para testar conectividade
export const testConnection = async (ip, port = 8080) => {
  try {
    const response = await fetch(`http://${ip}:${port}/health`, {
      method: 'GET',
      timeout: 5000,
    });
    return response.ok;
  } catch (error) {
    return false;
  }
};

// Função para detectar o melhor IP automaticamente
export const detectBestIP = async () => {
  const commonIPs = [
    '192.168.15.15',
    '192.168.1.100',
    '192.168.1.101',
    '192.168.0.100',
  ];
  
  for (const ip of commonIPs) {
    const isConnected = await testConnection(ip);
    if (isConnected) {
      return ip;
    }
  }
  
  // Se nenhum IP funcionar, retorna o padrão
  return '192.168.15.15';
}; 