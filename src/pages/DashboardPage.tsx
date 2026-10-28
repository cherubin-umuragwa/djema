import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Wrench,
  ClipboardList,
  ArrowRight,
  AlertCircle,
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Avatar } from '@/components/common/Avatar';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { Skeleton } from '@/components/common/Skeleton';
import { AvailabilityToggle } from '@/components/provider/AvailabilityToggle';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/common/ToastProvider';
import { getProvider, updateProvider } from '@/services/firestore';
import { signOut } from '@/services/auth';
import type { Provider } from '@/types/provider';

export function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();

  const [provider, setProvider] = useState<Provider | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [toggling, setToggling] = useState(false);

  function fetchProvider() {
    if (!user) return;
    setLoading(true);
    setHasError(false);
    getProvider(user.uid)
      .then((data) => setProvider(data))
      .catch(() => {
        setHasError(true);
        showToast('Failed to load your profile.', 'error');
      })
      .finally(() => setLoading(false));
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { fetchProvider(); }, [user]);

  async function handleAvailabilityChange(val: boolean) {
    if (!user) return;
    setToggling(true);
    setProvider((prev) => (prev ? { ...prev, available: val } : prev));
    try {
      await updateProvider(user.uid, { available: val });
    } catch {
      setProvider((prev) => (prev ? { ...prev, available: !val } : prev));
      showToast('Failed to update availability.', 'error');
    } finally {
      setToggling(false);
    }
  }

  if (!user) return null;

  const displayName = provider?.displayName ?? user.displayName ?? 'Provider';

  return (
    <DashboardLayout provider={provider} pageTitle="Overview">
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {[1, 2, 3].map((n) => <Skeleton key={n} className="h-36 rounded-2xl" />)}
        </div>
      ) : hasError ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <AlertCircle size={40} className="text-slate-300 mb-4" aria-hidden="true" />
          <p className="font-sans text-slate-600 mb-4">Failed to load your profile.</p>
          <Button variant="secondary" onClick={fetchProvider}>Try Again</Button>
        </div>
      ) : (
        <>
          {/* Welcome */}
          <div className="mb-6">
            <p className="font-sans text-sm text-slate-500">Good to see you,</p>
            <h2 className="font-display font-bold text-2xl text-slate-900 mt-0.5">
              {displayName}
            </h2>
          </div>

          {/* Cards grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">

            {/* Availability */}
            <div className="bg-white rounded-2xl shadow-sm p-5 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <p className="font-sans font-semibold text-sm text-slate-900">Availability</p>
                <div className={`w-2 h-2 rounded-full ${provider?.available ? 'bg-green-500' : 'bg-slate-300'}`} />
              </div>
              <AvailabilityToggle
                available={provider?.available ?? false}
                onChange={handleAvailabilityChange}
                loading={toggling}
              />
              <p className="font-sans text-xs text-slate-400">
                {provider?.available
                  ? 'You are visible to people looking for your services.'
                  : 'Turn on to appear in search results.'}
              </p>
            </div>

            {/* Skills */}
            <div className="bg-white rounded-2xl shadow-sm p-5 flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <Wrench size={16} className="text-green-600" aria-hidden="true" />
                <p className="font-sans font-semibold text-sm text-slate-900">Your Skills</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {(provider?.skills ?? []).map((skill) => (
                  <Badge key={skill} variant="green">{skill.replace('_', ' ')}</Badge>
                ))}
                {(!provider?.skills || provider.skills.length === 0) && (
                  <p className="font-sans text-xs text-slate-400">No skills added yet.</p>
                )}
              </div>
              <Link
                to="/profile/edit"
                className="font-sans text-xs text-green-600 hover:text-green-700 flex items-center gap-1 mt-auto transition-colors"
              >
                Edit skills <ArrowRight size={12} aria-hidden="true" />
              </Link>
            </div>

            {/* Find work CTA */}
            <div className="bg-green-600 rounded-2xl p-5 flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <ClipboardList size={16} className="text-green-100" aria-hidden="true" />
                <p className="font-sans font-semibold text-sm text-white">Open Requests</p>
              </div>
              <p className="font-sans text-sm text-green-100 leading-relaxed">
                People near you are looking for skilled workers right now.
              </p>
              <Link
                to="/board"
                className="mt-auto inline-flex items-center gap-2 bg-white text-green-700 font-sans font-semibold text-sm px-4 py-2 rounded-lg hover:bg-green-50 transition-colors w-fit"
              >
                Browse Requests
                <ArrowRight size={14} aria-hidden="true" />
              </Link>
            </div>

          </div>

          {/* Profile completeness hint */}
          {provider && !provider.bio && (
            <div className="mt-5 bg-amber-50 border border-amber-200 rounded-xl px-5 py-4 flex items-start gap-3">
              <AlertCircle size={16} className="text-amber-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <p className="font-sans font-medium text-sm text-amber-900">Complete your profile</p>
                <p className="font-sans text-xs text-amber-700 mt-0.5">
                  Adding a bio helps clients understand your experience and increases your chances of being contacted.
                </p>
                <Link to="/profile/edit" className="font-sans text-xs font-medium text-amber-800 hover:text-amber-900 underline mt-2 inline-block">
                  Add a bio
                </Link>
              </div>
            </div>
          )}
        </>
      )}
    </DashboardLayout>
  );
}
