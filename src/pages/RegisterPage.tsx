import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';
import type { FirebaseError } from 'firebase/app';
import { GeoPoint } from 'firebase/firestore';
import { Input } from '@/components/common/Input';
import { Textarea } from '@/components/common/Textarea';
import { Button } from '@/components/common/Button';
import { LocationInput } from '@/components/common/LocationInput';
import { SkillPicker } from '@/components/provider/SkillPicker';
import { useCategories } from '@/hooks/useCategories';
import { useToast } from '@/components/common/ToastProvider';
import { registerWithEmail, signInWithGoogle } from '@/services/auth';
import { createProvider } from '@/services/firestore';
import { useAuth } from '@/hooks/useAuth';

// ─── Step 1 schema ──────────────────────────────────────────────────────────
const step1Schema = z
  .object({
    email: z.string().email('Enter a valid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type Step1Values = z.infer<typeof step1Schema>;

// ─── Step 2 schema ──────────────────────────────────────────────────────────
const step2Schema = z.object({
  displayName: z.string().min(2, 'Name must be at least 2 characters'),
  skills: z.array(z.string()).min(1, 'Select at least one skill'),
  locationName: z.string().min(1, 'Select a location from the list'),
  lat: z.number(),
  lng: z.number(),
  whatsappNumber: z
    .string()
    .regex(/^\+[1-9]\d{7,14}$/, 'Enter a valid number like +256 700 000 000'),
  bio: z
    .string()
    .min(10, 'Bio must be at least 10 characters')
    .max(500, 'Bio must be 500 characters or less'),
});

type Step2Values = z.infer<typeof step2Schema>;

function mapAuthError(code: string): string {
  switch (code) {
    case 'auth/email-already-in-use':
      return 'An account with this email already exists.';
    case 'auth/invalid-email':
      return 'Invalid email address.';
    case 'auth/weak-password':
      return 'Password must be at least 6 characters.';
    case 'auth/network-request-failed':
      return 'Network error. Check your connection.';
    default:
      return 'Something went wrong. Please try again.';
  }
}

export function RegisterPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { categories } = useCategories();
  const { showToast } = useToast();

  const [step, setStep] = useState<1 | 2>(1);
  const [uid, setUid] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // ─── Step 1 form ──────────────────────────────────────────────────────────
  const {
    register: reg1,
    handleSubmit: handleSubmit1,
    formState: { errors: errors1, isSubmitting: submitting1 },
  } = useForm<Step1Values>({ resolver: zodResolver(step1Schema) });

  async function onStep1(data: Step1Values) {
    setFormError(null);
    try {
      const cred = await registerWithEmail(data.email, data.password);
      setUid(cred.user.uid);
      setStep(2);
    } catch (err) {
      const code = (err as FirebaseError).code ?? '';
      setFormError(mapAuthError(code));
    }
  }

  async function handleGoogle() {
    setFormError(null);
    try {
      const cred = await signInWithGoogle();
      setUid(cred.user.uid);
      setStep(2);
    } catch (err) {
      const code = (err as FirebaseError).code ?? '';
      setFormError(mapAuthError(code));
    }
  }

  // ─── Step 2 form ──────────────────────────────────────────────────────────
  const {
    register: reg2,
    handleSubmit: handleSubmit2,
    control,
    setValue,
    watch,
    formState: { errors: errors2, isSubmitting: submitting2 },
  } = useForm<Step2Values>({
    resolver: zodResolver(step2Schema),
    defaultValues: { skills: [], lat: 0, lng: 0, locationName: '' },
  });

  const bioValue = watch('bio', '');

  async function onStep2(data: Step2Values) {
    setFormError(null);
    const providerUid = uid || user?.uid || '';
    const providerEmail = user?.email ?? '';
    try {
      await createProvider(providerUid, {
        displayName: data.displayName,
        email: providerEmail,
        whatsappNumber: data.whatsappNumber,
        bio: data.bio,
        skills: data.skills,
        location: new GeoPoint(data.lat || 0.3476, data.lng || 32.5825),
        locationName: data.locationName,
        available: true,
        isActive: true,
      });
      showToast('Welcome to Djema! Your profile is live.', 'success');
      navigate('/dashboard');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to save profile. Try again.';
      setFormError(message);
    }
  }

  return (
    <main className="max-w-md mx-auto py-12 px-4 flex flex-col gap-6">
      {step === 1 ? (
        <>
          <div>
            <h1 className="font-display text-2xl font-bold text-slate-900">
              Create your provider account
            </h1>
            <p className="font-sans text-sm text-slate-600 mt-2">
              Join Djema and connect with people who need your skills.
            </p>
          </div>

          {formError && (
            <div
              className="bg-red-50 text-red-700 rounded-lg px-4 py-3 font-sans text-sm flex items-center gap-2"
              role="alert"
            >
              <AlertCircle size={16} aria-hidden="true" />
              {formError}
            </div>
          )}

          <form onSubmit={handleSubmit1(onStep1)} noValidate className="flex flex-col gap-4">
            <Input
              label="Email address"
              type="email"
              autoComplete="email"
              required
              error={errors1.email?.message}
              {...reg1('email')}
            />

            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                required
                error={errors1.password?.message}
                {...reg1('password')}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-9 text-slate-400 hover:text-slate-600 focus:outline-none"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <div className="relative">
              <Input
                label="Confirm password"
                type={showConfirm ? 'text' : 'password'}
                autoComplete="new-password"
                required
                error={errors1.confirmPassword?.message}
                {...reg1('confirmPassword')}
              />
              <button
                type="button"
                onClick={() => setShowConfirm((v) => !v)}
                className="absolute right-3 top-9 text-slate-400 hover:text-slate-600 focus:outline-none"
                aria-label={showConfirm ? 'Hide confirm password' : 'Show confirm password'}
              >
                {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <Button type="submit" variant="primary" loading={submitting1} className="w-full">
              Continue
            </Button>
          </form>

          {/* Divider */}
          <div className="relative flex items-center">
            <hr className="flex-1 border-slate-200" />
            <span className="absolute left-1/2 -translate-x-1/2 bg-white px-2 font-sans text-xs text-slate-500">
              or
            </span>
          </div>

          <Button
            type="button"
            variant="secondary"
            className="w-full"
            onClick={() => void handleGoogle()}
          >
            Continue with Google
          </Button>

          <p className="font-sans text-sm text-center">
            Already have an account?{' '}
            <Link to="/login" className="text-green-600 hover:underline">
              Sign in
            </Link>
          </p>
        </>
      ) : (
        <>
          <div>
            <p className="font-sans text-sm text-slate-500 text-right mb-2">Step 2 of 2</p>
            <h1 className="font-display text-2xl font-bold text-slate-900">
              Tell us about yourself
            </h1>
            <p className="font-sans text-sm text-slate-600 mt-2">
              Help clients find you by completing your profile.
            </p>
          </div>

          {formError && (
            <div
              className="bg-red-50 text-red-700 rounded-lg px-4 py-3 font-sans text-sm flex items-center gap-2"
              role="alert"
            >
              <AlertCircle size={16} aria-hidden="true" />
              {formError}
            </div>
          )}

          <form onSubmit={handleSubmit2(onStep2)} noValidate className="flex flex-col gap-4">
            <Input
              label="Full name"
              type="text"
              autoComplete="name"
              required
              error={errors2.displayName?.message}
              {...reg2('displayName')}
            />

            <div>
              <p className="block font-sans font-medium text-sm text-slate-700 mb-1.5">
                Skills <span className="text-red-500 ml-0.5">*</span>
              </p>
              <Controller
                name="skills"
                control={control}
                render={({ field }) => (
                  <SkillPicker
                    value={field.value}
                    onChange={field.onChange}
                    categories={categories}
                    error={errors2.skills?.message}
                  />
                )}
              />
            </div>

            <div>
              <p className="block font-sans font-medium text-sm text-slate-700 mb-1.5">
                Location <span className="text-red-500 ml-0.5">*</span>
              </p>
              <Controller
                name="locationName"
                control={control}
                render={({ field }) => (
                  <LocationInput
                    value={field.value}
                    onLocationSelect={(loc) => {
                      field.onChange(loc.locationName);
                      setValue('lat', loc.lat, { shouldValidate: true });
                      setValue('lng', loc.lng, { shouldValidate: true });
                    }}
                    error={errors2.locationName?.message}
                    label="Location"
                    required
                  />
                )}
              />
            </div>

            <Input
              label="WhatsApp number"
              type="tel"
              placeholder="+256 700 000 000"
              required
              error={errors2.whatsappNumber?.message}
              {...reg2('whatsappNumber')}
            />

            <Textarea
              label="About you"
              placeholder="Describe your experience, skills, and how you can help..."
              maxLength={500}
              required
              value={bioValue}
              error={errors2.bio?.message}
              {...reg2('bio')}
            />

            <Button type="submit" variant="primary" loading={submitting2} className="w-full">
              Complete Registration
            </Button>
          </form>
        </>
      )}
    </main>
  );
}
