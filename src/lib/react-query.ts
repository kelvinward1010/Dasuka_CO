import { AxiosError } from "axios";
import { QueryClient, UseMutationOptions, UseQueryOptions } from "react-query";
import type { DefaultOptions } from "react-query";

const queryConfig: DefaultOptions = {
  queries: {
    useErrorBoundary: true,
    refetchOnWindowFocus: false,
    retry: 1,
  },
};

export const queryClient = new QueryClient({ defaultOptions: queryConfig });

export type PromiseValue<
  PromiseType,
  Otherwise = PromiseType,
> = PromiseType extends Promise<infer Value>
  ? { 0: PromiseValue<Value>; 1: Value }[PromiseType extends Promise<unknown>
      ? 0
      : 1]
  : Otherwise;

export type ExtractFnReturnType<FnType extends (...args: any) => any> =
  PromiseValue<ReturnType<FnType>>;

export type QueryConfig<QueryFnType extends (...args: any) => any> = Omit<
  UseQueryOptions<ExtractFnReturnType<QueryFnType>>,
  "queryKey" | "queryFn"
>;

export type MutationConfig<MutationFnType extends (...args: any) => any> =
  UseMutationOptions<
    ExtractFnReturnType<MutationFnType>,
    AxiosError<any>,
    Parameters<MutationFnType>[0]
  >;
