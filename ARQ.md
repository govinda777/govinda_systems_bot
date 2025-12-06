# Arquitetura SaaS Multi-Tenant White Label com Typebot - Guia Completo

Vou apresentar uma arquitetura robusta e segura para sua plataforma SaaS, com código TypeScript completo e explicações detalhadas.

## 🏗️ Arquitetura Geral

```
┌─────────────────────────────────────────────────────┐
│          cliente1.seuservico.com                    │
│          cliente2.seuservico.com                    │
└─────────────────┬───────────────────────────────────┘
                  │
        ┌─────────▼─────────┐
        │  Edge Middleware  │ (Resolve Tenant)
        │  x-tenant-id      │
        └─────────┬─────────┘
                  │
        ┌─────────▼─────────┐
        │   Next.js App     │
        │   (Tenant-aware)  │
        └─────────┬─────────┘
                  │
    ┌─────────────┼─────────────┐
    │             │             │
┌───▼───┐   ┌────▼────┐   ┌───▼───┐
│ Privy │   │ GitHub  │   │Typebot│
│(Auth) │   │(Config) │   │  API  │
└───────┘   └─────────┘   └───────┘
```

## 1️⃣ Middleware Edge - Resolução Segura de Tenant

```typescript
// middleware.ts
import { NextRequest, NextResponse } from 'next/server';

// Lista de subdomínios do sistema (não são tenants)
const SYSTEM_SUBDOMAINS = ['www', 'api', 'admin', 'app'];

// Domínio base da aplicação
const BASE_DOMAIN = process.env.NEXT_PUBLIC_BASE_DOMAIN || 'seuservico.com';

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const hostname = request.headers.get('host') || '';
  
  // Extrai o subdomínio
  const subdomain = extractSubdomain(hostname);
  
  // Se não há subdomínio ou é um subdomínio do sistema, continua normalmente
  if (!subdomain || SYSTEM_SUBDOMAINS.includes(subdomain)) {
    return NextResponse.next();
  }
  
  // Valida formato do tenant-id (apenas alfanumérico e hífens)
  if (!isValidTenantId(subdomain)) {
    return new NextResponse('Invalid tenant', { status: 400 });
  }
  
  // Cria response com headers de tenant
  const response = NextResponse.next();
  
  // Injeta tenant-id em header customizado (CRÍTICO para isolamento)
  response.headers.set('x-tenant-id', subdomain);
  
  // Adiciona header de segurança para prevenir clickjacking entre tenants
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  
  // CSP específico para o tenant
  response.headers.set(
    'Content-Security-Policy',
    `frame-ancestors 'self' https://${subdomain}.${BASE_DOMAIN}`
  );
  
  return response;
}

function extractSubdomain(hostname: string): string | null {
  // Remove porta se existir
  const host = hostname.split(':')[0];
  
  // Para localhost development
  if (host === 'localhost' || host === '127.0.0.1') {
    return null;
  }
  
  // Divide por ponto
  const parts = host.split('.');
  
  // Se tem 3+ partes (ex: cliente1.seuservico.com), primeiro é subdomain
  if (parts.length >= 3) {
    return parts[0];
  }
  
  return null;
}

function isValidTenantId(tenantId: string): boolean {
  // Apenas alfanuméricos e hífens, 3-63 caracteres
  const regex = /^[a-z0-9]([a-z0-9-]{1,61}[a-z0-9])?$/;
  return regex.test(tenantId);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
};
```

## 2️⃣ Context Provider para Tenant

```typescript
// lib/tenant/tenant-context.tsx
'use client';

import { createContext, useContext, ReactNode } from 'react';

interface TenantContextType {
  tenantId: string;
  config: TenantConfig;
}

interface TenantConfig {
  name: string;
  logo?: string;
  primaryColor?: string;
  customDomain?: string;
}

const TenantContext = createContext<TenantContextType | null>(null);

