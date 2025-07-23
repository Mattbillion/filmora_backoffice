'use client';

import { useActionState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { login, LoginActionState } from '@/app/(auth)/action';
import { AuthForm } from '@/components/custom/auth-form';
import { SubmitButton } from '@/components/custom/submit-button';

export default function Page() {
  const router = useRouter();

  const [state, formAction] = useActionState<LoginActionState, FormData>(
    login,
    {
      status: 'idle',
    },
  );

  useEffect(() => {
    if (state.status === 'failed') {
      toast.error('Invalid credentials!');
    } else if (state.status === 'invalid_data') {
      toast.error('Failed validating your submission!');
    } else if (state.status === 'success') {
      router.refresh();
    }
  }, [state?.status, router]);

  const handleSubmit = (formData: FormData) => {
    formAction(formData);
  };

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-background">
      <div className="flex w-full max-w-md flex-col gap-8 overflow-hidden rounded-2xl">
        <div className="flex flex-col items-center justify-center gap-2 px-4 text-center sm:px-16">
          <h3 className="text-xl font-semibold dark:text-zinc-50">Sign In</h3>
          <p className="text-sm text-gray-500 dark:text-zinc-400">
            Use your username and password to sign in
          </p>
        </div>
        <AuthForm action={handleSubmit} defaultEmail={''}>
          <SubmitButton>Sign in</SubmitButton>
        </AuthForm>
      </div>
    </div>
  );
}
