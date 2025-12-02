## Contexto
Você enviou uma nova chave (`AIzaSyBUl...`) que é do Google (Gemini). Chaves são específicas por provedor: não funcionam cruzadas (uma chave do Google não autentica na OpenAI). Para “trocar todas as apiKey”, vamos alinhar o sistema para usar Gemini com essa chave, mantendo a segurança.

## O que vou fazer
- Variáveis de ambiente (não versionadas):
  - Criar/atualizar `.env.local` com `AI_PROVIDER=gemini` e `GEMINI_API_KEY=AIzaSyBUl...`.
  - Remover a dependência de `OPENAI_API_KEY` do ambiente ativo (opcionalmente manter como placeholder em `.env.example`).
- Rota de IA:
  - Atualizar `app/api/ai/route.ts` para suportar `AI_PROVIDER`:
    - `gemini`: chamar `https://generativelanguage.googleapis.com/v1beta/models/...:generateContent` com `contents` e `inlineData` (idêntico ao seu arquivo de referência), extraindo `candidates[0].content.parts[0].text` e parseando JSON.
    - `openai`: manter como fallback apenas se `AI_PROVIDER=openai` e houver `OPENAI_API_KEY` válido.
  - Manter logs detalhados de erro (status, corpo) e debug (tamanho do prompt, quantidade de arquivos), sem expor segredos.
- UI/Estilo:
  - Não alterar o estilo nem a interface; apenas trocar o provedor.

## Revisão tripla
- Verificar onde há uso de apiKey:
  1) `.env.local` e `.env.example` → garantir que a chave real só está em `.env.local` (não versionado) e que placeholders estão corretos.
  2) `app/api/ai/route.ts` → garantir que não há chave hardcoded e que lê de `process.env.GEMINI_API_KEY`/`AI_PROVIDER`.
  3) Qualquer outro arquivo → garantir ausência de segredos e que referências de “apiKey” estão removidas ou lendo do env.

## Testes
- `curl` de validação: `POST /api/ai` com `prompt` e sem arquivos deve retornar 200 e JSON (com quota habilitada). Em caso de erro (quota), logs mostrarão detalhes.
- Upload com imagens (JPG/PNG) para validar `inlineData` e parse do JSON.

## Documentação
- Atualizar `README.md` e `.env.example` para:
  - `AI_PROVIDER=gemini`
  - `GEMINI_API_KEY` (descrição: chave da Gemini API — Google Generative Language API)
  - Manter instruções de segurança (não versionar `.env.local`).

## Observação
- Como sua chave é do Google (Gemini), não a rotularei como “OpenAI API” para evitar inconsistência; documentarei corretamente como “chave da Gemini API”. Posso também manter suporte a OpenAI via `AI_PROVIDER=openai` com variável `OPENAI_API_KEY` opcional.

## Próximo passo
Com sua confirmação, aplico as mudanças descritas acima e executo os testes de validação para garantir que está tudo certo.