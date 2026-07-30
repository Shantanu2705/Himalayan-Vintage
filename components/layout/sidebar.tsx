'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/components/ui/button';
import { useAuthStore } from '@/lib/store/use-auth-store';
import { useFleetStore } from '@/lib/store/use-fleet-store';
import {
  LayoutDashboard,
  MessageSquareQuote,
  FileText,
  CalendarCheck,
  Receipt,
  Car,
  Users,
  Building2,
  MapPin,
  BarChart3,
  Settings,
  ShieldCheck,
  ChevronRight,
  Bus,
} from 'lucide-react';

export const Sidebar: React.FC<{ className?: string; onCloseMobile?: () => void }> = ({
  className,
  onCloseMobile,
}) => {
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);
  const { settings } = useFleetStore();

  const navItems = [
    { title: 'Dashboard', href: '/', icon: LayoutDashboard },
    { title: 'Calendar', href: '/calendar', icon: CalendarCheck },
    { title: 'Enquiries', href: '/enquiries', icon: MessageSquareQuote },
    { title: 'Quotations', href: '/quotations', icon: FileText },
    { title: 'Billing', href: '/billing', icon: Receipt },
    { title: 'Reports', href: '/reports', icon: BarChart3 },
    { title: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <aside
      className={cn(
        'flex h-full w-64 flex-col border-r bg-card text-card-foreground shadow-soft no-print',
        className
      )}
    >
      {/* Brand Header */}
      <div className="flex h-16 items-center border-b px-6">
        <Link href="/" className="flex items-center gap-3 font-bold text-lg tracking-tight overflow-hidden" onClick={onCloseMobile}>
          {settings?.logoUrl ? (
            <img src={settings.logoUrl} alt="Company Logo" className="h-9 w-9 rounded-lg object-contain bg-white border p-0.5 shrink-0 shadow-xs" />
          ) : (
            <img src="/logo-icon.svg" alt="Company Logo" className="h-10 w-10 shrink-0 object-contain" />
          )}
          <div className="flex flex-col truncate">
            <span className="leading-none text-primary truncate font-bold text-base">{settings?.companyName?.split(' ')[0] || 'Himalayan'}</span>
            <span className="text-[10px] font-semibold tracking-widest text-muted-foreground uppercase mt-0.5 truncate">
              {settings?.companyName?.split(' ').slice(1).join(' ') || 'Fleet Enterprise'}
            </span>
          </div>
        </Link>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        <div className="px-3 pb-2 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
          Core Modules
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onCloseMobile}
              className={cn(
                'group flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium transition-all duration-150',
                isActive
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:bg-muted/80 hover:text-foreground'
              )}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={cn(
                    'h-4 w-4 transition-colors',
                    isActive ? 'text-primary-foreground' : 'text-muted-foreground group-hover:text-foreground'
                  )}
                />
                <span>{item.title}</span>
              </div>
              {isActive && <ChevronRight className="h-4 w-4 opacity-75" />}
            </Link>
          );
        })}
      </div>

      {/* Footer User Info */}
      <div className="border-t p-4 bg-muted/30">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-primary font-bold text-xs uppercase">
            {user?.name?.[0] || 'U'}
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="truncate text-xs font-semibold text-foreground">{user?.name || 'Guest User'}</span>
            <span className="truncate text-[10px] text-muted-foreground capitalize">{user?.role || 'operator'} Role</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
