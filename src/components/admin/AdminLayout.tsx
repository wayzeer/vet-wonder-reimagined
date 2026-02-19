import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut, Home } from "lucide-react";
import logoVetWonder from "@/assets/logo-vetwonder.png";

interface AdminLayoutProps {
  children: React.ReactNode;
  onLogout: () => void;
}

export const AdminLayout = ({ children, onLogout }: AdminLayoutProps) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b bg-card">
        <div className="container-custom flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <img
              src={logoVetWonder}
              alt="VetWonder"
              className="h-10 cursor-pointer"
              onClick={() => navigate("/")}
            />
            <span className="text-sm font-semibold text-muted-foreground">
              Admin
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/")}
            >
              <Home className="h-4 w-4 mr-2" />
              Inicio
            </Button>
            <Button variant="outline" size="sm" onClick={onLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Salir
            </Button>
          </div>
        </div>
      </nav>

      <main>{children}</main>
    </div>
  );
};
