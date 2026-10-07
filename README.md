# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])

```

You can also install [eslint-plugin-react-x](https://npmx.dev/package/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://npmx.dev/package/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])

```
---

# Documentação das Alterações — Projeto Festão

## 1. Resumo geral das alterações

O objetivo foi tornar o projeto **apresentável em uma demonstração de ponta a ponta, 100% frontend**: criar evento → cadastrar convidados → cadastrar presentes → personalizar → **publicar** → abrir a **página pública** → **confirmar presença como convidado** → voltar ao dashboard e ver a confirmação.

Até então esse fluxo não existia: não havia nenhum código de publicação, a página pública não existia, e várias telas estavam visualmente quebradas (estilos ausentes), com erros de TypeScript e bugs de formatação/filtro.

**Números:** 15 arquivos alterados, sendo **2 novos** e **0 removidos** — 1.356 linhas adicionadas, 186 removidas. Tudo distribuído em **7 commits** (um por passo) e enviado ao repositório `https://github.com/camilev07/festao`.

**Nenhuma dependência foi instalada ou removida** e o `package-lock.json` **não foi tocado**. Toda a persistência continua sendo o `localStorage` via Zustand `persist` (chave `festsao-storage`, inalterada para não apagar dados existentes). Não foi criado backend, banco, API, autenticação, e-mail nem upload para servidor.

**Arquivos novos:**
- `src/lib/eventUtils.ts` — biblioteca de funções puras/utilitárias.
- `src/pages/PublicEventPage.tsx` — a página pública do evento.

**Arquivos removidos:** nenhum.

---

## 2. Arquivos alterados

| # | Arquivo | Tipo | Resumo |
|---|---------|------|--------|
| 1 | `package.json` | alterado | Adicionado o script `typecheck` |
| 2 | `src/index.css` | alterado | Criadas as classes `card-base`, `btn-secondary`, `btn-blush` |
| 3 | `src/App.tsx` | alterado | Nova rota `/e/:slug`, rota curinga `*` e shell que oculta Navbar/Footer/IA na página pública |
| 4 | `src/components/Footer.tsx` | alterado | Link quebrado `/presentes` corrigido para `/dashboard` |
| 5 | `src/lib/eventUtils.ts` | **novo** | Funções utilitárias puras (slug, cores, contagem, preços, cópia, compressão de imagem) |
| 6 | `src/store/useStore.ts` | alterado | Campos de publicação e RSVP, migração de dados antigos e sincronização entre abas |
| 7 | `src/pages/LandingPage.tsx` | alterado | Cores inexistentes (`coral`/`peach`) trocadas pelas reais do tema |
| 8 | `src/pages/CreateEventPage.tsx` | alterado | Correção de tipos, imports mortos e ajustes de responsividade |
| 9 | `src/pages/PersonalizationPage.tsx` | alterado | Botão fake de salvar → publicar/despublicar; cards de Informações, Capa e Publicação; preview real |
| 10 | `src/pages/PublicEventPage.tsx` | **novo** | Página pública completa, incluindo o formulário de RSVP |
| 11 | `src/pages/GiftListPage.tsx` | alterado | Preços parseados e formatados corretamente em BRL; modal responsivo |
| 12 | `src/pages/ServicesPage.tsx` | alterado | Apenas removido um import não usado (o filtro já estava correto) |
| 13 | `src/pages/GuestsPage.tsx` | alterado | Selo "via página", exibição de observações, registro de origem da resposta e responsividade |
| 14 | `src/pages/DashboardPage.tsx` | alterado | Contagem regressiva real, atividade recente com horários e card "Página do evento" |
| 15 | `src/pages/ProfessionalProfilePage.tsx` | alterado | Apenas removido um import não usado |

---

## 3. O que foi alterado em cada arquivo

### `package.json`
- Adicionado **apenas** o script `"typecheck": "tsc -p tsconfig.app.json --noEmit"` para conferir tipos sem build. O `build` não foi modificado. Nenhuma dependência entra ou sai.

### `src/index.css` (fundação visual)
- Criadas dentro de `@layer components` três classes que **eram usadas em quase todas as telas mas não existiam**:
  - `.card-base` — cartão branco arredondado com borda e sombra;
  - `.btn-secondary` — botão branco com borda;
  - `.btn-blush` — botão rosa.
