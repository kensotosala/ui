import { useIncapacidadQuery } from "../queries/incapacidades.queries";
import { useIncapacidadMutations } from "./useIncapacidadMutations";

export const useIncapacidad = () => {
  const incapacidadQuery = useIncapacidadQuery();
  const mutations = useIncapacidadMutations();

  return {
    incapacidades: incapacidadQuery.data ?? [],
    isLoading: incapacidadQuery.isLoading,
    refetch: incapacidadQuery.refetch,
    ...mutations,
  };
};
