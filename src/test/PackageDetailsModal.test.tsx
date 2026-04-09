import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { PackageDetailsModal } from "@/components/PackageDetailsModal";
import type { SetupApp } from "@/data/apps";

const mockApp: SetupApp = {
  id: "Mozilla.Firefox",
  name: "Mozilla Firefox",
  category: "browsers",
  description: "Fast, private & safe browser",
  winget: "Mozilla.Firefox",
  brew: "--cask firefox",
  apt: "firefox",
  dnf: "firefox",
  pacman: "firefox",
};

describe("PackageDetailsModal", () => {
  it("renders app name and id when open", () => {
    render(
      <PackageDetailsModal
        app={mockApp}
        open={true}
        selected={false}
        onClose={vi.fn()}
        onToggle={vi.fn()}
      />
    );

    expect(screen.getByText("Mozilla Firefox")).toBeInTheDocument();
    // The id appears in multiple places (header + winget row); check it is rendered at least once
    expect(screen.getAllByText("Mozilla.Firefox").length).toBeGreaterThanOrEqual(1);
  });

  it("renders app description", () => {
    render(
      <PackageDetailsModal
        app={mockApp}
        open={true}
        selected={false}
        onClose={vi.fn()}
        onToggle={vi.fn()}
      />
    );

    expect(screen.getByText("Fast, private & safe browser")).toBeInTheDocument();
  });

  it("shows available package managers", () => {
    render(
      <PackageDetailsModal
        app={mockApp}
        open={true}
        selected={false}
        onClose={vi.fn()}
        onToggle={vi.fn()}
      />
    );

    expect(screen.getByText("Winget")).toBeInTheDocument();
    expect(screen.getByText("Homebrew")).toBeInTheDocument();
    expect(screen.getByText("APT (Ubuntu/Debian)")).toBeInTheDocument();
  });

  it("shows 'Adicionar à fila' when app is not selected", () => {
    render(
      <PackageDetailsModal
        app={mockApp}
        open={true}
        selected={false}
        onClose={vi.fn()}
        onToggle={vi.fn()}
      />
    );

    expect(screen.getByText("Adicionar à fila")).toBeInTheDocument();
  });

  it("shows 'Remover da fila' when app is selected", () => {
    render(
      <PackageDetailsModal
        app={mockApp}
        open={true}
        selected={true}
        onClose={vi.fn()}
        onToggle={vi.fn()}
      />
    );

    expect(screen.getByText("Remover da fila")).toBeInTheDocument();
  });

  it("calls onToggle and onClose when action button is clicked", () => {
    const onToggle = vi.fn();
    const onClose = vi.fn();
    render(
      <PackageDetailsModal
        app={mockApp}
        open={true}
        selected={false}
        onClose={onClose}
        onToggle={onToggle}
      />
    );

    fireEvent.click(screen.getByText("Adicionar à fila"));
    expect(onToggle).toHaveBeenCalledWith("Mozilla.Firefox");
    expect(onClose).toHaveBeenCalled();
  });

  it("renders nothing when app is null", () => {
    const { container } = render(
      <PackageDetailsModal
        app={null}
        open={true}
        selected={false}
        onClose={vi.fn()}
        onToggle={vi.fn()}
      />
    );
    expect(container).toBeEmptyDOMElement();
  });
});
