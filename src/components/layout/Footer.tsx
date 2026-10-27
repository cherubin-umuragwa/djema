import React from 'react';
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 py-12">
      <div className="max-w-5xl mx-auto px-4">
        <div className="mb-6">
          <p className="font-display font-bold text-xl text-slate-900 mb-1">Djema</p>
          <p className="font-sans text-slate-500 text-sm">
            Find the help you need, get the work you deserve.
          </p>
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-2 mb-8">
          <Link to="/post-request" className="font-sans text-sm text-slate-600 hover:text-slate-900 transition-colors">
            Post a Request
          </Link>
          <Link to="/board" className="font-sans text-sm text-slate-600 hover:text-slate-900 transition-colors">
            Browse Requests
          </Link>
          <Link to="/register" className="font-sans text-sm text-slate-600 hover:text-slate-900 transition-colors">
            For Providers
          </Link>
          <Link to="/" className="font-sans text-sm text-slate-600 hover:text-slate-900 transition-colors">
            About
          </Link>
        </div>
        <p className="font-sans text-xs text-slate-400">
          2026 Djema &middot; Built for PreDevFest Hackathon &middot; Kampala, Uganda
        </p>
      </div>
    </footer>
  );
}
