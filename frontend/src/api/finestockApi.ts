import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  QueryClient,
  UseQueryResult,
  UseMutationResult,
} from "@tanstack/react-query";

// Tag types for cache invalidation
export type TagType =
  | "Auth"
  | "AuthProfile"
  | "User"
  | "Users"
  | "Image"
  | "Images";

export interface EndpointBuilder {
  query: <TResponse, TParams = void>(config: {
    queryKey: (params?: TParams) => readonly unknown[];
    queryFn: (params?: TParams) => Promise<TResponse>;
    enabled?: (params?: TParams) => boolean;
    staleTime?: number;
    gcTime?: number;
    providesTags?: (
      result: TResponse | undefined,
      params?: TParams
    ) => TagType[];
  }) => {
    useQuery: (params?: TParams) => UseQueryResult<TResponse>;
  };

  mutation: <TResponse, TVariables = void>(config: {
    mutationKey: readonly unknown[];
    mutationFn: (variables: TVariables) => Promise<TResponse>;
    invalidatesTags?: (
      result: TResponse | undefined,
      variables: TVariables
    ) => TagType[];
    onSuccess?: (
      result: TResponse,
      variables: TVariables,
      queryClient: QueryClient
    ) => void;
    onError?: (error: unknown, variables: TVariables) => void;
  }) => {
    useMutation: () => UseMutationResult<TResponse, unknown, TVariables>;
  };
}

export interface InjectEndpointsConfig {
  overrideExisting?: boolean;
  endpoints: (build: EndpointBuilder) => Record<string, unknown>;
}

class FinestockApi {
  private endpoints: Map<string, unknown> = new Map();

  injectEndpoints(config: InjectEndpointsConfig) {
    const builder = this.createEndpointBuilder();
    const endpointDefinitions = config.endpoints(builder);

    for (const [key, value] of Object.entries(endpointDefinitions)) {
      if (config.overrideExisting || !this.endpoints.has(key)) {
        this.endpoints.set(key, value);
      }
    }

    return endpointDefinitions;
  }

  private createEndpointBuilder(): EndpointBuilder {
    return {
      query: <TResponse, TParams = void>(config: {
        queryKey: (params?: TParams) => readonly unknown[];
        queryFn: (params?: TParams) => Promise<TResponse>;
        enabled?: (params?: TParams) => boolean;
        staleTime?: number;
        gcTime?: number;
        providesTags?: (
          result: TResponse | undefined,
          params?: TParams
        ) => TagType[];
      }) => {
        return {
          useQuery: (params?: TParams) => {
            return useQuery<TResponse>({
              queryKey: config.queryKey(params),
              queryFn: () => config.queryFn(params),
              enabled: config.enabled ? config.enabled(params) : true,
              staleTime: config.staleTime,
              gcTime: config.gcTime,
            });
          },
        };
      },

      mutation: <TResponse, TVariables = void>(config: {
        mutationKey: readonly unknown[];
        mutationFn: (variables: TVariables) => Promise<TResponse>;
        invalidatesTags?: (
          result: TResponse | undefined,
          variables: TVariables
        ) => TagType[];
        onSuccess?: (
          result: TResponse,
          variables: TVariables,
          queryClient: QueryClient
        ) => void;
        onError?: (error: unknown, variables: TVariables) => void;
      }) => {
        return {
          useMutation: () => {
            const queryClient = useQueryClient();
            return useMutation<TResponse, unknown, TVariables>({
              mutationKey: config.mutationKey,
              mutationFn: config.mutationFn,
              onSuccess: (result, variables) => {
                if (config.invalidatesTags) {
                  const tags = config.invalidatesTags(result, variables);
                  // Invalidate queries based on tags
                  queryClient.invalidateQueries({
                    predicate: (query) => {
                      const queryKey = query.queryKey;
                      return tags.some((tag) =>
                        queryKey.some(
                          (key) => typeof key === "string" && key.includes(tag)
                        )
                      );
                    },
                  });
                }
                if (config.onSuccess) {
                  config.onSuccess(result, variables, queryClient);
                }
              },
              onError: config.onError,
            });
          },
        };
      },
    };
  }
}

export const finestockApi = new FinestockApi();
