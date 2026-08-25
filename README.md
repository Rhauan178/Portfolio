# Portfólio — Rhauan Rafael

Base nova do portfólio, construída com **Vite + TypeScript + HTML semântico + CSS moderno**.
Esta etapa contém só a fundação (estrutura, tipografia, layout, responsividade básica) —
sem carrossel, sem formulário funcional, sem backend. Detalhes de cada decisão estão na
conversa com o Claude que gerou este projeto.

## Como rodar

```bash
npm install
npm run dev
```

Abre em `http://localhost:5173` (o terminal mostra o endereço exato).

## Comandos disponíveis

| Comando | O que faz |
|---|---|
| `npm install` | Baixa as dependências (Vite, TypeScript) listadas no `package.json`. Só precisa rodar uma vez (ou de novo se `package.json` mudar). |
| `npm run dev` | Sobe o servidor de desenvolvimento com Hot Reload (HMR). Fica rodando até você parar com `Ctrl+C`. |
| `npm run build` | Roda o type-check do TypeScript e gera a versão de produção otimizada na pasta `dist/`. |
| `npm run preview` | Serve localmente o conteúdo já gerado por `npm run build`, para conferir como ficaria em produção. |

## Estrutura

- `src/` — todo o código-fonte (HTML fica na raiz do projeto, por padrão do Vite).
- `public/` — arquivos servidos exatamente como estão, sem processamento (ex.: o PDF do currículo).
- `legacy/` — o projeto antigo (HTML/CSS/JS puro), preservado sem alterações, só para referência e comparação. Não faz parte do build novo.
