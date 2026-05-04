import type { AppCategory } from "@/data/apps";

/**
 * Normalised app record returned by any external provider.
 * Maps onto the existing SetupApp shape used throughout the app.
 */
export interface NormalizedApp {
  id: string;
  name: string;
  category: AppCategory;
  description?: string;
  version?: string;
  /** Winget package id */
  winget?: string;
  /** Homebrew formula / cask token */
  brew?: string;
  /** APT package name */
  apt?: string;
  /** DNF package name */
  dnf?: string;
  /** Pacman package name */
  pacman?: string;
  /** Flatpak application id */
  flatpak?: string;
}

/** Infer a category from free-form text */
export function inferCategory(text: string): AppCategory {
  const t = text.toLowerCase();
  if (/(browser|firefox|chrome|edge|opera|brave|safari|web browser)/.test(t)) return "browsers";
  if (/(chat|email|message|discord|slack|teams|telegram|zoom|meeting|mail|whatsapp)/.test(t)) return "communication";
  if (/(game|gaming|steam|epic\s+games|epicgames|gog|battle\.?net|launcher|xbox|playstation|gamepad|controller|esport|mmo|rpg|fps)/.test(t)) return "games";
  if (/(stream|obs|video|audio|media|codec|capture|record|vlc|player|music|podcast)/.test(t)) return "multimedia";
  if (/(dev|sdk|cli|code|editor|git|docker|kubernetes|database|sql|python|node|java|rust|go |golang|ruby|php|swift|kotlin|compiler|debugger|ide|terminal|shell)/.test(t)) return "development";
  return "utilities";
}