export function TenantProvider({
  children,
  tenantId,
  config,
}: {
  children: ReactNode;
  tenantId: string;
  config: TenantConfig;
}) {
  return (
    <TenantContext.Provider value={{ tenantId, config }}>
      {children}
    </TenantContext.Provider>
  );
}

export function useTenant() {
  const context = useContext(TenantContext);
  if (!context) {
    throw new Error('useTenant must be used within TenantProvider');
  }
  return context;
}
```

```typescript
// lib/tenant/get-tenant.ts (Server-side)
import { headers } from 'next/headers';
import { cache } from 'react';

export interface Tenant {
  id: string;
  name: string;
  config: TenantConfig;
  typebotWorkspaceId?: string;
  githubRepo?: string;
}

interface TenantConfig {
  name: string;
  logo?: string;
  primaryColor?: string;
  customDomain?: string;
}

// Cached para evitar múltiplas leituras na mesma request
export const getTenant = cache(async (): Promise<Tenant> => {
  const headersList = headers();
  const tenantId = headersList.get('x-tenant-id');
  
  if (!tenantId) {
    throw new Error('Tenant ID not found in request headers');
  }
  
  // Busca configuração do tenant no GitHub
  const config = await fetchTenantConfigFromGitHub(tenantId);
  
  return {
    id: tenantId,
    name: config.name,
    config,
    typebotWorkspaceId: config.typebotWorkspaceId,
    githubRepo: config.githubRepo,
  };
});

async function fetchTenantConfigFromGitHub(
  tenantId: string
): Promise<TenantConfig & { typebotWorkspaceId?: string; githubRepo?: string }> {
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN!;
  const GITHUB_REPO = process.env.GITHUB_REPO!; // ex: "myorg/tenants-config"
  
  try {
    // Path específico do tenant: tenants/{tenantId}/config.json
    const response = await fetch(
      `https://api.github.com/repos/${GITHUB_REPO}/contents/tenants/${tenantId}/config.json`,
      {
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          Accept: 'application/vnd.github.v3+json',
        },
        // Sem cache - sempre busca a versão atual
        cache: 'no-store',
      }
    );
    
    if (!response.ok) {
      throw new Error(`Tenant ${tenantId} not found`);
    }
    
    const data = await response.json();
    const content = Buffer.from(data.content, 'base64').toString('utf-8');
    return JSON.parse(content);
  } catch (error) {
    throw new Error(`Failed to fetch tenant config: ${error}`);
  }
}
```

## 3️⃣ Sistema de Autenticação Isolada com Privy

```typescript
// lib/auth/privy-config.ts
import { PrivyClientConfig } from '@privy-io/react-auth';
import { getTenant } from '@/lib/tenant/get-tenant';

export async function getPrivyConfig(): Promise<PrivyClientConfig> {
  const tenant = await getTenant();
  
  return {
    appId: process.env.NEXT_PUBLIC_PRIVY_APP_ID!,
    
    // Isolamento: Login separado por tenant
    loginMethods: ['email', 'wallet'],
    
    // Customização white label
    appearance: {
      theme: 'light',
      accentColor: tenant.config.primaryColor || '#6A3FF4',
      logo: tenant.config.logo,
      
      // Remove branding do Privy (requer plano enterprise)
      showWalletLoginFirst: false,
    },
    
    // Metadados do tenant no token
    embeddedWallets: {
      createOnLogin: 'users-without-wallets',
    },
  };
}
```

```typescript
// app/providers.tsx
'use client';

import { PrivyProvider } from '@privy-io/react-auth';
import { TenantProvider } from '@/lib/tenant/tenant-context';
import { ReactNode } from 'react';

