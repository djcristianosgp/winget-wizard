export type AppCategory = "browsers" | "development" | "utilities" | "communication" | "multimedia" | "games";

export type OSPlatform = "windows" | "macos" | "linux";
export type LinuxDistro = "apt" | "dnf" | "pacman" | "flatpak" | "nix";
export type PackageManager = "winget" | "brew" | LinuxDistro;

export interface SetupApp {
  id: string;
  name: string;
  category: AppCategory;
  description?: string;
  version?: string;
  icon?: string;
  winget?: string;
  brew?: string;
  apt?: string;
  dnf?: string;
  pacman?: string;
  /** Flatpak application id */
  flatpak?: string;
  /** Nix package name (nixpkgs attribute) */
  nix?: string;
}

export const categoryLabels: Record<AppCategory, string> = {
  browsers: "Navegadores",
  development: "Desenvolvimento",
  utilities: "Utilitários",
  communication: "Comunicação",
  multimedia: "Multimídia",
  games: "Jogos",
};

export const categoryIcons: Record<AppCategory, string> = {
  browsers: "Globe",
  development: "Code",
  utilities: "Wrench",
  communication: "MessageCircle",
  multimedia: "Play",
  games: "Gamepad2",
};

export const apps: SetupApp[] = [
  { id: "Google.Chrome", name: "Google Chrome", category: "browsers", winget: "Google.Chrome", brew: "--cask google-chrome", apt: "google-chrome-stable", dnf: "google-chrome", pacman: "google-chrome", nix: "google-chrome" },
  { id: "Microsoft.Edge", name: "Microsoft Edge", category: "browsers", winget: "Microsoft.Edge" },
  { id: "Mozilla.Firefox", name: "Mozilla Firefox", category: "browsers", winget: "Mozilla.Firefox", brew: "--cask firefox", apt: "firefox", dnf: "firefox", pacman: "firefox", nix: "firefox" },
  { id: "Brave.Brave", name: "Brave Browser", category: "browsers", winget: "Brave.Brave", brew: "--cask brave-browser", apt: "brave-browser", dnf: "brave-browser", pacman: "brave-bin", nix: "brave" },
  { id: "Opera.Opera", name: "Opera", category: "browsers", winget: "Opera.Opera", brew: "--cask opera" },
  { id: "Microsoft.VisualStudioCode", name: "Visual Studio Code", category: "development", winget: "Microsoft.VisualStudioCode", brew: "--cask visual-studio-code", apt: "code", dnf: "code", pacman: "code", nix: "vscode" },
  { id: "Git.Git", name: "Git", category: "development", winget: "Git.Git", brew: "git", apt: "git", dnf: "git", pacman: "git", nix: "git" },
  { id: "CoreyButler.NVMforWindows", name: "NVM for Windows", category: "development", winget: "CoreyButler.NVMforWindows" },
  { id: "OpenJS.NodeJS", name: "Node.js", category: "development", winget: "OpenJS.NodeJS", brew: "node", apt: "nodejs", dnf: "nodejs", pacman: "nodejs", nix: "nodejs" },
  { id: "GoLang.Go", name: "Go", category: "development", winget: "GoLang.Go", brew: "go", apt: "golang", dnf: "golang", pacman: "go", nix: "go" },
  { id: "Rustlang.Rustup", name: "Rustup", category: "development", winget: "Rustlang.Rustup", brew: "rustup", apt: "rustup", dnf: "rustup", pacman: "rustup", nix: "rustup" },
  { id: "pnpm.pnpm", name: "pnpm", category: "development", winget: "pnpm.pnpm", brew: "pnpm", nix: "nodePackages.pnpm" },
  { id: "Yarn.Yarn", name: "Yarn", category: "development", winget: "Yarn.Yarn", brew: "yarn", apt: "yarnpkg", dnf: "yarnpkg", pacman: "yarn", nix: "yarn" },
  { id: "Microsoft.DotNet.SDK.8", name: ".NET SDK 8", category: "development", winget: "Microsoft.DotNet.SDK.8", brew: "dotnet", apt: "dotnet-sdk-8.0", dnf: "dotnet-sdk-8.0", pacman: "dotnet-sdk", nix: "dotnet-sdk_8" },
  { id: "Oracle.JDK.25", name: "Oracle JDK 25", category: "development", winget: "Oracle.JDK.25", brew: "openjdk", apt: "openjdk-21-jdk", dnf: "java-21-openjdk", pacman: "jdk-openjdk", nix: "openjdk" },
  { id: "Docker.DockerDesktop", name: "Docker Desktop", category: "development", winget: "Docker.DockerDesktop", brew: "--cask docker", apt: "docker.io", dnf: "docker", pacman: "docker", nix: "docker" },
  { id: "Microsoft.WSL", name: "WSL", category: "development", winget: "Microsoft.WSL" },
  { id: "Kubernetes.kubectl", name: "Kubernetes kubectl", category: "development", winget: "Kubernetes.kubectl", brew: "kubectl", apt: "kubectl", dnf: "kubectl", pacman: "kubectl", nix: "kubectl" },
  { id: "Kubernetes.minikube", name: "Minikube", category: "development", winget: "Kubernetes.minikube", brew: "minikube", apt: "minikube", dnf: "minikube", pacman: "minikube", nix: "minikube" },
  { id: "Hashicorp.Terraform", name: "Terraform", category: "development", winget: "Hashicorp.Terraform", brew: "terraform", apt: "terraform", dnf: "terraform", pacman: "terraform", nix: "terraform" },
  { id: "Postman.Postman", name: "Postman", category: "development", winget: "Postman.Postman", brew: "--cask postman", apt: "postman", dnf: "postman", pacman: "postman-bin", nix: "postman" },
  { id: "Insomnia.Insomnia", name: "Insomnia", category: "development", winget: "Insomnia.Insomnia", brew: "--cask insomnia", nix: "insomnia" },
  { id: "DBeaver.DBeaver.Community", name: "DBeaver", category: "development", winget: "DBeaver.DBeaver.Community", brew: "--cask dbeaver-community", apt: "dbeaver-ce", dnf: "dbeaver-ce", pacman: "dbeaver", nix: "dbeaver" },
  { id: "PostgreSQL.PostgreSQL.13", name: "PostgreSQL 13", category: "development", winget: "PostgreSQL.PostgreSQL.13", brew: "postgresql@13", apt: "postgresql", dnf: "postgresql-server", pacman: "postgresql", nix: "postgresql" },
  { id: "Python.Python.3.12", name: "Python", category: "development", winget: "Python.Python.3.12", brew: "python", apt: "python3", dnf: "python3", pacman: "python", nix: "python3" },
  { id: "Microsoft.WindowsTerminal", name: "Windows Terminal", category: "development", winget: "Microsoft.WindowsTerminal" },
  { id: "Microsoft.PowerShell", name: "PowerShell", category: "development", winget: "Microsoft.PowerShell", brew: "powershell", apt: "powershell", dnf: "powershell", pacman: "powershell", nix: "powershell" },
  { id: "GitHub.cli", name: "GitHub CLI", category: "development", winget: "GitHub.cli", brew: "gh", apt: "gh", dnf: "gh", pacman: "github-cli", nix: "gh" },
  { id: "GitHub.GitHubDesktop", name: "GitHub Desktop", category: "development", winget: "GitHub.GitHubDesktop", brew: "--cask github" },
  { id: "JetBrains.Toolbox", name: "JetBrains Toolbox", category: "development", winget: "JetBrains.Toolbox", brew: "--cask jetbrains-toolbox", nix: "jetbrains-toolbox" },
  { id: "Figma.Figma", name: "Figma", category: "development", winget: "Figma.Figma", brew: "--cask figma" },
  { id: "Amazon.AWSCLI", name: "AWS CLI", category: "development", winget: "Amazon.AWSCLI", brew: "awscli", apt: "awscli", dnf: "awscli", pacman: "aws-cli", nix: "awscli2" },
  { id: "Microsoft.AzureCLI", name: "Azure CLI", category: "development", winget: "Microsoft.AzureCLI", brew: "azure-cli", apt: "azure-cli", dnf: "azure-cli", pacman: "azure-cli", nix: "azure-cli" },
  { id: "Microsoft.WebDeploy", name: "Web Deploy", category: "development", winget: "Microsoft.WebDeploy" },
  { id: "Notepad++.Notepad++", name: "Notepad++", category: "utilities", winget: "Notepad++.Notepad++" },
  { id: "7zip.7zip", name: "7-Zip", category: "utilities", winget: "7zip.7zip", apt: "p7zip-full", dnf: "p7zip", pacman: "p7zip", nix: "p7zip" },
  { id: "RARLab.WinRAR", name: "WinRAR", category: "utilities", winget: "RARLab.WinRAR" },
  { id: "Microsoft.PowerToys", name: "PowerToys", category: "utilities", winget: "Microsoft.PowerToys" },
  { id: "JAMSoftware.TreeSize.Free", name: "TreeSize Free", category: "utilities", winget: "JAMSoftware.TreeSize.Free" },
  { id: "voidtools.Everything", name: "Everything Search", category: "utilities", winget: "voidtools.Everything" },
  { id: "Bitwarden.Bitwarden", name: "Bitwarden", category: "utilities", winget: "Bitwarden.Bitwarden", brew: "--cask bitwarden", apt: "bitwarden", dnf: "bitwarden", pacman: "bitwarden", nix: "bitwarden" },
  { id: "Microsoft.OneDrive", name: "Microsoft OneDrive", category: "utilities", winget: "Microsoft.OneDrive" },
  { id: "Google.GoogleDrive", name: "Google Drive", category: "utilities", winget: "Google.GoogleDrive", brew: "--cask google-drive" },
  { id: "Dropbox.Dropbox", name: "Dropbox", category: "utilities", winget: "Dropbox.Dropbox", brew: "--cask dropbox", apt: "dropbox", dnf: "dropbox", pacman: "dropbox", nix: "dropbox" },
  { id: "Rufus.Rufus", name: "Rufus", category: "utilities", winget: "Rufus.Rufus" },
  { id: "Balena.Etcher", name: "balenaEtcher", category: "utilities", winget: "Balena.Etcher", brew: "--cask balenaetcher", apt: "balena-etcher-electron", dnf: "balena-etcher-electron", pacman: "etcher-bin" },
  { id: "Oracle.VirtualBox", name: "Oracle VirtualBox", category: "utilities", winget: "Oracle.VirtualBox", brew: "--cask virtualbox", apt: "virtualbox", dnf: "VirtualBox", pacman: "virtualbox", nix: "virtualbox" },
  { id: "Tailscale.Tailscale", name: "Tailscale", category: "utilities", winget: "Tailscale.Tailscale", brew: "tailscale", apt: "tailscale", dnf: "tailscale", pacman: "tailscale", nix: "tailscale" },
  { id: "WireGuard.WireGuard", name: "WireGuard", category: "utilities", winget: "WireGuard.WireGuard", brew: "wireguard-tools", apt: "wireguard", dnf: "wireguard-tools", pacman: "wireguard-tools", nix: "wireguard-tools" },
  { id: "OpenVPNTechnologies.OpenVPNConnect", name: "OpenVPN Connect", category: "utilities", winget: "OpenVPNTechnologies.OpenVPNConnect", brew: "--cask openvpn-connect" },
  { id: "AnyDesk.AnyDesk", name: "AnyDesk", category: "utilities", winget: "AnyDesk.AnyDesk", brew: "--cask anydesk" },
  { id: "TeamViewer.TeamViewer", name: "TeamViewer", category: "utilities", winget: "TeamViewer.TeamViewer", brew: "--cask teamviewer" },
  { id: "Notion.Notion", name: "Notion", category: "utilities", winget: "Notion.Notion", brew: "--cask notion" },
  { id: "Obsidian.Obsidian", name: "Obsidian", category: "utilities", winget: "Obsidian.Obsidian", brew: "--cask obsidian", apt: "obsidian", dnf: "obsidian", pacman: "obsidian", nix: "obsidian" },
  { id: "Ubiquiti.WiFimanDesktop", name: "WiFiman Desktop", category: "utilities", winget: "Ubiquiti.WiFimanDesktop" },
  { id: "Skillbrains.Lightshot", name: "Lightshot", category: "utilities", winget: "Skillbrains.Lightshot" },
  { id: "Discord.Discord", name: "Discord", category: "communication", winget: "Discord.Discord", brew: "--cask discord", apt: "discord", dnf: "discord", pacman: "discord", nix: "discord" },
  { id: "SlackTechnologies.Slack", name: "Slack", category: "communication", winget: "SlackTechnologies.Slack", brew: "--cask slack", apt: "slack", dnf: "slack", pacman: "slack-desktop", nix: "slack" },
  { id: "Zoom.Zoom", name: "Zoom", category: "communication", winget: "Zoom.Zoom", brew: "--cask zoom", apt: "zoom", dnf: "zoom", pacman: "zoom", nix: "zoom-us" },
  { id: "Microsoft.Teams", name: "Microsoft Teams", category: "communication", winget: "Microsoft.Teams", brew: "--cask microsoft-teams" },
  { id: "Telegram.TelegramDesktop", name: "Telegram", category: "communication", winget: "Telegram.TelegramDesktop", brew: "--cask telegram", apt: "telegram-desktop", dnf: "telegram-desktop", pacman: "telegram-desktop", nix: "telegram-desktop" },
  { id: "Mozilla.Thunderbird.pt-BR", name: "Thunderbird", category: "communication", winget: "Mozilla.Thunderbird.pt-BR", brew: "--cask thunderbird", apt: "thunderbird", dnf: "thunderbird", pacman: "thunderbird", nix: "thunderbird" },
  { id: "VideoLAN.VLC", name: "VLC", category: "multimedia", winget: "VideoLAN.VLC", brew: "--cask vlc", apt: "vlc", dnf: "vlc", pacman: "vlc", nix: "vlc" },
  { id: "Spotify.Spotify", name: "Spotify", category: "multimedia", winget: "Spotify.Spotify", brew: "--cask spotify", apt: "spotify-client", dnf: "spotify-client", pacman: "spotify", nix: "spotify" },
  { id: "OBSProject.OBSStudio", name: "OBS Studio", category: "multimedia", winget: "OBSProject.OBSStudio", brew: "obs", apt: "obs-studio", dnf: "obs-studio", pacman: "obs-studio", nix: "obs-studio" },
  { id: "Streamlabs.Streamlabs", name: "Streamlabs Desktop", category: "multimedia", winget: "Streamlabs.Streamlabs" },
  { id: "Elgato.StreamDeck", name: "Elgato Stream Deck", category: "multimedia", winget: "Elgato.StreamDeck" },
  { id: "Elgato.ControlCenter", name: "Elgato Control Center", category: "multimedia", winget: "Elgato.ControlCenter" },
  { id: "NDI.NDITools", name: "NDI Tools", category: "multimedia", winget: "NDI.NDITools" },
  { id: "DistroAV.DistroAV", name: "DistroAV", category: "multimedia", winget: "DistroAV.DistroAV" },
  { id: "Audacity.Audacity", name: "Audacity", category: "multimedia", winget: "Audacity.Audacity", brew: "audacity", apt: "audacity", dnf: "audacity", pacman: "audacity", nix: "audacity" },
  { id: "HandBrake.HandBrake", name: "HandBrake", category: "multimedia", winget: "HandBrake.HandBrake", brew: "--cask handbrake", apt: "handbrake", dnf: "HandBrake", pacman: "handbrake", nix: "handbrake" },
  { id: "GIMP.GIMP", name: "GIMP", category: "multimedia", winget: "GIMP.GIMP", brew: "gimp", apt: "gimp", dnf: "gimp", pacman: "gimp", nix: "gimp" },
  { id: "ShareX.ShareX", name: "ShareX", category: "multimedia", winget: "ShareX.ShareX" },
  { id: "Valve.Steam", name: "Steam", category: "games", winget: "Valve.Steam", brew: "--cask steam", apt: "steam-installer", dnf: "steam", pacman: "steam" },
  { id: "EpicGames.EpicGamesLauncher", name: "Epic Games Launcher", category: "games", winget: "EpicGames.EpicGamesLauncher" },
  { id: "GOG.Galaxy", name: "GOG Galaxy", category: "games", winget: "GOG.Galaxy" },
  { id: "Blizzard.BattleNet", name: "Battle.net", category: "games", winget: "Blizzard.BattleNet" },
  { id: "ElectronicArts.EADesktop", name: "EA App", category: "games", winget: "ElectronicArts.EADesktop" },
  { id: "Ubisoft.Connect", name: "Ubisoft Connect", category: "games", winget: "Ubisoft.Connect" },
  { id: "Microsoft.GamingApp", name: "Xbox App", category: "games", winget: "Microsoft.GamingApp" },
  { id: "Playnite.Playnite", name: "Playnite", category: "games", winget: "Playnite.Playnite", description: "Gerenciador de biblioteca de jogos" },
  { id: "Parsec.Parsec", name: "Parsec", category: "games", winget: "Parsec.Parsec", description: "Streaming de jogos e desktop remoto" },
  { id: "Nvidia.GeForceExperience", name: "GeForce Experience", category: "games", winget: "Nvidia.GeForceExperience", description: "Drivers e otimizações NVIDIA" },
  { id: "RazerInc.RazerCentralSoftware", name: "Razer Synapse", category: "games", winget: "RazerInc.RazerCentralSoftware", description: "Software para periféricos Razer" },
];