- Elas foram definidas de forma **neutra** (sem tamanhos fixos) para que classes utilitárias já usadas nas páginas (`p-4`, `bg-charcoal`, `-mx-6 -mt-6` etc.) continuem sobrescrevendo normalmente. Antes disso, as telas apareciam "sem fundo, borda e padding".

### `src/App.tsx` (rotas e shell)
- Adicionada a rota da página pública: `/e/:slug` → `PublicEventPage`.
- Adicionada rota curinga `*` → redireciona para `/` (antes, acessar uma rota inexistente quebrava).
- Criado um componente interno `AppShell` que usa `useLocation()`: quando o caminho começa com `/e/`, ele **não renderiza** `Navbar`, `Footer` nem `AIAssistant` — a página pública fica limpa e dedicada. O `Router` passou a envolver esse shell.

### `src/components/Footer.tsx`
- O link "Lista de Presentes" apontava para `/presentes`, **rota que não existe**. Passou para `/dashboard`.

### `src/lib/eventUtils.ts` (novo — funções puras e tipadas)
- `slugify(texto)` — minúsculas, sem acentos, não-alfanuméricos viram `-` (gera o endereço do evento).
- `normalizeName(texto)` — normaliza nomes (trim, minúsculas, sem acentos, espaços colapsados) para **comparar nomes de convidados** com ou sem formatação.
- `safeHex(valor, fallback)` — só aceita `#RRGGBB` válido, senão devolve um padrão (evita UI quebrada com cor inválida).
- `getCountdown(data, hora, agora)` — devolve `{status: 'future'|'today'|'past', days, hours, minutes}` calculando a diferença até o evento.
- `timeAgo(iso)` — "agora há pouco", "há X min", "há X h" ou a data `dd/mm`.
- `formatBRL(n)` — formata em reais com centavos ("R$ 1.299,90").
- `parsePrice(entrada)` — entende "1.299,90", "1299,9", "1299.90", "R$ ..." corretamente (o `parseFloat` antigo transformava "1.299,90" em 1.299).
- `copyText(texto)` — copia para a área de transferência com `navigator.clipboard` e fallback por `textarea` + `execCommand`.
- `compressImage(arquivo)` — redimensiona (máx. 1280px) e comprime para JPEG via `canvas`, rejeita arquivos > 8 MB e reduz qualidade/tamanho até caber em ~500 KB (usado no upload de capa).
- `eventTypeMeta` — mapa de tipo de evento → emoji/rótulo, usado só nos arquivos novos.

### `src/store/useStore.ts` (estado central)
- `Event` ganhou `published: boolean`, `slug: string` e `publishedAt?: string`.
- `Guest` ganhou `respondedAt?: string` e `respondedVia?: 'host' | 'public'` (para saber **quando** e **por onde** a resposta veio).
- `createEvent` agora inicializa `published: false, slug: ''` — quem cria o evento não precisa mudar nada.
- `persist` ganhou `version: 1` e uma função `migrate` que preenche os campos novos de eventos antigos (sem usar `any`, com cast controlado a partir de `unknown`) — assim dados salvos antes da alteração continuam abrindo.
- Adicionado um listener do evento `storage`: quando **outra aba** grava `festsao-storage`, esta aba chama `rehydrate()` e a interface se atualiza **sem recarregar** — essencial para a demonstração em duas abas.

### `src/pages/LandingPage.tsx`
- Substituídas as cores `coral`, `coral-dark` e `peach`, que **não existiam** no `tailwind.config.js` (o CTA principal ficava invisível), pelas cores reais do tema: `rose`, `rose-dark` e `blush-light/50`. O `tailwind.config.js` **não** foi alterado.

### `src/pages/CreateEventPage.tsx`
- `Event['type']` (que resolvia para o `Event` global do DOM) virou `EventModel['type']` via `import type { Event as EventModel }`.
- `steps.map((s, i))` → `steps.map((_, i))` e remoção de imports não usados (`FileText`, `Users`, `ArrowRight`, `Star`) para deixar o typecheck limpo.
- Responsividade: conectores do progresso `w-6 sm:w-12`; grids de data/hora, local/cidade e do resumo passaram a `grid-cols-1 sm:grid-cols-2`.

