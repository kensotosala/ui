import { useQuery } from "@tanstack/react-query";
import { Empleado } from "../types";
import { empleadoService } from "../services/empleados.service";

export const useEmpleadosQuery = () => {
  return useQuery<Empleado[]>({
    queryKey: ["empleados"],
    queryFn: () => empleadoService.getAll(),
  });
};
