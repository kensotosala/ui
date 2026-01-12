import { useQuery } from "@tanstack/react-query";
import { departamentoService } from "../services/departamentos.service";
import { Departamento } from "../types";

export const useDepartamentosQuery = () => {
  return useQuery<Departamento[]>({
    queryKey: ["departamentos"],
    queryFn: () => departamentoService.getAll(),
  });
};
