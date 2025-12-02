## Resumo
- Não consigo acessar arquivos fora da workspace (Desktop). Para garantir fidelidade total ao novo MVP, preciso do conteúdo acessível aqui: copie o arquivo para a workspace (ex.: `./docs/mvp.txt`) ou cole o texto na conversa. Assim, mapeio 1:1 o layout, sem diferenças.
- Vou integrar sua chave da OpenAI API com segurança (servidor) e documentar a descrição “chave da OpenAI API” sem expor o segredo em cliente.

## Ações Planejadas
1) Obter o novo MVP
- Você move o arquivo do Desktop para a workspace (`c:\Users\Cliente\Documents\GitHub\NotaAi\docs\mvp.txt`) ou cola o conteúdo aqui.
- Eu leio e extraio a hierarquia de páginas/sections, tipografia, grids, espaçamentos, e componentes.

2) Mapear layout 1:1
- Criar componentes e páginas em `app/(site)/*` exatamente conforme o MVP (sem diferenças):
  - Header/Nav, Hero, blocos de conteúdo, formulários, revisão, geração, rodapé.
- Reproduzir tipografia, cores, espaçamentos, breakpoints, e interações.
- Adicionar Framer Motion com variantes suaves onde indicado no MVP.

3) Integração OpenAI (segura)
- `.env.local`: `OPENAI_API_KEY=<sua chave>`.
- `app/api/ai/route.ts`: usar OpenAI Responses/Chat (servidor) com `Authorization: Bearer` e não expor a chave no cliente.
- Adicionar tratamento de erros, timeouts e logs mínimos.
- Documentar em `README.md` a descrição: “chave da OpenAI API” e o uso server-side.

4) Melhorias (quando apropriado)
- Acessibilidade: foco, aria, semântica.
- Responsividade: grid fluido + breakpoints fiéis.
- Performance: memoização e otimização de animações (Framer Motion), imagens otimizadas.

5) QA & Validação
- Rodar `npm run dev` e ajustar qualquer erro de versão/TS/ESLint/Motion.
- Garantir que todas as páginas rendem sem warnings e com fidelidade visual total.
- Testar `/api/ai` com prompt simples (server-side).

## Entregáveis
- Projeto Next.js 16 + React 19 + Framer Motion implementando o novo MVP sem diferenças.
- Design responsivo e acessível.
- Documentação de melhorias e instruções de configuração da chave da OpenAI.

## Observação Importante
- Nunca vou colocar sua chave diretamente no cliente nem commitá-la em repositório. Ela ficará apenas em `.env.local` e usada no servidor. Depois que você disponibilizar o novo MVP na workspace, inicio a implementação pixel‑perfect imediatamente.