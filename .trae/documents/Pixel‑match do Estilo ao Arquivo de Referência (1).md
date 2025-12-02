## Objetivo
Deixar a homepage 100% idêntica ao arquivo `import React, { useState, useRef, u.txt`, replicando exatamente JSX, classes Tailwind, hierarquia e comportamento visual.

## Ações
- Substituir o conteúdo de `app/(site)/page.tsx` pelo JSX do arquivo de referência, literalmente:
  - Manter `Card` e `Badge` como no arquivo (sem tipos TS), e importar todos os ícones `lucide-react`.
  - Replicar containers e classes: `min-h-screen`, `max-w-5xl`, `p-4 md:p-8`, `bg-slate-50`, `rounded-2xl`, `border-slate-200`, `shadow-sm`, etc.
  - Preservar a área de upload com drag‑and‑drop, lista de arquivos, botões e estados `idle/processing/error/complete` exatamente como no arquivo.
  - Manter o gerador e preview com as mesmas classes (`font-serif`, sticky, etc.).
- Animações
  - Confirmar `animate-fade-in` e `animate-slide-up` no CSS global com keyframes idênticos.
- Comportamento IA
  - Usar `callGeminiAPI` adaptado para enviar `prompt`+`files` ao endpoint `/api/ai` (sem alterar UI/estilo).
- Remover qualquer wrapper extra (header global, layout externo) que possa alterar espaçamentos/cor/sombra.

## Validação
- Comparar lado a lado com o arquivo de referência e ajustar qualquer diferença de espaçamento, cores, sombras, bordas e tipografia.
- Testar em `http://localhost:3000/` todas as seções (Upload/Análise/Gerador) para confirmar fidelidade visual.

## Entrega
- `app/(site)/page.tsx` idêntico ao arquivo de referência (pixel‑match), animações ativas e comportamento mantido.

## Observação
- Nenhum ajuste de funcionalidade ou modelo de IA alterará o estilo; apenas a chamada ao backend permanece segura (server‑side) sem mudar a UI.