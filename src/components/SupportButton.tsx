import { useState } from "react";
import { Heart } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export function SupportButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 bg-pink-500 hover:bg-pink-600 active:bg-pink-700 text-white text-sm font-semibold px-4 py-2.5 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5"
        aria-label="Apoiar o projeto"
      >
        <Heart className="h-4 w-4 fill-white" />
        <span className="hidden sm:inline">Apoiar projeto</span>
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-sm p-0 overflow-hidden">
          <DialogHeader className="px-5 pt-5 pb-3">
            <DialogTitle className="flex items-center gap-2 text-base">
              <Heart className="h-4 w-4 text-pink-500 fill-pink-500" />
              Apoiar o QuickSetup
            </DialogTitle>
            <DialogDescription className="text-xs">
              Sua contribuição ajuda a manter e evoluir o projeto. Obrigado! ❤️
            </DialogDescription>
          </DialogHeader>
          <div className="px-5 pb-5">
            <iframe
              src="https://widget.livepix.gg/embed/e77892f2-efcf-4b47-b378-4f665535354c"
              className="w-full rounded-lg border border-border/50"
              height="420"
              title="Apoiar QuickSetup via LivePix"
              allow="clipboard-write"
              loading="lazy"
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
