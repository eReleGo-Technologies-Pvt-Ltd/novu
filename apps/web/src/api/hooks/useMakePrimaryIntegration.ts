import { useMutation, useQueryClient, UseMutationOptions } from '@tanstack/react-query';

import { errorMessage } from '../../utils/notifications';
import type { IntegrationEntity } from '../../pages/integrations/types';
import { successMessage } from '../../utils/notifications';
import { QueryKeys } from '../query.keys';

export const useMakePrimaryIntegration = (
  options: UseMutationOptions<
    IntegrationEntity,
    { error: string; message: string; statusCode: number },
    {
      id: string;
    }
  > = {}
) => {
  const queryClient = useQueryClient();

  const { mutate: makePrimaryIntegration, ...rest } = useMutation<
    IntegrationEntity,
    { error: string; message: string; statusCode: number },
    {
      id: string;
    }
  >(
    ({ id }) =>
      new Promise((resolve) => {
        // TODO: integrate with backend
        setTimeout(() => {
          resolve({ name: 'Fake Integration' } as any);
        }, 1000);
      }),
    {
      ...options,
      onSuccess: (integration, variables, context) => {
        successMessage(`${integration.name} provider instance is activated and marked as the primary instance`);
        queryClient.refetchQueries({
          predicate: ({ queryKey }) =>
            queryKey.includes(QueryKeys.integrationsList) || queryKey.includes(QueryKeys.activeIntegrations),
        });
        options?.onSuccess?.(integration, variables, context);
      },
      onError: (e: any, variables, context) => {
        errorMessage(e.message || 'Unexpected error');
        options?.onError?.(e, variables, context);
      },
    }
  );

  return {
    makePrimaryIntegration,
    ...rest,
  };
};
