import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { MapPin, CheckCircle2, XCircle, UserX, Mail, MessageCircle } from 'lucide-react';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { Avatar } from '@/components/common/Avatar';
import { Badge } from '@/components/common/Badge';
import { Skeleton } from '@/components/common/Skeleton';
import { Button } from '@/components/common/Button';
import { getProvider } from '@/services/firestore';
import { generateWhatsAppLink } from '@/utils/whatsapp';
import type { Provider } from '@/types/provider';

export function ProviderProfilePage() {
  const { id } = useParams<{ id: string }>();
  const [provider, setProvider] = useState<Provider | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) {
      setNotFound(true);
      setLoading(false);
      return;
    }
    getProvider(id)
      .then((data) => {
        if (!data) setNotFound(true);
        else setProvider(data);
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <PageWrapper>
        <div className="flex items-center gap-4 mb-6">
          <Skeleton className="w-14 h-14 rounded-full" />
          <div className="flex flex-col gap-2">
            <Skeleton className="w-48 h-6 rounded-lg" />
            <Skeleton className="w-32 h-4 rounded-lg" />
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mb-6">
          {[1, 2, 3].map((n) => (
            <Skeleton key={n} className="w-20 h-7 rounded-md" />
          ))}
        </div>
        <Skeleton className="w-full h-24 rounded-xl" />
      </PageWrapper>
    );
  }

  if (notFound || !provider) {
    return (
      <PageWrapper className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <UserX size={48} className="text-slate-300 mb-4" aria-hidden="true" />
        <h1 className="font-display text-xl font-semibold text-slate-900">Provider not found.</h1>
        <p className="font-sans text-sm text-slate-500 mt-2">
          This profile may have been removed or the link is incorrect.
        </p>
        <div className="mt-6">
          <Button variant="ghost" href="/">Go Home</Button>
        </div>
      </PageWrapper>
    );
  }

  const waLink = generateWhatsAppLink(
    provider.whatsappNumber,
    `Hi ${provider.displayName}, I found your profile on Djema. I'd like to discuss a service request with you.`,
  );

  return (
    <PageWrapper>
      <div className="max-w-2xl">
        {/* Header */}
        <div className="flex items-start gap-5">
          <Avatar name={provider.displayName} size="lg" />
          <div className="flex-1 min-w-0">
            <h1 className="font-display font-bold text-2xl text-slate-900">
              {provider.displayName}
            </h1>
            <div className="flex items-center gap-1.5 mt-1">
              <MapPin size={14} className="text-slate-400 flex-shrink-0" aria-hidden="true" />
              <span className="font-sans text-sm text-slate-500">{provider.locationName}</span>
            </div>
            <div className="flex items-center gap-1.5 mt-2">
              {provider.available ? (
                <>
                  <CheckCircle2 size={14} className="text-green-600" aria-hidden="true" />
                  <span className="font-sans text-xs font-medium text-green-600">Available for work</span>
                </>
              ) : (
                <>
                  <XCircle size={14} className="text-slate-400" aria-hidden="true" />
                  <span className="font-sans text-xs font-medium text-slate-500">Not available</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Skills */}
        <div className="mt-8">
          <h2 className="font-display font-semibold text-lg text-slate-900 mb-3">
            Skills and services
          </h2>
          <div className="flex flex-wrap gap-2">
            {provider.skills.map((skill) => (
              <Badge key={skill} variant="green">{skill.replace('_', ' ')}</Badge>
            ))}
          </div>
        </div>

        {/* Bio */}
        {provider.bio && (
          <div className="mt-8">
            <h2 className="font-display font-semibold text-lg text-slate-900 mb-3">
              About
            </h2>
            <p className="font-sans text-slate-700 leading-relaxed">{provider.bio}</p>
          </div>
        )}

        {/* Contact — only shown when available */}
        {provider.available && (
          <div className="mt-8 pt-8 border-t border-slate-100">
            <h2 className="font-display font-semibold text-lg text-slate-900 mb-4">
              Get in touch
            </h2>
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-lg font-semibold font-sans text-sm px-5 py-2.5 min-h-[44px] bg-[#25D366] text-white hover:bg-[#128C7E] transition-colors"
              >
                <MessageCircle size={16} aria-hidden="true" />
                Contact on WhatsApp
              </a>
              <a
                href={`mailto:${provider.email}`}
                className="inline-flex items-center justify-center gap-2 rounded-lg font-semibold font-sans text-sm px-5 py-2.5 min-h-[44px] border border-green-600 text-green-600 hover:bg-green-50 transition-colors"
              >
                <Mail size={16} aria-hidden="true" />
                Send Email
              </a>
            </div>
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
