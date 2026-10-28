import React from 'react';
import { Link } from 'react-router-dom';
import {
  ClipboardList,
  Sparkles,
  MessageCircle,
  ArrowRight,
  MapPin,
  Wrench,
  Zap,
  Hammer,
  Paintbrush,
  Settings,
  Scissors,
  Leaf,
  Monitor,
  BookOpen,
  Camera,
  Car,
  Users,
} from 'lucide-react';
import { Button } from '@/components/common/Button';

// ─── How It Works steps ────────────────────────────────────────────────────
const STEPS = [
  {
    number: '01',
    Icon: ClipboardList,
    title: 'Describe what you need',
    body: 'Tell us the service you need, where you are in Kampala, and how long the job might take.',
  },
  {
    number: '02',
    Icon: Sparkles,
    title: 'AI finds the right people',
    body: 'Our matching algorithm scans registered providers and surfaces the ones whose skills and location fit your request.',
  },
  {
    number: '03',
    Icon: MessageCircle,
    title: 'Connect directly on WhatsApp',
    body: 'One tap opens a WhatsApp conversation. No middlemen, no platform fees — just a direct connection.',
  },
];

export function HomePage() {
  return (
    <div className="min-h-screen bg-white">

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      {/* Centered — the one section where center alignment is intentional */}
      <section className="relative pt-48 pb-36 px-4 text-center overflow-hidden">
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/images/hero1.jpg')" }}
          aria-hidden="true"
        />
        {/* Dark overlay so text remains readable */}
        <div className="absolute inset-0 bg-slate-900/65" aria-hidden="true" />

        {/* Content sits above the overlay */}
        <div className="relative max-w-3xl mx-auto">
          <p className="font-sans text-sm font-medium text-green-400 uppercase tracking-widest mb-4">
            Kampala, Uganda
          </p>
          <h1 className="font-display font-bold text-5xl md:text-6xl text-white leading-tight">
            Find skilled workers.<br />Get work done today.
          </h1>
          <p className="font-sans text-lg text-slate-300 mt-6 max-w-xl mx-auto leading-relaxed">
            Djema connects you with plumbers, electricians, carpenters, and hundreds of other skilled workers near you in Kampala — no bank card, no CV, no waiting.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button variant="primary" href="/post-request" size="lg">
              Post a Request
            </Button>
            <Link
              to="/register"
              className="font-sans font-medium text-sm text-slate-300 hover:text-white flex items-center gap-1 transition-colors"
            >
              Are you a provider? Join here
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────────────── */}
      {/* Left-aligned, numbered list — not cards */}
      <section className="py-20 px-4 bg-slate-100">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-display font-semibold text-3xl text-slate-900">
            How Djema works
          </h2>
          <p className="font-sans text-slate-600 mt-3 max-w-lg">
            Three steps from problem to solution. No account needed to get started.
          </p>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-12">
            {STEPS.map(({ number, Icon, title, body }) => (
              <div key={number} className="flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  <span className="font-display font-bold text-4xl text-slate-200 leading-none select-none">
                    {number}
                  </span>
                  <Icon size={24} className="text-green-600 flex-shrink-0" aria-hidden="true" />
                </div>
                <h3 className="font-display font-semibold text-lg text-slate-900">{title}</h3>
                <p className="font-sans text-sm text-slate-600 leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SDG 8 IMPACT ─────────────────────────────────────────────────── */}
      {/* Editorial text section — no cards, left-aligned, real numbers */}
      <section className="py-20 px-4 bg-slate-900">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="font-sans text-xs font-semibold uppercase tracking-widest text-green-400 mb-4">
                SDG 8 — Decent Work and Economic Growth
              </p>
              <h2 className="font-display font-bold text-3xl text-white leading-snug">
                Kampala has over 1.6 million informal workers with no digital presence.
              </h2>
              <p className="font-sans text-slate-400 mt-5 leading-relaxed">
                Platforms like LinkedIn and Upwork require formal credentials, bank accounts, and polished CVs. Most skilled workers in East Africa are locked out before they even start.
              </p>
              <p className="font-sans text-slate-400 mt-4 leading-relaxed">
                Djema removes those barriers. A plumber in Bwaise, a tailor in Kalerwe, an electrician in Ntinda — anyone with a skill and a phone can find work and get found.
              </p>
            </div>
            <div className="flex flex-col gap-8">
              <div className="border-l-2 border-green-500 pl-6">
                <p className="font-display font-bold text-4xl text-white">Goal</p>
                <p className="font-sans text-slate-400 mt-1 text-sm">500 providers registered in Kampala within 3 months of launch</p>
              </div>
              <div className="border-l-2 border-green-500 pl-6">
                <p className="font-display font-bold text-4xl text-white">Free</p>
                <p className="font-sans text-slate-400 mt-1 text-sm">No bank card, no formal CV, no platform fee required to join or use Djema</p>
              </div>
              <div className="border-l-2 border-green-500 pl-6">
                <p className="font-display font-bold text-4xl text-white">Direct</p>
                <p className="font-sans text-slate-400 mt-1 text-sm">Every connection happens through WhatsApp — a tool already on every phone in Uganda</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOR PROVIDERS ────────────────────────────────────────────────── */}
      {/* Asymmetric two-column editorial layout */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
            <div>
              <h2 className="font-display font-semibold text-3xl text-slate-900">
                Have a skill? Start getting work.
              </h2>
              <p className="font-sans text-slate-600 mt-4 leading-relaxed">
                Register your profile in minutes. Tell us what you do and where you are in Kampala. When someone nearby needs your service, Djema surfaces your profile — and they contact you directly on WhatsApp.
              </p>
              <p className="font-sans text-slate-600 mt-4 leading-relaxed">
                You can also browse the open requests board and reach out to people who are actively looking for help right now.
              </p>
              <div className="mt-8">
                <Button variant="primary" href="/register">
                  Register as a Provider
                </Button>
              </div>
            </div>

            <div className="flex flex-col gap-0 divide-y divide-slate-100">
              {[
                { label: 'No fee to join', detail: 'Creating a provider profile is completely free.' },
                { label: 'No bank account needed', detail: 'You receive payment directly from the client — off platform.' },
                { label: 'Work in your neighborhood', detail: 'Requests are matched by location — you only appear for jobs near you.' },
                { label: 'Browse open requests', detail: 'Clients post requests publicly when no match is found. You can contact them directly.' },
              ].map(({ label, detail }) => (
                <div key={label} className="py-5">
                  <p className="font-sans font-semibold text-sm text-slate-900">{label}</p>
                  <p className="font-sans text-sm text-slate-500 mt-0.5">{detail}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ────────────────────────────────────────────────────── */}
      <section className="py-20 px-4 bg-green-600">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          <div>
            <h2 className="font-display font-bold text-3xl text-white">
              Need something done in Kampala?
            </h2>
            <p className="font-sans text-green-100 mt-2">
              Post your request now — it takes less than 2 minutes.
            </p>
          </div>
          <div className="flex-shrink-0">
            <Link
              to="/post-request"
              className="inline-flex items-center gap-2 bg-white text-green-700 font-sans font-semibold text-sm px-6 py-3 rounded-lg hover:bg-green-50 transition-colors min-h-[44px] focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-green-600"
            >
              Post a Request
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
