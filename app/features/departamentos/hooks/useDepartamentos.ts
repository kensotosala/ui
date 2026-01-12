import { useDepartamentosQuery } from "../queries/departamentos.queries";
import { useDepartamentoMutations } from "./useDepartamentoMutation";

export const useDepartamentos = () => {
  const departamentosQuery = useDepartamentosQuery();
  const mutations = useDepartamentoMutations();

  return {
    departamentos: departamentosQuery.data ?? [],
    isLoading: departamentosQuery.isLoading,
    refetch: departamentosQuery.refetch,
    ...mutations,
  };
};
