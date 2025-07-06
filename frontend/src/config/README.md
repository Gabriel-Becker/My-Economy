# Configuração de Rede - My Economy

## 📱 Configuração Automática

O projeto está configurado para funcionar automaticamente em diferentes ambientes:

### 🖥️ **Emulador Android**
- **URL**: `http://10.0.2.2:8080`
- **Detecção**: Automática
- **Funciona**: Sim

### 🍎 **Emulador iOS**
- **URL**: `http://localhost:8080`
- **Detecção**: Automática
- **Funciona**: Sim

### 📱 **Dispositivo Físico**
- **URL**: `http://192.168.15.15:8080`
- **Detecção**: Manual (configurar IP)
- **Funciona**: Sim

## ⚙️ **Como Configurar**

### 1. **Descobrir seu IP**
```bash
# Windows
ipconfig

# macOS/Linux
ifconfig
```

### 2. **Alterar IP no Config**
Edite o arquivo `frontend/src/config/api.js`:

```javascript
export const API_CONFIG = {
  LOCAL_IP: 'SEU_IP_AQUI', // Ex: '192.168.1.100'
  PORT: 8080,
  TIMEOUT: 10000,
};
```

### 3. **Verificar Conectividade**
```bash
# Teste se o backend está rodando
curl http://SEU_IP:8080/health
```

## 🔧 **Troubleshooting**

### **Problema**: App não conecta ao backend
**Solução**:
1. Verifique se o backend está rodando
2. Confirme o IP no arquivo de configuração
3. Teste a conectividade com `ping SEU_IP`

### **Problema**: Emulador não conecta
**Solução**:
1. Use `10.0.2.2` para Android
2. Use `localhost` para iOS
3. Verifique se o backend aceita conexões externas

### **Problema**: Dispositivo físico não conecta
**Solução**:
1. Verifique se estão na mesma rede WiFi
2. Confirme o IP da máquina
3. Desative firewall temporariamente para teste

## 📋 **IPs Comuns**

| Rede | IP Padrão | Gateway |
|------|-----------|---------|
| 192.168.1.x | 192.168.1.100 | 192.168.1.1 |
| 192.168.15.x | 192.168.15.15 | 192.168.15.1 |
| 192.168.0.x | 192.168.0.100 | 192.168.0.1 |

## 🚀 **Dicas Rápidas**

1. **Para desenvolvimento rápido**: Use emulador
2. **Para testes reais**: Use dispositivo físico
3. **Para produção**: Configure IP fixo do servidor
4. **Para debug**: Verifique logs do console

## 📝 **Notas**

- O IP `192.168.15.15` é o padrão configurado
- Altere apenas se necessário
- Em produção, use IP fixo do servidor
- Para desenvolvimento, emulador é mais rápido 