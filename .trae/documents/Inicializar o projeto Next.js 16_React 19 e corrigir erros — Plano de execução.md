## Objetivo
Instalar dependências, iniciar o servidor de desenvolvimento do projeto Next.js 16 + React 19 + Framer Motion e corrigir todos os erros que surgirem até a aplicação abrir corretamente.

## Passos
- Preparar ambiente:
  - Criar `.env.local` e definir `AI_API_KEY` (será lido no route de AI). Nenhum segredo será versionado.
- Instalação e inicialização:
  - `npm install` na raiz do projeto.
  - `npm run dev` para iniciar o servidor Next.
- Correção de erros:
  - Se houver erro de versão (ex.: Next 16/React 19 indisponíveis no registro), ajustar para as versões compatíveis mais próximas (canary ou estáveis suportadas) mantendo o comportamento e layout. Documentar a troca.
  - Corrigir problemas de TypeScript (tipos, configs) e ESLint.
  - Corrigir avisos/erros de Framer Motion (uso em client components com `use client`, variants centralizados).
  - Ajustar `next.config.mjs` e `tailwind.config.ts` conforme necessário (paths e otimização de imagens).
- Validação:
  - Abrir o preview local e garantir que páginas `Home`, `Upload`, `Review`, `Generate` renderizem sem erros.
  - Testar a rota `POST /api/ai` com uma requisição simples para validar a leitura da `AI_API_KEY`.

## Entregáveis
- Projeto rodando em `http://localhost:3000/` sem erros.
- Ajustes aplicados e documentados em `README.md` quando houver trocas de versão ou correções estruturais.

## Observação
- Não consigo ler o arquivo de MVP no Desktop; após o servidor estar rodando, posso mapear e alinhar o layout 1:1 se você mover o arquivo para a workspace ou colar o conteúdo aqui.