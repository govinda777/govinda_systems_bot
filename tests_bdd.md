# 🧪 Guia Completo de Testes BDD para govinda_systems_bot

## 📑 Índice

1. [Setup de Testes](#setup-de-testes)
2. [Estrutura de Testes](#estrutura-de-testes)
3. [Exemplos de Feature Files](#exemplos-de-feature-files)
4. [Implementação dos Steps](#implementação-dos-steps)
5. [Executar e Validar Testes](#executar-e-validar-testes)
6. [CI/CD com GitHub Actions](#cicd-com-github-actions)

---

## 🛠️ Setup de Testes

### Instalação de Dependências

```bash
# BDD framework
npm install --save-dev @cucumber/cucumber

# E2E browser automation
npm install --save-dev @playwright/test

# Test runners
npm install --save-dev vitest
npm install --save-dev @testing-library/react

# Tipos TypeScript
npm install --save-dev @types/jest

# Ambiente de teste
npm install --save-dev dotenv-cli
```

### Configuração de Arquivos

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'dist/',
        '.next/',
      ],
      lines: 80,
      functions: 80,
      branches: 80,
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

```typescript
// cucumber.js
module.exports = {
  default: {
    require: ['tests/steps/**/*.ts'],
    requireModule: ['ts-node/register'],
    format: [
      'progress-bar',
      'html:test-results/cucumber-report.html',
      'json:test-results/cucumber-report.json',
    ],
    formatOptions: { snippetInterface: 'async-await' },
    parallel: 2,
  },
};
```

### Estrutura de Pasta

```
tests/
├── features/
│   ├── auth/
│   │   ├── login.feature
│   │   └── signup.feature
│   ├── onboarding/
│   │   ├── create-account.feature
│   │   ├── payment.feature
│   │   └── provisioning.feature
│   ├── bots/
│   │   ├── create-bot.feature
│   │   ├── edit-bot.feature
│   │   └── publish-bot.feature
│   ├── integrations/
│   │   ├── whatsapp.feature
│   │   ├── crm.feature
│   │   └── calendar.feature
│   └── security/
│       ├── multi-tenancy.feature
│       ├── authentication.feature
│       └── authorization.feature
│
├── steps/
│   ├── auth.steps.ts
│   ├── onboarding.steps.ts
│   ├── bots.steps.ts
│   ├── integrations.steps.ts
│   └── security.steps.ts
│
├── fixtures/
│   ├── users.ts
│   ├── bots.ts
│   └── payment.ts
│
├── helpers/
│   ├── browser.ts
│   ├── api.ts
│   ├── db.ts
│   └── stripe.ts
│
├── integration/
│   ├── api.test.ts
│   ├── database.test.ts
│   └── payment.test.ts
│
└── e2e/
    ├── auth.e2e.ts
    ├── onboarding.e2e.ts
    └── bots.e2e.ts
```

---

## 📋 Estrutura de Testes

### Padrão Given-When-Then

```gherkin
Feature: Exemplo de Padrão BDD
  
  Scenario: Descrição do comportamento esperado
    Given [condição inicial]
    When [ação do usuário]
    Then [resultado esperado]
    
  Scenario: Outro comportamento
    Given [estado]
    And [estado adicional]
    When [ação]
    Then [resultado]
    And [verificação adicional]
```

### Estrutura de Step

```typescript
// Uma feature é mapeada para steps
// Cada step implementa uma ação

import { Given, When, Then, Before, After } from '@cucumber/cucumber';
import { Browser, Page, chromium } from 'playwright';

let browser: Browser;
let page: Page;

Before(async function() {
  // Setup antes de cada scenario
  browser = await chromium.launch();
  page = await browser.newPage();
});

After(async function() {
  // Cleanup após cada scenario
  await page.close();
  await browser.close();
});

Given('estou na página de login', async function() {
  await page.goto('http://localhost:3000/login');
  await page.waitForSelector('button:has-text("Entrar")');
});

When('preencho email com {string}', async function(email: string) {
  await page.fill('input[type="email"]', email);
});

When('clico em {string}', async function(botaoText: string) {
  await page.click(`button:has-text("${botaoText}")`);
});

Then('vejo mensagem de erro {string}', async function(mensagem: string) {
  const error = await page.locator(`text=${mensagem}`);
  await error.waitFor({ state: 'visible' });
});
```

---

## 🎯 Exemplos de Feature Files

### 1. Feature: Autenticação

```gherkin
# tests/features/auth/login.feature

Feature: Login de Usuários
  Como um usuário
  Quero fazer login com email e senha
  Para acessar meu dashboard

  Background:
    Given uma nova sessão do navegador
    And acesso a página de login
    And usuário "joao@test.com" existe no sistema

  Scenario: Login bem-sucedido
    When preencho email com "joao@test.com"
    And preencho senha com "senha123"
    And clico em "Entrar"
    Then sou redirecionado para o dashboard
    And vejo "Bem-vindo, João!"

  Scenario: Email incorreto
    When preencho email com "invalido@test.com"
    And preencho senha com "senha123"
    And clico em "Entrar"
    Then vejo erro "Email ou senha incorretos"

  Scenario: Senha incorreta
    When preencho email com "joao@test.com"
    And preencho senha com "senhaerrada"
    And clico em "Entrar"
    Then vejo erro "Email ou senha incorretos"

  Scenario: Recuperação de senha
    When clico em "Esqueci minha senha"
    And preencho email com "joao@test.com"
    And clico em "Recuperar"
    Then vejo mensagem "Email de recuperação enviado"
    And joao@test.com recebe email com link de reset

  Scenario: Logout
    Given estou autenticado como "joao@test.com"
    When clico em meu avatar
    And clico em "Sair"
    Then sou redirecionado para a página de login
    And sessão é encerrada
```

### 2. Feature: Criação de Conta

```gherkin
# tests/features/auth/signup.feature

Feature: Cadastro de Novo Usuário
  Como um novo visitante
  Quero criar uma conta
  Para começar a usar a plataforma

  Scenario: Cadastro bem-sucedido
    Given acesso a página de sign up
    When preencho formulário:
      | campo | valor |
      | nome | João Silva |
      | email | joao@test.com |
      | senha | Senha123!@# |
    And confirmo email (verificando inbox)
    Then sou redirecionado para onboarding
    And usuário é criado com status "pending_setup"

  Scenario: Email já existe
    Given usuário "joao@test.com" já existe
    And acesso a página de sign up
    When preencho nome com "João"
    And preencho email com "joao@test.com"
    And clico em "Criar Conta"
    Then vejo erro "Este email já está registrado"

  Scenario: Senha fraca
    When preencho nome com "João"
    And preencho email com "joao@test.com"
    And preencho senha com "123"
    Then vejo validação em tempo real:
      """
      ❌ Mínimo 8 caracteres
      ❌ Deve conter números
      ❌ Deve conter caracteres especiais
      """

  Scenario: Aceitar termos é obrigatório
    When preencho todos os campos
    And não marco "Li e aceito os termos"
    And clico em "Criar Conta"
    Then botão fica desabilitado
    And vejo mensagem "Aceite os termos para continuar"
```

### 3. Feature: Onboarding Completo

```gherkin
# tests/features/onboarding/create-account.feature

Feature: Onboarding Completo do Novo Cliente
  Como um novo cliente
  Quero completar o onboarding
  Para ter meu bot pronto em 24h

  Scenario: Onboarding via chat do bot
    Given acesso seuservico.com
    When clico em "Começar Agora"
    Then chat do bot é aberto

    When converso com o bot:
      | envio | esperado |
      | Olá | Bem-vindo! Qual é seu nome? |
      | João Silva | E qual é seu email, João? |
      | joao@empresa.com | Qual é o nome da empresa? |
      | Minha Agência | Qual o objetivo principal? |
      | Suporte | Quais fluxos deseja? |
      | FAQ e agendamento | E os canais? |
      | WhatsApp e Web | Qual plano? |
      | Profissional | Vou enviar o link de pagamento |

    And clico no link de pagamento
    Then sou levado a Stripe checkout
    And finalizo pagamento com sucesso

    When retorno para o site
    Then sou redirecionado para dashboard
    And vejo "Agente em Configuração"
    And countdown mostra "24h até estar pronto"

    When espero 24 horas
    Then bot está pronto
    And recebo email "Seu bot está pronto!"
    And posso acessar dashboard completo

  Scenario: Retomar onboarding abandonado
    Given comecei onboarding mas não finalizei
    And saí do chat
    When acesso o site novamente
    Then vejo opção "Continuar Onboarding"
    And posso retomar de onde parei

  Scenario: Trocar plano antes de pagar
    Given estou no final do chat de onboarding
    And selecionei plano "Startup"
    When clico em "Voltar"
    And seleciono plano "Profissional"
    Then preço e features são atualizados em tempo real
    And conversas anteriores no chat são preservadas
```

### 4. Feature: Processamento de Pagamento

```gherkin
# tests/features/onboarding/payment.feature

Feature: Processamento de Pagamento
  Como a plataforma
  Quero processar pagamentos com segurança
  Para iniciar o setup do cliente

  Background:
    Given Stripe está configurado
    And webhook de pagamento está ativo

  Scenario: Pagamento com cartão bem-sucedido
    Given cliente "João" completou onboarding
    And vê link de checkout
    When clica em "Pagar R$ 548,50"
    Then redirecionado para Stripe
    
    When preenche dados:
      | campo | valor |
      | Número | 4242 4242 4242 4242 |
      | Validade | 12/25 |
      | CVC | 123 |
      | Nome | JOAO SILVA |
    And clica "Pagar"
    
    Then Stripe processa pagamento
    And webhook `payment_intent.succeeded` é disparado
    
    When backend recebe webhook
    Then:
      | ação | status |
      | Criar workspace Typebot | ✅ concluído |
      | Criar bot padrão | ✅ concluído |
      | Publicar bot | ✅ concluído |
      | Salvar config GitHub | ✅ concluído |
      | Registrar usuário admin | ✅ concluído |
      | Enviar email de confirmação | ✅ enviado |
    
    And cliente é redirecionado para dashboard
    And vê "Setup iniciado - volta em 24h"

  Scenario: Pagamento recusado
    Given cliente está no checkout Stripe
    When usa cartão de teste recusado "4000 0000 0000 0002"
    And clica "Pagar"
    
    Then Stripe retorna erro "Seu cartão foi recusado"
    And webhook `payment_intent.payment_failed` é disparado
    
    When backend recebe webhook
    Then NOT cria tenant
    
    And cliente vê mensagem
    """
    ❌ Pagamento não foi processado.
    Tente outro cartão ou método.
    """
    And pode tentar novamente

  Scenario: Reembolso após compra
    Given cliente pagou há 2 dias
    And quer cancelar
    
    When clico em "Cancelar Plano"
    And confirmo cancelamento
    
    Then admin recebe notificação
    And reembolso é processado via Stripe API
    And cliente recebe email "Reembolso de R$ 548,50 aprovado"
    And tenant será desativado em 30 dias

  Scenario: Falha no Webhook (retry)
    Given webhook de pagamento falha na primeira vez
    And Stripe automaticamente faz retry
    
    When Stripe retenta webhook (até 3 tentativas)
    Then backend processa com sucesso
    And tenant é criado normalmente
```

### 5. Feature: Segurança Multi-Tenancy

```gherkin
# tests/features/security/multi-tenancy.feature

Feature: Isolamento Total Entre Tenants
  Como operador de segurança
  Quero garantir zero vazamento de dados
  Para proteger confiança dos clientes

  Background:
    Given tenant A existe: "empresa-a.seuservico.com"
    And tenant B existe: "empresa-b.seuservico.com"
    And admin@empresa-a.com está autenticado

  Scenario: Impossível acessar outro tenant via URL
    When tenta acessar "empresa-b.seuservico.com/dashboard"
    Then recebe erro 403 Forbidden
    # Middleware verifica tenant no header vs URL
    # Se não corresponder, acesso é negado

  Scenario: Impossível contornar com ID manualmente
    Given estou autenticado para empresa-a
    When faço GET /api/bots com header:
      """
      x-tenant-id: empresa-b
      """
    Then recebe erro 403 Forbidden
    # Auth verifica: user.tenantId != x-tenant-id

  Scenario: Impossível de listar dados de outro tenant na API
    When faço GET /api/bots
    Then recebe APENAS bots de empresa-a
    # Query automática filtra: WHERE tenantId = 'empresa-a'

  Scenario: Impossível deletar bot de outro tenant
    Given empresa-a tem bot "bot_a_123"
    And empresa-b tem bot "bot_b_456"
    When tenta DELETE /api/bots/bot_b_456
    Then recebe erro 404 Not Found
    # Sistema não revela que existe, apenas nega
    # (previne reconhecimento)

  Scenario: Rate limiting não afeta outros tenants
    Given estou autenticando como empresa-a
    And faço 100 requests (máximo por minuto)
    
    When faço request 101
    Then recebo erro 429 Too Many Requests
    
    But usuário de empresa-b:
      When faz GET /api/bots
      Then recebe resposta 200 OK
      # Rate limit é por tenant, não global

  Scenario: Logs contêm tenant-id
    Given todas as ações geram logs
    When executa: DELETE /api/bots/bot_a_123
    Then log contém:
      """
      {
        "action": "bot.deleted",
        "tenantId": "empresa-a",
        "userId": "user_xyz",
        "timestamp": "2025-12-08T10:30:00Z"
      }
      """
```

---

## 💻 Implementação dos Steps

### Login Steps

```typescript
// tests/steps/auth.steps.ts

import { Given, When, Then, Before, After } from '@cucumber/cucumber';
import { Browser, Page, chromium } from 'playwright';
import { expect } from '@playwright/test';

let browser: Browser;
let page: Page;
const testUrl = process.env.TEST_URL || 'http://localhost:3000';

Before(async function() {
  browser = await chromium.launch();
  page = await browser.newPage();
  // Limpar cookies antes de cada cenário
  await page.context().clearCookies();
});

After(async function() {
  await page.close();
  await browser.close();
});

Given('uma nova sessão do navegador', async function() {
  // Já feito em Before
});

Given('acesso a página de login', async function() {
  await page.goto(`${testUrl}/login`);
  // Aguardar elemento para garantir carregamento
  await page.waitForSelector('input[type="email"]', { timeout: 5000 });
});

Given('usuário {string} existe no sistema', async function(email: string) {
  // Criar usuário via API setup
  const response = await page.request.post(`${testUrl}/api/test/setup-user`, {
    data: { email, password: 'Senha123!@#' }
  });
  expect(response.ok()).toBe(true);
});

When('preencho email com {string}', async function(email: string) {
  const emailInput = page.locator('input[type="email"]');
  await emailInput.clear();
  await emailInput.fill(email);
});

When('preencho senha com {string}', async function(senha: string) {
  const senhaInput = page.locator('input[type="password"]');
  await senhaInput.clear();
  await senhaInput.fill(senha);
});

When('clico em {string}', async function(botaoText: string) {
  await page.click(`button:has-text("${botaoText}")`);
  // Aguardar transição
  await page.waitForLoadState('networkidle');
});

Then('sou redirecionado para o dashboard', async function() {
  await page.waitForURL(`${testUrl}/dashboard`, { timeout: 5000 });
  expect(page.url()).toContain('/dashboard');
});

Then('vejo {string}', async function(texto: string) {
  const elemento = page.locator(`text=${texto}`);
  await elemento.waitFor({ state: 'visible' });
  expect(elemento).toBeVisible();
});

Then('vejo erro {string}', async function(mensagem: string) {
  const erro = page.locator(`[role="alert"]:has-text("${mensagem}")`);
  await erro.waitFor({ state: 'visible' });
  expect(erro).toBeVisible();
});
```

### Onboarding Steps

```typescript
// tests/steps/onboarding.steps.ts

import { Given, When, Then } from '@cucumber/cucumber';
import { Page } from 'playwright';

declare global {
  var page: Page;
  var onboardingData: Record<string, string>;
}

Given('acesso seuservico.com', async function() {
  await globalThis.page.goto('http://localhost:3000');
});

When('clico em {string}', async function(botaoText: string) {
  await globalThis.page.click(`button:has-text("${botaoText}")`);
  await globalThis.page.waitForLoadState('networkidle');
});

Then('chat do bot é aberto', async function() {
  const chat = globalThis.page.locator('[data-testid="bot-chat"]');
  await chat.waitFor({ state: 'visible' });
});

When('converso com o bot:', async function(dataTable) {
  const conversas = dataTable.rowsHash();
  
  for (const [envio, esperado] of Object.entries(conversas)) {
    // Enviar mensagem
    const inputChat = globalThis.page.locator('input[placeholder*="Digite"]');
    await inputChat.fill(envio);
    await globalThis.page.press('input[placeholder*="Digite"]', 'Enter');
    
    // Aguardar resposta
    const resposta = globalThis.page.locator(`text=${esperado}`);
    await resposta.waitFor({ state: 'visible', timeout: 10000 });
    
    // Guardar dados para verificação depois
    globalThis.onboardingData = globalThis.onboardingData || {};
    globalThis.onboardingData[envio] = esperado;
  }
});

When('clico no link de pagamento', async function() {
  const linkPagamento = globalThis.page.locator('a:has-text("Pagar")');
  
  // Aguardar nova página (popup/redirecionamento)
  const [popup] = await Promise.all([
    globalThis.page.waitForEvent('popup'),
    linkPagamento.click()
  ]);
  
  // Trocar contexto para nova página
  await popup.goto; // Verificar que está em Stripe
});

Then('sou levado a Stripe checkout', async function() {
  const stripeUrl = globalThis.page.url();
  expect(stripeUrl).toContain('stripe.com');
});

When('finalizo pagamento com sucesso', async function() {
  // Completar checkout com cartão de teste
  const numeroCartao = globalThis.page.locator('[placeholder="1234 1234 1234"]');
  await numeroCartao.fill('4242 4242 4242 4242');
  
  const validade = globalThis.page.locator('[placeholder="MM / YY"]');
  await validade.fill('12 / 25');
  
  const cvc = globalThis.page.locator('[placeholder="CVC"]');
  await cvc.fill('123');
  
  const botaoPagar = globalThis.page.locator('button:has-text("Pagar")');
  await botaoPagar.click();
  
  // Aguardar sucesso
  const sucesso = globalThis.page.locator('text=Pagamento processado');
  await sucesso.waitFor({ state: 'visible' });
});

When('retorno para o site', async function() {
  // Stripe redireciona para return URL
  await globalThis.page.waitForURL('**/dashboard', { timeout: 10000 });
});

Then('sou redirecionado para dashboard', async function() {
  expect(globalThis.page.url()).toContain('/dashboard');
});

Then('vejo {string}', async function(texto: string) {
  const elemento = globalThis.page.locator(`text=${texto}`);
  await elemento.waitFor({ state: 'visible' });
  expect(elemento).toBeVisible();
});

When('espero {int} horas', async function(horas: number) {
  // Em testes, pular direto para verificação
  // Na vida real, usar webhook ou task scheduler
  
  // Simular passagem de tempo no backend
  await globalThis.page.request.post('/api/test/advance-time', {
    data: { hours: horas }
  });
});

Then('bot está pronto', async function() {
  // Verificar que bot foi criado e publicado
  const botStatus = globalThis.page.locator('[data-testid="bot-status"]');
  await expect(botStatus).toHaveText('Ativo');
});

Then('{string} recebe email {string}', async function(email: string, subject: string) {
  // Usar Mailhog ou similar para verificar emails em testes
  const response = await globalThis.page.request.get(
    `http://localhost:1025/api/v2/search?kind=to&query=${email}`
  );
  const emails = await response.json();
  
  expect(emails.items).toSome(e => e.Raw.From.includes(subject));
});
```

---

## ▶️ Executar e Validar Testes

### Rodando Testes Localmente

```bash
# Instalar dependências
npm install

# Rodar apenas features (BDD)
npx cucumber-js tests/features/ --format progress

# Rodar com relatório HTML
npx cucumber-js tests/features/ --format html:reports/cucumber.html

# Rodar específica feature
npx cucumber-js tests/features/auth/login.feature

# Rodar com tags específicas
npx cucumber-js --tags "@critical"

# Rodar testes de unidade
npm run test:unit

# Rodar testes de integração
npm run test:integration

# Rodar testes E2E
npx playwright test

# Com UI do Playwright
npx playwright test --ui

# Cobertura de testes
npm run test:coverage
```

### Exemplo de Output

```
Running features:

Feature: Login de Usuários
  ✓ Login bem-sucedido (2.3s)
  ✓ Email incorreto (1.8s)
  ✓ Senha incorreta (1.9s)
  ✓ Recuperação de senha (3.2s)
  ✓ Logout (1.5s)

Feature: Cadastro de Novo Usuário
  ✓ Cadastro bem-sucedido (5.2s)
  ✓ Email já existe (2.1s)
  ✓ Senha fraca (1.6s)
  ✓ Aceitar termos é obrigatório (1.4s)

Feature: Onboarding Completo
  ✓ Onboarding via chat (45.3s)
  ✓ Retomar onboarding (8.2s)
  ✓ Trocar plano antes de pagar (3.1s)

10 features (10 passed)
32 scenarios (32 passed)
147 steps (147 passed)

Total: 5min 23s
Coverage: 87%
```

---

## 🔄 CI/CD com GitHub Actions

### Configuração de Testes Automatizados

```yaml
# .github/workflows/test.yml

name: Tests
on: [push, pull_request]

jobs:
  tests:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
      - uses: actions/checkout@v3
      
      - uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: 'npm'
      
      - run: npm ci
      
      - name: Testes Unitários
        run: npm run test:unit
      
      - name: Testes BDD (Cucumber)
        run: npx cucumber-js tests/features/ --format json:reports/bdd.json
      
      - name: Testes E2E (Playwright)
        run: npx playwright test
      
      - name: Cobertura de Testes
        run: npm run test:coverage
      
      - name: Upload Coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/coverage-final.json
      
      - name: Publicar Resultados
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: test-results
          path: |
            reports/
            test-results/
            coverage/
      
      - name: Comentar no PR
        if: github.event_name == 'pull_request'
        uses: actions/github-script@v6
        with:
          script: |
            const fs = require('fs');
            const report = JSON.parse(fs.readFileSync('reports/bdd.json'));
            const passed = report.reduce((acc, feature) => 
              acc + feature.elements.filter(e => e.steps.every(s => s.result.status === 'passed')).length, 0
            );
            
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: `✅ Testes passando\n\n- ${passed} cenários validados`
            });
```