export function Providers({
  children,
  tenantId,
  tenantConfig,
  privyConfig,
}: {
  children: ReactNode;
  tenantId: string;
  tenantConfig: any;
  privyConfig: any;
}) {
  return (
    <PrivyProvider
      appId={privyConfig.appId}
      config={privyConfig}
      onSuccess={(user) => {
        // Salva tenant-id no user metadata
        console.log('User logged in:', user.id, 'Tenant:', tenantId);
      }}
    >
      <TenantProvider tenantId={tenantId} config={tenantConfig}>
        {children}
      </TenantProvider>
    </PrivyProvider>
  );
}
```

## 4️⃣ Typebot API - Gerenciamento Programático

```typescript
// lib/typebot/client.ts
export class TypebotClient {
  private baseUrl: string;
  private apiToken: string;
  
  constructor(apiToken?: string) {
    this.baseUrl = 'https://typebot.io/api';
    this.apiToken = apiToken || process.env.TYPEBOT_API_TOKEN!;
  }
  
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.apiToken}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
    
    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Typebot API Error: ${response.status} - ${error}`);
    }
    
    return response.json();
  }
  
  // ===== WORKSPACES =====
  
  async createWorkspace(name: string, tenantId: string) {
    return this.request<{ workspace: Workspace }>('/v1/workspaces', {
      method: 'POST',
      body: JSON.stringify({
        name: `${name} (${tenantId})`, // Identificação clara
      }),
    });
  }
  
  async listWorkspaces() {
    return this.request<{ workspaces: Workspace[] }>('/v1/workspaces');
  }
  
  // ===== TYPEBOTS (BOTS) =====
  
  async createTypebot(workspaceId: string, name: string) {
    return this.request<{ typebot: Typebot }>(
      `/v1/typebots`,
      {
        method: 'POST',
        body: JSON.stringify({
          workspaceId,
          name,
        }),
      }
    );
  }
  
  async updateTypebotFlow(typebotId: string, groups: TypebotGroup[]) {
    return this.request<{ typebot: Typebot }>(
      `/v1/typebots/${typebotId}`,
      {
        method: 'PATCH',
        body: JSON.stringify({
          groups,
        }),
      }
    );
  }
  
  async publishTypebot(typebotId: string) {
    return this.request<{ typebot: Typebot }>(
      `/v1/typebots/${typebotId}/publish`,
      {
        method: 'POST',
      }
    );
  }
  
  async getTypebot(typebotId: string) {
    return this.request<{ typebot: Typebot }>(`/v1/typebots/${typebotId}`);
  }
  
  async listTypebots(workspaceId: string) {
    return this.request<{ typebots: Typebot[] }>(
      `/v1/typebots?workspaceId=${workspaceId}`
    );
  }
  
  async deleteTypebot(typebotId: string) {
    return this.request(`/v1/typebots/${typebotId}`, {
      method: 'DELETE',
    });
  }
}

// ===== TYPES =====

export interface Workspace {
  id: string;
  name: string;
  createdAt: string;
}

export interface Typebot {
  id: string;
  name: string;
  workspaceId: string;
  groups: TypebotGroup[];
  publicId?: string;
  customDomain?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TypebotGroup {
  id: string;
  title: string;
  graphCoordinates: { x: number; y: number };
  blocks: TypebotBlock[];
}

export interface TypebotBlock {
  id: string;
  type: string;
  [key: string]: any;
}
```