// Preset structure for future use
export interface Preset {
  id: string;
  name: string;
  description: string;
  appIds: string[];
  icon?: string;
}

export const defaultPresets: Preset[] = [
  {
    id: "dev-frontend",
    name: "Dev Frontend",
    description: "Ferramentas para desenvolvimento web frontend",
    icon: "Code",
    appIds: ["Microsoft.VisualStudioCode", "Google.Chrome", "Git.Git", "OpenJS.NodeJS", "pnpm.pnpm", "Figma.Figma"],
  },
  {
    id: "dev-backend",
    name: "Dev Backend",
    description: "Ferramentas para desenvolvimento backend e APIs",
    icon: "Server",
    appIds: ["Microsoft.VisualStudioCode", "Git.Git", "Docker.DockerDesktop", "PostgreSQL.PostgreSQL.13", "OpenJS.NodeJS", "Postman.Postman"],
  },
  {
    id: "dev-essentials",
    name: "Dev Essentials",
    description: "Ferramentas essenciais para desenvolvedores",
    icon: "Zap",
    appIds: ["Microsoft.VisualStudioCode", "Git.Git", "OpenJS.NodeJS", "Docker.DockerDesktop", "Microsoft.WindowsTerminal"],
  },
  {
    id: "gamer",
    name: "Gamer",
    description: "Ferramentas para gamers e streamers",
    icon: "Gamepad2",
    appIds: ["Valve.Steam", "EpicGames.EpicGamesLauncher", "GOG.Galaxy", "Discord.Discord", "OBSProject.OBSStudio", "Parsec.Parsec"],
  },
  {
    id: "escritorio",
    name: "Escritório",
    description: "Ferramentas de produtividade para o dia a dia",
    icon: "Briefcase",
    appIds: ["Google.Chrome", "Zoom.Zoom", "SlackTechnologies.Slack", "Notion.Notion", "Bitwarden.Bitwarden"],
  },
  {
    id: "basic-setup",
    name: "Setup Básico",
    description: "Aplicativos básicos para qualquer máquina",
    icon: "Package",
    appIds: ["Google.Chrome", "7zip.7zip", "VideoLAN.VLC", "Notepad++.Notepad++", "Microsoft.PowerToys"],
  },
];
