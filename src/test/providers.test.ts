import { describe, it, expect } from "vitest";
import { inferCategory } from "@/lib/providers/types";

describe("inferCategory", () => {
  it("classifies browser-related text as browsers", () => {
    expect(inferCategory("Google Chrome browser")).toBe("browsers");
    expect(inferCategory("Firefox web browser")).toBe("browsers");
  });

  it("classifies media-related text as multimedia", () => {
    expect(inferCategory("VLC media player video")).toBe("multimedia");
    expect(inferCategory("OBS Studio record stream")).toBe("multimedia");
  });

  it("classifies chat/meeting apps as communication", () => {
    expect(inferCategory("Discord chat messaging")).toBe("communication");
    expect(inferCategory("Zoom meeting video")).toBe("communication");
  });

  it("classifies dev tools as development", () => {
    expect(inferCategory("Git version control cli")).toBe("development");
    expect(inferCategory("Visual Studio Code editor ide")).toBe("development");
    expect(inferCategory("Docker container sdk")).toBe("development");
  });

  it("defaults to utilities for unrecognised text", () => {
    expect(inferCategory("Some random tool")).toBe("utilities");
    expect(inferCategory("")).toBe("utilities");
  });
});
