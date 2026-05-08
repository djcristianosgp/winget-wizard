# 🧙 Winget Wizard — QuickSetup

**Winget Wizard** é uma aplicação web que facilita a configuração de novos computadores, gerando scripts de instalação de aplicativos para Windows (winget), macOS (Homebrew) e Linux (apt, dnf, pacman, Flatpak) com apenas alguns cliques.

---

## ✨ Funcionalidades

- **Seleção visual de apps** — Escolha entre mais de 70 aplicativos organizados por categoria (Navegadores, Desenvolvimento, Utilitários, Comunicação, Multimídia).
- **Suporte multi-plataforma** — Gera scripts compatíveis com:
  - **Windows** → `winget` (`.ps1` e `.bat`)
  - **macOS** → `Homebrew` (`.sh`)
  - **Linux** → `apt`, `dnf`, `pacman` ou `Flatpak` (`.sh`)
- **Prévia do script** — Visualize o script gerado em tempo real antes de copiar ou baixar.
- **Bootstrap do Winget (Windows)** — Opcionalmente adiciona ao script a instalação automática do winget quando ele não estiver disponível.
- **Copiar & Baixar** — Copie o script para a área de transferência ou baixe o arquivo pronto para execução.
- **Atualização de apps** — Gere comandos `winget upgrade` para atualizar todos os apps ou um específico.
- **Presets** — Conjuntos pré-configurados de apps (ex.: *Dev Essentials*, *Setup Básico*) para agilizar a configuração.
- **Interface responsiva** — Funciona no desktop e no mobile com sidebar retrátil.

---

## 🚀 Como usar

1. Acesse a aplicação no navegador.
2. Selecione o sistema operacional desejado (Windows, macOS ou Linux).
3. Escolha os aplicativos que deseja instalar navegando pelas categorias.
4. Visualize o script gerado no painel à direita.
5. Copie o script ou baixe o arquivo (`.ps1`/`.bat` no Windows, `.sh` no macOS/Linux).
6. Execute o script no terminal da sua máquina.

---

## 🛠️ Tech Stack

| Tecnologia | Uso |
|---|---|
| [React 18](https://react.dev/) | Interface do usuário |
| [TypeScript](https://www.typescriptlang.org/) | Tipagem estática |
| [Vite](https://vitejs.dev/) | Build e dev server |
| [Tailwind CSS](https://tailwindcss.com/) | Estilização |
| [shadcn/ui](https://ui.shadcn.com/) | Componentes de UI |
| [React Router](https://reactrouter.com/) | Roteamento |
| [TanStack Query](https://tanstack.com/query) | Gerenciamento de estado assíncrono |
| [Vitest](https://vitest.dev/) | Testes unitários |
| [Playwright](https://playwright.dev/) | Testes E2E |

---

## 📦 Instalação e desenvolvimento

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev

# Build para produção
npm run build

# Rodar testes unitários
npm run test

# Rodar linter
npm run lint
```

---

## 📁 Estrutura do projeto

```
src/
├── assets/          # Imagens e recursos estáticos
├── components/      # Componentes React reutilizáveis
│   ├── ui/          # Componentes base (shadcn/ui)
│   ├── AppCard.tsx
│   ├── CategorySidebar.tsx
│   ├── QuickSetupApp.tsx
│   ├── ScriptPreview.tsx
│   ├── ScriptOptionsPanel.tsx
│   └── UpgradeTab.tsx
├── data/
│   └── apps.ts      # Catálogo de aplicativos e categorias
├── hooks/           # Custom hooks (ex.: useQuickSetup)
├── lib/             # Utilitários
└── pages/           # Páginas da aplicação
```

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Para adicionar um novo aplicativo, edite o arquivo `src/data/apps.ts` seguindo o padrão já existente:

```ts
{
  id: "Publisher.AppName",
  name: "Nome do App",
  category: "development", // browsers | development | utilities | communication | multimedia
  winget: "Publisher.AppName",
  brew: "--cask appname",
  apt: "appname",
  dnf: "appname",
  pacman: "appname",
}
```

---

## 📄 Licença

Este projeto é de código aberto. Consulte o repositório para mais detalhes.
