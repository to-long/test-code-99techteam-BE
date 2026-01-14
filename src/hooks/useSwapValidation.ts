import { useMemo } from 'react';
import * as yup from 'yup';

interface UseSwapValidationParams {
  walletBalance: number;
}

export function useSwapValidation({ walletBalance }: UseSwapValidationParams) {
  // Yup schema for form validation
  const schema = useMemo(() => {
    return yup.object({
      fromAmount: yup
        .string()
        .required('Please enter an amount')
        .matches(/^\d*\.?\d*$/, 'Invalid amount format')
        .test('positive', 'Amount must be greater than 0', (value) => {
          if (!value) return false;
          const num = Number(value);
          return !isNaN(num) && num > 0;
        })
        .test('balance', `Insufficient balance (max: ${walletBalance.toLocaleString(undefined, { maximumFractionDigits: 6 })})`, (value) => {
          if (!value) return true;
          const num = Number(value);
          if (isNaN(num)) return true;
          return num <= walletBalance;
        }),
    });
  }, [walletBalance]);

  return { schema };
}
