# OpenECU - Simulador Educacional de Mapas RPM × Carga

Um simulador educacional para aprender interpolação bilinear em mapas 2D de injeção de combustível (RPM × Carga), desenvolvido com Next.js no frontend e Node.js/Express no backend.

🌐 **Deploy em Produção**: https://open-ecu.vercel.app/

##  Sobre o Projeto

O OpenECU Dashboard é uma aplicação web que permite:
- **Simulação de ECU**: Simular cálculos de injeção combustível com mapas 2D
- **Monitoramento de Sensores**: Visualizar dados de sensores (RPM, temperatura, pressão)
- **Histórico de Execuções**: Analisar execuções anteriores com gráficos e filtros
- **Gerenciamento de Mapas**: Criar e gerenciar mapas de calibração bidimensionais

### ⚠️ Importante: Natureza do Projeto

**Este é um projeto educacional/didático**, não uma simulação realista de ECU automotiva. Foi desenvolvido para fins de aprendizado sobre conceitos de calibração e processamento de mapas, não para uso em calibração real de motores.

##  Modelo de Cálculo (Abstração)

###  O que é implementado fielmente:
- **Interpolação Bilinear**: Método real usado em ECUs automotivas (RPM × Carga)
- **Estrutura de Mapas 2D**: Tabelas de consulta com bins de RPM e carga
- **Fluxo de Cálculo**: Sensor → Lookup no mapa → Correções → Saída
- **Conceito de Tempo de Injeção**: Cálculo simplificado de ms (milissegundos)

### ⚠️ O que é abstrato/simplificado:
- **Apenas 2 dimensões**: ECUs reais usam 3-4 dimensões (RPM, Load, Temperatura, MAF, etc)
- **Correções hardcoded**: Em vez de tabelas dinâmicas
  - Temperatura: apenas 2 faixas (>90°C vs ≤90°C)
  - Lambda: apenas 2 faixas (<1 vs ≥1)
- **Sem feedback em tempo real**: Sem PID closed-loop
- **Sem segurança**: Sem rev limit, fuel cut, limitadores
- **Sem dinâmica de injetor**: Não considera tempo de abertura da válvula

###  Não implementado:
- Correção de pressão atmosférica (MAP dinâmico)
- Correção de voltagem de bateria (VBat)
- Sistema EGR (recirculação de gases)
- Cálculo de ar condicionado (AC load)
- Mapas tridimensionais ou superiores
- Transições suaves (ramp rates)
- Limitações de torque/potência
- Feedback controlado por sensor de oxigênio

##  Caso de Uso Apropriado

** Recomendado para:**
- Aprender conceitos de ECU e calibração
- Entender interpolação bilinear em mapas
- Fins educacionais e acadêmicos
- Prototipagem de conceitos
- Estrutura base para expandir

** NÃO recomendado para:**
- Calibração real de motores
- Simulação realista de performance
- Aplicações de produção
- Comparação com ECUs reais

##  Tecnologias Utilizadas

### Frontend
- **Next.js 16** - Framework React para produção
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Framework CSS utilitário
- **Recharts** - Biblioteca de gráficos para visualizações

### Backend
- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web minimalista
- **CORS** - Middleware para requisições cross-origin
- **File System** - Armazenamento de dados em JSON (desenvolvimento apenas)

##  Estrutura do Projeto

```
open-ecu/
├── backend/                      # API REST
│   ├── controllers/              # Controladores (lógica de requisições)
│   │   ├── ecuController.js      # Cálculos de ECU
│   │   ├── sensorController.js   # Gerenciamento de sensores
│   │   └── runController.js      # Histórico de execuções
│   ├── routes/                   # Definições de rotas
│   │   ├── ecuRoutes.js          # Rotas de mapas
│   │   ├── sensorRoutes.js       # Rotas de sensores
│   │   └── runRoutes.js          # Rotas de execuções
│   ├── services/                 # Lógica de negócio
│   │   ├── ecuService.js         # Interpolação e cálculos (bilinear)
│   │   ├── sensorService.js      # Gerenciamento de sensores
│   │   └── runService.js         # Histórico de execuções
│   ├── data/                     # Arquivos JSON (persistência)
│   │   ├── maps.json             # Mapas de calibração
│   │   ├── sensors.json          # Leituras de sensores
│   │   └── runs.json             # Histórico de execuções
│   ├── server.js                 # Ponto de entrada / configuração
│   └── package.json              # Dependências
│
├── frontend/                     # Aplicação Next.js
│   ├── app/                      # Pages e layout (App Router)
│   │   ├── page.tsx              # Página principal
│   │   ├── layout.tsx            # Layout global
│   │   ├── globals.css           # Estilos globais
│   │   ├── components/           # Componentes React
│   │   │   ├── DashboardTabs.tsx     # Navegação de abas
│   │   │   ├── SimulationPanel.tsx   # Painel de simulação
│   │   │   ├── RunEngineForm.tsx     # Formulário de execução
│   │   │   ├── RunChart.tsx          # Gráfico de execuções
│   │   │   ├── RunHistory.tsx        # Histórico filtrável
│   │   │   ├── MapForm.tsx           # Criação de mapas
│   │   │   ├── SensorForm.tsx        # Criação de sensores
│   │   │   └── RunSection.tsx        # Seção de histórico
│   │   └── services/             # Serviços de API
│   │       └── api.ts            # Chamadas HTTP ao backend
│   ├── public/                   # Assets estáticos
│   ├── package.json              # Dependências
│   ├── next.config.ts            # Configuração Next.js
│   ├── tsconfig.json             # Configuração TypeScript
│   └── tailwind.config.ts        # Configuração Tailwind
│
└── docs/                         # Documentação (em expansão)
```

