'use client';
import { useState } from 'react';
import { Header } from '@/components/header';
import { FreezerContent } from '@/components/freezer-content';
import { BottomNavbar } from '@/components/bottom-navbar';
import type { Freezer } from '@/lib/types';

export default function Home() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  
  // A key to force re-render/re-fetch of FreezerContent
  const [refreshKey, setRefreshKey] = useState(0); 
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [freezers, setFreezers] = useState<Freezer[]>([
    { id: 'freezer1', name: 'Kitchen Freezer' },
    { id: 'freezer2', name: 'Garage Deep Freeze' }
  ]);
  const [currentFreezerId, setCurrentFreezerId] = useState('freezer1');

  const handleItemAdded = () => {
    setIsAddDialogOpen(false);
    setRefreshKey(prev => prev + 1);
  };
  
  const currentFreezerName = freezers.find(f => f.id === currentFreezerId)?.name || 'Freezer';
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header freezerName={currentFreezerName} />
      <main className="flex-1 p-4 md:p-6 lg:p-8 pb-24">
        <FreezerContent 
          key={refreshKey}
          isAddDialogOpen={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
          onItemAdded={handleItemAdded}
          view={view}
          searchQuery={searchQuery}
          currentFreezerId={currentFreezerId}
        />
      </main>
      <BottomNavbar 
        view={view}
        setView={setView}
        onAddClick={() => setIsAddDialogOpen(true)}
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
        freezers={freezers}
        currentFreezerId={currentFreezerId}
        onFreezerChange={setCurrentFreezerId}
      />
    </div>
  );
}