### `src/pages/PersonalizationPage.tsx` (o coração da publicação)
- **Removidos** o estado `saved` e o botão fake "Salvar alterações" (que só piscava "Salvo!" sem fazer nada — as mudanças já eram salvas ao digitar).
- No lugar do botão: se não publicado → botão **"Publicar página"**; se publicado → link **"Abrir página"** (nova aba). Abaixo do título, o texto "As alterações são salvas automaticamente".
- **Publicar** gera o slug só na primeira vez (`slugify(nome)` + 4 caracteres aleatórios, verificando unicidade) e grava `published/slug/publishedAt` via `updateEvent`.
- **Novo card "Publicação"**: status (Publicada/Rascunho), campo readonly com a URL completa + botão "Copiar link" (feedback "Copiado!" ou "Selecione e copie") e botão "Despublicar" (mantém o slug, então o **mesmo link volta a funcionar**).
- **Novo card "Informações do evento"**: nome, organizadores, data, horário, local, cidade e mensagem, controlados por `event` e gravados via `updateEvent`.
- **Novo card "Capa"**: campo de URL, botão "Enviar imagem" (arquivo comprimido via `compressImage` e salvo como data URL), botão "Remover capa" e mensagens de erro.
- **Cores**: os campos de texto hex agora usam um rascunho local (`draft`) e só gravam na store se o valor for um hex válido (`ring-rose` avisa quando está inválido); o rascunho se sincroniza quando a cor muda por preset/seletor. Todos os usos de `cor + '15'/'25'` passam por `safeHex`.
- **Preview** agora usa a capa real, a contagem regressiva real (com `setInterval` de 30s e cleanup), o nome do evento, os organizadores e a tagline — e o `sticky` só vale em telas `lg`.

### `src/pages/PublicEventPage.tsx` (novo)
- Busca o evento por `slug` **e** `published`. Se não achar, mostra mensagem amigável explicando que a página pode não estar publicada ou ter sido aberta em outro navegador, com link para `/`.
- Quando encontra, exibe: hero com capa (imagem absoluta + overlay da cor primária, com `onError` que esconde se a capa falhar), tipo/emoji, organizadores, nome, tagline entre aspas, contagem regressiva (caixas dias/horas/min, "É hoje! 🎉" ou "Evento realizado"), data por extenso, horário, local, **"Ver no mapa"** (Google Maps), mensagem para os convidados, contagem de convidados (N · M confirmados), **lista de presentes somente leitura** (nome, categoria, melhor preço em `formatBRL`, link da loja só se for `http(s)`, selo "Já presenteado" — sem expor `receivedBy`), e rodapé "Criado com Festão".
- Cores vêm de `primaryColor`/`secondaryColor` via `style`, com `safeHex` como proteção.
- **Card "Confirme sua presença"** (quando `showRsvp` está ligado): botões "Vou com certeza" / "Não poderei ir", nome obrigatório, e-mail/telefone opcionais, checkbox de acompanhante + nome, observações e erros no padrão `text-rose text-xs`. Ao enviar: procura o convidado por `normalizeName` — se existir, **atualiza**; se não, **cria** — sempre gravando `respondedAt` e `respondedVia: 'public'`. Depois mostra tela de sucesso ("Presença confirmada! Obrigado, {primeiro nome}." ou mensagem gentil de recusa) com botão **"Alterar resposta"**.
- **A página pública nunca exibe nomes, e-mails ou telefones da lista de convidados** — apenas a contagem agregada.

### `src/pages/GiftListPage.tsx`
- Preços agora usam `parsePrice` na entrada (descartando preços inválidos ou ≤ 0) e `formatBRL` na saída. O `parseFloat` que quebrava "1.299,90" e os `toFixed`/`toLocaleString` sem centavos foram removidos.
- Modal de presente com `p-5 sm:p-8`; modal de "recebido" ganhou `max-h-[90vh] overflow-y-auto`.

### `src/pages/ServicesPage.tsx`
- **Nenhuma mudança de lógica.** O filtro de categorias já havia sido corrigido em um commit anterior (`categoryIdByLabel`). Só removido o import `Filter` não usado. Os mocks **não** foram alterados.