##  Como Executar Localmente

### Pré-requisitos
- **Node.js 18+** instalado ([nodejs.org](https://nodejs.org))
- **npm** ou **yarn** (incluído com Node.js)
- **Git** para clonar o repositório

### 1. Clone o repositório
```bash
git clone https://github.com/seu-usuario/open-ecu.git
cd open-ecu
```

### 2. Backend
```bash
cd backend
npm install
npm start
```
 O servidor iniciará em `http://localhost:3000`

**Desenvolvimento com auto-reload:**
```bash
npm run dev  # Usa nodemon para reiniciar automaticamente
```

### 3. Frontend
```bash
cd ../frontend
npm install
npm run dev
```
 A aplicação estará disponível em `http://localhost:3000`

**Para build de produção:**
```bash
npm run build
npm start
```

##  Deploy em Produção

### Backend no Render.com
1. Conecte seu repositório GitHub no [Render Dashboard](https://dashboard.render.com)
2. Selecione "New +" → "Web Service"
3. Configure:
   - **Name**: `open-ecu-api`
   - **Environment**: `Node.js`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Region**: Escolha a mais próxima
4. O Render fornecerá uma URL como: `https://open-ecu-api.onrender.com`

### Frontend no Vercel
1. Conecte seu repositório GitHub em [vercel.com](https://vercel.com)
2. Selecione "Import Project"
3. **Root Directory**: selecione `frontend`
4. **Environment Variables** → Adicione:
   ```
   NEXT_PUBLIC_API_URL=https://open-ecu-api.onrender.com
   ```
5. Clique em "Deploy"
6. Vercel fornecerá uma URL como: `https://open-ecu.vercel.app`

##  Funcionalidades

###  Dashboard Principal
- **[Simulação]**: Criar sensores, executar simulações, visualizar resultados
- **[Mapas]**: Criar, visualizar e gerenciar mapas de calibração
- **[Gráficos]**: Visualizar execuções em gráfico interativo (Recharts)
- **[Histórico]**: Lista filtrável de execuções por mapa com detalhes

### 🔌 API Endpoints

#### Sensores (`/engine/sensors`)
- `GET /engine/sensors` - Buscar leitura atual dos sensores
- `POST /engine/sensors` - Criar nova leitura de sensor

#### Execuções (`/engine/run`)
- `GET /engine/runs` - Buscar historiço de execuções
- `POST /engine/run` - Executar simulação com dados de entrada

#### Mapas (`/ecu/maps`)
- `GET /ecu/maps` - Listar todos os mapas cadastrados
- `POST /ecu/maps` - Criar novo mapa de calibração
- `PUT /ecu/maps/:id` - Atualizar mapa existente
- `DELETE /ecu/maps/:id` - Deletar mapa

##  Algoritmo de Cálculo

### Interpolação Bilinear (Implementado)
```
1. RPM e Carga (throttle) são os eixos
2. Busca-se os 4 pontos vizinhos na grade
3. Interpolação linear em RPM
4. Interpolação linear em Carga
5. Resultado: Tempo de injeção base (ms)
```

### Fórmula simplificada
```
Tempo Final = Base × Correção_Temperatura × Correção_Lambda

Onde:
- Base = Valor interpolado do mapa
- Correção_Temperatura = 0.97 se T > 90°C, senão 1.05
- Correção_Lambda = 1.02 se λ < 1, senão 0.98
```

##  Desenvolvimento

### Scripts Disponíveis

#### Frontend
```bash
npm run dev      # Inicia servidor com hot-reload
npm run build    # Build otimizado para produção
npm run start    # Inicia servidor de produção
npm run lint     # Executa ESLint para análise de código
```

#### Backend
```bash
npm start        # Inicia servidor
npm run dev      # Inicia com nodemon (auto-restart)
```

### Variáveis de Ambiente

#### Frontend (`.env.local` ou Vercel)
```bash
NEXT_PUBLIC_API_URL=http://localhost:3000        # Desenvolvimento
NEXT_PUBLIC_API_URL=https://open-ecu-api.onrender.com  # Produção
```

#### Backend (`.env` ou Render)
```bash
PORT=3000        # Porta do servidor
```

##  Fluxo de Dados

```
Usuário (Interface)
     ↓
[SimulationPanel / RunEngineForm]
     ↓
POST /engine/run (com RPM, Temperatura, etc)
     ↓
[ecuController.calculateEcu()]
     ↓
[ecuService.calculateInjectionFromMap()]
     → Busca mapa no arquivo JSON
     → Interpolação bilinear
     → Aplicar correções
     ↓
Retorna resultado JSON
     ↓
[Salva execução em runs.json]
     ↓
Frontend processa resposta
     ↓
[RunChart / RunHistory mostra resultado]
```

## 🤝 Como Contribuir

1. **Fork** o repositório
2. Crie uma branch para sua feature
   ```bash
   git checkout -b feature/minha-feature
   ```
3. Commit suas mudanças com mensagens claras
   ```bash
   git commit -m 'Adiciona nova funcionalidade X'
   ```
4. Push para a branch
   ```bash
   git push origin feature/minha-feature
   ```
5. Abra um **Pull Request** descrevendo suas mudanças

### Diretrizes
- Seguir o padrão de código existente
- Testar localmente antes de fazer push
- Descrever claramente o propósito da alteração
- Comentar código complexo

## 🛣️ Roadmap (Melhorias Futuras)

### Curto Prazo
- [ ] Migração para banco de dados (MongoDB/PostgreSQL)
- [ ] API com autenticação (JWT)
- [ ] Validação de entrada mais robusta
- [ ] Testes unitários e integração

### Médio Prazo
- [ ] Suporte a mapas 3D (RPM × Carga × Temperatura)
- [ ] Correções mais realistas (MAF, VBat, EGR)
- [ ] Sistema de usuários e projetos
- [ ] Importação/exportação de mapas (ECU tuning standards)
- [ ] Documentação técnica expandida

### Longo Prazo
- [ ] Integração com dados reais de ECU (via OBD-II)
- [ ] Simulação em tempo real
- [ ] Comparação com ECUs reais
- [ ] Interface de calibração avançada
- [ ] Suporte a múltiplos tipos de motor

## 📝 Notas de Desenvolvimento

### Persistência de Dados
⚠️ **Importante**: Atualmente usa **arquivos JSON locais** (`maps.json`, `runs.json`, `sensors.json`).

- ✅ **Desenvolvimento**: Funciona bem
- ❌ **Produção no Render**: Dados serão perdidos a cada deploy
- 💡 **Solução recomendada**: Migrar para PostgreSQL ou MongoDB

### CORS (Cross-Origin Resource Sharing)
```javascript
app.use(cors());  // Atualmente permite TODAS as origens
```

- ✅ **Desenvolvimento**: Funciona bem
- ⚠️ **Produção**: Restrinja para seu domínio do Vercel
  ```javascript
  app.use(cors({
    origin: 'https://open-ecu.vercel.app'
  }));
  ```

### TypeScript
- Frontend está completamente tipado
- Garante menos bugs e melhor refatoração
- Recomenda-se manter essa prática no backend também

## 📚 Referências e Recursos

### ECU e Calibração
- [OBD-II Protocol](https://en.wikipedia.org/wiki/On-board_diagnostics)
- [MAF e MAP Sensors](https://en.wikipedia.org/wiki/Engine_control_unit)
- [Fuel Injection Systems](https://en.wikipedia.org/wiki/Fuel_injection)

### Tecnologias Usadas
- [Next.js Docs](https://nextjs.org/docs)
- [Express.js Guide](https://expressjs.com)
- [Recharts Documentation](https://recharts.org)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

## 📄 Licença

Este projeto está sob a licença **MIT**. Você é livre para usar, modificar e distribuir este projeto em suas aplicações.

Veja o arquivo `LICENSE` para mais detalhes.

## 👥 Autores e Colaboradores

**Desenvolvedor Principal**: [Leiriele Corrêa]
**Contribuições**: Bem-vindo ao projeto! Abra um PR e seja reconhecido aqui.

---

**OpenECU Dashboard** - Educando sobre calibração eletrônica de motores 🚗⚙️</content>
<parameter name="filePath">c:\Users\leiriele\open-ecu\README.md
