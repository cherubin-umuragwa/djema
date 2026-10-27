import { z } from 'zod';

const e164Regex = /^\+[1-9]\d{7,14}$/;

export const e164PhoneSchema = z
  .string()
  .regex(e164Regex, 'Enter a valid phone number starting with + (e.g. +256700123456)');

export const emailSchema = z.string().email('Enter a valid email address');

export const providerSchema = z.object({
  displayName: z.string().min(2, 'Name must be at least 2 characters').max(60, 'Name is too long'),
  email: emailSchema,
  whatsappNumber: e164PhoneSchema,
  bio: z.string().min(1, 'Bio is required').max(500, 'Bio must be 500 characters or fewer'),
  skills: z
    .array(z.string())
    .min(1, 'Select at least one skill')
    .max(10, 'You can select up to 10 skills'),
  locationName: z.string().min(1, 'Location is required'),
  lat: z.number(),
  lng: z.number(),
  profilePhotoUrl: z.string().url().optional(),
});

export const requestSchema = z.object({
  serviceType: z.string().min(1, 'Select a service type'),
  description: z
    .string()
    .min(1, 'Description is required')
    .max(1000, 'Description must be 1000 characters or fewer'),
  locationName: z.string().min(1, 'Location is required'),
  lat: z.number(),
  lng: z.number(),
  estimatedHours: z.number().min(0.5).max(72),
  photoFile: z.instanceof(File).optional(),
});

export const publicPostSchema = z.object({
  requesterWhatsapp: e164PhoneSchema,
  requesterEmail: emailSchema.optional().or(z.literal('')),
});

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const registerAccountSchema = z
  .object({
    email: emailSchema,
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type ProviderFormValues = z.infer<typeof providerSchema>;
export type RequestFormValues = z.infer<typeof requestSchema>;
export type PublicPostValues = z.infer<typeof publicPostSchema>;
export type LoginValues = z.infer<typeof loginSchema>;
export type RegisterAccountValues = z.infer<typeof registerAccountSchema>;