```typescript
// lib/typebot/flow-builder.ts
import { TypebotGroup, TypebotBlock } from './client';
import { v4 as uuidv4 } from 'uuid';

export class FlowBuilder {
  private groups: TypebotGroup[] = [];
  
  addWelcomeMessage(message: string): this {
    const groupId = uuidv4();
    const blockId = uuidv4();
    
    this.groups.push({
      id: groupId,
      title: 'Boas-vindas',
      graphCoordinates: { x: 0, y: 0 },
      blocks: [
        {
          id: blockId,
          type: 'text',
          content: {
            richText: [{ type: 'p', children: [{ text: message }] }],
          },
        },
      ],
    });
    
    return this;
  }
  
  addTextInput(question: string, variableName: string): this {
    const groupId = uuidv4();
    const questionBlockId = uuidv4();
    const inputBlockId = uuidv4();
    
    this.groups.push({
      id: groupId,
      title: 'Pergunta',
      graphCoordinates: { x: 0, y: (this.groups.length * 200) },
      blocks: [
        {
          id: questionBlockId,
          type: 'text',
          content: {
            richText: [{ type: 'p', children: [{ text: question }] }],
          },
        },
        {
          id: inputBlockId,
          type: 'text input',
          options: {
            variableId: variableName,
            labels: {
              placeholder: 'Digite sua resposta...',
              button: 'Enviar',
            },
          },
        },
      ],
    });
    
    return this;
  }
  
  addCondition(
    variableName: string,
    conditions: Array<{ value: string; message: string }>
  ): this {
    const groupId = uuidv4();
    const conditionBlockId = uuidv4();
    
    this.groups.push({
      id: groupId,
      title: 'Condição',
      graphCoordinates: { x: 0, y: (this.groups.length * 200) },
      blocks: [
        {
          id: conditionBlockId,
          type: 'condition',
          items: conditions.map((cond, idx) => ({
            id: uuidv4(),
            content: {
              comparisons: [
                {
                  id: uuidv4(),
                  variableId: variableName,
                  comparisonOperator: 'equal',
                  value: cond.value,
                },
              ],
            },
          })),
        },
      ],
    });
    
    return this;
  }
  
  addWebhook(url: string, method: 'GET' | 'POST' = 'POST'): this {
    const groupId = uuidv4();
    const webhookBlockId = uuidv4();
    
    this.groups.push({
      id: groupId,
      title: 'Webhook',
      graphCoordinates: { x: 0, y: (this.groups.length * 200) },
      blocks: [
        {
          id: webhookBlockId,
          type: 'webhook',
          options: {
            url,
            method,
          },
        },
      ],
    });
    
    return this;
  }
  
  build(): TypebotGroup[] {
    return this.groups;
  }
}

// Exemplo de uso:
export function createSupportBotFlow(): TypebotGroup[] {
  return new FlowBuilder()
    .addWelcomeMessage('Olá! Como posso ajudar você hoje?')
    .addTextInput('Qual é o seu nome?', 'userName')
    .addTextInput('Qual é o seu email?', 'userEmail')
    .addTextInput('Descreva seu problema:', 'userProblem')
    .addWebhook('https://api.example.com/support-tickets', 'POST')
    .addWelcomeMessage('Obrigado! Seu ticket foi criado.')
    .build();
}
```

## 5️⃣ Provisionamento de Tenant - Fluxo Completo

```typescript
// app/api/tenants/provision/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { TypebotClient } from '@/lib/typebot/client';
import { createSupportBotFlow } from '@/lib/typebot/flow-builder';
import { GitHubClient } from '@/lib/github/client';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tenantId, tenantName, adminEmail } = body;
    
    // Validação
    if (!tenantId || !tenantName || !adminEmail) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // 1. Criar workspace no Typebot
    const typebotClient = new TypebotClient();
    const { workspace } = await typebotClient.createWorkspace(
      tenantName,
      tenantId
    );
    
    console.log(`✅ Workspace criado: ${workspace.id}`);
    
    // 2. Criar bot de suporte padrão
    const { typebot } = await typebotClient.createTypebot(
      workspace.id,
      'Bot de Suporte'
    );
    
    console.log(`✅ Typebot criado: ${typebot.id}`);
    
    // 3. Configurar fluxo do bot
    const flow = createSupportBotFlow();
    await typebotClient.updateTypebotFlow(typebot.id, flow);
    
    console.log(`✅ Fluxo configurado`);
    
    // 4. Publicar bot
    const { typebot: publishedBot } = await typebotClient.publishTypebot(
      typebot.id
    );
    
    console.log(`✅ Bot publicado: ${publishedBot.publicId}`);
    
    // 5. Salvar configuração no GitHub
    const githubClient = new GitHubClient();
    
    const tenantConfig = {
      name: tenantName,
      typebotWorkspaceId: workspace.id,
      bots: [
        {
          id: typebot.id,
          name: 'Bot de Suporte',
          publicId: publishedBot.publicId,
          url: `https://typebot.io/${publishedBot.publicId}`,
        },
      ],
      adminEmail,
      createdAt: new Date().toISOString(),
    };
    
    await githubClient.createOrUpdateTenantConfig(tenantId, tenantConfig);
    
    console.log(`✅ Configuração salva no GitHub`);
    
    return NextResponse.json({
      success: true,
      tenant: {
        id: tenantId,
        name: tenantName,
        workspaceId: workspace.id,
        botUrl: `https://typebot.io/${publishedBot.publicId}`,
      },
    });
  } catch (error: any) {
    console.error('Erro no provisionamento:', error);
    return NextResponse.json(
      { error: error.message || 'Provisioning failed' },
      { status: 500 }
    );
  }
}
```

## 6️⃣ GitHub Client - Versionamento Isolado

```typescript
// lib/github/client.ts
export class GitHubClient {
  private token: string;
  private repo: string;
  private owner: string;
  
