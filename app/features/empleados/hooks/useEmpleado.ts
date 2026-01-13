/* eslint-disable react-hooks/rules-of-hooks */
import {
  useEmpleadoQuery,
  useEmpleadosActivosQuery,
  useEmpleadosPorDepartamentoQuery,
  useEmpleadosPorPuestoQuery,
  useEmpleadosQuery,
} from "../queries/empleados.queries";
import { Empleado } from "../types";
import { useEmpleadoMutations } from "./useEmpleadosMutation";

export const useEmpleados = (options?: {
  id?: number;
  departamentoId?: number;
  puestoId?: number;
  soloActivos?: boolean;
}) => {
  const { id, departamentoId, puestoId, soloActivos } = options || {};

  // Determinar qué query usar basado en las opciones
  let empleadosQuery;

  if (id) {
    // Query individual para un empleado específico
    empleadosQuery = useEmpleadoQuery(id);
  } else if (departamentoId) {
    // Query para empleados de un departamento específico
    empleadosQuery = useEmpleadosPorDepartamentoQuery(departamentoId);
  } else if (puestoId) {
    // Query para empleados de un puesto específico
    empleadosQuery = useEmpleadosPorPuestoQuery(puestoId);
  } else if (soloActivos) {
    // Query solo para empleados activos
    empleadosQuery = useEmpleadosActivosQuery();
  } else {
    // Query general para todos los empleados
    empleadosQuery = useEmpleadosQuery();
  }

  const mutations = useEmpleadoMutations();

  // Helper para obtener datos específicos
  const getEmpleadoById = (empleadoId: number): Empleado | undefined => {
    if (empleadosQuery.data && Array.isArray(empleadosQuery.data)) {
      return empleadosQuery.data.find((e) => e.id === empleadoId);
    }
    return undefined;
  };

  // Helper para filtrar empleados
  const filterEmpleados = (
    predicate: (empleado: Empleado) => boolean
  ): Empleado[] => {
    if (!empleadosQuery.data || !Array.isArray(empleadosQuery.data)) return [];
    return empleadosQuery.data.filter(predicate);
  };

  // Helper para buscar por código
  const buscarPorCodigo = (codigo: string): Empleado | undefined => {
    if (!empleadosQuery.data || !Array.isArray(empleadosQuery.data))
      return undefined;
    return empleadosQuery.data.find((e) => e.codigoEmpleado === codigo);
  };

  // Helper para buscar por nombre/apellido
  const buscarPorNombre = (termino: string): Empleado[] => {
    if (!empleadosQuery.data || !Array.isArray(empleadosQuery.data)) return [];
    const terminoLower = termino.toLowerCase();
    return empleadosQuery.data.filter(
      (e) =>
        e.nombre.toLowerCase().includes(terminoLower) ||
        e.primerApellido.toLowerCase().includes(terminoLower) ||
        (e.segundoApellido &&
          e.segundoApellido.toLowerCase().includes(terminoLower)) ||
        `${e.nombre} ${e.primerApellido}`.toLowerCase().includes(terminoLower)
    );
  };

  return {
    // Datos
    empleados: Array.isArray(empleadosQuery.data) ? empleadosQuery.data : [],
    empleado: !Array.isArray(empleadosQuery.data)
      ? empleadosQuery.data
      : undefined,

    // Estados
    isLoading: empleadosQuery.isLoading,
    isFetching: empleadosQuery.isFetching,
    isError: empleadosQuery.isError,
    error: empleadosQuery.error,

    // Métodos de query
    refetch: empleadosQuery.refetch,
    refetchEmpleados: empleadosQuery.refetch,

    // Helpers
    getEmpleadoById,
    filterEmpleados,
    buscarPorCodigo,
    buscarPorNombre,

    // Mutaciones
    ...mutations,

    // Propiedades computadas (solo para arrays)
    total: Array.isArray(empleadosQuery.data) ? empleadosQuery.data.length : 0,
    activos: Array.isArray(empleadosQuery.data)
      ? empleadosQuery.data.filter((e) => e.estado === "ACTIVO").length
      : 0,
    inactivos: Array.isArray(empleadosQuery.data)
      ? empleadosQuery.data.filter((e) => e.estado === "INACTIVO").length
      : 0,

    // Métodos para manejo común de empleado individual (si tenemos un empleado)
    actualizarEmpleado: (empleadoId: number, datos: Partial<Empleado>) => {
      if (
        id === empleadoId &&
        empleadosQuery.data &&
        !Array.isArray(empleadosQuery.data)
      ) {
        // Optimistic update para empleado individual
        mutations.mutateUpdate({ id: empleadoId, empleado: datos });
      } else {
        mutations.updateEmpleado({ id: empleadoId, empleado: datos });
      }
    },

    // Método conveniente para toggle de estado
    toggleEstado: (empleadoId: number, nuevoEstado?: "ACTIVO" | "INACTIVO") => {
      const empleado = getEmpleadoById(empleadoId);
      const estado =
        nuevoEstado || (empleado?.estado === "ACTIVO" ? "INACTIVO" : "ACTIVO");
      mutations.toggleEstadoEmpleado({ id: empleadoId, estado });
    },
  };
};

// Hook especializado para uso común
export const useEmpleadosLista = () => {
  return useEmpleados();
};

export const useEmpleadosActivos = () => {
  return useEmpleados({ soloActivos: true });
};

export const useEmpleadoDetalle = (id?: number) => {
  return useEmpleados({ id });
};

export const useEmpleadosPorDepartamento = (departamentoId?: number) => {
  return useEmpleados({ departamentoId });
};

export const useEmpleadosPorPuesto = (puestoId?: number) => {
  return useEmpleados({ puestoId });
};
