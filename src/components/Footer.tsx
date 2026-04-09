import { Github, ExternalLink } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border/60 bg-background px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
      <span>
        Desenvolvido por{" "}
        <a
          href="https://curriculo-online-indol.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-foreground hover:text-blue-600 inline-flex items-center gap-1 transition-colors"
        >
          Cristiano Grobério
          <ExternalLink className="h-3 w-3" />
        </a>
      </span>
      <a
        href="https://github.com/djcristianosgp/winget-wizard"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 font-medium text-foreground hover:text-blue-600 transition-colors"
      >
        <Github className="h-3.5 w-3.5" />
        djcristianosgp/winget-wizard
      </a>
    </footer>
  );
}