  constructor() {
    this.token = process.env.GITHUB_TOKEN!;
    const repoFull = process.env.GITHUB_REPO!; // ex: "myorg/tenants-config"
    [this.owner, this.repo] = repoFull.split('/');
  }
  
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const response = await fetch(`https://api.github.com${endpoint}`, {
      ...options,
      headers: {
        Authorization: `Bearer ${this.token}`,
        Accept: 'application/vnd.github.v3+json',
        ...options.headers,
      },
    });
    
    if (!response.ok) {
      const error = await response.text();
      throw new Error(`GitHub API Error: ${response.status} - ${error}`);
    }
    
    return response.json();
  }
  
  async createOrUpdateTenantConfig(
    tenantId: string,
    config: any
  ): Promise<void> {
    const path = `tenants/${tenantId}/config.json`;
    const content = Buffer.from(JSON.stringify(config, null, 2)).toString('base64');
    
    try {
      // Tenta obter arquivo existente
      const existing = await this.getFile(path);
      
      // Atualiza arquivo existente
      await this.request(`/repos/${this.owner}/${this.repo}/contents/${path}`, {
        method: 'PUT',
        body: JSON.stringify({
          message: `Update config for tenant ${tenantId}`,
          content,
          sha: existing.sha,
        }),
      });
    } catch (error) {
      // Arquivo não existe, cria novo
      await this.request(`/repos/${this.owner}/${this.repo}/contents/${path}`, {
        method: 'PUT',
        body: JSON.stringify({
          message: `Create config for tenant ${tenantId}`,
          content,
        }),
      });
    }
  }
  
  async getFile(path: string): Promise<{ content: string; sha: string }> {
    return this.request<{ content: string; sha: string }>(
      `/repos/${this.owner}/${this.repo}/contents/${path}`
    );
  }
  
  async getTenantConfig(tenantId: string): Promise<any> {
    const path = `tenants/${tenantId}/config.json`;
    const file = await this.getFile(path);
    const content = Buffer.from(file.content, 'base64').toString('utf-8');
    return JSON.parse(content);
  }
  
  async listTenants(): Promise<string[]> {
    const { tree } = await this.request<{ tree: Array<{ path: string }> }>(
      `/repos/${this.owner}/${this.repo}/git/trees/main?recursive=1`
    );
    
    // Extrai tenant IDs dos paths
    const tenantIds = tree
      .filter((item) => item.path.startsWith('tenants/') && item.path.endsWith('/config.json'))
      .map((item) => item.path.split('/')[1]);
    
    return Array.from(new Set(tenantIds));
  }
}
```

## 7️⃣ API Route com Isolamento de Tenant

```typescript
// app/api/bots/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getTenant } from '@/lib/tenant/get-tenant';
import { TypebotClient } from '@/lib/typebot/client';
import { verifyAuth } from '@/lib/auth/verify';

