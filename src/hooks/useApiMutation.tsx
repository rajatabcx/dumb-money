import { useMutation } from "convex/react";
import {
  FunctionReference,
  FunctionReturnType,
  OptionalRestArgs,
} from "convex/server";
import { useState } from "react";

export function useApiMutation<Mutation extends FunctionReference<"mutation">>(
  mutationFn: Mutation
): {
  mutate: (
    ...payload: OptionalRestArgs<Mutation>
  ) => Promise<FunctionReturnType<Mutation>>;
  isPending: boolean;
} {
  const [isPending, setIsPending] = useState(false);
  const apiMutation = useMutation(mutationFn);

  const mutate = async (...[payload]: OptionalRestArgs<Mutation>) => {
    try {
      setIsPending(true);
      const res = await apiMutation(payload);
      return res;
    } catch (err: any) {
      throw err;
    } finally {
      setIsPending(false);
    }
  };

  return { mutate, isPending };
}
