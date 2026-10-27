import React from 'react';
import { MapPin, Navigation, MessageCircle, Mail } from 'lucide-react';
import { Avatar } from '@/components/common/Avatar';
import { Badge } from '@/components/common/Badge';
import type { MatchResult } from '@/types/match';
import type { Provider } from '@/types/provider';
import { generateWhatsAppLink, requesterContactMessage } from '@/utils/whatsapp';

interface ProviderCardProps {
  result: MatchResult;
  // Provider is passed separately so contact details are not stored in the publicly-readable
  // match document. Resolved from the providers collection at display time.
  provider: Provider;
  serviceType: string;
  requestLocationName: string;
}

export function ProviderCard({ result, provider, serviceType, requestLocationName }: ProviderCardProps) {
  const MAX_SKILLS = 4;
  const visibleSkills = result.skills.slice(0, MAX_SKILLS);
  const extraCount = result.skills.length - MAX_SKILLS;
  const waLink = generateWhatsAppLink(
    provider.whatsappNumber,
    requesterContactMessage(result.displayName, serviceType, requestLocationName),
  );

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <div className="flex items-start gap-4">
        <Avatar name={result.displayName} size="lg" />
        <div className="flex-1 min-w-0">
          <h3 className="font-display font-semibold text-lg text-slate-900">{result.displayName}</h3>
          <div className="flex items-center gap-1 mt-0.5">
            <MapPin size={16} className="text-slate-400 flex-shrink-0" aria-hidden="true" />
            <span className="font-sans text-sm text-slate-500 truncate">{result.locationName}</span>
          </div>
          <div className="flex items-center gap-1 mt-0.5">
            <Navigation size={14} className="text-slate-400 flex-shrink-0" aria-hidden="true" />
            <span className="font-sans text-xs text-slate-500">{result.distanceKm.toFixed(1)}km away</span>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mt-4">
        {visibleSkills.map(skill => (
          <Badge key={skill} variant="green">{skill}</Badge>
        ))}
        {extraCount > 0 && <Badge variant="slate">+{extraCount} more</Badge>}
      </div>

      <div className="mt-4">
        <span className="font-sans text-xs text-slate-500">Match quality</span>
        <div className="mt-1 h-1.5 rounded-full bg-slate-200 overflow-hidden">
          {/* Width is dynamic — only safe use of inline style in the codebase, no design-system class covers arbitrary percentages */}
          <div
            className="h-full bg-green-500 rounded-full transition-all"
            style={{ width: `${(result.finalScore * 100).toFixed(0)}%` }}
          />
        </div>
      </div>

      <div className="mt-4 flex flex-col sm:flex-row gap-3">
        <a
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg font-semibold font-sans text-sm px-5 py-2.5 min-h-[44px] bg-[#25D366] text-white hover:bg-[#128C7E] transition-colors duration-150"
        >
          <MessageCircle size={16} aria-hidden="true" />
          Contact on WhatsApp
        </a>
        <a
          href={`mailto:${provider.email}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 rounded-lg font-semibold font-sans text-sm px-5 py-2.5 min-h-[44px] border border-green-600 text-green-600 hover:bg-green-50 transition-colors duration-150"
        >
          <Mail size={16} aria-hidden="true" />
          Email
        </a>
      </div>
    </div>
  );
}
