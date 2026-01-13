import { useEmpleadosQuery } from "../queries/empleados.queries";
import { useEmpleadoMutations } from "./useEmpleadosMutation";

export const useEmpleados = () => {
  const empleadosQuery = useEmpleadosQuery();
  const mutations = useEmpleadoMutations();

  return {
    empleados: empleadosQuery.data ?? [],
    isLoading: empleadosQuery.isLoading,
    refetch: empleadosQuery.refetch,
    ...mutations,
  };
};
