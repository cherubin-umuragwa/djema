import React, { useState, useEffect } from 'react';
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
  const [scrolled, setScrolled] = useState(false);

  // Switch to solid white once the user scrolls past the hero (~80vh)
  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > window.innerHeight * 0.75);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // run once on mount in case page is already scrolled
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  async function handleSignOut() {
    await signOut();
    setDropdownOpen(false);
  }

  return (
    <>
      {/* Floating glassmorphism navbar */}
      <nav
        className="fixed top-0 left-0 right-0 z-30 px-4 pt-4"
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="max-w-5xl mx-auto">
          <div className={`h-14 flex items-center justify-between px-5 rounded-2xl border shadow-sm transition-all duration-300 ${
            scrolled
              ? 'bg-white border-slate-200 shadow-md'
              : 'bg-white/15 backdrop-blur-md border-white/25'
          }`}>

            {/* Logo */}
            <Link
              to="/"
              className={`font-display font-bold text-xl focus:outline-none focus:ring-2 rounded transition-colors duration-300 ${
                scrolled ? 'text-slate-900 focus:ring-green-500' : 'text-white focus:ring-white/50'
              }`}
            >
              Djema
            </Link>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-2">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/board"
                    className={`font-sans text-sm font-medium px-3 py-2 rounded-lg transition-colors ${
                      scrolled
                        ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                        : 'text-white/90 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    Browse Requests
                  </Link>
                  <div className="relative">
                    <button
                      onClick={() => setDropdownOpen((o) => !o)}
                      className="w-9 h-9 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-green-500"
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
                  <Link
                    to="/login"
                    className={`font-sans text-sm font-medium px-3 py-2 rounded-lg transition-colors ${
                      scrolled
                        ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                        : 'text-white/90 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    Sign in as Provider
                  </Link>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              className={`md:hidden p-2 rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                scrolled
                  ? 'text-slate-600 hover:bg-slate-100 focus:ring-green-500'
                  : 'text-white hover:bg-white/10 focus:ring-white/50'
              }`}
              onClick={() => setMobileOpen((o) => !o)}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
            </button>

          </div>
        </div>
      </nav>

      {/* Mobile slide-over — backdrop + panel */}
      {mobileOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 z-40 md:hidden"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />

          {/* Panel */}
          <div className="fixed inset-y-0 right-0 w-72 bg-white shadow-xl z-50 flex flex-col md:hidden">
            <div className="h-16 flex items-center justify-between px-4 border-b border-slate-200">
              <span className="font-display font-bold text-lg text-slate-900">Menu</span>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                aria-label="Close menu"
              >
                <X size={20} aria-hidden="true" />
              </button>
            </div>

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
        </>
      )}
    </>
  );
}