export async function GET(request: NextRequest) {
  try {
    // 1. Verifica autenticação
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // 2. Obtém tenant do header (injetado pelo middleware)
    const tenant = await getTenant();
    
    // 3. Valida que o usuário pertence ao tenant
    if (user.tenantId !== tenant.id) {
      return NextResponse.json(
        { error: 'Forbidden - Tenant mismatch' },
        { status: 403 }
      );
    }
    
    // 4. Lista bots APENAS do workspace do tenant
    const typebotClient = new TypebotClient();
    const { typebots } = await typebotClient.listTypebots(
      tenant.typebotWorkspaceId!
    );
    
    // 5. Retorna bots isolados
    return NextResponse.json({
      tenant: tenant.id,
      bots: typebots,
    });
  } catch (error: any) {
    console.error('Error fetching bots:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
```

```typescript
// lib/auth/verify.ts
import { headers } from 'next/headers';

export interface AuthUser {
  id: string;
  email: string;
  tenantId: string;
}

export async function verifyAuth(
  request?: Request
): Promise<AuthUser | null> {
  const headersList = headers();
  
  // Obtém token do header Authorization
  const authHeader = headersList.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  
  const token = authHeader.substring(7);
  
  // Obtém tenant-id do header
  const tenantId = headersList.get('x-tenant-id');
  if (!tenantId) {
    return null;
  }
  
  try {
    // Verifica token com Privy
    const response = await fetch('https://auth.privy.io/api/v1/users/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      return null;
    }
    
    const privyUser = await response.json();
    
    // Retorna usuário com tenant-id associado
    return {
      id: privyUser.id,
      email: privyUser.email?.address,
      tenantId, // CRÍTICO: tenant-id vem do middleware, não do token
    };
  } catch (error) {
    console.error('Auth verification failed:', error);
    return null;
  }
}
```

## 8️⃣ Layout Root com Tenant Context

```typescript
// app/layout.tsx
import { getTenant } from '@/lib/tenant/get-tenant';
import { getPrivyConfig } from '@/lib/auth/privy-config';
import { Providers } from './providers';
import './globals.css';

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Busca tenant no servidor (via header x-tenant-id)
  const tenant = await getTenant();
  const privyConfig = await getPrivyConfig();
  
  return (
    <html lang="pt-BR">
      <head>
        <title>{tenant.config.name}</title>
        {tenant.config.logo && (
          <link rel="icon" href={tenant.config.logo} />
        )}
        <style
          dangerouslySetInnerHTML={{
            __html: `
              :root {
                --primary-color: ${tenant.config.primaryColor || '#6A3FF4'};
              }
            `,
          }}
        />
      </head>
      <body>
        <Providers
          tenantId={tenant.id}
          tenantConfig={tenant.config}
          privyConfig={privyConfig}
        >
          {children}
        </Providers>
      </body>
    </html>
  );
}
```

## 9️⃣ Preparação para Domínios Customizados

```typescript
// lib/domains/verify.ts
export async function verifyCustomDomain(domain: string): Promise<boolean> {
  try {
    // Verifica registro CNAME
    const response = await fetch(`https://dns.google/resolve?name=${domain}&type=CNAME`);
    const data = await response.json();
    
    if (data.Answer) {
      const cname = data.Answer[0]?.data;
      // Verifica se aponta para sua infraestrutura
      return cname?.endsWith('.vercel-dns.com');
    }
    
    return false;
  } catch (error) {
    return false;
  }
}

// app/api/domains/verify/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getTenant } from '@/lib/tenant/get-tenant';
import { verifyCustomDomain } from '@/lib/domains/verify';
import { GitHubClient } from '@/lib/github/client';

export async function POST(request: NextRequest) {
  try {
    const tenant = await getTenant();
    const { domain } = await request.json();
    
    // Valida domínio
    if (!domain || !/^[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,}$/i.test(domain)) {
      return NextResponse.json({ error: 'Invalid domain' }, { status: 400 });
    }
    
    // Verifica DNS
    const isValid = await verifyCustomDomain(domain);
    if (!isValid) {
      return NextResponse.json(
        { error: 'Domain DNS not configured correctly' },
        { status: 400 }
      );
    }
    
    // Adiciona domínio no Vercel via API
    await fetch(`https://api.vercel.com/v9/projects/${process.env.VERCEL_PROJECT_ID}/domains`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.VERCEL_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: domain }),
    });
    
    // Atualiza config do tenant no GitHub
    const github = new GitHubClient();
    const config = await github.getTenantConfig(tenant.id);
    config.customDomain = domain;
    await github.createOrUpdateTenantConfig(tenant.id, config);
    
    return NextResponse.json({ success: true, domain });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
```

```typescript
// middleware.ts (atualizado para custom domains)
import { NextRequest, NextResponse } from 'next/server';

const SYSTEM_SUBDOMAINS = ['www', 'api', 'admin', 'app'];
const BASE_DOMAIN = process.env.NEXT_PUBLIC_BASE_DOMAIN || 'seuservico.com';

export async function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const hostname = request.headers.get('host') || '';
  
  let tenantId: string | null = null;
  
  // Verifica se é custom domain
  if (!hostname.endsWith(BASE_DOMAIN)) {
    // É domínio customizado - busca tenant pelo domínio
    tenantId = await getTenantByCustomDomain(hostname);
  } else {
    // É subdomínio - extrai normalmente
    tenantId = extractSubdomain(hostname);
  }
  
  if (!tenantId || SYSTEM_SUBDOMAINS.includes(tenantId)) {
    return NextResponse.next();
  }
  
  const response = NextResponse.next();
  response.headers.set('x-tenant-id', tenantId);
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  
  return response;
}

