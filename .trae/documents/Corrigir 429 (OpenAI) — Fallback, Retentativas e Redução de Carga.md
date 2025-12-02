## Causa
O erro no Terminal#953-968 é `429 Too Many Requests` da OpenAI com `insufficient_quota`. Não é erro de código; é limite/quota da conta. Precisamos mitigar no código e/ou ajustar ambiente.

## Correções Propostas
- Provider e modelo
  - Usar `OPENAI_MODEL` por env (ex.: `gpt-4o-mini`) e permitir troca rápida.
- Retentativas e rate-limit
  - Exponential backoff com respeito a cabeçalhos/`retry` do provedor.
  - Rate-limit por usuário/ip no endpoint para evitar estouro.
- Fallback de provedor
  - Se OpenAI retornar 429/401, tentar Gemini usando `GEMINI_API_KEY` (se presente) com modelo leve (ex.: `gemini-1.5-flash`).
- Redução de carga
  - Compactar `prompt` e limitar tamanho das imagens/base64.
  - Se múltiplos arquivos, processar em lotes menores.
- Logs e respostas
  - Já registramos `status`, `statusText` e `details`; adicionaremos dica no payload ao cliente quando for quota para orientar ação.

## Implementação
1) Ler `OPENAI_MODEL` do `.env.local`; default `gpt-4o-mini`.
2) Adicionar backoff (até 3 tentativas, 1s/2s/4s) quando 429; se cabeçalho de retry/time estiver presente, respeitar.
3) Implementar fallback `openai → gemini` e `gemini → openai` quando houver chaves válidas.
4) Limitar payload:
   - Truncar `prompt` acima de N caracteres (configurável)
   - Limitar número de arquivos/imagens por requisição.
5) Atualizar README com instruções de env e comportamento de fallback.

## Testes
- `curl` `POST /api/ai` sem arquivos e com 1 imagem.
- Validar retorno 200 com `output` quando quota permite; validar resposta clara com `details` quando 429.
- Verificar logs mostram tentativa/fallback/backoff.

## Observação
- Se a conta OpenAI continuar sem quota, apenas fallback ou ativação de billing resolverá 429 definitivamente. Vou aplicar as correções acima e validar o comportamento.