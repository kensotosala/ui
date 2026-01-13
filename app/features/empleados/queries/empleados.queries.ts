import { useQuery } from "@tanstack/react-query";
import { empleadoService } from "../services/empleados.service";
import { Empleado } from "../types";

export const useEmpleadosQuery = () => {
  return useQuery<Empleado[]>({
    queryKey: ["empleados"],
    queryFn: () => empleadoService.getAll(),
    // Opciones adicionales recomendadas para empleados:
    staleTime: 5 * 60 * 1000, // 5 minutos (los datos de empleados pueden cambiar más frecuentemente)
    gcTime: 10 * 60 * 1000, // 10 minutos de garbage collection
  });
};

// Query para obtener un empleado específico por ID
export const useEmpleadoQuery = (id?: number) => {
  return useQuery<Empleado>({
    queryKey: ["empleados", id],
    queryFn: () => {
      if (!id) throw new Error("ID de empleado no proporcionado");
      return empleadoService.getById(id);
    },
    enabled: !!id, // Solo ejecuta si hay un ID válido
  });
};

// Query para empleados por departamento (útil para dropdowns/filtros)
export const useEmpleadosPorDepartamentoQuery = (departamentoId?: number) => {
  return useQuery<Empleado[]>({
    queryKey: ["empleados", "departamento", departamentoId],
    queryFn: () => {
      if (!departamentoId) return Promise.resolve([]);
      return empleadoService.buscarPorDepartamento(departamentoId);
    },
    enabled: !!departamentoId,
  });
};

// Query para empleados por puesto
export const useEmpleadosPorPuestoQuery = (puestoId?: number) => {
  return useQuery<Empleado[]>({
    queryKey: ["empleados", "puesto", puestoId],
    queryFn: () => {
      if (!puestoId) return Promise.resolve([]);
      return empleadoService.buscarPorPuesto(puestoId);
    },
    enabled: !!puestoId,
  });
};

// Query para empleados activos (filtro común)
export const useEmpleadosActivosQuery = () => {
  return useQuery<Empleado[]>({
    queryKey: ["empleados", "activos"],
    queryFn: async () => {
      const empleados = await empleadoService.getAll();
      return empleados.filter((e) => e.estado === "ACTIVO");
    },
    // Cache más corto para datos activos que pueden cambiar
    staleTime: 2 * 60 * 1000, // 2 minutos
  });
};
