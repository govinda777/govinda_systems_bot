# 📋 Planejamento Completo: govinda_systems_bot

## 📑 Índice

1. [Definição de Negócio](#definição-de-negócio)
2. [Modelo de Preços](#modelo-de-preços)
3. [Arquitetura do Projeto](#arquitetura-do-projeto)
4. [Fluxo de Atendimento Detalhado](#fluxo-de-atendimento-detalhado)
5. [Documentação Técnica](#documentação-técnica)
6. [Testes BDD (Behavior Driven Development)](#testes-bdd)
7. [Roadmap de Implementação](#roadmap-de-implementação)
8. [KPIs e Métricas](#kpis-e-métricas)

---

## 🎯 Definição de Negócio

### Visão e Propósito

**govinda_systems_bot** é uma plataforma SaaS white-label que permite agências e empresas criar e gerenciar chatbots de atendimento automatizados usando Typebot como engine de bots, com suporte nativo para WhatsApp e integração com LLM (Large Language Models) como GPT-4 e Claude.

### Problema que Resolve

- ❌ **Antes**: Agências precisavam desenvolver bots do zero ou usar ferramentas genéricas sem white-label
- ✅ **Depois**: Agências podem vender uma solução personalizada com marca própria em menos de 24h

### Diferenciais Competitivos

1. **Multi-Tenant Seguro** - Cada cliente tem seu próprio workspace isolado
2. **White-Label Completo** - Subdomínio personalizado (empresa.seuservico.com)
3. **Zero Setup** - Subdomínio automático via provisionamento
4. **Fluxo de Onboarding Inovador** - Cliente experimenta o bot durante o próprio atendimento
5. **Engine Plugável** - Arquitetura preparada para trocar Typebot por outro engine
6. **IA Integrada** - Suporte nativo a GPT-4, Claude, e LLMs locais

### Público-Alvo

**Segmento Primário**: Agências digitais (10-50 pessoas)
- **Tamanho do mercado**: ~5.000 agências no Brasil
- **Willingness to pay**: Alto (já vendem serviços de desenvolvimento)
- **Fácil implementação**: Conhecem clientes potenciais

**Segmento Secundário**: Pequenas e médias empresas (PMEs)
- **Tamanho do mercado**: ~1M de PMEs no Brasil
- **Willingness to pay**: Moderado
- **Lead time**: Maior

### Modelo de Negócio

```
┌────────────────────────────────────────────────────┐
│        govinda_systems_bot (SaaS)                  │
├────────────────────────────────────────────────────┤
│                                                    │
│  Receita 1: Configuração Inicial (One-time)      │
│  R$ 499 - R$ 1.999                               │
│  (Setup, treinamento, número WhatsApp)            │
│                                                    │
│  Receita 2: Subscription Mensal                   │
│  R$ 99 - R$ 999/mês                              │
│  (Conforme plano e uso)                           │
│                                                    │
│  Receita 3: Add-ons (Opcional)                    │
│  - IA Tokens extras                              │
│  - Integrações premium                           │
│  - Suporte dedicado                              │
│                                                    │
└────────────────────────────────────────────────────┘
```

---

## 💰 Modelo de Preços

### Pesquisa de Mercado

| Plataforma | Básico | Profissional | Enterprise |
|-----------|--------|-------------|-----------|
| **Typebot** | Grátis | $39/mês | Custom |
| **Chatfuel** | $15/mês | $45/mês | $300/mês |
| **ManyChat** | Grátis | $15/mês | Custom |
| **Tidio** | Grátis | $29/mês | $749/mês |
| **BotSailor** | Grátis | $10.99/mês | Custom |

### Estratégia de Preços Recomendada

#### Setup Inicial (One-time, antes do pagamento recorrente)

```
┌─────────────────────────────────────────────────────┐
│  CONFIGURAÇÃO INICIAL DO AGENTE                    │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Incluído:                                         │
│  ✅ Subdomínio personalizado                      │
│  ✅ Número WhatsApp (comprado para o cliente)     │
│  ✅ Configuração do bot padrão (suporte)          │
│  ✅ Integração com CRM/Calendar básica             │
│  ✅ Treinamento básico (30 min)                   │
│                                                     │
│  Valor: R$ 499 - R$ 999                          │
│  (Conforme complexidade)                           │
│                                                     │
│  Foco: Recuperar custo do número WhatsApp         │
│  (aprox. R$ 150-200) + margem de serviço         │
│                                                     │
└─────────────────────────────────────────────────────┘
```

#### Planos de Subscription Mensal

```
┌────────────────────────────────────────────────────────┐
│ PLANO STARTUP                                          │
├────────────────────────────────────────────────────────┤
│ Valor: R$ 99/mês (anual: R$ 1.089/ano = 11% desconto) │
│                                                        │
│ Incluído:                                             │
│ • 1 chatbot                                           │
│ • 1.000 conversas/mês                                │
│ • Integrações: WhatsApp, Email, Website              │
│ • Suporte por email (48h)                            │
│ • IA: 100k tokens/mês (GPT-3.5)                      │
│ • Análises básicas                                    │
│ • Até 2 usuários                                     │
│                                                        │
│ Ideal para: Testes, startups, freelancers            │
└────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────┐
│ PLANO PROFISSIONAL                                     │
├────────────────────────────────────────────────────────┤
│ Valor: R$ 299/mês (anual: R$ 3.288/ano = 11% desc.)   │
│                                                        │
│ Incluído (+ Startup):                                 │
│ • 5 chatbots                                          │
│ • 10.000 conversas/mês                               │
│ • Integrações: +CRM, +Calendário, +API               │
│ • Suporte por email (24h)                            │
│ • IA: 1M tokens/mês (GPT-4 disponível)              │
│ • Análises avançadas + exports                       │
│ • Até 5 usuários                                     │
│ • Templates personalizados                          │
│                                                        │
│ Ideal para: Agências pequenas, PMEs                  │
└────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────┐
│ PLANO ENTERPRISE                                       │
├────────────────────────────────────────────────────────┤
│ Valor: R$ 999/mês + (acima de 100k mensagens = custom) │
│                                                        │
│ Incluído (+ Profissional):                           │
│ • Bots ilimitados                                    │
│ • 100.000+ conversas/mês                             │
│ • Integrações: Tudo + Custom via Webhook            │
│ • Suporte: Telefone + Slack (2h)                     │
│ • IA: Ilimitada (todos os modelos)                   │
│ • Análises em tempo real + BI                        │
│ • Usuários ilimitados                                │
│ • White-label avançado                              │
│ • SSO (Single Sign-On)                              │
│ • Dedicado account manager                          │
│                                                        │
│ Ideal para: Agências grandes, enterprises            │
└────────────────────────────────────────────────────────┘
```

#### Add-ons Opcionais

| Recurso | Valor | Descrição |
|---------|-------|-----------|
| **IA Tokens Extra** | R$ 29/1M tokens | Além da cota mensal |
| **Números WhatsApp Extra** | R$ 49/mês c/u | Adicionar canais WhatsApp |
| **Domínio Customizado** | R$ 99/mês | empresa.com.br em vez de subdomain |
| **Suporte Dedicado** | R$ 199/mês | Account manager + onboarding |
| **API Avançada** | R$ 149/mês | Webhooks, exports, custom endpoints |
| **Armazenamento Extra** | R$ 49/100GB/mês | Além dos limites do plano |
| **Backup & Disaster Recovery** | R$ 149/mês | Backups automáticos + SLA 99.9% |

### Estratégia de Precificação

1. **Ano 1**: Foco em adoção
   - Oferecer desconto de 20% para primeiros 100 clientes
   - Oferecer setup grátis para clientes Startup
   - Período de trial de 14 dias

2. **Ano 2**: Foco em retenção
   - Descontos por longo prazo (11% anual)
   - Programas de referência (R$ 99/nova conta)
   - Aumentar preço dos add-ons em 20%

3. **Ano 3+**: Foco em margem
   - Aumentar plano base em 10-15%
   - Remover período de trial
   - Oferecer planos anuais com desconto menor (5%)

### Análise de Rentabilidade

```
CENÁRIO: 100 clientes Profissionais (Break-even)

Receita Mensal:
├─ 50 clientes × R$ 299/mês = R$ 14.950
├─ 30 clientes × R$ 99/mês = R$ 2.970
└─ 20 clientes × R$ 999/mês = R$ 19.980
  ─────────────────────────────
  TOTAL MRR = R$ 37.900/mês

Custos Mensais Estimados:
├─ Typebot SaaS (40% da receita) = R$ 15.160
├─ Infraestrutura (Vercel, etc) = R$ 2.000
├─ Números WhatsApp (10 novos/mês) = R$ 1.500
├─ Salário 1 Dev (PT) = R$ 8.000
├─ Salário 1 Sales = R$ 5.000
├─ Suporte ao cliente = R$ 3.000
└─ Marketing/Outros = R$ 2.000
  ─────────────────────────────
  TOTAL = R$ 36.660/mês

LUCRO LÍQUIDO = R$ 1.240/mês (3.3% margem)

💡 Observação: No início, você terá prejuízo.
   Break-even é estimado entre mês 9-12 com bom growth.
```

---

## 🏗️ Arquitetura do Projeto

### Stack Tecnológico

```
Frontend
├─ Next.js 15+ (App Router)
├─ TypeScript
├─ TailwindCSS + Shadcn/UI
└─ React Query (data fetching)

Backend
├─ Next.js API Routes
├─ Node.js runtime
├─ TypeScript
└─ Edge Functions (Vercel)

Auth & Identity
├─ Privy (Web3 + Web2 auth)
├─ JWT tokens
└─ Multi-tenant isolation

Data & Storage
├─ GitHub (tenant configs)
├─ Typebot API (bots)
├─ PostgreSQL (users, payments) - Future
└─ Redis (caching, rate limiting) - Future

External APIs
├─ Typebot API
├─ OpenAI API
├─ Anthropic API (Claude)
├─ Stripe API (payments)
├─ WhatsApp Business API
└─ Calendly/Google Calendar

DevOps
├─ Vercel (hosting)
├─ GitHub (version control)
├─ GitHub Actions (CI/CD)
├─ Sentry (error tracking)
└─ Datadog (monitoring)
```

### Estrutura de Diretórios

```
govinda_systems_bot/
├── app/
│   ├── api/
│   │   ├── tenants/
│   │   │   ├── provision/          # Criar novo tenant
│   │   │   └── [tenantId]/
│   │   │       ├── config/         # Getter/setter config
│   │   │       └── bots/           # List/create/delete bots
│   │   │
│   │   ├── bots/
│   │   │   ├── route.ts            # List bots do tenant
│   │   │   └── [botId]/
│   │   │       ├── route.ts        # Get/update/delete
│   │   │       ├── publish/        # Publicar bot
│   │   │       └── webhook/        # Webhook para conversas
│   │   │
│   │   ├── auth/
│   │   │   ├── login/
│   │   │   ├── logout/
│   │   │   └── verify/
│   │   │
│   │   ├── integrations/
│   │   │   ├── whatsapp/           # WhatsApp integration
│   │   │   ├── calendar/           # Calendly/Google
│   │   │   ├── crm/                # Salesforce, Hubspot
│   │   │   └── webhook/            # Generic webhooks
│   │   │
│   │   ├── ai/
│   │   │   ├── chat/               # AI chat completion
│   │   │   ├── tokens/             # Token usage tracking
│   │   │   └── models/             # Model management
│   │   │
│   │   └── webhooks/
│   │       ├── stripe/             # Payment webhooks
│   │       └── typebot/            # Typebot webhooks
│   │
│   ├── (auth)/
│   │   ├── login/
│   │   ├── register/
│   │   └── onboarding/
│   │
│   ├── (dashboard)/
│   │   ├── dashboard/              # Home do tenant
│   │   ├── bots/
│   │   │   ├── page.tsx            # List bots
│   │   │   ├── [botId]/
│   │   │   │   ├── page.tsx        # Edit bot
│   │   │   │   ├── flows/          # Visualizar fluxo
│   │   │   │   ├── analytics/      # Stats do bot
│   │   │   │   └── settings/       # Config bot
│   │   │   └── new/                # Criar novo
│   │   │
│   │   ├── integrations/           # Manage integrações
│   │   ├── settings/               # Tenant settings
│   │   ├── billing/                # Planos e pagamento
│   │   ├── team/                   # Manage usuários
│   │   └── support/                # Help & docs
│   │
│   ├── layout.tsx                  # Root layout
│   ├── page.tsx                    # Marketing/public home
│   └── providers.tsx               # Context providers
│
├── lib/
│   ├── tenant/
│   │   ├── get-tenant.ts           # Ler tenant do header
│   │   └── tenant-context.tsx      # Context para client
│   │
│   ├── auth/
│   │   ├── privy-config.ts
│   │   └── verify.ts
│   │
│   ├── typebot/
│   │   ├── client.ts               # API client
│   │   └── flow-builder.ts         # Builder helpers
│   │
│   ├── github/
│   │   └── client.ts               # Config storage
│   │
│   ├── stripe/
│   │   └── client.ts               # Payments
│   │
│   ├── ai/
│   │   ├── openai.ts               # OpenAI integration
│   │   ├── anthropic.ts            # Claude integration
│   │   └── token-counter.ts        # Count tokens
│   │
│   ├── whatsapp/
│   │   └── client.ts               # WhatsApp API
│   │
│   ├── integrations/
│   │   ├── calendar.ts
│   │   ├── crm.ts
│   │   └── slack.ts
│   │
│   ├── db/
│   │   ├── schema.ts               # DB schema (Drizzle)
│   │   └── client.ts               # DB connection
│   │
│   ├── rate-limit.ts               # Rate limiting
│   ├── logging.ts                  # Tenant-aware logging
│   └── utils.ts                    # Helpers
│
├── components/
│   ├── auth/
│   │   ├── LoginForm.tsx
│   │   └── RegisterForm.tsx
│   │
│   ├── bots/
│   │   ├── BotCard.tsx
│   │   ├── BotBuilder.tsx
│   │   ├── FlowVisualizer.tsx
│   │   └── BotPreview.tsx
│   │
│   ├── integrations/
│   │   ├── WhatsAppSetup.tsx
│   │   ├── CalendarIntegration.tsx
│   │   └── CRMIntegration.tsx
│   │
│   ├── dashboard/
│   │   ├── DashboardNav.tsx
│   │   ├── StatsCard.tsx
│   │   └── RecentBots.tsx
│   │
│   ├── billing/
│   │   ├── PlanSelector.tsx
│   │   ├── UpgradeButton.tsx
│   │   └── UsageChart.tsx
│   │
│   └── ui/
│       ├── Button.tsx
│       ├── Modal.tsx
│       ├── Toast.tsx
│       └── ...
│
├── public/
│   ├── logos/
│   ├── icons/
│   └── demo/
│
├── docs/
│   ├── api.md
│   ├── guides/
│   └── faq.md
│
├── tests/
│   ├── features/              # BDD feature files
│   ├── integration/           # Integration tests
│   ├── unit/                  # Unit tests
│   └── e2e/                   # End-to-end tests
│
├── .github/
│   ├── workflows/
│   │   ├── deploy.yml
│   │   ├── test.yml
│   │   └── lint.yml
│   └── ISSUE_TEMPLATE/
│
├── middleware.ts             # Tenant detection
├── vitest.config.ts
├── package.json
└── README.md
```

---

## 🎯 Fluxo de Atendimento Detalhado

### Visão Geral do Fluxo

```
┌─────────────────────────────────────────────────────────────┐
│ JORNADA DO CLIENTE (Tempo total: ~2-3 horas)               │
└─────────────────────────────────────────────────────────────┘

T0:00  → Cliente acessa seuservico.com
         └─ Vê landing page com CTA "Começar Agora"

T0:05  → Cliente clica "Começar Agora"
         └─ Inicia chat com bot da plataforma

T0:10  → Bot coleta informações
         ├─ Email e nome
         ├─ Nome da empresa
         ├─ Objetivo do bot
         └─ Fluxos de atendimento desejados

T0:25  → Bot confirma dados
         └─ Mostra resumo + plano selecionado

T0:30  → Bot envia link de pagamento
         └─ Stripe checkout ou PIX

T1:00  → Cliente realiza pagamento
         └─ Sistema cria tenant automaticamente

T1:05  → Cliente é redirecionado para dashboard
         ├─ Mostra "Agente em Configuração"
         ├─ Countdown 24h
         └─ Guia de próximos passos

T24:00 → Agente pronto para uso
         └─ Email notificando que está live

T24:05 → Cliente começa a usar o bot
         └─ Pode fazer teste com clientes reais
```

### Detalhamento: Fluxo no Bot (Chat)

```
┌─────────────────────────────────────────────────────────────┐
│ FASE 1: COLETA DE DADOS (10 min)                            │
└─────────────────────────────────────────────────────────────┘

Bot: Olá! 👋 Bem-vindo à govinda_systems_bot!
     Vamos configurar seu agente de atendimento em minutos.
     
     Qual é o seu nome completo?

Cliente: João Silva

Bot: Ótimo, João! 😊
     Agora, qual é o seu email?

Cliente: joao@empresa.com

Bot: Perfeito! E qual é o nome da sua empresa?

Cliente: Minha Agência Digital

Bot: Excelente! 🚀
     
     Qual seria o objetivo principal do seu bot?
     
     1️⃣  Suporte ao cliente
     2️⃣  Coleta de leads
     3️⃣  Agendamento
     4️⃣  Vendas
     5️⃣  Outro

Cliente: [Clica em "Suporte ao cliente"]

Bot: Ótima escolha!
     
     Quais desses fluxos você gostaria?
     
     ✅ FAQ automático
     ✅ Agendamento de atendimento
     ✅ Coleta de dados do cliente
     ⏭️ Transferência para humano
     
     (Todos vêm pré-configurados)

Bot: Agora, para quais canais?
     
     1️⃣  WhatsApp
     2️⃣  Website
     3️⃣  Ambos

Cliente: [Clica em "Ambos"]

┌─────────────────────────────────────────────────────────────┐
│ FASE 2: CONFIRMAÇÃO (3 min)                                 │
└─────────────────────────────────────────────────────────────┘

Bot: Confirme os dados:
     
     Nome: João Silva ✅
     Email: joao@empresa.com ✅
     Empresa: Minha Agência Digital ✅
     Objetivo: Suporte ao cliente ✅
     Canais: WhatsApp + Website ✅
     
     Qual plano você prefere?
     
     🌟 STARTUP (R$ 99/mês)
        └─ 1 bot, 1000 conversas/mês
        
     💼 PROFISSIONAL (R$ 299/mês)
        └─ 5 bots, 10k conversas/mês, +integrações
        
     🚀 ENTERPRISE (R$ 999/mês)
        └─ Bots ilimitados, suporte dedicado

Cliente: [Clica em "PROFISSIONAL"]

┌─────────────────────────────────────────────────────────────┐
│ FASE 3: INTEGRAÇÃO (2 min)                                  │
└─────────────────────────────────────────────────────────────┘

Bot: Perfeito! Sua solução inclui:
     
     ✅ Bot de suporte pré-configurado
     ✅ WhatsApp integrado
     ✅ Análises em tempo real
     ✅ Suporte por email (24h)
     
     Próximo: Escolha um domínio para seu painel.
     
     ⚙️ Como você gostaria de ser chamado?
     
     Sugestão: minha-agencia
     URL: minha-agencia.seuservico.com

Cliente: Deixa assim!

┌─────────────────────────────────────────────────────────────┐
│ FASE 4: PAGAMENTO (5 min)                                   │
└─────────────────────────────────────────────────────────────┘

Bot: Resumo do pedido:
     
     Plano: PROFISSIONAL
     Valor: R$ 299/mês
     Setup: R$ 499 (desconto 50% = R$ 249,50)
     ───────────────────────
     Total: R$ 548,50
     
     ✅ Clique aqui para pagar
     (Você será levado a checkout seguro)

Cliente: [Clica no link]
         → Redirect para Stripe checkout
         → Realiza pagamento
         → Redirect de volta

┌─────────────────────────────────────────────────────────────┐
│ FASE 5: CONFIRMAÇÃO FINAL (2 min)                          │
└─────────────────────────────────────────────────────────────┘

Bot: 🎉 PAGAMENTO RECEBIDO!
     
     Seu agente está sendo configurado.
     Volte em 24h para começar a usar!
     
     Enquanto isso:
     📧 Enviamos um email para joao@empresa.com
     🔑 Suas credenciais estão lá
     🚀 URL do dashboard: minha-agencia.seuservico.com
     
     Dúvidas? Estamos aqui: support@seuservico.com
     
     [Ver Dashboard]
     [Fechar]
```

### Fluxo no Dashboard (Após 24h)

```
┌─────────────────────────────────────────────────────────────┐
│ DASHBOARD HOME - minha-agencia.seuservico.com              │
└─────────────────────────────────────────────────────────────┘

[Logo da Minha Agência]  [João Silva]  [Configurações] [Sair]

┌─────────────────────────┐
│ 🎉 Agente Configurado!  │
│                         │
│ Seu bot está pronto.    │
│ [Começar a Usar]        │
└─────────────────────────┘

ESTATÍSTICAS (últimos 7 dias)
┌──────────────┬──────────────┬──────────────┐
│ Conversas    │ Resoluções   │ Satisfação   │
│ 0            │ 0%           │ N/A          │
└──────────────┴──────────────┴──────────────┘

SEUS BOTS
┌─────────────────────────────────────────┐
│ 🤖 Bot de Suporte (Padrão)              │
│ Status: ✅ Ativo e publicado            │
│ Conversas: 0                             │
│ Última conversa: Nunca                   │
│ [Testar] [Editar] [Analytics] [Delete]  │
└─────────────────────────────────────────┘

[+ Novo Bot]

PRÓXIMAS AÇÕES
├─ ⏳ Integrar com sua base de conhecimento
├─ ⏳ Conectar CRM (Salesforce, Hubspot)
├─ ⏳ Adicionar seu logo e cores
└─ ⏳ Treinar o bot com seus dados

[Ver Guia de Onboarding]
```

---

## 📖 Documentação Técnica

### 1. Documentação de API

```yaml
# docs/api.md

## Authentication
Todos os endpoints requerem:
- Header: `Authorization: Bearer {token}`
- Header: `X-Tenant-ID: {tenantId}` (injetado automaticamente)

## Endpoints Principais

### POST /api/tenants/provision
Cria um novo tenant (chamado automaticamente após pagamento)

Request:
{
  "tenantId": "minha-agencia",
  "tenantName": "Minha Agência",
  "adminEmail": "joao@empresa.com",
  "plan": "professional",
  "whatsappIntegration": true
}

Response:
{
  "success": true,
  "tenant": {
    "id": "minha-agencia",
    "name": "Minha Agência",
    "workspaceId": "ws_xyz123",
    "dashboardUrl": "https://minha-agencia.seuservico.com"
  }
}

### GET /api/bots
Lista todos os bots do tenant autenticado

Response:
{
  "tenant": "minha-agencia",
  "bots": [
    {
      "id": "bot_123",
      "name": "Bot de Suporte",
      "publicId": "pub_xyz",
      "status": "published",
      "conversationCount": 42,
      "createdAt": "2025-12-08T10:30:00Z"
    }
  ]
}

### POST /api/bots
Cria um novo bot para o tenant

Request:
{
  "name": "Bot de Vendas",
  "description": "Bot para capturar leads",
  "templateId": "sales" // ou "support", "faq", "scheduling"
}

Response:
{
  "id": "bot_456",
  "name": "Bot de Vendas",
  "publicId": "pub_abc",
  "url": "https://typebot.io/pub_abc"
}

### PATCH /api/bots/[botId]
Atualiza um bot (fluxo, integração, etc)

### DELETE /api/bots/[botId]
Deleta um bot

### POST /api/bots/[botId]/publish
Publica um bot para uso produtivo

### GET /api/bots/[botId]/analytics
Retorna analytics do bot

Response:
{
  "period": "7d",
  "conversations": 42,
  "avgDuration": 180,
  "satisfaction": 4.2,
  "topIntents": [
    {"intent": "Suporte técnico", "count": 15}
  ]
}

### POST /api/integrations/whatsapp
Configura integração WhatsApp

Request:
{
  "phoneNumber": "+5511999999999",
  "displayName": "Minha Agência",
  "greeting": "Olá! Como posso ajudar?"
}

### GET /api/integrations/crm
Lista CRMs disponíveis para integração

Response:
{
  "available": [
    {"id": "salesforce", "name": "Salesforce", "configured": false},
    {"id": "hubspot", "name": "HubSpot", "configured": true}
  ]
}

### POST /api/ai/chat
Chat com IA (para testes)

Request:
{
  "message": "Qual é o horário de atendimento?",
  "model": "gpt-4", // ou "claude-3"
  "context": "You are a support agent"
}

Response:
{
  "response": "Nosso horário é seg-sex 9h-18h",
  "tokensUsed": 45,
  "cost": 0.002
}
```

### 2. Guia de Integração

#### WhatsApp

```typescript
// docs/guides/whatsapp-integration.md

## Integração com WhatsApp Business API

### Pré-requisitos
- Conta Meta Business (facebook.com/business)
- WhatsApp Business Account
- Phone number verificado

### Fluxo de Setup
1. Usuário vai para Integrações → WhatsApp
2. Clica "Conectar WhatsApp"
3. Autentica com Meta
4. Seleciona número da conta (ou compra novo)
5. Sistema configura webhooks automaticamente

### Como Funciona
```
Cliente envia msg no WhatsApp
        ↓
Webhook da Meta chega em /api/webhooks/whatsapp
        ↓
Sistema identifica qual bot responde
        ↓
Typebot API processa fluxo
        ↓
Resposta volta para WhatsApp
        ↓
Cliente recebe mensagem
```

### Código de Exemplo

```typescript
// lib/whatsapp/client.ts
export class WhatsAppClient {
  async sendMessage(
    phoneNumber: string,
    message: string,
    botId: string
  ) {
    // Usa Typebot API para processar mensagem
    const response = await typebotClient.sendMessage(botId, {
      message,
      channel: 'whatsapp'
    });
    
    // Envia resposta via Meta API
    await metaAPI.sendMessage(phoneNumber, response.message);
  }
}
```

#### Integração com CRM (Salesforce/HubSpot)

```typescript
// docs/guides/crm-integration.md

## Conectar com CRM

### HubSpot
- OAuth 2.0 flow
- Sync automático de leads
- Updates de contatos

### Salesforce
- OAuth 2.0 flow
- Webhook para novos registros
- Field mapping customizado

### Fluxo Típico
```
Usuário preenche formulário no bot
        ↓
Dados armazenados no Typebot
        ↓
Webhook dispara /api/integrations/crm/sync
        ↓
Sistema cria/atualiza contato no CRM
        ↓
Email automático para vendedor
```
```

#### Integrações de Calendário

```markdown
# docs/guides/calendar-integration.md

## Integração com Calendário

Suportado:
- Google Calendar
- Outlook Calendar
- Calendly
- Agendor

Fluxo:
1. Bot pergunta "Qual dia você prefere?"
2. Mostra calendário disponível
3. Cliente marca horário
4. Evento criado automaticamente
5. Confirmação via email/WhatsApp
```

---

## 🧪 Testes BDD (Behavior Driven Development)

### Estrutura de Testes

Vamos usar **Playwright** para E2E com **Gherkin** (BDD syntax).

### 1. Feature: Onboarding do Cliente

```gherkin
# tests/features/onboarding.feature

Feature: Onboarding Completo do Cliente
  Como um novo cliente
  Quero criar uma conta e configurar meu bot
  Para começar a usar a plataforma em minutos

  Background:
    Given uma nova sessão no navegador
    And a página de landing está carregada

  Scenario: Cliente completa onboarding com sucesso
    When clico em "Começar Agora"
    Then sou levado ao chat do bot
    
    When preencho formulário com:
      | campo | valor |
      | nome | João Silva |
      | email | joao@test.com |
      | empresa | Minha Agência |
      | objetivo | Suporte |
      | plano | Profissional |
    
    And confirmo os dados
    Then vejo o link de pagamento
    
    When realizo pagamento
    Then sou redirecionado para o dashboard
    And vejo mensagem "Agente em Configuração"
    
    When espero 24 horas
    Then o bot está pronto para usar
    And recebo email de confirmação

  Scenario: Cliente abandona onboarding
    When clico em "Começar Agora"
    Then sou levado ao chat do bot
    
    When fecho o chat sem completar
    Then não sou cobrado
    And posso retomar depois

  Scenario: Validação de email duplicado
    When preencho email "joao@test.com"
    And já existe uma conta com esse email
    Then vejo erro "Email já em uso"
    And sugiro login
```

### 2. Feature: Criação de Bots

```gherkin
# tests/features/bot-creation.feature

Feature: Criar e Gerenciar Bots
  Como um usuário autenticado
  Quero criar novos bots
  Para atender diferentes casos de uso

  Background:
    Given estou autenticado como "joao@test.com"
    And acesso o dashboard

  Scenario: Criar novo bot do zero
    When clico em "+ Novo Bot"
    Then vejo modal de seleção de template
    
    When seleciono template "Suporte"
    Then sou levado ao bot builder
    
    When dou nome "Bot de Suporte v2"
    And configuro fluxo:
      | bloco | tipo | conteúdo |
      | 1 | mensagem | Olá, como posso ajudar? |
      | 2 | entrada | Qual é seu problema? |
      | 3 | condição | Se problema == "técnico" -> ir para 4 |
      | 4 | mensagem | Vou transferir para um especialista |
      | 5 | webhook | POST /api/tickets |
    
    And clico "Publicar"
    Then bot fica ativo em 5 segundos
    And recebo link público

  Scenario: Deletar bot
    When abro bot existente "Bot Antigo"
    And clico em "Más opções"
    Then vejo botão "Deletar"
    
    When clico "Deletar"
    Then vejo confirmação "Tem certeza?"
    
    When confirmo deleção
    Then bot é removido
    And histórico de conversas é preservado (64 dias)

  Scenario: Clonar bot existente
    When abro bot "Bot de Suporte"
    And clico "Duplicar"
    Then vejo novo bot "Bot de Suporte (cópia)"
    And fluxo é idêntico

  Scenario: Editar fluxo do bot
    When abro bot "Bot de Suporte"
    And clico em "Editar"
    Then sou levado ao visual editor
    
    When adiciono novo bloco de mensagem
    And ligo ao bloco anterior
    Then mudança é salva automaticamente
    
    When clico "Publicar"
    Then nova versão fica ativa em 5 segundos
```

### 3. Feature: Multi-Tenancy (Isolamento)

```gherkin
# tests/features/multi-tenancy.feature

Feature: Isolamento de Dados Entre Tenants
  Como um operador da plataforma
  Quero garantir que tenants não consigam
  Acessar dados um do outro

  Scenario: Usuário não consegue acessar outro tenant via URL
    Given tenant A criado: "empresa-a.seuservico.com"
    And tenant B criado: "empresa-b.seuservico.com"
    And usuário autenticado como admin@empresa-a.com
    
    When tento acessar "empresa-b.seuservico.com/bots"
    Then recebo erro 403 Forbidden
    
    # Não é redirecionado, apenas bloqueado
    # Previne IDOR (Insecure Direct Object Reference)

  Scenario: Usuário de um tenant não consegue chamar API de outro
    Given estou autenticado como joao@empresa-a.com
    And token de auth para empresa-a
    
    When faço GET /api/bots com header "x-tenant-id: empresa-b"
    Then recebo erro 403 Forbidden
    
    # Mesmo com ID válido no header, meu tenant é verificado

  Scenario: Rate limiting por tenant
    Given estou autenticado como joao@empresa-a.com
    And faço 100 requisições/min (limite padrão)
    
    When faço requisição 101
    Then recebo erro 429 Too Many Requests
    
    # Limite é por tenant, não global
    # Usuário B não é afetado se A atingir limite

  Scenario: Isolamento de dados em banco
    Given tenant A tem 100 bots
    And tenant B tem 50 bots
    
    When faz query direto no DB sem filtro tenant
    Then nunca retorna dados sem WHERE tenant_id = X
    
    # Cascata de proteção:
    # 1. Middleware injeta tenant-id
    # 2. Auth verifica tenant
    # 3. API valida propriedade
    # 4. Query sempre filtra
```

### 4. Feature: Integração WhatsApp

```gherkin
# tests/features/whatsapp-integration.feature

Feature: Integração WhatsApp
  Como usuário
  Quero configurar WhatsApp para meu bot
  Para atender clientes pelo WhatsApp

  Scenario: Configurar novo número WhatsApp
    Given estou no dashboard
    When clico em "Integrações"
    Then vejo opção "WhatsApp"
    
    When clico "Conectar WhatsApp"
    Then vejo modal com opções:
      | opção | descrição |
      | Usar número existente | Importar conta Meta |
      | Comprar novo | Compra automática (R$ 99 setup) |
    
    When clico "Comprar novo"
    And seleciono país "Brasil"
    Then número é atribuído automaticamente
    And começa a cobrança mensal

  Scenario: Testar bot via WhatsApp
    Given número WhatsApp configurado
    When envio mensagem de teste
    Then bot responde dentro de 5 segundos
    
    When simulo diálogo:
      | envio | resposta |
      | Olá | Olá! Como posso ajudar? |
      | Preciso de suporte | Qual é seu problema? |
      | Erro no app | Vou criar um ticket para você |
    
    Then histórico aparece no analytics

  Scenario: Webhook de conversa
    Given número WhatsApp ativo
    When cliente envia mensagem
    Then webhook dispara POST /api/webhooks/whatsapp
    
    Request body:
    {
      "from": "+5511999999999",
      "message": "Olá",
      "timestamp": "2025-12-08T10:30:00Z",
      "tenantId": "empresa-a"
    }
    
    Response:
    {
      "response": "Olá! Como posso ajudar?",
      "nextStep": "wait_for_input"
    }
```

### 5. Feature: Pagamento

```gherkin
# tests/features/payment.feature

Feature: Processamento de Pagamento
  Como admin da plataforma
  Quero processar pagamentos com sucesso
  Para iniciar provisioning do tenant

  Background:
    Given Stripe está configurado
    And webhooks estão ativos

  Scenario: Fluxo de pagamento bem-sucedido
    Given cliente completou onboarding
    And vê link de pagamento
    
    When clica no link
    Then é levado a Stripe checkout
    
    When preenche dados de cartão
    And clica "Pagar"
    Then Stripe processa pagamento
    And webhook payment.success é disparado
    
    When backend recebe webhook
    Then provisioning do tenant começa:
      | passo | ação |
      | 1 | Criar workspace no Typebot |
      | 2 | Criar bot padrão |
      | 3 | Publicar bot |
      | 4 | Salvar config no GitHub |
      | 5 | Criar usuário admin |
    
    And cliente é redirecionado para dashboard
    And vê "Agente em Configuração"

  Scenario: Pagamento recusado
    When cliente tenta pagar
    And cartão é recusado
    
    Then Stripe webhook payment.failed é disparado
    And cliente vê erro
    And não é criado tenant
    And pode tentar novamente

  Scenario: Reembolso
    Given cliente pagou 24h atrás
    And quer cancelar
    
    When clico "Cancelar Plano"
    Then vejo opção "Solicitar Reembolso"
    
    When confirmo
    Then admin recebe notificação
    And payment é refundado
    And tenant é desativado em 30 dias
```

### 6. Feature: Analytics

```gherkin
# tests/features/analytics.feature

Feature: Análise de Dados do Bot
  Como usuário
  Quero ver estatísticas de meu bot
  Para otimizar seu desempenho

  Scenario: Visualizar dashboard de analytics
    Given estou no dashboard do bot
    When clico em "Analytics"
    Then vejo gráficos para:
      | métrica | período |
      | Conversas/dia | últimos 7 dias |
      | Taxa de resolução | últimos 30 dias |
      | Tempo médio de resposta | em tempo real |
      | Principais intenções | últimos 30 dias |
      | Satisfação | últimas 100 conversas |
    
    When seleciono "últimos 90 dias"
    Then gráficos atualizam com novos dados

  Scenario: Exportar dados
    Given estou no analytics
    When clico "Exportar"
    Then vejo opções:
      | formato | período |
      | CSV | 7d, 30d, 90d |
      | JSON | 7d, 30d, 90d |
      | PDF Report | 30d, 90d |
    
    When clico "CSV - últimos 30 dias"
    Then arquivo é baixado com dados completos
```

### Executar Testes

```bash
# Instalar dependências
npm install --save-dev @playwright/test @cucumber/cucumber

# Rodar testes BDD
npx cucumber-js tests/features/

# Rodar testes E2E
npx playwright test

# Com relatório visual
npx playwright test --reporter=html
```

---

## 🚀 Roadmap de Implementação

### Fase 1: MVP (Meses 1-3)
```
Semana 1-2: Setup Infrastructure
├─ [x] Repo inicial + middleware
├─ [x] Multi-tenancy base
└─ [x] Auth com Privy

Semana 3-4: Core Features
├─ [ ] API de provisioning de tenants
├─ [ ] Integração com Typebot
├─ [ ] GitHub config storage
└─ [ ] Dashboard básico

Semana 5-6: Bot Building
├─ [ ] Visual bot builder
├─ [ ] Templates de bots
└─ [ ] Fluxo de publicação

Semana 7-8: Pagamento
├─ [ ] Integração Stripe
├─ [ ] Checkout
└─ [ ] Webhooks

Semana 9-12: Polish
├─ [ ] Testes E2E
├─ [ ] Documentação
├─ [ ] Performance
└─ [ ] Launch alfa
```

### Fase 2: Integrações (Meses 4-6)
```
├─ WhatsApp Business API
├─ Google Calendar / Calendly
├─ Salesforce CRM
├─ HubSpot CRM
├─ Slack notifications
└─ Webhook genérico
```

### Fase 3: IA Avançada (Meses 7-9)
```
├─ GPT-4 Vision (processar imagens)
├─ Claude 3 integration
├─ RAG (Retrieval Augmented Generation)
├─ Fine-tuning de modelos
└─ Token usage dashboard
```

### Fase 4: Escalabilidade (Meses 10-12)
```
├─ Load testing + optimization
├─ Domínios customizados
├─ Multi-region deployment
├─ Cache optimization
└─ Backup/disaster recovery
```

---

## 📊 KPIs e Métricas

### Métricas de Negócio

```
CADASTROS
├─ CAC (Cost of Acquisition) = Gasto Marketing / Novos Clientes
├─ Tempo de conversão onboarding → pagamento
├─ Taxa de conversão landing → trial
└─ Churn rate mensal

FINANCEIRO
├─ MRR (Monthly Recurring Revenue)
├─ ARR (Annual Recurring Revenue)
├─ LTV (Lifetime Value) = ARPU × (1/Churn)
├─ Payback Period
└─ Profit Margin

RETENÇÃO
├─ Churn rate por plano
├─ NPS (Net Promoter Score)
├─ Feature adoption rate
└─ Support tickets/user
```

### Métricas Técnicas

```
PERFORMANCE
├─ Page load time < 2s
├─ API response < 500ms
├─ Bot response < 2s
└─ Uptime > 99.9%

UTILIZAÇÃO
├─ Bots por tenant (média)
├─ Conversas/dia
├─ Tokens IA/mês
├─ Integração usage
└─ API calls/tenant

QUALIDADE
├─ Erro rate
├─ Test coverage > 80%
├─ Bug report/user/mês
└─ Security incidents: 0
```

### Dashboard de Monitoramento

```
Em Grafana:
├─ MRR e ARR (charts)
├─ Churn rate (linha)
├─ Signup funnel (funil)
├─ API latency (heatmap)
├─ Bot conversations (área)
├─ Error rate (gauge)
└─ Webhook success rate (%)
```

---

## 📋 Checklist Final

### Antes do Launch

- [ ] Todos os testes BDD passando
- [ ] Documentação técnica completa
- [ ] Landing page funcionando
- [ ] Bot de onboarding testado
- [ ] Stripe integrado e testado
- [ ] Typebot API funcionando
- [ ] GitHub integration ok
- [ ] Privy auth ok
- [ ] Multi-tenancy verificado
- [ ] Rate limiting ativo
- [ ] Logging centralizado
- [ ] Monitoring setup
- [ ] Backup strategy
- [ ] LGPD/GDPR compliance
- [ ] Privacy policy pronta
- [ ] Terms of service prontos
- [ ] Email de suporte ativo
- [ ] Helpdesk setup

### Pós-Launch (Primeiros 30 dias)

- [ ] Monitorar erros via Sentry
- [ ] Coletar feedback de primeiros clientes
- [ ] Iterate com base em feedback
- [ ] Publicar case studies
- [ ] Refinar messaging
- [ ] Otimizar CAC
- [ ] Melhorar onboarding time

---
