import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, LogOut, ChevronRight } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { Avatar } from '@/components/common/Avatar';
import { useAuth } from '@/hooks/useAuth';
import { signOut } from '@/services/auth';

export function Navbar() {
  const { user, isAuthenticated } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  async function handleSignOut() {
    await signOut();
    setDropdownOpen(false);
  }

  return (
    <nav
      className="fixed top-0 w-full h-16 bg-white border-b border-slate-200 shadow-sm z-30"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="max-w-5xl mx-auto px-4 h-full flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="font-display font-bold text-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-green-500 rounded"
        >
          Djema
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-2">
          {isAuthenticated ? (
            <>
              <Button variant="ghost" href="/board">Browse Requests</Button>
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen((o) => !o)}
                  className="w-9 h-9 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                  aria-label="Account menu"
                  aria-expanded={dropdownOpen}
                >
                  <Avatar name={user?.displayName ?? 'Provider'} size="sm" />
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-md border border-slate-100 py-1 z-40">
                    <Link
                      to="/dashboard"
                      className="block px-4 py-2 font-sans text-sm text-slate-700 hover:bg-slate-50"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/profile/edit"
                      className="block px-4 py-2 font-sans text-sm text-slate-700 hover:bg-slate-50"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Edit Profile
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="w-full text-left px-4 py-2 font-sans text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                    >
                      <LogOut size={14} aria-hidden="true" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Button variant="primary" href="/post-request">Post a Request</Button>
              <Button variant="ghost" href="/login">Sign in as Provider</Button>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          onClick={() => setMobileOpen((o) => !o)}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
        </button>
      </div>

      {/* Mobile slide-over */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-y-0 right-0 w-72 bg-white shadow-xl z-50 flex flex-col pt-16">
          <div className="px-4 py-6 flex flex-col gap-3">
            {isAuthenticated ? (
              <>
                <Link
                  to="/board"
                  className="font-sans text-slate-700 py-2 px-3 rounded-lg hover:bg-slate-100 flex items-center gap-2"
                  onClick={() => setMobileOpen(false)}
                >
                  Browse Requests <ChevronRight size={16} aria-hidden="true" />
                </Link>
                <Link
                  to="/dashboard"
                  className="font-sans text-slate-700 py-2 px-3 rounded-lg hover:bg-slate-100"
                  onClick={() => setMobileOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  to="/profile/edit"
                  className="font-sans text-slate-700 py-2 px-3 rounded-lg hover:bg-slate-100"
                  onClick={() => setMobileOpen(false)}
                >
                  Edit Profile
                </Link>
                <button
                  onClick={() => { void handleSignOut(); setMobileOpen(false); }}
                  className="text-left font-sans text-red-600 py-2 px-3 rounded-lg hover:bg-red-50 flex items-center gap-2"
                >
                  <LogOut size={14} aria-hidden="true" />
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Button variant="primary" href="/post-request" className="w-full" onClick={() => setMobileOpen(false)}>
                  Post a Request
                </Button>
                <Button variant="ghost" href="/login" className="w-full" onClick={() => setMobileOpen(false)}>
                  Sign in as Provider
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
