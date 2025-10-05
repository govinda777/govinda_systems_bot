# Integração com Plataformas de Mensagens

A integração do Agente Govinda com plataformas de mensagens é feita diretamente através do painel de controle do agente. Você precisará obter as credenciais de API da plataforma desejada (WhatsApp, Telegram ou Discord) e inseri-las nos campos correspondentes no painel do seu agente.

## 1. Como configurar a API do WhatsApp Business

O Govinda Bot se conecta diretamente à API do WhatsApp Business Cloud.

1.  **Gere as Credenciais no Portal da Meta:**
    *   Acesse o [Portal Meta for Developers](https://developers.facebook.com/).
    *   Crie um novo aplicativo do tipo "Business".
    *   Na seção de produtos, adicione o "WhatsApp" ao seu aplicativo.
    *   Você obterá um **Token de Acesso Temporário (Temporary Access Token)** e um **ID do Número de Telefone (Phone Number ID)**. Para produção, é crucial gerar um **Token de Acesso Permanente**.

2.  **Insira as Credenciais no Painel do Agente:**
    *   Acesse o painel de administração do seu Agente Govinda.
    *   Navegue até a seção "Integrações" ou "Conexões".
    *   Insira o `Access Token` e o `Phone Number ID` nos campos designados para o WhatsApp.
    *   O agente cuidará da configuração do webhook e da autenticação automaticamente.

## 2. Como configurar a API do Telegram

1.  **Crie um Bot no Telegram:**
    *   Abra o Telegram e procure pelo bot `@BotFather`.
    *   Inicie uma conversa e envie o comando `/newbot`.
    *   Siga as instruções para dar um nome e um username ao seu bot.
    *   O BotFather fornecerá um **token de API HTTP**. Guarde este token com segurança.

2.  **Insira o Token no Painel do Agente:**
    *   No painel do Agente Govinda, vá para a seção de integrações.
    *   Selecione "Telegram" e cole o token de API que você recebeu.

## 3. Como configurar a API do Discord

1.  **Crie uma Aplicação no Discord:**
    *   Acesse o [Portal de Desenvolvedores do Discord](https://discord.com/developers/applications).
    *   Clique em "New Application" e dê um nome a ela.
    *   Navegue até a aba "Bot" e clique em "Add Bot".

2.  **Obtenha o Token do Bot:**
    *   Na mesma aba "Bot", você encontrará o token de autenticação do seu bot. Clique em "Reset Token" para visualizá-lo e copiá-lo.

3.  **Insira o Token no Painel do Agente:**
    *   No painel do Agente Govinda, vá para a seção de integrações.
    *   Selecione "Discord" e cole o token do bot.
    *   Você também precisará convidar o bot para o seu servidor Discord, concedendo as permissões necessárias.

## 4. Configuração de Webhook e Comandos

### Configuração do Webhook

Uma vez que as credenciais da API são inseridas no painel do Agente Govinda, **a configuração do webhook é gerenciada automaticamente**. O agente se registra para receber eventos de mensagens da plataforma conectada (WhatsApp, Telegram, etc.) sem que você precise configurar manualmente uma URL de webhook.

Toda mensagem enviada para o seu número de WhatsApp, bot do Telegram ou bot do Discord será encaminhada para o agente para processamento.

### Comandos do Agente

Você pode definir comandos personalizados para que os usuários interajam com as funcionalidades do bot. Os comandos são geralmente prefixados com uma barra (`/`).

**Exemplos de Comandos:**

*   `/pagar <valor> <endereço>`: Inicia uma transação de pagamento.
*   `/vender_nft <id_do_nft> <preço>`: Coloca um NFT à venda.
*   `/checar_nft <coleção>`: Verifica se o usuário possui um NFT de uma determinada coleção.
*   `/saldo`: Consulta o saldo de tokens do usuário.
*   `/assinar`: Solicita a assinatura do usuário para uma transação ou mensagem.

**Como configurar comandos:**

1.  **Acesse o Painel do Agente:** Navegue até a seção de "Comandos" ou "Habilidades".
2.  **Crie um Novo Comando:** Defina a palavra-chave do comando (ex: `pagar`).
3.  **Associe a uma Ação:** Vincule o comando a uma função ou fluxo de trabalho predefinido no agente. Por exemplo, o comando `/pagar` pode acionar a função de pagamentos, que por sua vez solicitará os parâmetros necessários (`valor`, `endereço`) ao usuário.
4.  **Defina Permissões:** Opcionalmente, restrinja o uso de certos comandos a perfis de usuários específicos (ex: administradores ou detentores de um NFT específico).