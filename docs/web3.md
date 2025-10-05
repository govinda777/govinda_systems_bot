# Funcionalidades Web3

O Agente Govinda é projetado para interagir com a blockchain, permitindo uma série de operações descentralizadas diretamente do chat.

## 1. Como fazer o agente receber pagamentos e transferir o saldo

O agente pode gerenciar uma carteira digital (wallet) para receber e enviar criptoativos.

1.  **Recebimento de Pagamentos:**
    *   Quando um usuário executa o comando `/pagar`, o agente gera um endereço de carteira único para a transação ou informa o endereço da carteira principal do serviço.
    *   O usuário envia os fundos para este endereço.
    *   O agente monitora a blockchain e, ao confirmar o recebimento, credita o saldo ao usuário no sistema interno.

2.  **Transferência para a Carteira de Origem:**
    *   Os fundos recebidos podem ser periodicamente consolidados e transferidos para uma carteira principal (de origem) definida pelo administrador no painel do agente.
    *   Essa transferência é uma transação na blockchain, executada pelo agente de forma automática ou mediante um comando de administrador.

## 2. Como fazer o Bot permitir Trade

A funcionalidade de trade pode ser implementada através da integração com uma exchange descentralizada (DEX) ou um protocolo de liquidez.

1.  **Integração com DEX:** O agente se conecta à API de uma DEX (como Uniswap ou PancakeSwap).
2.  **Comando de Trade:** O usuário utiliza um comando como `/trocar <token_a> <token_b> <quantidade>`.
3.  **Execução:** O agente executa a ordem de troca na DEX em nome do usuário, utilizando os fundos da carteira do usuário no bot. É crucial que o usuário autorize a transação, geralmente através de uma assinatura.

## 3. Como vender uma NFT pelo bot

1.  **Comando de Venda:** O usuário inicia o processo com um comando como `/vender_nft <id_do_nft> <preço>`.
2.  **Verificação de Propriedade:** O agente verifica na blockchain se o usuário é o proprietário do NFT.
3.  **Listagem no Marketplace:** Se a verificação for positiva, o agente lista o NFT em um marketplace (como OpenSea) através da API do marketplace ou interagindo diretamente com o smart contract.
4.  **Notificação:** O usuário é notificado quando a venda é concluída, e os fundos são creditados em sua carteira.

## 4. Como fazer o bot checar se o usuário tem a NFT da coleção X

Esta é uma funcionalidade chave para criar comunidades exclusivas ou conceder permissões especiais.

1.  **Associação de Carteira:** Primeiro, o usuário precisa associar sua carteira Web3 (ex: MetaMask) à sua conta no bot. Isso é feito de forma segura, geralmente pedindo para o usuário assinar uma mensagem.
2.  **Comando de Verificação:** Com um comando como `/verificar_acesso` ou automaticamente ao tentar acessar uma área restrita, o agente é acionado.
3.  **Consulta na Blockchain:** O agente consulta o smart contract da coleção de NFTs na blockchain para verificar se a carteira associada ao usuário possui pelo menos um NFT da coleção X.
4.  **Concessão de Acesso:** Com base no resultado, o agente libera ou nega o acesso à funcionalidade ou conteúdo.

## 5. Como fazer o bot coletar a assinatura do usuário

A assinatura digital é usada para autorizar transações ou provar a identidade de forma segura, sem expor chaves privadas.

1.  **Geração da Mensagem:** Quando uma ação requer autorização (ex: uma transação ou login), o agente gera uma mensagem única e segura para ser assinada (conforme o padrão EIP-712, por exemplo).
2.  **Solicitação de Assinatura:** O agente envia um link ou um deep link para o usuário, que o direciona para sua carteira (MetaMask, Trust Wallet) para assinar a mensagem.
3.  **Verificação da Assinatura:** Após o usuário assinar, a assinatura é enviada de volta para o agente. O agente então a verifica na blockchain para garantir que foi assinada pela chave privada correta. Se válida, a ação é autorizada.