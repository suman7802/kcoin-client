'use client';

import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { LogOut, Wallet, Menu } from 'lucide-react';
import { truncateAddress } from '@/lib/utils/formatters';
import { useState } from 'react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { LayoutDashboard, Send, Blocks } from 'lucide-react';

const navItems = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutDashboard,
    },
    {
        title: 'Transactions',
        href: '/transactions',
        icon: Send,
    },
    {
        title: 'Blockchain',
        href: '/blockchain',
        icon: Blocks,
    },
];

export function Header() {
    const { walletAddress, logout, isLoggingOut } = useAuth();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const pathname = usePathname();

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 items-center justify-between">
                <div className="flex items-center gap-2">
                    <Sheet
                        open={mobileMenuOpen}
                        onOpenChange={setMobileMenuOpen}
                    >
                        <SheetTrigger
                            asChild
                            className="md:hidden"
                        >
                            <Button
                                variant="ghost"
                                size="icon"
                            >
                                <Menu className="h-5 w-5" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent
                            side="left"
                            className="w-64"
                        >
                            <nav className="space-y-2 mt-8">
                                {navItems.map((item) => {
                                    const Icon = item.icon;
                                    const isActive = pathname === item.href;
                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            onClick={() => setMobileMenuOpen(false)}
                                            className={cn(
                                                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                                                isActive
                                                    ? 'bg-primary text-primary-foreground'
                                                    : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                                            )}
                                        >
                                            <Icon className="h-4 w-4" />
                                            {item.title}
                                        </Link>
                                    );
                                })}
                            </nav>
                        </SheetContent>
                    </Sheet>
                    <Wallet className="h-5 w-5 ml-5" />
                    <span className="font-bold">Crypto Wallet</span>
                </div>
                <div className="flex items-center gap-4">
                    {walletAddress && (
                        <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
                            <span className="font-mono">{truncateAddress(walletAddress)}</span>
                        </div>
                    )}
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={logout}
                        disabled={isLoggingOut}
                    >
                        <LogOut className="mr-2 h-4 w-4" />
                        <span className="hidden sm:inline">Logout</span>
                    </Button>
                </div>
            </div>
        </header>
    );
}
