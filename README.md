# ParaBank - Automação de Testes com Playwright

![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white) 
![Playwright](https://img.shields.io/badge/Playwright-2EAD33?style=flat-square&logo=playwright&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)

Projeto referente ao teste técnico da empresa Auvo Tecnologia.

## Pré-requisitos

Certifique-se de ter instalado:

- **Node.js** (versão 18 ou superior)
- **npm** (vem com Node.js)

**Opcional** (para ambiente local):
- **Docker** (versão 20 ou superior)
- **Docker Compose**

## Instalação e Execução

### 1. Instale as dependências

```bash
npm install
```

### 2. Instale os browsers do Playwright

```bash
npx playwright install chromium
```

### 3. Escolha o ambiente de testes

#### Opção A: Ambiente Público (padrão)
```bash
npm test
```
> Testes rodam contra https://parabank.parasoft.com/parabank

#### Opção B: Ambiente Local (requer Docker, mais estável)

Build das imagens e container
```bash
docker-compose up -d --build
```
> Este comando pode demorar alguns minutos.

Executar testes em ambientes locais
```bash
npm run test:local
```
Parar ParaBank
```bash
docker-compose stop
```
> Testes rodam contra http://localhost:8080/parabank

### 4. Outros comandos

#### Interface visual
Executa os testes em ambientes locais
```bash
npm run test:ui
```

#### Visualizar relatório

```bash
npm run test:report
```

> Para mais informações, acesse o `package.json` e veja os comandos criados para os testes.

## Decisões técnicas

### 1. TypeScript
- Type safety (menos erros)
- Melhor IntelliSense e autocomplete
- Mais fácil de manter e refatorar

### 2. Types
- Arquivo de types para melhor legibilidade e manutenção
- Principio DRY (Don't Repeat Yourself) aplicado

### 3. Intercepts
- Waits interceptando as rotas para que os testes prossigam a execução
- Chamadas de API para capturar dados e usar dinamicamente nas asserções

### 3. Gestão de Dados de Teste
- Arquivo fixtures com dados pessoais e credenciais de acesso do usuário, para serem consumidos durante os testes

### 4. Sem variáveis de ambiente
- Ambiente público com URL e API pública

### 5. Docker
- Estável e manipulável
- Perfeito para desenvolvimento dos testes

## Suposições

### Ambiente
- O servidor ParaBank está online e acessível em https://parabank.parasoft.com/parabank
- A aplicação está em inglês (seletores baseados em textos em inglês)
- Configurar variáveis de ambiente antes de rodar os testes

### Sistema
- Node.js versão 18 ou superior deve estar instalado

### Dados
- Sistema permite cadastro ilimitado de novos usuários
- Usuário de testes (john/john123) existe e está funcional
- Username gerado com timestamp é único no momento da execução
- Sistema aceita dados no formato padrão americano (SSN, Zip Code)

### Execução
- Testes podem executar em paralelo sem interferência
- Cada teste é independente e não depende de execução prévia
- Sistema suporta múltiplas sessões simultâneas

---

**Desenvolvido com ❤️ por Gustavo Schmidt - QA Engineer**
