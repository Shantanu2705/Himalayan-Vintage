'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/lib/store/use-auth-store';
import { useFleetStore } from '@/lib/store/use-fleet-store';
import {
  Bell,
  LogOut,
  Menu,
  PlusCircle,
  Sun,
  Moon,
  CheckCircle2,
  FileText,
  MessageSquareQuote,
  CalendarCheck,
} from 'lucide-react';

export const Header: React.FC<{ onOpenMobileSidebar?: () => void }> = ({ onOpenMobileSidebar }) => {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { notifications, markNotificationRead, settings } = useFleetStore();
  const [isDark, setIsDark] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showQuickAdd, setShowQuickAdd] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    if (typeof document !== 'undefined') {
      if (next) document.documentElement.classList.add('dark');
      else document.documentElement.classList.remove('dark');
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b bg-background/95 px-4 md:px-6 backdrop-blur supports-[backdrop-filter]:bg-background/60 no-print shadow-xs">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={onOpenMobileSidebar}
          aria-label="Open navigation menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
        
        <div className="hidden sm:flex items-center gap-2">
          <span className="text-sm font-semibold text-muted-foreground">Company:</span>
          {settings?.logoUrl ? (
            <img src={settings.logoUrl} alt="Company Logo" className="h-7 w-auto max-w-[140px] object-contain inline-block mr-1" />
          ) : null}
          <span className="text-sm font-bold text-foreground">{settings?.companyName || 'Himalayan Vintage Holidays'}</span>
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-3">
        {/* Quick Create Dropdown */}
        <div className="relative">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowQuickAdd(!showQuickAdd)}
            className="hidden sm:flex items-center gap-1.5 font-semibold text-primary border-primary/20 hover:bg-primary/10"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Quick Create</span>
          </Button>

          {showQuickAdd && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowQuickAdd(false)} />
              <div className="absolute right-0 mt-2 w-48 rounded-md border bg-popover p-1 shadow-md z-50 animate-in fade-in-80 zoom-in-95">
                <Link
                  href="/enquiries"
                  onClick={() => setShowQuickAdd(false)}
                  className="flex items-center gap-2 rounded-sm px-3 py-2 text-xs font-medium hover:bg-accent"
                >
                  <MessageSquareQuote className="h-4 w-4 text-primary" /> New Enquiry
                </Link>
                <Link
                  href="/quotations/new"
                  onClick={() => setShowQuickAdd(false)}
                  className="flex items-center gap-2 rounded-sm px-3 py-2 text-xs font-medium hover:bg-accent"
                >
                  <FileText className="h-4 w-4 text-primary" /> Create Quotation
                </Link>
                <Link
                  href="/bookings"
                  onClick={() => setShowQuickAdd(false)}
                  className="flex items-center gap-2 rounded-sm px-3 py-2 text-xs font-medium hover:bg-accent"
                >
                  <CalendarCheck className="h-4 w-4 text-primary" /> Log Booking
                </Link>
              </div>
            </>
          )}
        </div>

        {/* Theme Toggle */}
        <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle dark mode">
          {isDark ? <Sun className="h-5 w-5 text-amber-400" /> : <Moon className="h-5 w-5 text-slate-600" />}
        </Button>

        {/* Notifications Dropdown */}
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative"
            aria-label="View notifications"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 flex h-2 w-2 rounded-full bg-red-600 ring-2 ring-background" />
            )}
          </Button>

          {showNotifications && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-lg border bg-popover shadow-lg z-50 animate-in fade-in-80 zoom-in-95 overflow-hidden">
                <div className="flex items-center justify-between border-b px-4 py-3 bg-muted/30">
                  <span className="text-sm font-bold">Notifications</span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-primary/10 text-primary">
                    {unreadCount} new
                  </span>
                </div>
                <div className="max-h-80 overflow-y-auto divide-y">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-xs text-muted-foreground">No notifications</div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => markNotificationRead(n.id)}
                        className={`flex items-start gap-3 p-3 cursor-pointer transition-colors hover:bg-muted/40 ${
                          !n.read ? 'bg-primary/5 font-medium' : 'opacity-80'
                        }`}
                      >
                        <CheckCircle2 className={`h-4 w-4 mt-0.5 shrink-0 ${!n.read ? 'text-primary' : 'text-muted-foreground'}`} />
                        <div className="flex-1 overflow-hidden">
                          <div className="text-xs font-semibold">{n.title}</div>
                          <div className="text-[11px] text-muted-foreground truncate">{n.message}</div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* User Menu & Logout */}
        <div className="flex items-center gap-2 border-l pl-2 md:pl-3">
          <div className="hidden lg:flex flex-col text-right">
            <span className="text-xs font-bold leading-tight">{user?.name || 'Admin'}</span>
            <span className="text-[10px] text-muted-foreground capitalize">{user?.role || 'administrator'}</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="text-destructive hover:bg-destructive/10 hover:text-destructive flex items-center gap-1.5"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>
      </div>
    </header>
  );
};
