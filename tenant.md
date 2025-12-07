# 📚 Guia Completo: Tenants e Arquitetura Multi-Tenant

## 📖 Índice

1. [O que é um Tenant?](#o-que-é-um-tenant)
2. [Arquitetura Geral](#arquitetura-geral)
3. [Fluxo de Onboarding (Subdomínio)](#fluxo-de-onboarding-subdomínio)
4. [Como Funciona Tecnicamente](#como-funciona-tecnicamente)
5. [Isolamento de Dados](#isolamento-de-dados)
6. [Segurança Multi-Tenant](#segurança-multi-tenant)
7. [FAQ](#faq)

---

## 🏢 O que é um Tenant?

### Conceito Simples

Um **tenant** é um **cliente isolado** em sua plataforma SaaS. Pense em um **prédio de apartamentos**:

```
🏢 PRÉDIO (Sua plataforma SaaS)
│
├── 🚪 Apartamento 1 (Tenant A) → Empresa ABC
│   ├── Dados de ABC
│   ├── Configurações de ABC
│   └── Usuários de ABC
│
├── 🚪 Apartamento 2 (Tenant B) → Empresa XYZ
│   ├── Dados de XYZ
│   ├── Configurações de XYZ
│   └── Usuários de XYZ
│
└── 🚪 Apartamento 3 (Tenant C) → Empresa 123
    ├── Dados de 123
    ├── Configurações de 123
    └── Usuários de 123
```

**Importante:** Cada morador (tenant):
- ✅ Tem seus próprios dados isolados
- ✅ Não consegue acessar dados do vizinho
- ✅ Personaliza sua própria experiência
- ❌ **Nunca** vê dados de outro tenant

### O que Cada Tenant Recebe?

```
✅ Workspace isolado no Typebot
✅ Subdomínio personalizado (empresa.seuservico.com)
✅ Configurações customizadas (logo, cores, etc)
✅ Usuários próprios com acesso isolado
✅ Dados de bots isolados
✅ Históricos de conversas separados
```

---

## 🏗️ Arquitetura Geral

### Fluxo de Requisição

```
┌──────────────────────────────────────────────────────┐
│   Cliente acessa: empresa.seuservico.com             │
└─────────────────┬──────────────────────────────────┘
                  │
        ┌─────────▼─────────────────────┐
        │  Edge Middleware               │
        │  (Detecta Tenant)              │
        │  Injeta: x-tenant-id           │
        └─────────┬───────────────────────┘
                  │
        ┌─────────▼──────────────────────┐
        │   Next.js App                  │
        │   (Tenant-Aware)               │
        │   Lê: x-tenant-id              │
        └─────────┬──────────────────────┘
                  │
      ┌───────────┼───────────┐
      │           │           │
  ┌───▼──┐   ┌────▼────┐  ┌──▼────┐
  │ Privy│   │ GitHub  │  │Typebot│
  │ Auth │   │ Config  │  │ API   │
  └──────┘   └─────────┘  └───────┘
```

### Componentes Principais

| Componente | Função |
|-----------|--------|
| **Middleware** | Detecta qual tenant acessou a URL |
| **Next.js App** | Aplicação isolada por tenant |
| **Privy** | Autenticação segura por tenant |
| **GitHub** | Armazena configuração isolada de cada tenant |
| **Typebot** | API para criar/gerenciar bots do tenant |

---

## 📋 Fluxo de Onboarding (Subdomínio)

### Passo 1: Cliente Criar Conta

```
Cliente acessa: seuservico.com
Clica em: "Criar Nova Conta"

Formulário:
┌─────────────────────────────────┐
│ Email:        seu@email.com     │
│ Senha:        ••••••••          │
│ Nome Empresa: Minha Agência     │
│ Subdomain:    minha-agencia     │
└─────────────────────────────────┘

Clica: Criar Conta
```

### Passo 2: Sistema Processa

```typescript
// O que acontece nos bastidores:

1️⃣ Valida dados (email, senha forte, subdomain único)

2️⃣ Cria tenant no banco:
   {
     tenantId: "minha-agencia",
     name: "Minha Agência",
     email: "seu@email.com"
   }

3️⃣ Cria workspace no Typebot:
   workspace = createWorkspace("Minha Agência (minha-agencia)")

4️⃣ Cria config no GitHub:
   /tenants/minha-agencia/config.json
   {
     "name": "Minha Agência",
     "typebotWorkspaceId": "ws_xyz123",
     "adminEmail": "seu@email.com",
     "createdAt": "2025-12-07T23:51:00Z"
   }

5️⃣ Envia email de confirmação:
   "Sua conta foi criada!"
   "Acesse: https://minha-agencia.seuservico.com"
```

### Passo 3: Cliente Acessa Plataforma

```
Cliente digita:  minha-agencia.seuservico.com
                 ↓
Middleware detecta: subdomain = "minha-agencia"
                 ↓
Injeta header:   x-tenant-id: minha-agencia
                 ↓
App verifica:    Esse tenant existe? ✅ Sim!
                 ↓
Mostra dashboard do cliente com seus dados isolados
```

### Timeline Visual

```
T0:00  → Cliente preenche formulário
        │
T0:05  → Sistema valida e cria tenant
        ├── ✅ Tenant criado em banco
        ├── ✅ Workspace Typebot criado
        ├── ✅ Config GitHub criado
        │
T0:10  → Email enviado: "Bem-vindo!"
        │
T0:15  → Cliente acessa: minha-agencia.seuservico.com
        │
        ✅ PRONTO! Dashboard disponível
```

---

## ⚙️ Como Funciona Tecnicamente

### 1. Middleware: Detectando o Tenant

```typescript
// middleware.ts
import { NextRequest, NextResponse } from 'next/server';

const SYSTEM_SUBDOMAINS = ['www', 'api', 'admin', 'app'];
const BASE_DOMAIN = 'seuservico.com';

export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || '';
  
  // Extrai subdomínio
  const subdomain = extractSubdomain(hostname);
  
  // Ex: hostname = "minha-agencia.seuservico.com"
  //     subdomain = "minha-agencia"
  
  if (!subdomain || SYSTEM_SUBDOMAINS.includes(subdomain)) {
    return NextResponse.next();
  }
  
  // ✅ CRÍTICO: Injeta tenant-id no header
  const response = NextResponse.next();
  response.headers.set('x-tenant-id', subdomain);
  
  return response;
}

function extractSubdomain(hostname: string): string | null {
  const host = hostname.split(':')[0]; // Remove porta
  const parts = host.split('.');
  
  // www.seuservico.com        → partes = ['www', 'seuservico', 'com']
  // minha-agencia.seuservico.com → partes = ['minha-agencia', 'seuservico', 'com']
  
  if (parts.length >= 3) {
    return parts[0]; // Retorna primeira parte
  }
  return null;
}
```

### 2. Obter Tenant em Componentes Server

```typescript
// lib/tenant/get-tenant.ts
import { headers } from 'next/headers';

export interface Tenant {
  id: string;
  name: string;
  config: TenantConfig;
  typebotWorkspaceId?: string;
}

export const getTenant = async (): Promise<Tenant> => {
  const headersList = headers();
  const tenantId = headersList.get('x-tenant-id');
  
  if (!tenantId) {
    throw new Error('Tenant ID não encontrado');
  }
  
  // Busca config do tenant no GitHub
  const config = await fetchTenantConfigFromGitHub(tenantId);
  
  return {
    id: tenantId,
    name: config.name,
    config,
    typebotWorkspaceId: config.typebotWorkspaceId,
  };
};

async function fetchTenantConfigFromGitHub(tenantId: string) {
  const response = await fetch(
    `https://api.github.com/repos/myorg/tenants-config/contents/tenants/${tenantId}/config.json`,
    {
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      },
      cache: 'no-store',
    }
  );
  
  const data = await response.json();
  const content = Buffer.from(data.content, 'base64').toString('utf-8');
  return JSON.parse(content);
}
```

### 3. Usar Tenant em Páginas

```typescript
// app/dashboard/page.tsx
import { getTenant } from '@/lib/tenant/get-tenant';
import { TypebotClient } from '@/lib/typebot/client';

export default async function DashboardPage() {
  // Obtém tenant da requisição
  const tenant = await getTenant();
  
  // Verifica autenticação
  const user = await getCurrentUser();
  if (user.tenantId !== tenant.id) {
    return <div>Sem permissão</div>;
  }
  
  // Lista APENAS bots deste tenant
  const typebotClient = new TypebotClient();
  const { typebots } = await typebotClient.listTypebots(
    tenant.typebotWorkspaceId
  );
  
  return (
    <div>
      <h1>Dashboard - {tenant.name}</h1>
      <p>Seus bots:</p>
      {typebots.map(bot => (
        <div key={bot.id}>{bot.name}</div>
      ))}
    </div>
  );
}
```

### 4. Proteger APIs

```typescript
// app/api/bots/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getTenant } from '@/lib/tenant/get-tenant';
import { verifyAuth } from '@/lib/auth/verify';

export async function GET(request: NextRequest) {
  try {
    // 1️⃣ Verificar autenticação
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Não autenticado' },
        { status: 401 }
      );
    }
    
    // 2️⃣ Obter tenant
    const tenant = await getTenant();
    
    // 3️⃣ CRÍTICO: Validar que usuário pertence ao tenant
    if (user.tenantId !== tenant.id) {
      return NextResponse.json(
        { error: 'Sem permissão - tenant mismatch' },
        { status: 403 }
      );
    }
    
    // 4️⃣ Buscar dados APENAS deste tenant
    const typebotClient = new TypebotClient();
    const { typebots } = await typebotClient.listTypebots(
      tenant.typebotWorkspaceId
    );
    
    // 5️⃣ Retornar com isolamento garantido
    return NextResponse.json({
      tenant: tenant.id,
      botCount: typebots.length,
      bots: typebots,
    });
    
  } catch (error: any) {
    console.error('Erro:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
```

---

## 🔐 Isolamento de Dados

### Camadas de Isolamento

```
┌─────────────────────────────────────────────────────┐
│ Camada 1: URL / Subdomínio                          │
│ Cada tenant tem: empresa.seuservico.com             │
└─────────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────────┐
│ Camada 2: Middleware                                │
│ Injeta x-tenant-id no header de cada requisição    │
└─────────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────────┐
│ Camada 3: Autenticação                              │
│ Verifica se usuário pertence àquele tenant          │
└─────────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────────┐
│ Camada 4: Aplicação                                 │
│ Todas as queries filtram: WHERE tenant_id = X      │
└─────────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────────┐
│ Camada 5: GitHub Config                             │
│ /tenants/empresa-a/config.json (isolado)           │
│ /tenants/empresa-b/config.json (isolado)           │
└─────────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────────┐
│ Camada 6: Typebot Workspaces                        │
│ Workspace A (empresa-a) - isolado                   │
│ Workspace B (empresa-b) - isolado                   │
└─────────────────────────────────────────────────────┘
```

### Exemplo: Por Que Não Vaza Dados?

```
Usuário: joao@empresa-a.com
Tenta acessar: empresa-b.seuservico.com

┌─ Middleware detecta: tenant-id = "empresa-b"
├─ Verifica Auth: user.tenantId = "empresa-a"
├─ Compara: "empresa-a" !== "empresa-b" ❌
└─ NEGA ACESSO! Retorna 403 Forbidden
```

---

## 🛡️ Segurança Multi-Tenant

### 1. IDOR (Insecure Direct Object Reference)

**❌ VULNERÁVEL:**

```typescript
// app/api/bots/[botId]/delete/route.ts

export async function DELETE(
  request: NextRequest,
  { params }: { params: { botId: string } }
) {
  const typebotClient = new TypebotClient();
  
  // ❌ PROBLEMA: Não valida que bot pertence ao tenant!
  await typebotClient.deleteTypebot(params.botId);
  
  return NextResponse.json({ success: true });
}
```

**Um hacker poderia:**
```
DELETE /api/bots/bot_xyz_de_outro_cliente/delete
↓
DELETAR bot de outro cliente! 🔥
```

**✅ SEGURO:**

```typescript
// app/api/bots/[botId]/delete/route.ts

export async function DELETE(
  request: NextRequest,
  { params }: { params: { botId: string } }
) {
  const tenant = await getTenant();
  const typebotClient = new TypebotClient();
  
  // 1. Busca o bot
  const { typebot } = await typebotClient.getTypebot(params.botId);
  
  // 2. CRÍTICO: Valida propriedade
  if (typebot.workspaceId !== tenant.typebotWorkspaceId) {
    return NextResponse.json(
      { error: 'Forbidden - Bot não pertence ao seu tenant' },
      { status: 403 }
    );
  }
  
  // 3. Só então deleta
  await typebotClient.deleteTypebot(params.botId);
  
  return NextResponse.json({ success: true });
}
```

### 2. Rate Limiting por Tenant

```typescript
// lib/rate-limit.ts

const rateLimitStore = new Map<
  string,
  { count: number; resetAt: number }
>();

export function checkRateLimit(
  tenantId: string,
  limit: number = 100
): boolean {
  const now = Date.now();
  const current = rateLimitStore.get(tenantId);
  
  // Reset a cada minuto
  if (!current || current.resetAt < now) {
    rateLimitStore.set(tenantId, {
      count: 1,
      resetAt: now + 60000,
    });
    return true;
  }
  
  if (current.count >= limit) {
    return false; // Limite atingido!
  }
  
  current.count++;
  return true;
}
```

**Uso:**

```typescript
export async function POST(request: NextRequest) {
  const tenant = await getTenant();
  
  if (!checkRateLimit(tenant.id)) {
    return NextResponse.json(
      { error: 'Limite de requisições atingido' },
      { status: 429 }
    );
  }
  
  // Processar...
}
```

### 3. Headers de Segurança

```typescript
// middleware.ts

const response = NextResponse.next();

// Previne clickjacking entre tenants
response.headers.set('X-Frame-Options', 'SAMEORIGIN');

// Previne MIME-sniffing
response.headers.set('X-Content-Type-Options', 'nosniff');

// Política de Segurança de Conteúdo
response.headers.set(
  'Content-Security-Policy',
  "frame-ancestors 'self'"
);

return response;
```

---

## 📁 Estrutura de Pastas

```
/
├── app/
│   ├── api/
│   │   ├── tenants/
│   │   │   └── provision/
│   │   │       └── route.ts          (Criar novo tenant)
│   │   │
│   │   ├── bots/
│   │   │   ├── route.ts              (Listar bots do tenant)
│   │   │   └── [botId]/
│   │   │       └── route.ts          (Deletar bot com validação)
│   │   │
│   │   └── auth/
│   │       ├── login/
│   │       └── logout/
│   │
│   ├── dashboard/
│   │   └── page.tsx                  (Dashboard do tenant)
│   │
│   ├── layout.tsx                    (Root layout - injeta tenant context)
│   ├── providers.tsx                 (Privy + TenantProvider)
│   └── page.tsx                      (Home)
│
├── lib/
│   ├── tenant/
│   │   ├── get-tenant.ts             (Lê x-tenant-id do header)
│   │   └── tenant-context.tsx        (Context para usar em client)
│   │
│   ├── auth/
│   │   ├── privy-config.ts           (Config Privy isolada)
│   │   └── verify.ts                 (Verifica autenticação)
│   │
│   ├── typebot/
│   │   ├── client.ts                 (API Typebot)
│   │   └── flow-builder.ts           (Construir flows)
│   │
│   ├── github/
│   │   └── client.ts                 (Buscar/atualizar config)
│   │
│   └── rate-limit.ts                 (Rate limiting por tenant)
│
├── middleware.ts                     (Detecta tenant + injeta header)
├── .env.local                        (Variáveis de ambiente)
└── package.json
```

---

## 🔑 Variáveis de Ambiente

```bash
# .env.local

# Aplicação
NEXT_PUBLIC_APP_URL=https://seuservico.com
NEXT_PUBLIC_BASE_DOMAIN=seuservico.com

# Privy (Autenticação)
NEXT_PUBLIC_PRIVY_APP_ID=xxxxxxxxxxxxx
PRIVY_APP_SECRET=xxxxxxxxxxxxx

# Typebot (API de Bots)
TYPEBOT_API_TOKEN=xxxxxxxxxxxxx

# GitHub (Armazenar configs)
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
GITHUB_REPO=myorg/tenants-config

# Rate Limiting
RATE_LIMIT_PER_MINUTE=100
```

---

## ✅ Checklist de Implementação

### Fase 1: Estrutura Base

- [ ] Criar middleware.ts para detectar tenant
- [ ] Implementar getTenant() em lib/tenant/get-tenant.ts
- [ ] Criar TenantProvider em lib/tenant/tenant-context.tsx
- [ ] Configurar Privy com isolamento de tenant
- [ ] Criar layout.tsx que injeta TenantProvider

### Fase 2: APIs Seguras

- [ ] Implementar verifyAuth() para autenticação
- [ ] Criar route /api/tenants/provision
- [ ] Criar route /api/bots com isolamento
- [ ] Adicionar validação de propriedade em cada endpoint
- [ ] Implementar rate limiting por tenant

### Fase 3: GitHub Integration

- [ ] Criar GitHub client para armazenar configs
- [ ] Estrutura de pastas: /tenants/{tenant-id}/config.json
- [ ] Função para buscar config do GitHub
- [ ] Função para atualizar config do GitHub

### Fase 4: Typebot Integration

- [ ] Criar TypebotClient para API
- [ ] Implementar criação de workspace por tenant
- [ ] Implementar criação de bots por tenant
- [ ] Criar FlowBuilder para templates padrão

### Fase 5: Dashboard

- [ ] Página de dashboard isolada por tenant
- [ ] Listar bots do tenant
- [ ] Criar novo bot
- [ ] Deletar bot (com validação)
- [ ] Editar configurações do tenant

---

## ❓ FAQ

### P: Como dois clientes não conseguem acessar dados um do outro?

**R:** Através de múltiplas camadas:

1. **URL:** Cada um tem seu subdomínio
2. **Middleware:** Injeta tenant-id baseado no subdomínio
3. **Auth:** Verifica se usuário pertence àquele tenant
4. **API:** Todas as queries filtram por tenant-id
5. **Banco:** Dados separados por tenant

Se um hacker tenta acessar outro tenant, é bloqueado na camada de autenticação com erro 403.

---

### P: Como o cliente acessa sua plataforma?

**R:** Super simples:

1. Preenche formulário: email, senha, nome da empresa
2. Clica "Criar Conta"
3. Recebe link: `empresa.seuservico.com`
4. Acessa e está pronto!

Nenhuma configuração de DNS necessária! 🎉

---

### P: O que fica armazenado no GitHub?

**R:** A configuração de cada tenant:

```json
// /tenants/minha-agencia/config.json
{
  "name": "Minha Agência",
  "logo": "https://...",
  "primaryColor": "#6A3FF4",
  "typebotWorkspaceId": "ws_xyz123",
  "bots": [
    {
      "id": "typebot_123",
      "name": "Bot de Suporte",
      "publicId": "pub_xyz"
    }
  ],
  "adminEmail": "seu@email.com",
  "createdAt": "2025-12-07T23:51:00Z"
}
```

---

### P: Posso adicionar domínio customizado depois?

**R:** Sim! Essa é uma Feature 2.0:

```
Fase 1 (Agora):  cliente.seuservico.com  ✅
Fase 2 (depois): cliente.com.br (custom) 🚀
```

A documentação tem um exemplo de como fazer, mas use subdomínios primeiro!

---

### P: Como faço para monitorar uso por tenant?

**R:** Adicione logging:

```typescript
// lib/logging.ts
export function logAction(
  tenantId: string,
  action: string,
  details?: any
) {
  console.log({
    timestamp: new Date().toISOString(),
    tenantId,
    action,
    details,
  });
  
  // Ou integrar com: Datadog, LogRocket, Sentry, etc
}
```

**Uso:**

```typescript
logAction(tenant.id, 'BOT_CREATED', { botId: '123' });
logAction(tenant.id, 'USER_LOGIN', { userId: 'user_abc' });
```

---

### P: E se um tenant tentar fazer força bruta?

**R:** Rate limiting protege:

```typescript
if (!checkRateLimit(tenant.id, 100)) {
  // Bloqueado! Max 100 requisições/minuto por tenant
  return NextResponse.json({ error: '429 Too Many Requests' });
}
```

---

## 📚 Recursos Adicionais

- [Documentação Typebot API](https://docs.typebot.io/api)
- [Documentação Privy](https://docs.privy.io)
- [Documentação Next.js Middleware](https://nextjs.org/docs/app/building-your-application/routing/middleware)
- [GitHub REST API](https://docs.github.com/en/rest)
- [OWASP Multi-Tenant Security](https://owasp.org/www-community/attacks/Insecure_Direct_Object_References)

---

## 🎯 Próximos Passos

1. **Implementar a estrutura base** (middleware + getTenant)
2. **Configurar Privy** com isolamento de tenant
3. **Criar rota de provisionamento** para novo tenant
4. **Implementar GitHub integration** para armazenar configs
5. **Integrar Typebot** para criar workspaces isolados
6. **Testes E2E** para validar isolamento
7. **Documentação para cliente** (como acessar)
8. **Feature 2.0:** Domínios customizados

---

**Última atualização:** Dezembro 07, 2025

**Versão:** 1.0 - Subdomínios (Simples & Recomendado)
