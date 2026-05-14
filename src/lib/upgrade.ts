import type { LinuxDistro, OSPlatform } from "@/data/apps";

export type UpgradePackageManager = "winget" | "brew" | "apt" | "dnf" | "pacman";

export interface UpgradeOptions {
  updateAll: boolean;
  packageId: string;
  dryRun: boolean;
  autoConfirm: boolean;
  useSudo: boolean;
  wingetIncludeUnknown: boolean;
  wingetAcceptAgreements: boolean;
  wingetDisableInteractivity: boolean;
  includeCleanup: boolean;
}

export function getUpgradePackageManager(platform: OSPlatform, linuxDistro: LinuxDistro): UpgradePackageManager {
  if (platform === "windows") return "winget";
  if (platform === "macos") return "brew";
  if (linuxDistro === "dnf") return "dnf";
  if (linuxDistro === "pacman") return "pacman";
  return "apt";
}

function sanitizePackageId(value: string): string {
  return value.trim().replace(/[^A-Za-z0-9._:+@-]/g, "");
}

export function buildUpgradeCommand(manager: UpgradePackageManager, options: UpgradeOptions): string {
  const target = sanitizePackageId(options.packageId);
  if (!options.updateAll && !target) return "";

  if (manager === "winget") {
    const parts = ["winget upgrade"];
    // winget upgrade does not provide a stable dry-run flag in current releases.
    // When dryRun is enabled, keep the command in "list updates" mode.
    if (!options.dryRun) {
      if (options.updateAll) parts.push("--all");
      else parts.push(`--id ${target}`, "-e");
    }
    if (options.wingetIncludeUnknown) parts.push("--include-unknown");
    if (options.wingetAcceptAgreements) parts.push("--accept-package-agreements --accept-source-agreements");
    if (options.wingetDisableInteractivity) parts.push("--disable-interactivity");
    return parts.join(" ");
  }

  if (manager === "brew") {
    const cmd = options.updateAll ? "brew upgrade" : `brew upgrade ${target}`;
    return options.dryRun ? `${cmd} --dry-run` : cmd;
  }

  const sudoPrefix = options.useSudo ? "sudo " : "";
  const yesFlag = options.autoConfirm ? " -y" : "";
  if (manager === "apt") {
    if (options.updateAll) {
      const dryFlag = options.dryRun ? " --simulate" : "";
      return `${sudoPrefix}apt update && ${sudoPrefix}apt upgrade${yesFlag}${dryFlag}`.trim();
    }
    const simulateFlag = options.dryRun ? " --simulate" : "";
    return `${sudoPrefix}apt install --only-upgrade${yesFlag}${simulateFlag} ${target}`.trim();
  }
  if (manager === "dnf") {
    if (options.updateAll) {
      const dryFlag = options.dryRun ? " --assumeno" : "";
      return `${sudoPrefix}dnf upgrade --refresh${yesFlag}${dryFlag}`.trim();
    }
    const dryFlag = options.dryRun ? " --assumeno" : "";
    return `${sudoPrefix}dnf upgrade${yesFlag}${dryFlag} ${target}`.trim();
  }

  if (options.updateAll) {
    const dryFlag = options.dryRun ? " --print" : "";
    const noConfirm = options.autoConfirm ? " --noconfirm" : "";
    return `${sudoPrefix}pacman -Syu${noConfirm}${dryFlag}`.trim();
  }
  const dryFlag = options.dryRun ? " --print" : "";
  const noConfirm = options.autoConfirm ? " --noconfirm" : "";
  return `${sudoPrefix}pacman -S${noConfirm}${dryFlag} ${target}`.trim();
}

export function buildUpgradeScript(
  manager: UpgradePackageManager,
  command: string,
  includeCleanup: boolean,
  useSudo: boolean
): string {
  if (!command) return "";

  if (manager === "winget") {
    return `# QuickSetup - Upgrade Windows (winget)\nWrite-Host "=== Iniciando atualizacao ===" -ForegroundColor Cyan\n${command}\nWrite-Host "=== Atualizacao concluida ===" -ForegroundColor Green`;
  }

  const sudoPrefix = useSudo ? "sudo " : "";
  const cleanup = includeCleanup
    ? manager === "brew"
      ? "\nbrew cleanup"
      : manager === "apt"
        ? `\n${sudoPrefix}apt autoremove -y\n${sudoPrefix}apt autoclean`
        : manager === "dnf"
          ? `\n${sudoPrefix}dnf autoremove -y`
          : `\n${sudoPrefix}pacman -Sc --noconfirm`
    : "";

  return `#!/usr/bin/env bash\nset -e\n\necho "=== QuickSetup - Iniciando atualização ==="\n${command}${cleanup}\necho "=== Atualização concluída ==="`;
}

export function getUpgradeScriptFilename(manager: UpgradePackageManager): string {
  return manager === "winget" ? "quicksetup-upgrade.ps1" : "quicksetup-upgrade.sh";
}