### `src/pages/GuestsPage.tsx`
- O `<select>` de RSVP do anfitrião agora grava também `respondedAt` e `respondedVia: 'host'`.
- Linha do convidado: selo discreto **"via página"** quando `respondedVia === 'public'` e exibição das `notes` em texto pequeno (ambos no mesmo estilo dos selos já existentes).
- Responsividade: linha quebra em telas pequenas (`flex-wrap sm:flex-nowrap`), contato com `flex-wrap`, select + ações em segunda linha (`w-full sm:w-auto`), filtros com `overflow-x-auto`, 5º card de estatística com `col-span-2 sm:col-span-1`, modais com padding responsivo e `max-h`.
- Removidos imports/variáveis não usados (`Filter`, `Download`, `UserCheck`, `UserX`, `ChevronDown`, `RsvpIcon`, o mapa `rsvpIcons` etc.).

### `src/pages/DashboardPage.tsx`
- **Sem id:** se já há eventos, mostra "Seus eventos" + "Escolha um evento para abrir o painel."; se não, mantém o "Bem-vindo ao Festão!".
- **Contagem:** trocado o cálculo manual `daysLeft` por `getCountdown` — o card agora aparece nos estados futuro ("Faltam X dias"), "É hoje! 🎉", "Evento realizado" e "Defina a data" (nunca some).
- **Atividade recente:** itens ordenados por `respondedAt` (mais recente primeiro), com textos diferentes para "confirmou presença pela página" (público) vs "foi marcado como confirmado" (anfitrião), mantendo recusa/pendente; o horário usa `timeAgo` e **some** quando não há horário (acabou o "Recente" fixo).
- **Card "Enviar atualização"** (botão sem `onClick`) substituído por **"Página do evento"**: se publicada, "Sua página está no ar." + "Copiar link" (com feedback) + "Abrir página"; se não, "Sua página ainda não foi publicada." + link "Publicar página" para a personalização.
- Atalho "Personalizar página" agora mostra **"Publicada"** ou **"Rascunho"**.
- Variável morta `totalGifts` removida; linha de data/local com `flex-wrap`.

### `src/pages/ProfessionalProfilePage.tsx`
- Apenas removido o import `ExternalLink` não usado (para o typecheck fechar). Conteúdo de mock intacto.

---

## 4. Novas funcionalidades ou correções

**Novas funcionalidades**
1. **Publicação de página** — botão Publicar, geração de slug único, link copiável, abrir em nova aba e despublicar/republicar mantendo o mesmo link.
2. **Página pública do evento** em `/e/<slug>` — visual com cores, capa, contagem, mapa, presentes e rodapé.
3. **Confirmação de presença (RSVP) pelo convidado** — formulário completo com validação, tela de sucesso e "Alterar resposta"; atualiza convidado existente (sem duplicar, mesmo com nome em caixa diferente/acentuada) ou cria um novo.
4. **Rastreamento da origem da resposta** — `respondedAt` + `respondedVia` ('host' | 'public'), com selo "via página" e atividade datada.
5. **Sincronização entre abas** — listener de `storage` + `rehydrate()` atualiza dashboard/página pública em tempo real.
6. **Upload/capçaha de imagem** — compressão e redimensionamento no navegador via canvas.
7. **Cartões de informação e capa** na personalização, com preview fiel ao resultado real.
8. **Migração de dados antigos** (`version: 1`) para eventos criados antes das mudanças.

**Correções**
- Estilos ausentes (`.card-base`, `.btn-secondary`, `.btn-blush`) — telas sem aparência de cartão/botão.
- Cores inexistentes na landing (`coral`/`peach`) — CTA invisível.
- Typecheck de 26 erros → **0**; `npm run typecheck` agora existe.
- Rota quebrada `/presentes` no rodapé e ausência de rota `*`.
- Preço "1.299,90" virando 1.299 e formatação sem centavos/milhar.
- Dashboard dizendo "Você ainda não criou nenhum evento" mesmo com eventos; card de contagem que sumia no/after do evento; atividade com "Recente" fixo; botão "Enviar mensagem" morto.
- Personalização com botão de salvar inerte, preview com contagem fixa 47/8/23 e sem UI de capa.
- Diversos problemas de responsividade (320–1280px).

