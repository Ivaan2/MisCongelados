import { Button } from '@/components/ui/button';
import { List, LayoutGrid } from 'lucide-react';

type ViewToggleProps = {
  view: 'grid' | 'list';
  setView: (view: 'grid' | 'list') => void;
};

export function ViewToggle({ view, setView }: ViewToggleProps) {
  return (
    <div className="flex items-center gap-1 bg-muted p-1 rounded-lg">
      <Button
        variant={view === 'grid' ? 'secondary' : 'ghost'}
        size="sm"
        onClick={() => setView('grid')}
        aria-label="Vista de cuadrícula"
        className="rounded-md"
      >
        <LayoutGrid className="h-4 w-4" />
      </Button>
      <Button
        variant={view === 'list' ? 'secondary' : 'ghost'}
        size="sm"
        onClick={() => setView('list')}
        aria-label="Vista de lista"
        className="rounded-md"
      >
        <List className="h-4 w-4" />
      </Button>
    </div>
  );
}
