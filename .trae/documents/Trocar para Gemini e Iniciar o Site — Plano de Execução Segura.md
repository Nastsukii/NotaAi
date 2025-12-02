## Objetivo
Configurar o projeto para usar sua chave da Gemini API, iniciar o site e validar o fluxo de IA mantendo segurança (sem expor segredo em código/cliente).

## Troca de Chaves (Segurança)
- Não colocar chaves em código ou arquivos versionados.
- Atualizar `.env.local` (não versionado):
  - `AI_PROVIDER=gemini`
  - `GEMINI_API_KEY=<sua chave>`
  - Opcional: `GEMINI_MODEL=gemini-1.5-flash` (modelo leve, menor consumo)
- Remover/ignorar `OPENAI_API_KEY` se não for usar OpenAI.

## Rota de IA
- Usar `AI_PROVIDER` para selecionar provedor:
  - Gemini: chamar `generateContent` com `contents` + `inlineData` (imagens base64), `responseMimeType: application/json` e parse do JSON.
- Manter logs detalhados (status, corpo) sem expor segredo.
- Se ocorrer `429` (quota), aplicar backoff e retornar detalhes ao cliente; sugerir modelo mais leve e/ou ativar billing.

## Iniciar e Validar
- Instalar dependências (se necessário): `npm install`.
- Iniciar dev server: `npm run dev`.
- Abrir `http://localhost:3000/`.
- Testes:
  - `curl -X POST http://localhost:3000/api/ai -H "Content-Type: application/json" -d '{"prompt":"Teste","files":[]}'` deve retornar JSON.
  - Upload de imagem (JPG/PNG) para validar multimodal.

## Observações de Quota
- Se `429 RESOURCE_EXHAUSTED` persistir, é necessário:
  - Trocar o modelo para `gemini-1.5-flash`/`gemini-1.5-flash-8b`
  - Ativar billing/quota na conta.

## Entregáveis
- Ambiente configurado com Gemini.
- Servidor iniciado e rotas funcionais.
- Logs e respostas de erro claras, sem exposição de segredos.

## Próximo Passo
Com sua confirmação, aplico as variáveis no ambiente, garanto o provedor setado para Gemini, inicio o servidor e executo os testes de validação com sua chave.