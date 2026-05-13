export type OsCategory = "windows" | "macos" | "linux" | "embedded";

export type OsArchitecture = "x64" | "x86" | "arm64" | "arm" | "universal";

export interface OsRelease {
  id: string;
  name: string;
  version: string;
  category: OsCategory;
  description: string;
  releaseDate?: string;
  architecture: OsArchitecture[];
  officialUrl: string;
  /** Optional secondary URL (e.g. release notes page) */
  releaseNotesUrl?: string;
  tags?: string[];
  /** Whether this is the currently recommended/latest release */
  isLatest?: boolean;
  /** Whether this is an LTS release */
  isLts?: boolean;
  /** Raspberry Pi Imager or similar tooling download */
  isTool?: boolean;
}

export const osCategoryLabels: Record<OsCategory, string> = {
  windows: "Windows",
  macos: "macOS",
  linux: "Linux",
  embedded: "Embarcado / IoT",
};

export const osCategoryDescriptions: Record<OsCategory, string> = {
  windows: "Sistemas operacionais da Microsoft",
  macos: "Sistemas operacionais da Apple",
  linux: "Distribuições Linux",
  embedded: "Sistemas para dispositivos embarcados e IoT",
};

export const osCatalog: OsRelease[] = [
  // ── Windows ──────────────────────────────────────────────────────────────
  {
    id: "windows-11",
    name: "Windows 11",
    version: "24H2",
    category: "windows",
    description:
      "A versão mais recente do Windows, com interface renovada, suporte a Android e melhorias de segurança e desempenho.",
    releaseDate: "2024-10-01",
    architecture: ["x64", "arm64"],
    officialUrl: "https://www.microsoft.com/pt-br/software-download/windows11",
    releaseNotesUrl:
      "https://learn.microsoft.com/pt-br/windows/whats-new/windows-11-version-24h2",
    tags: ["desktop", "workstation"],
    isLatest: true,
  },
  {
    id: "windows-10",
    name: "Windows 10",
    version: "22H2",
    category: "windows",
    description:
      "Versão estável e amplamente adotada do Windows, com suporte até outubro de 2025.",
    releaseDate: "2022-10-18",
    architecture: ["x64", "x86", "arm64"],
    officialUrl: "https://www.microsoft.com/pt-br/software-download/windows10",
    releaseNotesUrl:
      "https://learn.microsoft.com/pt-br/windows/release-health/release-information",
    tags: ["desktop", "workstation", "lts"],
    isLts: true,
  },
  {
    id: "windows-server-2025",
    name: "Windows Server 2025",
    version: "2025",
    category: "windows",
    description:
      "Plataforma de servidor empresarial com suporte a contêineres, segurança avançada e integração com Azure.",
    releaseDate: "2024-11-01",
    architecture: ["x64", "arm64"],
    officialUrl:
      "https://www.microsoft.com/pt-br/evalcenter/evaluate-windows-server-2025",
    tags: ["server", "enterprise"],
    isLatest: true,
  },
  {
    id: "windows-server-2022",
    name: "Windows Server 2022",
    version: "2022",
    category: "windows",
    description:
      "Servidor robusto com recursos de segurança avançados e suporte a longo prazo (LTSC 2031).",
    releaseDate: "2021-08-18",
    architecture: ["x64"],
    officialUrl:
      "https://www.microsoft.com/pt-br/evalcenter/evaluate-windows-server-2022",
    tags: ["server", "enterprise", "lts"],
    isLts: true,
  },

  // ── macOS ─────────────────────────────────────────────────────────────────
  {
    id: "macos-sequoia",
    name: "macOS Sequoia",
    version: "15",
    category: "macos",
    description:
      "A versão mais recente do macOS, com iPhone Mirroring, melhorias no Safari e no modo de Concentração.",
    releaseDate: "2024-09-16",
    architecture: ["arm64", "x64"],
    officialUrl: "https://www.apple.com/macos/macos-sequoia/",
    releaseNotesUrl:
      "https://support.apple.com/pt-br/111902",
    tags: ["desktop", "apple-silicon"],
    isLatest: true,
  },
  {
    id: "macos-sonoma",
    name: "macOS Sonoma",
    version: "14",
    category: "macos",
    description:
      "Versão com widgets na área de trabalho, melhorias no Safari e novos protetores de tela.",
    releaseDate: "2023-09-26",
    architecture: ["arm64", "x64"],
    officialUrl: "https://www.apple.com/macos/sonoma/",
    tags: ["desktop"],
  },
  {
    id: "macos-ventura",
    name: "macOS Ventura",
    version: "13",
    category: "macos",
    description:
      "Traz o Stage Manager, Continuity Camera, nova Central de Notificações e outros recursos.",
    releaseDate: "2022-10-24",
    architecture: ["arm64", "x64"],
    officialUrl: "https://support.apple.com/pt-br/105113",
    tags: ["desktop"],
  },

  // ── Linux ─────────────────────────────────────────────────────────────────
  {
    id: "ubuntu-2404-lts",
    name: "Ubuntu 24.04 LTS",
    version: "24.04",
    category: "linux",
    description:
      "Noble Numbat — LTS com suporte de 5 anos. Kernel 6.8, GNOME 46 e melhorias de desempenho.",
    releaseDate: "2024-04-25",
    architecture: ["x64", "arm64"],
    officialUrl: "https://ubuntu.com/download/desktop",
    releaseNotesUrl: "https://ubuntu.com/blog/canonical-releases-ubuntu-24-04-noble-numbat",
    tags: ["desktop", "server", "lts"],
    isLatest: true,
    isLts: true,
  },
  {
    id: "ubuntu-2204-lts",
    name: "Ubuntu 22.04 LTS",
    version: "22.04",
    category: "linux",
    description:
      "Jammy Jellyfish — LTS com suporte até abril de 2027. Kernel 5.15 e GNOME 42.",
    releaseDate: "2022-04-21",
    architecture: ["x64", "arm64"],
    officialUrl: "https://ubuntu.com/download/desktop",
    tags: ["desktop", "server", "lts"],
    isLts: true,
  },
  {
    id: "debian-12",
    name: "Debian 12 Bookworm",
    version: "12",
    category: "linux",
    description:
      "Distribuição estável, confiável e universal. Base para muitas outras distros, ideal para servidores.",
    releaseDate: "2023-06-10",
    architecture: ["x64", "x86", "arm64", "arm"],
    officialUrl: "https://www.debian.org/distrib/",
    tags: ["server", "desktop", "stable"],
    isLatest: true,
    isLts: true,
  },
  {
    id: "fedora-41",
    name: "Fedora 41",
    version: "41",
    category: "linux",
    description:
      "Distribuição de ponta da Red Hat, com os pacotes mais recentes e GNOME 47.",
    releaseDate: "2024-10-29",
    architecture: ["x64", "arm64"],
    officialUrl: "https://fedoraproject.org/workstation/download/",
    releaseNotesUrl: "https://docs.fedoraproject.org/pt_BR/fedora/f41/release-notes/",
    tags: ["desktop", "workstation"],
    isLatest: true,
  },
  {
    id: "arch-linux",
    name: "Arch Linux",
    version: "Rolling",
    category: "linux",
    description:
      "Distro rolling release minimalista. Altamente customizável e focada em simplicidade e controle.",
    architecture: ["x64"],
    officialUrl: "https://archlinux.org/download/",
    tags: ["advanced", "rolling-release"],
  },
  {
    id: "manjaro-linux",
    name: "Manjaro Linux",
    version: "24.x",
    category: "linux",
    description:
      "Baseada no Arch Linux, com instalação simplificada e repositórios curados para maior estabilidade.",
    architecture: ["x64", "arm64"],
    officialUrl: "https://manjaro.org/download/",
    tags: ["desktop", "user-friendly"],
    isLatest: true,
  },
  {
    id: "linux-mint-22",
    name: "Linux Mint 22",
    version: "22",
    category: "linux",
    description:
      "Wilma — baseada no Ubuntu 24.04 LTS, ideal para iniciantes com interface familiar e elegante.",
    releaseDate: "2024-07-01",
    architecture: ["x64"],
    officialUrl: "https://www.linuxmint.com/download.php",
    tags: ["desktop", "beginner-friendly", "lts"],
    isLatest: true,
    isLts: true,
  },
  {
    id: "pop-os-22",
    name: "Pop!_OS 22.04 LTS",
    version: "22.04",
    category: "linux",
    description:
      "Desenvolvido pela System76, focado em produtividade para desenvolvedores e criadores de conteúdo.",
    releaseDate: "2022-04-25",
    architecture: ["x64"],
    officialUrl: "https://pop.system76.com/",
    tags: ["desktop", "developer", "lts"],
    isLts: true,
  },
  {
    id: "opensuse-tumbleweed",
    name: "openSUSE Tumbleweed",
    version: "Rolling",
    category: "linux",
    description:
      "Distro rolling release empresarial com as últimas atualizações de software e YaST para administração.",
    architecture: ["x64", "arm64"],
    officialUrl: "https://get.opensuse.org/tumbleweed/",
    tags: ["rolling-release", "enterprise"],
  },
  {
    id: "opensuse-leap-156",
    name: "openSUSE Leap 15.6",
    version: "15.6",
    category: "linux",
    description:
      "Distribuição estável com ciclo de lançamento previsível, baseada no código do SUSE Linux Enterprise.",
    releaseDate: "2024-06-12",
    architecture: ["x64", "arm64"],
    officialUrl: "https://get.opensuse.org/leap/",
    tags: ["stable", "enterprise"],
    isLts: true,
  },
  {
    id: "kali-linux",
    name: "Kali Linux",
    version: "2024.x",
    category: "linux",
    description:
      "Distribuição especializada em segurança da informação e testes de penetração, mantida pela Offensive Security.",
    architecture: ["x64", "arm64", "arm"],
    officialUrl: "https://www.kali.org/get-kali/",
    tags: ["security", "pentesting"],
    isLatest: true,
  },
  {
    id: "rocky-linux-9",
    name: "Rocky Linux 9",
    version: "9",
    category: "linux",
    description:
      "Alternativa ao CentOS, compatível com RHEL. Ideal para servidores de produção e ambientes corporativos.",
    releaseDate: "2022-07-14",
    architecture: ["x64", "arm64"],
    officialUrl: "https://rockylinux.org/download",
    tags: ["server", "enterprise", "rhel-compatible"],
    isLts: true,
  },
  {
    id: "almalinux-9",
    name: "AlmaLinux 9",
    version: "9",
    category: "linux",
    description:
      "Fork comunitário do RHEL, oferece compatibilidade binária com o Red Hat Enterprise Linux.",
    releaseDate: "2022-05-26",
    architecture: ["x64", "arm64"],
    officialUrl: "https://almalinux.org/get-almalinux/",
    tags: ["server", "enterprise", "rhel-compatible"],
    isLts: true,
  },

  // ── Embedded / IoT ────────────────────────────────────────────────────────
  {
    id: "raspberry-pi-os-desktop",
    name: "Raspberry Pi OS (Desktop)",
    version: "Bookworm",
    category: "embedded",
    description:
      "Sistema oficial para Raspberry Pi com ambiente desktop LXDE. Recomendado para uso geral com monitor.",
    architecture: ["arm64", "arm"],
    officialUrl: "https://www.raspberrypi.com/software/operating-systems/",
    tags: ["raspberry-pi", "desktop", "arm"],
    isLatest: true,
  },
  {
    id: "raspberry-pi-os-lite",
    name: "Raspberry Pi OS Lite",
    version: "Bookworm",
    category: "embedded",
    description:
      "Versão sem interface gráfica do Raspberry Pi OS. Ideal para servidores, automação e projetos headless.",
    architecture: ["arm64", "arm"],
    officialUrl: "https://www.raspberrypi.com/software/operating-systems/",
    tags: ["raspberry-pi", "server", "headless", "arm"],
    isLatest: true,
  },
  {
    id: "raspberry-pi-imager",
    name: "Raspberry Pi Imager",
    version: "1.9.x",
    category: "embedded",
    description:
      "Ferramenta oficial para gravar imagens de sistemas operacionais em cartões SD e dispositivos USB para Raspberry Pi.",
    architecture: ["x64", "arm64"],
    officialUrl: "https://www.raspberrypi.com/software/",
    tags: ["tool", "raspberry-pi", "imager"],
    isLatest: true,
    isTool: true,
  },
  {
    id: "ubuntu-server-rpi",
    name: "Ubuntu Server para Raspberry Pi",
    version: "24.04 LTS",
    category: "embedded",
    description:
      "Versão do Ubuntu Server otimizada para dispositivos Raspberry Pi, com suporte a longo prazo.",
    architecture: ["arm64"],
    officialUrl: "https://ubuntu.com/download/raspberry-pi",
    tags: ["raspberry-pi", "server", "lts"],
    isLts: true,
  },
];
