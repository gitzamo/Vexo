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

  const handleLogoClick = () => {
    navigate('/discover');
  };

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="hidden md:flex w-64 shrink-0 flex-col border-r border-border bg-card shadow-sm">
        <button
          onClick={handleLogoClick}
          className="flex items-center gap-2 px-6 py-6 hover:opacity-80 transition-opacity cursor-pointer bg-transparent border-none"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-md">
            <Trophy className="h-5 w-5" />
          </div>
          <span className="font-display text-xl font-bold tracking-tight">Vexo</span>
        </button>

        <nav className="flex-1 space-y-1 px-4 py-4">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200',
                  isActive ? 'bg-primary text-primary-foreground shadow-sm' : 'text-foreground hover:bg-muted/60'
                )
              }
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span>{label}</span>
            </NavLink>
          ))}

          {user?.role === 'admin' && (
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200 mt-2 border-t border-border pt-3',
                  isActive ? 'bg-primary text-primary-foreground shadow-sm' : 'text-foreground hover:bg-muted/60'
                )
              }
            >
              <LayoutDashboard className="h-4 w-4 shrink-0" />
              <span>Admin</span>
            </NavLink>
          )}
        </nav>

        <div className="border-t border-border p-4">
          <div className="flex items-center gap-3 rounded-lg px-3 py-3 bg-muted/30">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="font-semibold text-xs">{initials(user?.name)}</AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{user?.name}</p>
              <p className="truncate text-xs text-muted-foreground">{user?.location_text || 'No location'}</p>
            </div>
            <button
              onClick={handleLogout}
              className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              title="Log out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      <div className="flex md:hidden fixed top-0 inset-x-0 z-40 items-center justify-between border-b border-border bg-card px-4 py-4 shadow-sm">
        <button
          onClick={handleLogoClick}
          className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer bg-transparent border-none"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Trophy className="h-4 w-4" />
          </div>
          <span className="font-display text-lg font-bold">Vexo</span>
        </button>
        <button onClick={handleLogout} className="text-muted-foreground hover:text-foreground transition-colors">
          <LogOut className="h-4 w-4" />
        </button>
      </div>

      <main className="flex-1 pt-16 md:pt-0 pb-20 md:pb-0">
        <div className="container max-w-6xl py-8 md:py-12">
          <Outlet />
        </div>
      </main>

      <nav className="fixed bottom-0 inset-x-0 z-40 flex md:hidden border-t border-border bg-card shadow-lg">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                'flex flex-1 flex-col items-center gap-1 py-3 text-xs font-medium transition-colors',
                isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
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