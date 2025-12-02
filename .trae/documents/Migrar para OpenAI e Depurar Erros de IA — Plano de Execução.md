## O que está acontecendo
- O terminal mostra 429 (Too Many Requests) da Gemini API com `RESOURCE_EXHAUSTED`: sem cota ativa (free tier com limite 0 para `gemini-2.0-flash-exp`).
- Você pediu para "utilizar o OpenAI" ao mesmo tempo que quer "trocar todas as chaves" para a chave `AIzaSyBUl...`, que é do Google (Gemini). Chaves não são intercambiáveis: uma chave Gemini não autentica na OpenAI.

## Decisão
- Para usar OpenAI: precisamos de `OPENAI_API_KEY` (chave da OpenAI). A chave `AIza...` não serve na OpenAI. 
- Se preferir manter a chave `AIza...` (Gemini), o provedor deve ser Gemini; para evitar 429, é necessário ativar cota/billing ou usar um modelo com limites disponíveis.

## Plano (sem alterar estilo/UI)
1) Provedor e chaves
- Adotar `AI_PROVIDER=openai` e ler `OPENAI_API_KEY` do `.env.local` (você fornecerá uma chave válida da OpenAI).
- Manter `GEMINI_API_KEY` apenas como backup; não usado quando `AI_PROVIDER=openai`.
2) Rota de IA (`app/api/ai/route.ts`)
- Fixar provider = openai; remover chamadas Gemini (ou manter fallback somente se você solicitar).
- Modelo configurável por env `OPENAI_MODEL` (ex.: `gpt-4o-mini`).
- Manter logs detalhados: request (tamanhos) e resposta (status, corpo) sem expor segredo.
3) Debug e validação
- Testar `curl` com `prompt` simples e sem arquivos para confirmar 200.
- Testar upload de imagem (multimodal) e verificar parsing JSON em `output`.
- Se OpenAI retornar 429/401, registrar detalhes e orientar ajustes (quota/billing, modelo).
4) Documentação
- Atualizar `README.md` e `.env.example` para OpenAI.
- Notar explicitamente: “chaves são específicas por provedor”.

## Alternativa (caso insista em usar a chave `AIza...`)
- Definir `AI_PROVIDER=gemini` e `GEMINI_API_KEY=AIza...`.
- Trocar o modelo para um com cota disponível (ex.: `gemini-1.5-flash`), ou ativar billing/quota na conta.
- Manter logs e testar até sair do 429.

## Testes previstos
- `curl -X POST http://localhost:3000/api/ai -H 'Content-Type: application/json' -d '{"prompt":"Teste","files":[]}'` deve retornar `200` com `output`.
- Upload multimodal e análise com retorno JSON conforme o MVP.

## Próximo passo
- Confirme se deseja seguir com OpenAI (fornecendo `OPENAI_API_KEY`) ou manter Gemini com a chave `AIza...` e ajustar cota/modelo. Após a confirmação, implemento e depuro até a resposta 200 com logs claros.