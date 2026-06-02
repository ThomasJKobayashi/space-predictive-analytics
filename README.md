# 🛰️ Space Predictive Analytics

### Global Solution 2026.1 — Cross-Platform Application Development | FIAP

![Space Predictive Analytics Banner](./assets/screenshots/home.png)

## Descrição

O **Space Predictive Analytics** é uma plataforma mobile de análise preditiva para monitoramento de sistemas espaciais e operações orbitais simuladas. O app coleta, organiza e processa dados de sensores, energia, comunicação e estabilidade orbital em tempo real (simulado), gerando alertas automáticos baseados em limiares configuráveis e oferecendo dashboards analíticos para apoio à tomada de decisão em ambientes críticos. O diferencial da solução é a interface com tema espacial completo (dark/light mode), sistema de notificações push para alertas de missão e tipagem TypeScript em todo o projeto.

## 👥 Equipe

| Thomas Joh Kobayashi | RM562758 |


## 📱 Telas do Aplicativo

### Home — Dashboard Principal
![Home](./assets/screenshots/home.png)
> Visão geral dos indicadores da missão: dados orbitais, temperatura, bateria, sinal e radiação. Banner de status com indicador visual (nominal/warning/critical). Acesso rápido ao painel de comunicação via navegação Stack.

### Dashboard de Sensores
![Sensores](./assets/screenshots/sensores.png)
> Cards com leituras atuais de temperatura, radiação, pressão e umidade. Gráficos de linha com histórico das últimas leituras em tempo real simulado (atualização a cada 3s).

### Dashboard de Energia
![Energia](./assets/screenshots/energia.png)
> Indicadores de geração solar, consumo, nível de bateria e balanço energético. Barras de progresso para bateria, eficiência solar e relação carga/consumo. Gráficos de histórico.

### Comunicação — Detalhes (Stack)
![Comunicação](./assets/screenshots/comunicacao.png)
> Status do link de telemetria, latência, taxa de dados e perda de pacotes. Indicadores visuais de saúde do link. Gráficos de histórico para cada métrica. Acessível via navegação Stack a partir do Dashboard.

### Central de Alertas
![Alertas](./assets/screenshots/alertas.png)
> Lista de alertas ativos gerados automaticamente com nível de criticidade (critical/warning/info). Tabs para alternar entre alertas ativos e histórico. Botão para confirmar ou limpar alertas. Badge na tab com contagem de alertas ativos.

### Configurações / Formulário
![Config](./assets/screenshots/configuracoes.png)
> Formulário de configuração do nome da missão e dos 8 limiares de alerta com validação (campos obrigatórios, tipo numérico, faixa min/max). Toggle de dark mode e notificações. Feedback visual de erro e confirmação de salvamento. Dados persistidos com AsyncStorage.

## ⚙️ Funcionalidades

- [x] Dashboard com indicadores em tempo real (simulado) — atualização a cada 3s
- [x] 4 dashboards distintos: Overview, Sensores, Energia, Comunicação
- [x] Dados orbitais (altitude, velocidade, inclinação, período)
- [x] Sistema de alertas automáticos por limiar crítico
- [x] Persistência de configurações com AsyncStorage (tema, limiares, nome da missão, notificações)
- [x] Navegação com Expo Router (Tabs + Stack)
- [x] Context API para estado global da missão (MissionContext + ThemeContext)
- [x] useReducer para gerenciamento de estado complexo
- [x] Formulário de configuração com validação completa
- [x] Gráficos de linha com histórico de telemetria
- [x] Dark Mode completo (tema espacial) — **Diferencial**
- [x] Expo Notifications para alertas críticos — **Diferencial**
- [x] TypeScript em todo o projeto — **Diferencial**

## 🛠️ Tecnologias

- React Native + Expo (SDK 52)
- Expo Router (Tabs + Stack)
- AsyncStorage
- Context API + useReducer
- TypeScript
- react-native-chart-kit + react-native-svg
- expo-notifications
- @expo/vector-icons (Ionicons)

## ▶️ Como Executar

### Pré-requisitos
- Node.js instalado (v18+)
- Expo Go instalado no celular (iOS ou Android)

### Instalação

```bash
# Clone o repositório
git clone https://github.com/thomasjkobayashi/space-predictive-analytics.git

# Acesse a pasta do projeto
cd space-predictive-analytics

# Instale as dependências
npm install --legacy-peer-deps

# Inicie o projeto
npx expo start
```

Escaneie o QR Code com o Expo Go para rodar no dispositivo físico.

## 🎬 Vídeo de Demonstração

[Clique aqui para assistir à demonstração](https://youtu.be/h7NaoWQwH-A?si=ZgJqv3joGD-zMtf_)

## 📄 Licença

Este projeto foi desenvolvido para fins acadêmicos — FIAP 2026.
