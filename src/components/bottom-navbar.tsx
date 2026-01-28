'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LogOut, Search, User, Refrigerator } from 'lucide-react';
import { ViewToggle } from './freezer/view-toggle';
import { useAuth } from '@/hooks/use-auth';
import { auth } from '@/lib/firebase';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
  DropdownMenuSubContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import type { Freezer } from '@/lib/types';

type BottomNavbarProps = {
  view: 'grid' | 'list';
  setView: (view: 'grid' | 'list') => void;
  onAddClick: () => void;
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  freezers: Freezer[];
  currentFreezerId: string;
  onFreezerChange: (id: string) => void;
};

export function BottomNavbar({ 
  view, 
  setView, 
  onAddClick, 
  searchQuery, 
  onSearchQueryChange,
  freezers,
  currentFreezerId,
  onFreezerChange,
}: BottomNavbarProps) {
  const { user: authUser } = useAuth();
  
  const isMockUser = !authUser;
  
  const user = authUser || {
      displayName: 'Usuario dev',
      email: 'dev.user@example.com',
      photoURL: 'https://i.pravatar.cc/40?u=dev-user',
  };

  const handleSignOut = async () => {
    if (!isMockUser) {
      await auth.signOut();
    }
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 p-2 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex items-center gap-2 sm:gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-10 w-10 rounded-full"
              >
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src={user.photoURL ?? ''}
                    alt={user.displayName ?? 'Usuario'}
                  />
                  <AvatarFallback>
                    {user.displayName ? user.displayName.charAt(0).toUpperCase() : <User />}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64 mb-2" align="start" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {user.displayName}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    <Refrigerator />
                    <span>Cambiar congelador</span>
                  </DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                      <DropdownMenuRadioGroup value={currentFreezerId} onValueChange={onFreezerChange}>
                        {freezers.map((freezer) => (
                           <DropdownMenuRadioItem key={freezer.id} value={freezer.id}>
                            {freezer.name}
                          </DropdownMenuRadioItem>
                        ))}
                      </DropdownMenuRadioGroup>
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut} disabled={isMockUser}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Cerrar sesión</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Filtrar alimentos..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => onSearchQueryChange(e.target.value)}
          />
        </div>
        <ViewToggle view={view} setView={setView} />
        <Button size="icon" className="rounded-full h-12 w-12" onClick={onAddClick}>
          <Refrigerator className="h-6 w-6" />
          <span className="sr-only">Añadir alimento</span>
        </Button>
      </div>
    </nav>
  );
}
