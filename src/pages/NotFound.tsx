import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Wand2, Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4 text-white">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/20">
          <Wand2 className="h-6 w-6 text-blue-400" />
        </div>
        <span className="text-lg font-bold tracking-tight text-white/90">Winget Wizard</span>
      </div>

      <h1 className="mb-2 text-8xl font-extrabold text-blue-400/80 select-none">404</h1>
      <p className="mb-2 text-2xl font-semibold text-white/90">Página não encontrada</p>
      <p className="mb-8 max-w-sm text-center text-sm text-white/50">
        A página{" "}
        <code className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-blue-300">
          {location.pathname}
        </code>{" "}
        não existe ou foi removida.
      </p>

      <div className="flex gap-3">
        <Button
          variant="outline"
          className="gap-2 border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Button>
        <Button
          className="gap-2 bg-blue-500 text-white hover:bg-blue-600"
          onClick={() => navigate("/")}
        >
          <Home className="h-4 w-4" />
          Ir para o início
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
