## Alvo
Deixar a homepage 100% idêntica ao arquivo `import React, { useState, useRef, u.txt`, sem nenhuma diferença visual, estrutura ou classes.

## Ações
- Copiar a estrutura JSX e classes Tailwind do arquivo de referência literalmente:
  - Manter `Card`, `Badge`, utilitários (`fileToBase64`, `callGeminiAPI`), e todos os elementos/ícones mesmo quando não usados.
  - Reproduzir os mesmos containers (`min-h-screen`, `max-w-5xl`, `p-4 md:p-8`, etc.), bordas (`border-slate-200`), sombras e arredondamentos.
  - Preservar as classes de animação `animate-fade-in` e `animate-slide-up` já criadas.
- Comportamento:
  - Substituir `callGeminiAPI` por um adapter que envia `prompt` + arquivos para `/api/ai` mantendo a mesma assinatura; mas não alterar a UI.
  - Manter estados e a lógica do gerador com `useEffect` exatamente como no arquivo de referência.
- Layout do projeto:
  - Garantir que não há header global; a página renderiza somente o layout interno igual ao arquivo.
- Verificação visual:
  - Rodar em `http://localhost:3000/` e comparar seção a seção (Header com “ImóvelScan Multi”, abas, upload, lista, estados e gerador com preview) para eliminar qualquer diferença.

## Entregáveis
- `app/(site)/page.tsx` com JSX idêntico ao arquivo de referência.
- Função de IA adaptada para backend sem alterar estilo.
- Testes visuais concluídos.

## Observação
- Não modificarei a estrutura visual; apenas adapto a chamada da IA por segurança server‑side. O resultado final será 1:1 com o arquivo de referência.