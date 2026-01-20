import {
  usePermisosQuery,
  usePermisoQuery,
  usePermisosFiltrosQuery,
  usePermisosByEmpleadoQuery,
  usePermisosPendientesJefeQuery,
} from "../queries/permisos.queries";

import {
  Permiso,
  CrearPermisoDTO,
  ActualizarPermisoDTO,
  AprobarRechazarPermisoDTO,
  FiltrosPermisos,
} from "../types";
import {
  useAprobarRechazarPermisoMutation,
  useCreatePermisoMutation,
  useDeletePermisoMutation,
  useUpdatePermisoMutation,
} from "./permisos.mutations";

/**
 * Hook principal para gestión de permisos
 * Combina queries y mutations en una sola interfaz
 */
export const usePermisos = () => {
  // Queries
  const {
    data: permisos = [],
    isLoading,
    isError,
    error,
    refetch,
  } = usePermisosQuery();

  // Mutations
  const createMutation = useCreatePermisoMutation();
  const updateMutation = useUpdatePermisoMutation();
  const deleteMutation = useDeletePermisoMutation();
  const aprobarRechazarMutation = useAprobarRechazarPermisoMutation();

  // Funciones auxiliares
  const createPermiso = async (dto: CrearPermisoDTO): Promise<Permiso> => {
    return await createMutation.mutateAsync(dto);
  };

  const updatePermiso = async ({
    id,
    data,
  }: {
    id: number;
    data: ActualizarPermisoDTO;
  }): Promise<Permiso> => {
    return await updateMutation.mutateAsync({ id, dto: data });
  };

  const deletePermiso = async (id: number): Promise<void> => {
    return await deleteMutation.mutateAsync(id);
  };

  const aprobarRechazarPermiso = async ({
    id,
    data,
  }: {
    id: number;
    data: AprobarRechazarPermisoDTO;
  }): Promise<void> => {
    return await aprobarRechazarMutation.mutateAsync({ id, dto: data });
  };

  return {
    // Data
    permisos,
    isLoading,
    isError,
    error,

    // Actions
    refetch,
    createPermiso,
    updatePermiso,
    deletePermiso,
    aprobarRechazarPermiso,

    // Mutation states
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isAprobandoRechazando: aprobarRechazarMutation.isPending,
  };
};

/**
 * Hook para obtener un permiso específico por ID
 */
export const usePermiso = (id: number) => {
  const { data: permiso, isLoading, isError, error } = usePermisoQuery(id);

  return {
    permiso,
    isLoading,
    isError,
    error,
  };
};

/**
 * Hook para buscar permisos con filtros
 */
export const usePermisosFiltros = (filtros: FiltrosPermisos) => {
  const {
    data: permisos = [],
    isLoading,
    isError,
    error,
    refetch,
  } = usePermisosFiltrosQuery(filtros);

  return {
    permisos,
    isLoading,
    isError,
    error,
    refetch,
  };
};

/**
 * Hook para obtener permisos de un empleado
 */
export const usePermisosByEmpleado = (empleadoId: number) => {
  const {
    data: permisos = [],
    isLoading,
    isError,
    error,
    refetch,
  } = usePermisosByEmpleadoQuery(empleadoId);

  return {
    permisos,
    isLoading,
    isError,
    error,
    refetch,
  };
};

/**
 * Hook para obtener permisos pendientes de un jefe
 */
export const usePermisosPendientesJefe = (jefeId: number) => {
  const {
    data: permisos = [],
    isLoading,
    isError,
    error,
    refetch,
  } = usePermisosPendientesJefeQuery(jefeId);

  return {
    permisos,
    isLoading,
    isError,
    error,
    refetch,
  };
};
