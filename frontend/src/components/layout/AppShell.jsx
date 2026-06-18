import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  Compass,
  Inbox,
  User,
  History,
  LayoutDashboard,
  LogOut,
  Trophy,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

function initials(name = '') {
  return name
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

const navItems = [
  { to: '/discover', label: 'Discover', icon: Compass },
  { to: '/requests', label: 'Requests', icon: Inbox },
  { to: '/history', label: 'History', icon: History },
  { to: '/profile', label: 'Profile', icon: User },
];

export default function AppShell() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="hidden md:flex w-60 shrink-0 flex-col border-r border-border bg-card">
        <div className="flex items-center gap-2 px-5 py-5">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Trophy className="h-4 w-4" />
          </div>
          <span className="font-display text-lg font-bold tracking-tight">Vexo</span>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-2">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )
              }
            >
              <Icon className="h-4 w-4" />
              {label}
            </NavLink>
          ))}

          {user?.role === 'admin' && (
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )
              }
            >
              <LayoutDashboard className="h-4 w-4" />
              Admin
            </NavLink>
          )}
        </nav>

        <div className="border-t border-border p-3">
          <div className="flex items-center gap-3 rounded-md px-2 py-2">
            <Avatar>
              <AvatarFallback>{initials(user?.name)}</AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{user?.name}</p>
              <p className="truncate text-xs text-muted-foreground">{user?.location_text || 'No location set'}</p>
            </div>
            <button
              onClick={handleLogout}
              className="rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
              title="Log out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="flex md:hidden fixed top-0 inset-x-0 z-40 items-center justify-between border-b border-border bg-card px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Trophy className="h-3.5 w-3.5" />
          </div>
          <span className="font-display text-base font-bold">Vexo</span>
        </div>
        <button onClick={handleLogout} className="text-muted-foreground">
          <LogOut className="h-4 w-4" />
        </button>
      </div>

      <main className="flex-1 pt-14 md:pt-0 pb-20 md:pb-0">
        <div className="container max-w-5xl py-6 md:py-10">
          <Outlet />
        </div>
      </main>

      {/* Mobile bottom nav */}
      <nav className="fixed bottom-0 inset-x-0 z-40 flex md:hidden border-t border-border bg-card">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                'flex flex-1 flex-col items-center gap-0.5 py-2.5 text-xs font-medium',
                isActive ? 'text-primary' : 'text-muted-foreground'
              )
            }
          >
            <Icon className="h-5 w-5" />
            {label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
