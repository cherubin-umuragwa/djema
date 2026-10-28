import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, MapPin, Pencil, AlertCircle } from 'lucide-react';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { Avatar } from '@/components/common/Avatar';
import { Button } from '@/components/common/Button';
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
  const [loadingProvider, setLoadingProvider] = useState(true);
  const [toggling, setToggling] = useState(false);
  const [providerError, setProviderError] = useState<boolean>(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    setLoadingProvider(true);
    getProvider(user.uid)
      .then((data) => setProvider(data))
      .catch(() => {
        showToast('Failed to load your profile.', 'error');
        setProviderError(true);
      })
      .finally(() => setLoadingProvider(false));
  }, [user, navigate, showToast]);

  function retryFetch() {
    if (!user) return;
    setProviderError(false);
    setLoadingProvider(true);
    getProvider(user.uid)
      .then((data) => setProvider(data))
      .catch(() => {
        showToast('Failed to load your profile.', 'error');
        setProviderError(true);
      })
      .finally(() => setLoadingProvider(false));
  }

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

  async function handleSignOut() {
    await signOut();
    navigate('/');
  }

  if (!user) return null;

  return (
    <PageWrapper className="max-w-2xl">
      {loadingProvider ? (
        <div className="flex flex-col gap-4">
          <div className="animate-pulse bg-slate-200 rounded-xl h-12 w-full" />
          <div className="animate-pulse bg-slate-200 rounded-xl h-24 w-full" />
          <div className="animate-pulse bg-slate-200 rounded-xl h-10 w-48" />
        </div>
      ) : providerError ? (
        <div className="flex flex-col items-center gap-4 py-12 text-center">
          <AlertCircle size={32} className="text-slate-400" aria-hidden="true" />
          <p className="font-sans text-slate-600">Failed to load your profile.</p>
          <Button variant="secondary" onClick={retryFetch}>Try Again</Button>
        </div>
      ) : (
        <>
          {/* Section 1 — Welcome header */}
          <div className="flex items-center gap-4">
            <Avatar name={provider?.displayName ?? user.displayName ?? 'Provider'} size="lg" />
            <div>
              <h1 className="font-display text-2xl font-bold text-slate-900">
                Welcome back, {provider?.displayName ?? 'Provider'}
              </h1>
              <p className="font-sans text-sm text-slate-500 flex items-center gap-1 mt-0.5">
                <MapPin size={14} aria-hidden="true" />
                {provider?.locationName}
              </p>
            </div>
          </div>

          {/* Section 2 — Availability */}
          <div className="mt-6 bg-slate-50 rounded-xl p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-sans font-semibold text-sm text-slate-900">Availability</p>
                <p className="font-sans text-xs text-slate-500 mt-0.5">Toggle to show providers you are open for work</p>
              </div>
              <AvailabilityToggle
                available={provider?.available ?? false}
                onChange={handleAvailabilityChange}
                loading={toggling}
              />
            </div>
          </div>

          <hr className="border-t border-slate-100 my-8" />

          {/* Section 3 — Open requests CTA */}
          <h2 className="font-display text-xl font-semibold text-slate-900">Find work near you</h2>
          <p className="font-sans text-sm text-slate-600 mt-1">Browse open requests that match your skills and reach out directly.</p>
          <Button variant="primary" href="/board" className="mt-4">Browse Open Requests</Button>

          <hr className="border-t border-slate-100 my-8" />

          {/* Section 4 — Quick actions */}
          <div className="flex gap-3 flex-wrap">
            <Button variant="ghost" href="/profile/edit" leftIcon={<Pencil size={16} />}>Edit Profile</Button>
            <Button variant="ghost" onClick={() => void handleSignOut()} leftIcon={<LogOut size={16} />}>Sign Out</Button>
          </div>
        </>
      )}
    </PageWrapper>
  );
}
