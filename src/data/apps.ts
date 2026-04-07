export type AppCategory = "browsers" | "development" | "utilities" | "communication" | "multimedia";

export interface WingetApp {
  name: string;
  id: string;
  category: AppCategory;
  icon?: string;
}

export const categoryLabels: Record<AppCategory, string> = {
  browsers: "Navegadores",
  development: "Desenvolvimento",
  utilities: "Utilitários",
  communication: "Comunicação",
  multimedia: "Multimídia",
};

export const categoryIcons: Record<AppCategory, string> = {
  browsers: "Globe",
  development: "Code",
  utilities: "Wrench",
  communication: "MessageCircle",
  multimedia: "Play",
};

export const apps: WingetApp[] = [
  { name: "Google Chrome", id: "Google.Chrome", category: "browsers" },
  { name: "Microsoft Edge", id: "Microsoft.Edge", category: "browsers" },
  { name: "Mozilla Firefox", id: "Mozilla.Firefox", category: "browsers" },
  { name: "Brave Browser", id: "Brave.Brave", category: "browsers" },
  { name: "Opera", id: "Opera.Opera", category: "browsers" },
  { name: "Visual Studio Code", id: "Microsoft.VisualStudioCode", category: "development" },
  { name: "Git", id: "Git.Git", category: "development" },
  { name: "NVM for Windows", id: "CoreyButler.NVMforWindows", category: "development" },
  { name: "Node.js", id: "OpenJS.NodeJS", category: "development" },
  { name: "Go", id: "GoLang.Go", category: "development" },
  { name: "Rustup", id: "Rustlang.Rustup", category: "development" },
  { name: "pnpm", id: "pnpm.pnpm", category: "development" },
  { name: "Yarn", id: "Yarn.Yarn", category: "development" },
  { name: ".NET SDK 8", id: "Microsoft.DotNet.SDK.8", category: "development" },
  { name: "Oracle JDK 25", id: "Oracle.JDK.25", category: "development" },
  { name: "Docker Desktop", id: "Docker.DockerDesktop", category: "development" },
  { name: "WSL", id: "Microsoft.WSL", category: "development" },
  { name: "Kubernetes kubectl", id: "Kubernetes.kubectl", category: "development" },
  { name: "Minikube", id: "Kubernetes.minikube", category: "development" },
  { name: "Terraform", id: "Hashicorp.Terraform", category: "development" },
  { name: "Postman", id: "Postman.Postman", category: "development" },
  { name: "Insomnia", id: "Insomnia.Insomnia", category: "development" },
  { name: "DBeaver", id: "DBeaver.DBeaver.Community", category: "development" },
  { name: "PostgreSQL 13", id: "PostgreSQL.PostgreSQL.13", category: "development" },
  { name: "Python", id: "Python.Python.3.12", category: "development" },
  { name: "Windows Terminal", id: "Microsoft.WindowsTerminal", category: "development" },
  { name: "PowerShell", id: "Microsoft.PowerShell", category: "development" },
  { name: "GitHub CLI", id: "GitHub.cli", category: "development" },
  { name: "GitHub Desktop", id: "GitHub.GitHubDesktop", category: "development" },
  { name: "JetBrains Toolbox", id: "JetBrains.Toolbox", category: "development" },
  { name: "Figma", id: "Figma.Figma", category: "development" },
  { name: "AWS CLI", id: "Amazon.AWSCLI", category: "development" },
  { name: "Azure CLI", id: "Microsoft.AzureCLI", category: "development" },
  { name: "Web Deploy", id: "Microsoft.WebDeploy", category: "development" },
  { name: "Notepad++", id: "Notepad++.Notepad++", category: "utilities" },
  { name: "7-Zip", id: "7zip.7zip", category: "utilities" },
  { name: "WinRAR", id: "RARLab.WinRAR", category: "utilities" },
  { name: "PowerToys", id: "Microsoft.PowerToys", category: "utilities" },
  { name: "TreeSize Free", id: "JAMSoftware.TreeSize.Free", category: "utilities" },
  { name: "Everything Search", id: "voidtools.Everything", category: "utilities" },
  { name: "Bitwarden", id: "Bitwarden.Bitwarden", category: "utilities" },
  { name: "Microsoft OneDrive", id: "Microsoft.OneDrive", category: "utilities" },
  { name: "Google Drive", id: "Google.GoogleDrive", category: "utilities" },
  { name: "Dropbox", id: "Dropbox.Dropbox", category: "utilities" },
  { name: "Rufus", id: "Rufus.Rufus", category: "utilities" },
  { name: "balenaEtcher", id: "Balena.Etcher", category: "utilities" },
  { name: "Oracle VirtualBox", id: "Oracle.VirtualBox", category: "utilities" },
  { name: "Tailscale", id: "Tailscale.Tailscale", category: "utilities" },
  { name: "WireGuard", id: "WireGuard.WireGuard", category: "utilities" },
  { name: "OpenVPN Connect", id: "OpenVPNTechnologies.OpenVPNConnect", category: "utilities" },
  { name: "AnyDesk", id: "AnyDesk.AnyDesk", category: "utilities" },
  { name: "TeamViewer", id: "TeamViewer.TeamViewer", category: "utilities" },
  { name: "Notion", id: "Notion.Notion", category: "utilities" },
  { name: "Obsidian", id: "Obsidian.Obsidian", category: "utilities" },
  { name: "WiFiman Desktop", id: "Ubiquiti.WiFimanDesktop", category: "utilities" },
  { name: "Lightshot", id: "Skillbrains.Lightshot", category: "utilities" },
  { name: "Discord", id: "Discord.Discord", category: "communication" },
  { name: "Slack", id: "SlackTechnologies.Slack", category: "communication" },
  { name: "Zoom", id: "Zoom.Zoom", category: "communication" },
  { name: "Microsoft Teams", id: "Microsoft.Teams", category: "communication" },
  { name: "Telegram", id: "Telegram.TelegramDesktop", category: "communication" },
  { name: "Thunderbird", id: "Mozilla.Thunderbird.pt-BR", category: "communication" },
  { name: "VLC", id: "VideoLAN.VLC", category: "multimedia" },
  { name: "Spotify", id: "Spotify.Spotify", category: "multimedia" },
  { name: "OBS Studio", id: "OBSProject.OBSStudio", category: "multimedia" },
  { name: "Streamlabs Desktop", id: "Streamlabs.Streamlabs", category: "multimedia" },
  { name: "Elgato Stream Deck", id: "Elgato.StreamDeck", category: "multimedia" },
  { name: "Elgato Control Center", id: "Elgato.ControlCenter", category: "multimedia" },
  { name: "NDI Tools", id: "NDI.NDITools", category: "multimedia" },
  { name: "DistroAV", id: "DistroAV.DistroAV", category: "multimedia" },
  { name: "Audacity", id: "Audacity.Audacity", category: "multimedia" },
  { name: "HandBrake", id: "HandBrake.HandBrake", category: "multimedia" },
  { name: "GIMP", id: "GIMP.GIMP", category: "multimedia" },
  { name: "ShareX", id: "ShareX.ShareX", category: "multimedia" },
];

// Preset structure for future use
export interface Preset {
  id: string;
  name: string;
  description: string;
  appIds: string[];
}

export const defaultPresets: Preset[] = [
  {
    id: "dev-essentials",
    name: "Dev Essentials",
    description: "Ferramentas essenciais para desenvolvedores",
    appIds: ["Microsoft.VisualStudioCode", "Git.Git", "OpenJS.NodeJS", "Docker.DockerDesktop", "Microsoft.WindowsTerminal"],
  },
  {
    id: "basic-setup",
    name: "Setup Básico",
    description: "Aplicativos básicos para qualquer máquina",
    appIds: ["Google.Chrome", "7zip.7zip", "VideoLAN.VLC", "Notepad++.Notepad++", "Microsoft.PowerToys"],
  },
];
