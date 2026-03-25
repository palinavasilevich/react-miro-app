import { ROUTES } from "@/shared/model/routes";
import { useSession } from "@/shared/model/session";
import { Button } from "@/shared/ui/kit/button";
import { Link } from "react-router-dom";

export function AppHeader() {
  const { session, logout } = useSession();

  if (!session) {
    return null;
  }

  return (
    <header className="bg-background border-b border-border/40 shadow-sm py-3">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link to={ROUTES.HOME} className="text-xl font-semibold">
          React Miro App
        </Link>
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">{session.email}</span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => logout()}
            className="cursor-pointer"
          >
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
}
