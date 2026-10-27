import React from 'react';
import { MapPin, Clock, MessageCircle } from 'lucide-react';
import { Badge } from '@/components/common/Badge';
import type { ServiceRequest } from '@/types/request';
import { relativeTime } from '@/utils/time';
import { generateWhatsAppLink, providerContactMessage } from '@/utils/whatsapp';

interface RequestCardProps {
  request: ServiceRequest;
  categoryLabel: string;
}

export function RequestCard({ request, categoryLabel }: RequestCardProps) {
  const [firstSentence, ...rest] = request.description.split(/(?<=[.!?])\s+/);
  const remainder = rest.join(' ');
  const waLink = request.requesterWhatsapp
    ? generateWhatsAppLink(
        request.requesterWhatsapp,
        providerContactMessage(request.serviceType, request.locationName),
      )
    : null;

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <div className="flex items-center justify-between gap-4">
        <Badge variant="green">{categoryLabel}</Badge>
        <span className="font-sans text-xs text-slate-400 flex-shrink-0">
          {relativeTime(request.createdAt.toDate())}
        </span>
      </div>
      <div className="mt-3">
        <p className="font-display font-medium text-slate-900 text-base">{firstSentence}</p>
        {remainder && (
          <p className="font-sans text-sm text-slate-600 line-clamp-2 mt-1">{remainder}</p>
        )}
      </div>
      <div className="mt-3 flex gap-4 text-xs text-slate-500">
        <span className="flex items-center gap-1">
          <MapPin size={12} aria-hidden="true" />
          {request.locationName}
        </span>
        <span className="flex items-center gap-1">
          <Clock size={12} aria-hidden="true" />
          {request.estimatedHours}h estimated
        </span>
      </div>
      {waLink && (
        <div className="mt-4">
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full inline-flex items-center justify-center gap-2 rounded-lg font-semibold font-sans text-sm px-5 py-2.5 min-h-[44px] bg-[#25D366] text-white hover:bg-[#128C7E] transition-colors duration-150"
          >
            <MessageCircle size={16} aria-hidden="true" />
            Contact on WhatsApp
          </a>
        </div>
      )}
    </div>
  );
}
