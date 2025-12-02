## Objetivo
Identificar e resolver sistematicamente todos os erros exibidos no terminal, validar configurações e dependências, executar testes para confirmar correções e documentar as alterações. Foco no projeto Next.js 16 + React 19 + Framer Motion.

## Coleta e Análise de Erros
- Capturar logs do servidor dev:
  - Executar `npm run dev` e registrar mensagens.
  - Acessar `http://localhost:3000/` e verificar console do navegador (erros de rede/JS).
- Coletar diagnósticos:
  - `npm run lint` (ESLint) e `tsc --noEmit` (TypeScript) para detectar problemas em tempo de desenvolvimento.
  - Verificar logs de API ao chamar `POST /api/ai` com payload mínimo.

## Verificação de Arquivos e Configurações
- `package.json`: versões de `next`, `react`, `framer-motion`, dependência `lucide-react` e scripts.
- `next.config.mjs`: configurações de imagens/domínios e compatibilidade.
- `tsconfig.json`: opções `moduleResolution`, `strict` e `paths`.
- `.eslintrc.cjs`: regras e parsers.
- `.env.local` e `.env.example`: garantir `OPENAI_API_KEY` definido; não expor segredo no cliente.
- `app/api/ai/route.ts`: uso de `process.env.OPENAI_API_KEY`, formato de request `prompt`+`files` e parsing da resposta.
- `app/(site)/page.tsx`: fidelidade ao MVP, chamadas ao endpoint `/api/ai` e estados de UI.

## Correções Previstas
- Variável de ambiente:
  - Garantir que todo o código use `OPENAI_API_KEY` (não `AI_API_KEY`).
  - Atualizar `.env.example` e instruções em `README.md`.
- Rota `/api/ai`:
  - Validar tipos de `files` (base64), montar partes para multimodal, lidar com erros e tempo limite.
  - Normalizar a resposta para o JSON esperado pelo MVP.
- UI Homepage:
  - Confirmar que `startProcessing` envia `files` corretamente.
  - Garantir estados (`processing`, `error`, `complete`) e botões reagem adequadamente.
- Configurações:
  - Ajustar qualquer divergência em `next.config.mjs` e CSS global para animações usadas (`animate-fade-in`/`animate-slide-up`).

## Testes de Confirmação
- Funcionais:
  - `analysis`: arrastar PDF/JPG/PNG, processar, obter resumo e campos; copiar texto.
  - `generator`: preencher form e copiar texto gerado.
- API:
  - `curl -X POST http://localhost:3000/api/ai -H "Content-Type: application/json" -d '{"prompt":"Teste","files":[]}'` e verificar `200`/payload.
- Build:
  - `npm run build` para garantir que não há erros de compilação.
- Lint/TS:
  - `npm run lint` e `tsc --noEmit` sem erros críticos.

## Documentação
- Atualizar `README.md` com:
  - Uso de `OPENAI_API_KEY` (descrição: chave da OpenAI API).
  - Passos de inicialização, testes e observações de segurança.

## Critérios de Conclusão
- Servidor dev rodando sem erros.
- UI fiel ao MVP funcionando completamente.
- Rota de IA respondendo corretamente.
- Build sem falhas e diagnósticos limpos.

## Próximo Passo
- Com a aprovação, executo os comandos de diagnóstico, aplico correções pontuais nos arquivos e rodo os testes para confirmar a resolução total dos erros.