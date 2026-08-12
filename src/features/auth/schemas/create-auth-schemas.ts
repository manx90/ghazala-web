import { z } from 'zod';

type ValidationTranslator = (key: string) => string;

export function createLoginSchema(t: ValidationTranslator) {
  return z.object({
    email: z.string().email(t('emailInvalid')),
    password: z.string().min(1, t('passwordRequired')),
  });
}

export function createRegisterSchema(t: ValidationTranslator) {
  return z.object({
    firstName: z.string().min(2, t('firstNameMin')),
    lastName: z.string().min(2, t('lastNameMin')),
    email: z.string().email(t('emailInvalid')),
    password: z
      .string()
      .min(8, t('passwordMin'))
      .regex(/[A-Z]/, t('passwordUppercase'))
      .regex(/[a-z]/, t('passwordLowercase'))
      .regex(/[0-9]/, t('passwordNumber')),
  });
}

export function createForgotPasswordSchema(t: ValidationTranslator) {
  return z.object({
    email: z.string().email(t('emailInvalid')),
  });
}

export function createResetPasswordSchema(t: ValidationTranslator) {
  return z.object({
    email: z.string().email(t('emailInvalid')),
    otp: z.string().length(6, t('otpLength')),
    password: z.string().min(8, t('passwordMin')),
  });
}

export function createVerifyEmailSchema(t: ValidationTranslator) {
  return z.object({
    email: z.string().email(t('emailInvalid')),
    otp: z.string().length(6, t('otpLength')),
  });
}

export type LoginFormValues = z.infer<ReturnType<typeof createLoginSchema>>;
export type RegisterFormValues = z.infer<ReturnType<typeof createRegisterSchema>>;
export type ForgotPasswordFormValues = z.infer<ReturnType<typeof createForgotPasswordSchema>>;
export type ResetPasswordFormValues = z.infer<ReturnType<typeof createResetPasswordSchema>>;
export type VerifyEmailFormValues = z.infer<ReturnType<typeof createVerifyEmailSchema>>;
