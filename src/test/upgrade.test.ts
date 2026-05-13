import { describe, expect, it } from "vitest";
import {
  buildUpgradeCommand,
  buildUpgradeScript,
  getUpgradePackageManager,
  type UpgradeOptions,
} from "@/lib/upgrade";

const baseOptions: UpgradeOptions = {
  updateAll: true,
  packageId: "",
  dryRun: false,
  autoConfirm: true,
  useSudo: true,
  wingetIncludeUnknown: true,
  wingetAcceptAgreements: true,
  wingetDisableInteractivity: false,
  includeCleanup: false,
};

describe("getUpgradePackageManager", () => {
  it("maps platform and distro to manager", () => {
    expect(getUpgradePackageManager("windows", "apt")).toBe("winget");
    expect(getUpgradePackageManager("macos", "apt")).toBe("brew");
    expect(getUpgradePackageManager("linux", "apt")).toBe("apt");
    expect(getUpgradePackageManager("linux", "dnf")).toBe("dnf");
    expect(getUpgradePackageManager("linux", "pacman")).toBe("pacman");
  });
});

describe("buildUpgradeCommand", () => {
  it("builds winget update all with advanced flags", () => {
    const command = buildUpgradeCommand("winget", baseOptions);
    expect(command).toContain("winget upgrade --all");
    expect(command).toContain("--include-unknown");
    expect(command).toContain("--accept-package-agreements --accept-source-agreements");
  });

  it("builds brew command for specific package with dry-run", () => {
    const command = buildUpgradeCommand("brew", {
      ...baseOptions,
      updateAll: false,
      packageId: "git",
      dryRun: true,
    });
    expect(command).toBe("brew upgrade git --dry-run");
  });

  it("builds apt all-upgrade with sudo and auto-confirm", () => {
    const command = buildUpgradeCommand("apt", baseOptions);
    expect(command).toBe("sudo apt update && sudo apt upgrade -y");
  });

  it("returns empty command when specific package is required but invalid", () => {
    const command = buildUpgradeCommand("dnf", {
      ...baseOptions,
      updateAll: false,
      packageId: "   ",
    });
    expect(command).toBe("");
  });

  it("sanitizes specific package ids", () => {
    const command = buildUpgradeCommand("winget", {
      ...baseOptions,
      updateAll: false,
      packageId: "Google.Chrome;rm -rf /",
    });
    expect(command).toContain("--id Google.Chromerm-rf");
    expect(command).not.toContain(";");
  });
});

describe("buildUpgradeScript", () => {
  it("builds a powershell script for winget", () => {
    const script = buildUpgradeScript("winget", "winget upgrade --all", false, false);
    expect(script).toContain("Write-Host");
    expect(script).toContain("winget upgrade --all");
  });

  it("adds cleanup commands for apt scripts", () => {
    const script = buildUpgradeScript("apt", "sudo apt update && sudo apt upgrade -y", true, true);
    expect(script).toContain("#!/usr/bin/env bash");
    expect(script).toContain("sudo apt autoremove -y");
    expect(script).toContain("sudo apt autoclean");
  });
});