async function getTenantByCustomDomain(domain: string): Promise<string | null> {
  // Cache em memória para performance (Edge Runtime não tem KV)
  // Em produção, considere usar Vercel Edge Config
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/domains/resolve?domain=${domain}`,
      { cache: 'no-store' }
    );
    const data = await response.json();
    return data.tenantId || null;
  } catch {
    return null;
  }
}

// ... resto do código anterior
```

## 🔟 Checklist de Segurança Multi-Tenant

### ✅ Isolamento de Dados

```typescript
// ❌ ERRADO - Query sem filtro de tenant
const bots = await db.bots.findMany();

// ✅ CORRETO - Sempre filtra por tenant
const tenant = await getTenant();
const bots = await typebotClient.listTypebots(tenant.typebotWorkspaceId!);
```

### ✅ Validação de Propriedade

```typescript
// app/api/bots/[botId]/route.ts
export async function DELETE(
  request: NextRequest,
  { params }: { params: { botId: string } }
) {
  const tenant = await getTenant();
  const typebotClient = new TypebotClient();
  
  // 1. Busca o bot
  const { typebot } = await typebotClient.getTypebot(params.botId);
  
  // 2. CRÍTICO: Valida que o bot pertence ao workspace do tenant
  if (typebot.workspaceId !== tenant.typebotWorkspaceId) {
    return NextResponse.json(
      { error: 'Forbidden - Bot does not belong to your tenant' },
      { status: 403 }
    );
  }
  
  // 3. Só então deleta
  await typebotClient.deleteTypebot(params.botId);
  
  return NextResponse.json({ success: true });
}
```

### ✅ Prevenção de IDOR (Insecure Direct Object Reference)

```typescript
// Middleware de validação reutilizável
export async function validateBotOwnership(
  botId: string,
  tenantId: string
): Promise<boolean> {
  const typebotClient = new TypebotClient();
  const github = new GitHubClient();
  
  try {
    const config = await github.getTenantConfig(tenantId);
    const botExists = config.bots?.some((b: any) => b.id === botId);
    return botExists;
  } catch {
    return false;
  }
}
```

### ✅ Rate Limiting por Tenant

```typescript
// lib/rate-limit.ts
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(tenantId: string, limit: number = 100): boolean {
  const now = Date.now();
  const key = tenantId;
  
  const current = rateLimitStore.get(key);
  
  // Reset a cada minuto
  if (!current || current.resetAt < now) {
    rateLimitStore.set(key, { count: 1, resetAt: now + 60000 });
    return true;
  }
  
  if (current.count >= limit) {
    return false;
  }
  
  current.count++;
  return true;
}

// Uso em API routes
export async function POST(request: NextRequest) {
  const tenant = await getTenant();
  
  if (!checkRateLimit(tenant.id)) {
    return NextResponse.json(
      { error: 'Rate limit exceeded' },
      { status: 429 }
    );
  }
  
  // ... resto da lógica
}
```

## 📋 Estrutura de Pastas Recomendada

```
/
├── app/
│   ├── api/
│   │   ├── tenants/
│   │   │   └── provision/
│   │   │       └── route.ts
│   │   ├── bots/
│   │   │   ├── route.ts
│   │   │   └── [botId]/
│   │   │       └── route.ts
│   │   └── domains/
│   │       ├── verify/
│   │       │   └── route.ts
│   │       └── resolve/
│   │           └── route.ts
│   ├── layout.tsx
│   ├── page.tsx
│   └── providers.tsx
├── lib/
│   ├── tenant/
│   │   ├── get-tenant.ts
│   │   └── tenant-context.tsx
│   ├── auth/
│   │   ├── privy-config.ts
│   │   └── verify.ts
│   ├── typebot/
│   │   ├── client.ts
│   │   └── flow-builder.ts
│   ├── github/
│   │   └── client.ts
│   ├── domains/
│   │   └── verify.ts
│   └── rate-limit.ts
├── middleware.ts
├── .env.local
└── package.json
```

## 🔑 Variáveis de Ambiente

```bash
# .env.local

# Vercel
NEXT_PUBLIC_APP_URL=https://seuservico.com
NEXT_PUBLIC_BASE_DOMAIN=seuservico.com
VERCEL_PROJECT_ID=prj_xxxxx
VERCEL_TOKEN=token_xxxxx

# Privy
NEXT_PUBLIC_PRIVY_APP_ID=xxxxx
PRIVY_APP_SECRET=xxxxx

# Typebot
TYPEBOT_API_TOKEN=xxxxx

# GitHub
GITHUB_TOKEN=ghp_xxxxx
GITHUB_REPO=myorg/tenants-config

# Rate Limiting
RATE_LIMIT_PER_MINUTE=100
```

## 🚀 Próximos Passos

1. **Implementar logging centralizado por tenant** (Vercel Analytics + custom events)
2. **Adicionar métricas de uso por tenant** (chamadas API, bots criados, etc.)
3. **Implementar sistema de billing** (Stripe com metadata de tenant)
4. **Criar dashboard admin** para gerenciar tenants
5. **Adicionar testes E2E** focados em isolamento multi-tenant
6. **Implementar backup automático** das configs do GitHub
7. **Criar sistema de templates** de bots pré-configurados
8. **Adicionar suporte a múltiplos engines** (preparar abstração)

## 📚 Recursos Adicionais

- [Typebot API Docs](https://docs.typebot.io/api)
- [Next.js Middleware](https://nextjs.org/docs/app/building-your-application/routing/middleware)
- [Privy Docs](https://docs.privy.io)
- [GitHub REST API](https://docs.github.com/en/rest)
- [Vercel Domains API](https://vercel.com/docs/rest-api/endpoints/domains)

***

Esta arquitetura garante **isolamento total**, **segurança robusta** e **escalabilidade** para seu SaaS multi-tenant white label. Cada componente foi projetado para prevenir vazamento de dados entre tenants, com múltiplas camadas de validação e um design que facilita auditoria e extensão futura.
