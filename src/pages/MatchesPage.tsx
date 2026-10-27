import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { ProviderCard } from '@/components/provider/ProviderCard';
import {
  getRequest,
  subscribeToMatch,
  getAvailableProviders,
  createMatch,
  updateRequest,
  Timestamp,
} from '@/services/firestore';
import { runMatching } from '@/services/matching';
import { getSessionToken } from '@/utils/session';
import type { ServiceRequest } from '@/types/request';
import type { MatchDocument, MatchResult } from '@/types/match';
import type { Provider } from '@/types/provider';

const publicFormSchema = z.object({
  whatsapp: z
    .string()
    .min(8, 'Please enter a valid WhatsApp number')
    .regex(/^\+[1-9]\d{7,14}$/, 'Use E.164 format: +256700123456'),
  email: z.string().email('Please enter a valid email').or(z.literal('')).optional(),
});
type PublicFormValues = z.infer<typeof publicFormSchema>;

type PageState = 'loading' | 'matching' | 'results' | 'no_matches' | 'posted' | 'error';

export function MatchesPage() {
  const { requestId } = useParams<{ requestId: string }>();
  const [pageState, setPageState] = useState<PageState>('loading');
  const [request, setRequest] = useState<ServiceRequest | null>(null);
  const [results, setResults] = useState<MatchResult[]>([]);
  const [providerMap, setProviderMap] = useState<Map<string, Provider>>(new Map());
  const [errorMessage, setErrorMessage] = useState<string>('');
  // Use a ref to track whether matching has started — avoids stale closure in subscribeToMatch callback
  const matchingStartedRef = useRef(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting: isPosting },
  } = useForm<PublicFormValues>({ resolver: zodResolver(publicFormSchema) });

  useEffect(() => {
    if (!requestId) {
      setPageState('error');
      setErrorMessage('No request ID found.');
      return;
    }

    const sessionToken = getSessionToken();
    let matchUnsub: (() => void) | undefined;
    // Narrow once — requestId is confirmed non-null by the early return above
    const safeRequestId = requestId;

    async function init() {
      try {
        const req = await getRequest(safeRequestId, sessionToken);
        if (!req) {
          setPageState('error');
          setErrorMessage('Request not found or access denied.');
          return;
        }
        setRequest(req);

        // Subscribe to the match document first — if it already exists (e.g. back navigation), use it
        matchUnsub = subscribeToMatch(
          safeRequestId,
          async (match: MatchDocument | null) => {
            if (match && match.status === 'completed') {
              setResults(match.results);
              setPageState('results');
              setProviderMap(prev => {
                if (prev.size === 0) {
                  getAvailableProviders().then(providers => {
                    setProviderMap(new Map(providers.map(p => [p.uid, p])));
                  }).catch(() => {/* non-fatal: contact buttons will be hidden */});
                }
                return prev;
              });
              return;
            }
            if (match && match.status === 'no_matches') {
              setPageState('no_matches');
              return;
            }
            if (!matchingStartedRef.current) {
              matchingStartedRef.current = true;
              setPageState('matching');
              try {
                const providers = await getAvailableProviders();
                const matchResults = await runMatching(req, providers);
                const map = new Map(providers.map(p => [p.uid, p]));
                setProviderMap(map);
                const matchStatus = matchResults.length > 0 ? 'completed' : 'no_matches';
                await createMatch(safeRequestId, {
                  requestId: safeRequestId,
                  sessionToken: req.sessionToken,
                  status: matchStatus,
                  results: matchResults,
                  processedAt: Timestamp.now(),
                });
                await updateRequest(safeRequestId, {
                  matchCount: matchResults.length,
                });
                if (matchResults.length > 0) {
                  setResults(matchResults);
                  setPageState('results');
                } else {
                  setPageState('no_matches');
                }
              } catch (matchErr) {
                const msg = matchErr instanceof Error ? matchErr.message : 'Matching failed';
                setPageState('error');
                setErrorMessage(msg);
              }
            }
          },
          (err) => {
            setPageState('error');
            setErrorMessage(err.message);
          },
        );
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Something went wrong';
        setPageState('error');
        setErrorMessage(msg);
      }
    }

    void init();
    return () => {
      if (matchUnsub) matchUnsub();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps -- runs once on mount
  }, [requestId]);

  async function onPublicPost(values: PublicFormValues) {
    if (!requestId) return;
    try {
      await updateRequest(requestId, {
        status: 'open',
        isPublic: true,
        requesterWhatsapp: values.whatsapp,
        requesterEmail: values.email ?? null,
      });
      setPageState('posted');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to post your request publicly.';
      setErrorMessage(msg);
      setPageState('error');
    }
  }

  if (pageState === 'loading' || pageState === 'matching') {
    return (
      <PageWrapper>
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 size={48} className="text-green-600 animate-spin" aria-hidden="true" />
          <h2 className="font-display text-xl text-slate-900 mt-6">Finding skilled providers near you...</h2>
          <p className="font-sans text-sm text-slate-500 mt-2">This usually takes a few seconds.</p>
        </div>
      </PageWrapper>
    );
  }

  if (pageState === 'error') {
    return (
      <PageWrapper>
        <div className="flex flex-col items-center justify-center py-20">
          <AlertCircle size={48} className="text-red-500" aria-hidden="true" />
          <h2 className="font-display text-xl text-slate-900 mt-6">Something went wrong</h2>
          <p className="font-sans text-sm text-slate-500 mt-2">{errorMessage}</p>
          <div className="mt-6">
            <Button variant="ghost" href="/">
              Go home
            </Button>
          </div>
        </div>
      </PageWrapper>
    );
  }

  if (pageState === 'posted') {
    return (
      <PageWrapper>
        <div className="flex flex-col items-center justify-center py-20">
          <CheckCircle2 size={48} className="text-green-600" aria-hidden="true" />
          <h2 className="font-display text-xl text-slate-900 mt-6">Your request is now live on the board.</h2>
          <p className="font-sans text-slate-600 mt-2">Providers who match your needs will contact you on WhatsApp.</p>
          <div className="mt-6">
            <Button variant="ghost" href="/board">View Open Requests Board</Button>
          </div>
        </div>
      </PageWrapper>
    );
  }

  if (pageState === 'results') {
    return (
      <PageWrapper>
        <h1 className="font-display text-3xl text-slate-900">
          We found {results.length} provider{results.length === 1 ? '' : 's'} near you
        </h1>
        <p className="font-sans text-slate-600 mt-2">Here are the best matches based on skill and location.</p>
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {results.map(r => {
            const provider = providerMap.get(r.providerId);
            if (!provider) return null;
            return (
              <ProviderCard
                key={r.providerId}
                result={r}
                provider={provider}
                serviceType={request?.serviceType ?? ''}
                requestLocationName={request?.locationName ?? ''}
              />
            );
          })}
        </div>
      </PageWrapper>
    );
  }

  // pageState === 'no_matches'
  return (
    <PageWrapper>
      <h1 className="font-display text-2xl text-slate-900">No providers found yet</h1>
      <p className="font-sans text-slate-600 mt-2">
        Post your request publicly and skilled providers will contact you when they're available.
      </p>
      <div className="mt-8 max-w-md">
        <form onSubmit={handleSubmit(onPublicPost)} className="flex flex-col gap-6">
          <Input
            label="Your WhatsApp number"
            type="tel"
            placeholder="+256700000000"
            required
            helpText="E.164 format, e.g. +256700123456"
            error={errors.whatsapp?.message}
            {...register('whatsapp')}
          />
          <Input
            label="Email (optional)"
            type="email"
            placeholder="you@example.com"
            error={errors.email?.message}
            {...register('email')}
          />
          <Button type="submit" variant="primary" size="lg" loading={isPosting} className="w-full sm:w-auto">
            Post Publicly
          </Button>
        </form>
      </div>
    </PageWrapper>
  );
}
