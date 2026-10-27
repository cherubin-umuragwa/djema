import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { signInWithEmail, signInWithGoogle } from '@/services/auth';

const loginSchema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginValues = z.infer<typeof loginSchema>;

function mapAuthError(code: string, fallback: string): string {
  switch (code) {
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'Incorrect email or password.';
    case 'auth/network-request-failed':
      return 'Network error. Check your connection.';
    default:
      return fallback || 'Something went wrong. Please try again.';
  }
}

export function LoginPage() {
  const navigate = useNavigate();
  const [formError, setFormError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({ resolver: zodResolver(loginSchema) });

  async function onSubmit(data: LoginValues) {
    setFormError(null);
    try {
      await signInWithEmail(data.email, data.password);
      navigate('/dashboard');
    } catch (err) {
      const code = err instanceof Error && 'code' in err ? (err as { code: string }).code : '';
      const message = err instanceof Error ? err.message : 'Something went wrong. Please try again.';
      setFormError(mapAuthError(code, message));
    }
  }

  async function handleGoogle() {
    setFormError(null);
    try {
      await signInWithGoogle();
      navigate('/dashboard');
    } catch (err) {
      const code = err instanceof Error && 'code' in err ? (err as { code: string }).code : '';
      const message = err instanceof Error ? err.message : 'Something went wrong. Please try again.';
      setFormError(mapAuthError(code, message));
    }
  }

  return (
    <main className="max-w-sm mx-auto py-12 px-4 flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-slate-900">Welcome back</h1>
        <p className="font-sans text-sm text-slate-600 mt-2">
          Sign in to browse requests and find work.
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

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
        <Input
          label="Email address"
          type="email"
          autoComplete="email"
          required
          error={errors.email?.message}
          {...register('email')}
        />

        <div className="relative">
          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            required
            error={errors.password?.message}
            {...register('password')}
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

        <Button type="submit" variant="primary" loading={isSubmitting} className="w-full">
          Sign In
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
        Sign in with Google
      </Button>

      <p className="font-sans text-sm text-center">
        New to Djema?{' '}
        <Link to="/register" className="text-green-600 hover:underline">
          Register as a provider
        </Link>
      </p>
    </main>
  );
}
