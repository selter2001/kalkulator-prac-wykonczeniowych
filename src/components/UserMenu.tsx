import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { User, LogOut, UserCircle } from 'lucide-react';

export const UserMenu = () => {
  const { user, authMode, signOut, exitGuestMode } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast({
        title: 'Błąd',
        description: 'Nie udało się wylogować',
        variant: 'destructive'
      });
    } else {
      toast({
        title: 'Wylogowano',
        description: 'Do zobaczenia!'
      });
      navigate('/auth');
    }
  };

  const handleExitGuest = () => {
    exitGuestMode();
    navigate('/auth');
  };

  if (authMode === 'guest') {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground hidden sm:inline">Tryb gościa</span>
        <Button variant="outline" size="sm" onClick={handleExitGuest}>
          <User className="w-4 h-4 mr-2" />
          Zaloguj się
        </Button>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <UserCircle className="w-4 h-4" />
          <span className="hidden sm:inline max-w-32 truncate">
            {user?.email}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="px-2 py-1.5">
          <p className="text-sm font-medium truncate">{user?.email}</p>
          <p className="text-xs text-muted-foreground">Zalogowany</p>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut} className="text-destructive cursor-pointer">
          <LogOut className="w-4 h-4 mr-2" />
          Wyloguj się
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
