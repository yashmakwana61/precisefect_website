import { useQuery } from "@tanstack/react-query";
import { cmsApi } from "@/lib/cms-api";

export function useAdmin() {
  const query = useQuery({
    queryKey: ["auth", "me"],
    queryFn: () => cmsApi.me(),
    staleTime: 1000 * 60,
  });
  return {
    isAdmin: query.data?.isAdmin ?? false,
    isLoading: query.isLoading,
    refetch: query.refetch,
  };
}
