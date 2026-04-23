import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { parseURLState, buildShareURL } from "@/hooks/useQuickSetup";
import { useSetupHistory } from "@/hooks/useSetupHistory";
import { renderHook, act } from "@testing-library/react";

// ── URL helpers ───────────────────────────────────────────────────────────────

describe("parseURLState", () => {
  const originalSearch = window.location.search;

  afterEach(() => {
    Object.defineProperty(window, "location", {
      writable: true,
      value: { ...window.location, search: originalSearch },
    });
  });

  it("returns null when no relevant params are present", () => {
    Object.defineProperty(window, "location", {
      writable: true,
      value: { ...window.location, search: "" },
    });
    expect(parseURLState()).toBeNull();
  });

  it("parses apps and os from URL", () => {
    Object.defineProperty(window, "location", {
      writable: true,
      value: { ...window.location, search: "?apps=Google.Chrome,Git.Git&os=windows" },
    });
    const state = parseURLState();
    expect(state).not.toBeNull();
    expect(state!.selectedIds).toEqual(["Google.Chrome", "Git.Git"]);
    expect(state!.platform).toBe("windows");
  });

  it("parses linux distro from URL", () => {
    Object.defineProperty(window, "location", {
      writable: true,
      value: { ...window.location, search: "?os=linux&distro=dnf" },
    });
    const state = parseURLState();
    expect(state!.platform).toBe("linux");
    expect(state!.linuxDistro).toBe("dnf");
  });

  it("defaults distro to apt when invalid", () => {
    Object.defineProperty(window, "location", {
      writable: true,
      value: { ...window.location, search: "?os=linux&distro=unknown" },
    });
    const state = parseURLState();
    expect(state!.linuxDistro).toBe("apt");
  });

  it("parses silent flag", () => {
    Object.defineProperty(window, "location", {
      writable: true,
      value: { ...window.location, search: "?os=windows&silent=1" },
    });
    const state = parseURLState();
    expect(state!.options.silent).toBe(true);
  });

  it("parses accept=0 as acceptAgreements=false", () => {
    Object.defineProperty(window, "location", {
      writable: true,
      value: { ...window.location, search: "?os=windows&accept=0" },
    });
    const state = parseURLState();
    expect(state!.options.acceptAgreements).toBe(false);
  });
});

describe("buildShareURL", () => {
  it("includes apps param when apps selected", () => {
    const url = buildShareURL(
      new Set(["Google.Chrome", "Git.Git"]),
      "windows",
      "apt",
      { silent: false, acceptAgreements: true, disableInteractivity: false, scope: "none", version: "", linuxAutoYes: true, linuxUseSudo: true }
    );
    expect(url).toContain("apps=Google.Chrome%2CGit.Git");
    expect(url).toContain("os=windows");
  });

  it("omits apps param when no apps selected", () => {
    const url = buildShareURL(
      new Set(),
      "macos",
      "apt",
      { silent: false, acceptAgreements: true, disableInteractivity: false, scope: "none", version: "", linuxAutoYes: true, linuxUseSudo: true }
    );
    expect(url).not.toContain("apps=");
    expect(url).toContain("os=macos");
  });

  it("includes distro only for linux", () => {
    const linuxUrl = buildShareURL(
      new Set(),
      "linux",
      "pacman",
      { silent: false, acceptAgreements: true, disableInteractivity: false, scope: "none", version: "", linuxAutoYes: true, linuxUseSudo: true }
    );
    expect(linuxUrl).toContain("distro=pacman");

    const winUrl = buildShareURL(
      new Set(),
      "windows",
      "pacman",
      { silent: false, acceptAgreements: true, disableInteractivity: false, scope: "none", version: "", linuxAutoYes: true, linuxUseSudo: true }
    );
    expect(winUrl).not.toContain("distro=");
  });

  it("includes silent=1 when silent is true", () => {
    const url = buildShareURL(
      new Set(),
      "windows",
      "apt",
      { silent: true, acceptAgreements: true, disableInteractivity: false, scope: "none", version: "", linuxAutoYes: true, linuxUseSudo: true }
    );
    expect(url).toContain("silent=1");
  });

  it("round-trips through parseURLState", () => {
    const originalIDs = new Set(["Microsoft.VisualStudioCode", "Git.Git"]);
    const shareUrl = buildShareURL(
      originalIDs,
      "linux",
      "dnf",
      { silent: true, acceptAgreements: false, disableInteractivity: true, scope: "none", version: "", linuxAutoYes: true, linuxUseSudo: true }
    );
    const search = "?" + shareUrl.split("?")[1];
    Object.defineProperty(window, "location", {
      writable: true,
      value: { ...window.location, search },
    });
    const parsed = parseURLState();
    expect(parsed).not.toBeNull();
    expect(new Set(parsed!.selectedIds)).toEqual(originalIDs);
    expect(parsed!.platform).toBe("linux");
    expect(parsed!.linuxDistro).toBe("dnf");
    expect(parsed!.options.silent).toBe(true);
    expect(parsed!.options.acceptAgreements).toBe(false);
    expect(parsed!.options.disableInteractivity).toBe(true);
  });
});

// ── Setup History ─────────────────────────────────────────────────────────────

describe("useSetupHistory", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("starts with empty history", () => {
    const { result } = renderHook(() => useSetupHistory());
    expect(result.current.history).toHaveLength(0);
  });

  it("saves a setup entry", () => {
    const { result } = renderHook(() => useSetupHistory());
    act(() => {
      result.current.saveSetup("My Setup", ["Google.Chrome", "Git.Git"], "windows", "apt");
    });
    expect(result.current.history).toHaveLength(1);
    expect(result.current.history[0].name).toBe("My Setup");
    expect(result.current.history[0].selectedIds).toEqual(["Google.Chrome", "Git.Git"]);
    expect(result.current.history[0].platform).toBe("windows");
  });

  it("deletes a setup entry", () => {
    const { result } = renderHook(() => useSetupHistory());
    act(() => {
      result.current.saveSetup("Setup A", ["Git.Git"], "windows", "apt");
    });
    const id = result.current.history[0].id;
    act(() => {
      result.current.deleteSetup(id);
    });
    expect(result.current.history).toHaveLength(0);
  });

  it("persists entries to localStorage", () => {
    const { result } = renderHook(() => useSetupHistory());
    act(() => {
      result.current.saveSetup("Persistent", ["Git.Git"], "macos", "apt");
    });
    const raw = localStorage.getItem("quicksetup-history");
    expect(raw).not.toBeNull();
    const parsed = JSON.parse(raw!);
    expect(parsed).toHaveLength(1);
    expect(parsed[0].name).toBe("Persistent");
  });

  it("limits history to 10 entries", async () => {
    const { result } = renderHook(() => useSetupHistory());
    for (let i = 0; i < 12; i++) {
      act(() => {
        result.current.saveSetup(`Setup ${i}`, [], "windows", "apt");
      });
    }
    expect(result.current.history).toHaveLength(10);
  });

  it("uses fallback name for empty name", () => {
    const { result } = renderHook(() => useSetupHistory());
    act(() => {
      result.current.saveSetup("", [], "windows", "apt");
    });
    expect(result.current.history[0].name).toBe("Setup sem nome");
  });
});
