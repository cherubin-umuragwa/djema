import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { Button } from '@/components/common/Button';
import { Textarea } from '@/components/common/Textarea';
import { LocationInput } from '@/components/common/LocationInput';
import { CategoryPicker } from '@/components/request/CategoryPicker';
import { AlertCircle } from 'lucide-react';
import { useCategories } from '@/hooks/useCategories';
import { createRequest, GeoPoint } from '@/services/firestore';
import { getSessionToken } from '@/utils/session';

const schema = z.object({
  serviceType: z.string().min(1, 'Please select a service'),
  description: z.string().min(10, 'Please describe what you need (min 10 characters)').max(1000),
  locationName: z.string().min(2, 'Please enter your location'),
  lat: z.number(),
  lng: z.number(),
  estimatedHours: z.number().min(0.5).max(72),
});

type FormValues = z.infer<typeof schema>;

export function PostRequestPage() {
  const navigate = useNavigate();
  const { categories } = useCategories();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { serviceType: '', description: '', locationName: '', lat: 0, lng: 0, estimatedHours: 1 },
  });

  const locationName = watch('locationName');
  const description = watch('description');

  async function onSubmit(values: FormValues) {
    setSubmitError(null);
    try {
      const sessionToken = getSessionToken();
      const location = new GeoPoint(values.lat, values.lng);
      const requestId = await createRequest({
        sessionToken,
        serviceType: values.serviceType,
        description: values.description,
        location,
        locationName: values.locationName,
        estimatedHours: values.estimatedHours,
        requesterWhatsapp: null,
        requesterEmail: null,
      });
      navigate(`/matches/${requestId}`);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    }
  }

  return (
    <PageWrapper>
      <div className="max-w-2xl mx-auto">
        <h1 className="font-display text-3xl text-slate-900">What do you need help with?</h1>
        <p className="font-sans text-slate-600 mt-2">Describe your request and we'll find skilled providers near you in Kampala.</p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 flex flex-col gap-8">
          <div>
            <label className="block font-sans font-medium text-sm text-slate-700 mb-3">
              Select a service <span className="text-red-500">*</span>
            </label>
            <Controller
              name="serviceType"
              control={control}
              render={({ field }) => (
                <CategoryPicker
                  value={field.value}
                  onChange={field.onChange}
                  categories={categories}
                  error={errors.serviceType?.message}
                />
              )}
            />
          </div>

          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <Textarea
                label="Describe what you need"
                placeholder="E.g. My kitchen sink pipe is leaking under the cabinet. I need it fixed today."
                maxLength={1000}
                required
                error={errors.description?.message}
                value={description}
                {...field}
              />
            )}
          />

          <Controller
            name="locationName"
            control={control}
            render={() => (
              <LocationInput
                value={locationName ?? ''}
                onLocationSelect={(loc) => {
                  setValue('locationName', loc.locationName, { shouldValidate: true });
                  setValue('lat', loc.lat);
                  setValue('lng', loc.lng);
                }}
                error={errors.locationName?.message}
                label="Where are you located?"
                required
              />
            )}
          />

          <div>
            <label htmlFor="estimatedHours" className="block font-sans font-medium text-sm text-slate-700 mb-1.5">
              How long do you think it will take?
            </label>
            <select
              id="estimatedHours"
              className="rounded-lg border border-slate-300 px-4 py-3 font-sans text-base w-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors duration-150 bg-white text-slate-900"
              {...register('estimatedHours', { valueAsNumber: true })}
            >
              <option value={0.5}>0.5 hours</option>
              <option value={1}>1 hour</option>
              <option value={2}>2 hours</option>
              <option value={4}>4 hours</option>
              <option value={8}>8 hours</option>
            </select>
            {errors.estimatedHours && (
              <p className="font-sans text-red-600 text-sm mt-1.5 flex items-center gap-1.5" role="alert">
                <AlertCircle size={14} aria-hidden="true" />
                {errors.estimatedHours.message}
              </p>
            )}
          </div>

          {submitError && (
            <div className="flex items-center gap-2 text-red-600 text-sm font-sans">
              <AlertCircle size={16} aria-hidden="true" />
              {submitError}
            </div>
          )}

          <div className="pb-8">
            <Button type="submit" variant="primary" size="lg" loading={isSubmitting} className="w-full sm:w-auto">
              Find Providers Near Me
            </Button>
          </div>
        </form>
      </div>
    </PageWrapper>
  );
}