---

## 5. Como ficou o funcionamento após as alterações

O cenário completo funciona assim, de ponta a ponta:

1. **Criar evento** (4 etapas, com validações intactas) → salva com `published: false` e `slug: ''`.
2. **Cadastrar convidados** — edição, remoção, adição em lote e filtro por RSVP continuam iguais, agora com selo/observações extras.
3. **Cadastrar presentes** — preço digitado em qualquer formato brasileiro aparece "R$ 1.299,90" no item e nos totais.
4. **Personalizar** — nome, cores, capa, frase, toggles e informações mudam **o preview na hora**; tudo persiste automaticamente.
5. **Publicar página** → gera `/e/<slug>`, mostra link copiável; "Abrir página" abre em nova aba **sem Navbar/Footer/Assistente**.
6. **Na página pública**, o convidado responde (ex.: "maria silva" minúsculo atualiza a "Maria Silva" existente; "Carlos Novo" cria um novo) → sucesso com opção de alterar.
7. **Voltando ao dashboard em outra aba**, sem recarregar: "Confirmados" sobe, a barra de RSVP muda e a atividade mostra "…confirmou presença pela página — há X min".
8. **Despublicar** faz a página mostrar "não está disponível"; **publicar de novo** reativa o **mesmo link**.
9. Acessar qualquer rota inexistente redireciona para a home.

**Dependências entre alterações:** as mudanças se encadeiam — os estilos do Passo 1 são pré-requisito para as telas ficarem visíveis; os campos novos da store + `migrate` + listener de `storage` sustentam publicação, RSVP e sincronização; `eventUtils` é consumido pela personalização, página pública e dashboard; e os campos `respondedAt`/`respondedVia` são o que conecta o RSVP público ao selo e à atividade do painel.

---

## 6. Observações importantes

- **Nada do que já funcionava foi reescrito.** As 4 etapas de criação, CRUD de convidados e de presentes, os filtros, os mocks de `ProfessionalProfilePage`/`ServicesPage`, o `AIAssistant` e a identidade visual (paleta, tipografia, layout, componentes, animação `fadeUp`) foram **mantidos** — só houve acréscimo e correção pontual. As actions da store existentes (`updateEvent`, `addGuest`, `updateGuest`, `updatePersonalization` etc.) foram **reutilizadas**, sem criar novas.
- **Persistência:** apenas `localStorage` na chave `festsao-storage` (nunca alterada). Consequência aceita: **a página pública só enxerga os dados do mesmo navegador/perfil** — outra aba funciona (por causa do listener de `storage`), outro dispositivo não.
- **Hospedagem:** em servidor estático será preciso configurar *fallback de SPA* para abrir `/e/<slug>` direto; o dev server do Vite já cuida disso em desenvolvimento.
- **Escopo 100% frontend:** sem backend, banco, API, auth, e-mail ou upload para servidor; as imagens de capa ficam como data URL no próprio `localStorage`.
- **Mantidos como estão (fora do escopo):** as 11 dependências não usadas no `package.json`, o `npm audit` não tratado, e os mocks de serviços/perfil/assistente.
- **Validação:** `npm run typecheck` com **0 erros** e `npm run build` **OK**; funções utilitárias e a migração da store testadas por harness compilado em Node; dev server verificado respondendo HTTP 200; grep confirma ausência de `console.log`, `any`, `@ts-ignore` e `eslint-disable` no código.
- **Limite de validação visual:** sem ferramenta de navegador no ambiente, a checagem em 320–1280px foi por leitura de classes e build — recomenda-se um passe manual rápido (ex.: `document.documentElement.scrollWidth <= window.innerWidth` no console).
- **Divergência registrada:** o filtro do `ServicesPage` já estava corregido em commit anterior — foi mantido como estava, sem refatoração.
- **Git:** 7 commits (um por passo, revertíveis) + 2 pushes — `origin` (repositório original) segue inalterado e o remote `camile` aponta para `https://github.com/camilev07/festao`, onde a `main` está atualizada em `fd310d5`.
