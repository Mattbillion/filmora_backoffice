'use server';

// import { signIn } from "@/lib/auth";
import { z } from 'zod';

import { validateSchema } from '@/lib/utils';

import { signIn } from './auth';
import { authFormSchema } from './schema';

export interface LoginActionState {
  status: 'idle' | 'in_progress' | 'success' | 'failed' | 'invalid_data';
}

export const login = async (
  _: LoginActionState,
  formData: FormData,
): Promise<LoginActionState> => {
  try {
    const validatedData = validateSchema(authFormSchema, formData);

    await signIn('credentials', {
      username: validatedData.username,
      password: validatedData.password,
      redirect: false,
    });

    return { status: 'success' };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { status: 'invalid_data' };
    }

    return { status: 'failed' };
  }
};

export interface RegisterActionState {
  status:
    | 'idle'
    | 'in_progress'
    | 'success'
    | 'failed'
    | 'user_exists'
    | 'invalid_data';
}

// export const register = async (
//   _: RegisterActionState,
//   formData: FormData
// ): Promise<RegisterActionState> => {
//   try {
//     const validatedData = authFormSchema.parse({
//       email: formData.get("email"),
//       password: formData.get("password"),
//     });

//     let [user] = await getUser(validatedData.email);

//     if (user) {
//       return { status: "user_exists" } as RegisterActionState;
//     } else {
//       await createUser(validatedData.email, validatedData.password);
//       await signIn("credentials", {
//         email: validatedData.email,
//         password: validatedData.password,
//         redirect: false,
//       });

//       return { status: "success" };
//     }
//   } catch (error) {
//     if (error instanceof z.ZodError) {
//       return { status: "invalid_data" };
//     }

//     return { status: "failed" };
//   }
// };
