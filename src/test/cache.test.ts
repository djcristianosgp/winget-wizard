import { describe, it, expect, beforeEach } from "vitest";
import { getCached, setCached, deleteCached, clearCache, TTL_24H, TTL_1H } from "@/lib/cache";

describe("cache", () => {
  beforeEach(() => {
    clearCache();
  });

  it("returns null for missing keys", () => {
    expect(getCached("nonexistent")).toBeNull();
  });

  it("stores and retrieves a value", () => {
    setCached("key1", { foo: "bar" }, TTL_24H);
    expect(getCached("key1")).toEqual({ foo: "bar" });
  });

  it("returns null for expired entries", () => {
    setCached("expiring", "value", -1); // expired immediately
    expect(getCached("expiring")).toBeNull();
  });

  it("deletes a specific key", () => {
    setCached("key2", 42, TTL_1H);
    deleteCached("key2");
    expect(getCached("key2")).toBeNull();
  });

  it("clears all entries", () => {
    setCached("a", 1, TTL_24H);
    setCached("b", 2, TTL_24H);
    clearCache();
    expect(getCached("a")).toBeNull();
    expect(getCached("b")).toBeNull();
  });

  it("overwrites an existing entry", () => {
    setCached("key3", "original", TTL_24H);
    setCached("key3", "updated", TTL_24H);
    expect(getCached("key3")).toBe("updated");
  });
});
