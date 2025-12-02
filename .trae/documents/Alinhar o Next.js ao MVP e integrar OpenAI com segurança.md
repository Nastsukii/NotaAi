## Objetivo
Replicar fielmente o layout e fluxo do arquivo `import React, { useState, useRef, u.txt` na homepage do projeto Next.js, integrando a IA via OpenAI em rota server-side e mantendo a chave apenas em ambiente.

## Ações
- UI
  - Instalar `lucide-react`.
  - Recriar exatamente as seções: abas `analysis`/`generator`, área de upload/drag-drop, lista de arquivos, botões de processamento, estados `processing/error/complete`, blocos de resumo e detalhes, formulário do gerador e preview com copiar.
  - Adicionar classes utilitárias e animações (`animate-fade-in`, `animate-slide-up`) em CSS global.
- Client
  - Implementar utilitários `fileToBase64`, `addFiles`, `removeFile`, `startProcessing` que enviam arquivos para `POST /api/ai`.
- Server
  - Atualizar `app/api/ai/route.ts` para aceitar uploads (base64) e chamar OpenAI (`responses`), usando `process.env.OPENAI_API_KEY` (server-side).
  - Fazer parsing da resposta e retornar JSON exatamente como o MVP espera.
- Segurança & Doc
  - `.env.example` e `README.md` com descrição “chave da OpenAI API”; não expor segredo no cliente.

## Validação
- Rodar dev server, verificar `Home` com fidelidade visual e funcional.
- Testar `analysis` com imagens e observar estados; testar gerador e copiar.

## Entrega
- Homepage com layout idêntico ao MVP.
- IA funcional via OpenAI em server route.
- Documentação de chave e melhorias leves (acessibilidade e responsividade).