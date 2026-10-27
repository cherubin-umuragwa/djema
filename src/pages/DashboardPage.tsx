import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogOut, Pencil } from 'lucide-react';
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

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    setLoadingProvider(true);
    getProvider(user.uid)
      .then((data) => setProvider(data))
      .catch(() => showToast('Failed to load your profile.', 'error'))
      .finally(() => setLoadingProvider(false));
  }, [user, navigate, showToast]);

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
    <PageWrapper>
      {loadingProvider ? (
        <div className="flex flex-col gap-4">
          <div className="animate-pulse bg-slate-200 rounded-lg h-8 w-48" />
          <div className="animate-pulse bg-slate-200 rounded-lg h-6 w-32" />
          <div className="animate-pulse bg-slate-200 rounded-lg h-12 w-full" />
        </div>
      ) : (
        <>
          {/* Header row */}
          <div className="flex items-center gap-4">
            <Avatar name={provider?.displayName ?? user.displayName ?? 'Provider'} size="lg" />
            <h1 className="font-display text-2xl font-bold text-slate-900">
              Welcome back, {provider?.displayName ?? 'Provider'}
            </h1>
          </div>

          {/* Availability */}
          <div className="mt-4">
            <AvailabilityToggle
              available={provider?.available ?? false}
              onChange={handleAvailabilityChange}
              loading={toggling}
            />
          </div>

          <hr className="border-slate-100 my-6" />

          {/* Open requests section */}
          <h2 className="font-display text-xl font-semibold text-slate-900">
            Open requests matching your skills
          </h2>
          <p className="font-sans text-sm text-slate-600 mt-2">
            Browse the board to find work near you.
          </p>
          <div className="mt-4">
            <Button variant="primary" href="/board">
              Browse Open Requests
            </Button>
          </div>

          <hr className="border-slate-100 my-6" />

          {/* Actions */}
          <div className="flex items-center gap-3 flex-wrap">
            <Button variant="ghost" href="/profile/edit" leftIcon={<Pencil size={16} />}>
              Edit Profile
            </Button>
            <Button
              variant="ghost"
              leftIcon={<LogOut size={16} />}
              onClick={() => void handleSignOut()}
            >
              Sign Out
            </Button>
          </div>
        </>
      )}
    </PageWrapper>
  );
}
