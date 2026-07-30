'use client';

import { useState } from 'react';
import type { FieldValues, UseFormHandleSubmit } from 'react-hook-form';

interface UseFormSubmitOptions {
  isPending?: boolean;
}

export function useFormSubmit<T extends FieldValues>(
  handleSubmit: UseFormHandleSubmit<T>,
  onValid: (values: T) => void | Promise<void>,
  options: UseFormSubmitOptions = {},
) {
  const [isLocalSubmitting, setIsLocalSubmitting] = useState(false);
  const { isPending = false } = options;

  const onSubmit = handleSubmit(async (values) => {
    if (isLocalSubmitting || isPending) return;
    setIsLocalSubmitting(true);
    try {
      await onValid(values);
    } finally {
      setIsLocalSubmitting(false);
    }
  });

  return { onSubmit, isSubmitting: isPending || isLocalSubmitting };
}
