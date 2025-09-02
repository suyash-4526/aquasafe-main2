'use client';

import * as React from 'react';
import { Droplets, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

export type View = 'dashboard' | 'map' | 'data' | 'calculator' | 'solutions';

const navItems: { view: View; label: string }[] = [
  { view: 'dashboard', label: 'Dashboard' },
  { view: 'map', label: 'Map View' },
  { view: 'data', label: 'Data Table' },
  { view: 'calculator', label: 'Contribute & Calculate' },
  { view: 'solutions', label: 'Find Solutions' },
];

interface NavbarProps {
  activeView: View;
  setActiveView: (view: View) => void;
}

export default function Navbar({ activeView, setActiveView }: NavbarProps) {
  const isMobile = useIsMobile();
  const [isSheetOpen, setSheetOpen] = React.useState(false);

  const handleNavClick = (view: View) => {
    setActiveView(view);
    if (isMobile) {
      setSheetOpen(false);
    }
  };

  const NavLinks = () => (
    <>
      {navItems.map((item) => (
        <Button
          key={item.view}
          variant={activeView === item.view ? 'secondary' : 'ghost'}
          className={cn(
            'justify-start sm:justify-center',
            activeView === item.view && 'font-bold text-primary'
          )}
          onClick={() => handleNavClick(item.view)}
        >
          {item.label}
        </Button>
      ))}
    </>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card shadow-sm">
      <div className="container flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <Droplets className="h-7 w-7 text-primary" />
          <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            AquaSafe Dashboard
          </h1>
        </div>

        {isMobile ? (
          <Sheet open={isSheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-3/4">
              <div className="flex flex-col gap-4 py-6">
                <NavLinks />
              </div>
            </SheetContent>
          </Sheet>
        ) : (
          <div className="flex items-center gap-2">
            <nav className="hidden items-center gap-1 md:flex">
              <NavLinks />
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
