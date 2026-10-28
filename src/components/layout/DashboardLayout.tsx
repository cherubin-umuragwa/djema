import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  ClipboardList,
  UserCircle,
  LogOut,
  MapPin,
  CheckCircle2,
  XCircle,
  Menu,
  X,
} from 'lucide-react';
import { Avatar } from '@/components/common/Avatar';
import { useAuth } from '@/hooks/useAuth';
import { signOut } from '@/services/auth';
import type { Provider } from '@/types/provider';

const NAV = [
  { label: 'Overview', icon: LayoutDashboard, href: '/dashboard' },
  { label: 'Browse Requests', icon: ClipboardList, href: '/board' },
  { label: 'Edit Profile', icon: UserCircle, href: '/profile/edit' },
];

interface DashboardLayoutProps {
  provider: Provider | null;
  pageTitle: string;
  children: React.ReactNode;
}

export function DashboardLayout({ provider, pageTitle, children }: DashboardLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const displayName = provider?.displayName ?? user?.displayName ?? 'Provider';

  async function handleSignOut() {
    await signOut();
    navigate('/');
  }

  return (
    <div className="min-h-screen bg-slate-100 flex">

      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* ── Sidebar ─────────────────────────────────────────────────────── */}
      <aside className={`
        fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-slate-200
        flex flex-col transition-transform duration-200
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:z-auto
      `}>
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-slate-100">
          <Link to="/" className="font-display font-bold text-xl text-slate-900">
            Djema
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1.5 text-slate-500 hover:bg-slate-100 rounded-lg"
            aria-label="Close sidebar"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        {/* Provider identity */}
        <div className="px-5 py-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <Avatar name={displayName} size="md" />
            <div className="min-w-0">
              <p className="font-sans font-semibold text-sm text-slate-900 truncate">
                {displayName}
              </p>
              <p className="font-sans text-xs text-slate-500 flex items-center gap-1 mt-0.5 truncate">
                <MapPin size={11} aria-hidden="true" className="flex-shrink-0" />
                {provider?.locationName ?? '—'}
              </p>
            </div>
          </div>
          <div className="mt-3 flex items-center gap-1.5">
            {provider?.available ? (
              <>
                <CheckCircle2 size={13} className="text-green-600" aria-hidden="true" />
                <span className="font-sans text-xs text-green-600 font-medium">Available for work</span>
              </>
            ) : (
              <>
                <XCircle size={13} className="text-slate-400" aria-hidden="true" />
                <span className="font-sans text-xs text-slate-500">Not available</span>
              </>
            )}
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4" aria-label="Dashboard navigation">
          {NAV.map(({ label, icon: Icon, href }) => {
            const active = location.pathname === href;
            return (
              <Link
                key={href}
                to={href}
                onClick={() => setSidebarOpen(false)}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1
                  font-sans text-sm transition-colors
                  ${active
                    ? 'bg-green-50 text-green-700 font-medium'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}
                `}
              >
                <Icon size={18} aria-hidden="true" />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Sign out */}
        <div className="px-3 py-4 border-t border-slate-100">
          <button
            onClick={() => void handleSignOut()}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-sans text-sm text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <LogOut size={18} aria-hidden="true" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* ── Main ────────────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 flex-shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
              aria-label="Open sidebar"
            >
              <Menu size={20} aria-hidden="true" />
            </button>
            <h1 className="font-display font-semibold text-lg text-slate-900">
              {pageTitle}
            </h1>
          </div>
          <Avatar name={displayName} size="sm" />
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
