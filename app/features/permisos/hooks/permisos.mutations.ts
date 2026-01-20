import {
  useMutation,
  useQueryClient,
  UseMutationResult,
} from "@tanstack/react-query";

import {
  Permiso,
  CrearPermisoDTO,
  ActualizarPermisoDTO,
  AprobarRechazarPermisoDTO,
} from "../types";
import permisoService from "../services/permisos.service";
import { permisoKeys } from "../queries/permisos.queries";

/**
 * Crear nuevo permiso
 */
export const useCreatePermisoMutation = (): UseMutationResult<
  Permiso,
  Error,
  CrearPermisoDTO
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: CrearPermisoDTO) => permisoService.create(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: permisoKeys.lists() });
    },
  });
};

/**
 * Actualizar permiso
 */
export const useUpdatePermisoMutation = (): UseMutationResult<
  Permiso,
  Error,
  { id: number; dto: ActualizarPermisoDTO }
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, dto }) => permisoService.update(id, dto),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: permisoKeys.detail(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: permisoKeys.lists() });
    },
  });
};

/**
 * Eliminar permiso
 */
export const useDeletePermisoMutation = (): UseMutationResult<
  void,
  Error,
  number
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => permisoService.delete(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: permisoKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: permisoKeys.lists() });
    },
  });
};

/**
 * Aprobar o rechazar permiso
 */
export const useAprobarRechazarPermisoMutation = (): UseMutationResult<
  void,
  Error,
  { id: number; dto: AprobarRechazarPermisoDTO }
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, dto }) => permisoService.aprobarRechazar(id, dto),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: permisoKeys.detail(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: permisoKeys.lists() });
    },
  });
};
