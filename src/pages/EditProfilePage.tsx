import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AlertCircle } from 'lucide-react';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { Input } from '@/components/common/Input';
import { Textarea } from '@/components/common/Textarea';
import { Button } from '@/components/common/Button';
import { LocationInput } from '@/components/common/LocationInput';
import { SkillPicker } from '@/components/provider/SkillPicker';
import { useCategories } from '@/hooks/useCategories';
import { useToast } from '@/components/common/ToastProvider';
import { useAuth } from '@/hooks/useAuth';
import { getProvider, updateProvider, GeoPoint } from '@/services/firestore';

const profileSchema = z.object({
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

type ProfileValues = z.infer<typeof profileSchema>;

export function EditProfilePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { categories } = useCategories();
  const { showToast } = useToast();
  const [formError, setFormError] = useState<string | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { skills: [], lat: 0, lng: 0, locationName: '' },
  });

  const bioValue = watch('bio', '');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    setLoadingProfile(true);
    getProvider(user.uid)
      .then((data) => {
        if (data) {
          reset({
            displayName: data.displayName,
            skills: data.skills,
            locationName: data.locationName,
            lat: data.location.latitude,
            lng: data.location.longitude,
            whatsappNumber: data.whatsappNumber,
            bio: data.bio,
          });
        }
      })
      .catch(() => showToast('Failed to load your profile.', 'error'))
      .finally(() => setLoadingProfile(false));
  }, [user, navigate, reset, showToast]);

  async function onSubmit(data: ProfileValues) {
    if (!user) return;
    setFormError(null);
    try {
      await updateProvider(user.uid, {
        displayName: data.displayName,
        skills: data.skills,
        location: new GeoPoint(data.lat || 0.3476, data.lng || 32.5825),
        locationName: data.locationName,
        whatsappNumber: data.whatsappNumber,
        bio: data.bio,
      });
      showToast('Profile updated.', 'success');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update profile. Try again.';
      setFormError(message);
    }
  }

  if (!user) return null;

  return (
    <PageWrapper>
      <div className="max-w-md mx-auto py-12 px-4 flex flex-col gap-6">
        <h1 className="font-display text-2xl font-bold text-slate-900">Edit your profile</h1>

        {loadingProfile ? (
          <div className="flex flex-col gap-4">
            <div className="animate-pulse bg-slate-200 rounded-lg h-10 w-full" />
            <div className="animate-pulse bg-slate-200 rounded-lg h-10 w-full" />
            <div className="animate-pulse bg-slate-200 rounded-lg h-24 w-full" />
          </div>
        ) : (
          <>
            {formError && (
              <div
                className="bg-red-50 text-red-700 rounded-lg px-4 py-3 font-sans text-sm flex items-center gap-2"
                role="alert"
              >
                <AlertCircle size={16} aria-hidden="true" />
                {formError}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
              <Input
                label="Full name"
                type="text"
                autoComplete="name"
                required
                error={errors.displayName?.message}
                {...register('displayName')}
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
                      error={errors.skills?.message}
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
                      error={errors.locationName?.message}
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
                error={errors.whatsappNumber?.message}
                {...register('whatsappNumber')}
              />

              <Textarea
                label="About you"
                placeholder="Describe your experience, skills, and how you can help..."
                maxLength={500}
                required
                value={bioValue}
                error={errors.bio?.message}
                {...register('bio')}
              />

              <Button type="submit" variant="primary" loading={isSubmitting} className="w-full">
                Save Changes
              </Button>
            </form>
          </>
        )}
      </div>
    </PageWrapper>
  );
}
