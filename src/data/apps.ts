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
  { name: "Node.js", id: "OpenJS.NodeJS", category: "development" },
  { name: "Docker Desktop", id: "Docker.DockerDesktop", category: "development" },
  { name: "Postman", id: "Postman.Postman", category: "development" },
  { name: "Python", id: "Python.Python.3.12", category: "development" },
  { name: "Windows Terminal", id: "Microsoft.WindowsTerminal", category: "development" },
  { name: "PowerShell", id: "Microsoft.PowerShell", category: "development" },
  { name: "Notepad++", id: "Notepad++.Notepad++", category: "utilities" },
  { name: "7-Zip", id: "7zip.7zip", category: "utilities" },
  { name: "WinRAR", id: "RARLab.WinRAR", category: "utilities" },
  { name: "PowerToys", id: "Microsoft.PowerToys", category: "utilities" },
  { name: "TreeSize Free", id: "JAMSoftware.TreeSize.Free", category: "utilities" },
  { name: "Everything Search", id: "voidtools.Everything", category: "utilities" },
  { name: "Discord", id: "Discord.Discord", category: "communication" },
  { name: "Slack", id: "SlackTechnologies.Slack", category: "communication" },
  { name: "Zoom", id: "Zoom.Zoom", category: "communication" },
  { name: "Microsoft Teams", id: "Microsoft.Teams", category: "communication" },
  { name: "Telegram", id: "Telegram.TelegramDesktop", category: "communication" },
  { name: "VLC", id: "VideoLAN.VLC", category: "multimedia" },
  { name: "Spotify", id: "Spotify.Spotify", category: "multimedia" },
  { name: "OBS Studio", id: "OBSProject.OBSStudio", category: "multimedia" },
  { name: "Audacity", id: "Audacity.Audacity", category: "multimedia" },
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
