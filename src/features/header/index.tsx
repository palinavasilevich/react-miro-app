import { useSession } from "@/shared/model/session";
import { Button } from "@/shared/ui/kit/button";

export function AppHeader() {
  const { session, logout } = useSession();

  if (!session) {
    return null;
  }

  return (
    <header className="bg-background border-b border-border/40 shadow-sm py-3">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <div className="text-xl font-semibold">React Miro App</div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">{session.email}</span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => logout()}
            className="hover:bg-destructive/10"
          >
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
}
