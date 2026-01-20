import {
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from "@tanstack/react-query";

import { Permiso, FiltrosPermisos } from "../types";
import permisoService from "../services/permisos.service";

/**
 * PATRÓN: Factory para Query Keys
 */
export const permisoKeys = {
  all: ["permisos"] as const,
  lists: () => [...permisoKeys.all, "list"] as const,
  list: () => [...permisoKeys.lists()] as const,
  details: () => [...permisoKeys.all, "detail"] as const,
  detail: (id: number) => [...permisoKeys.details(), id] as const,
  filtros: (filtros: FiltrosPermisos) =>
    [...permisoKeys.lists(), "filtros", filtros] as const,
  empleado: (empleadoId: number) =>
    [...permisoKeys.lists(), "empleado", empleadoId] as const,
  pendientesJefe: (jefeId: number) =>
    [...permisoKeys.lists(), "pendientes", jefeId] as const,
};

// Opciones por defecto
const defaultOptions = {
  staleTime: 5 * 60 * 1000, // 5 minutos
  gcTime: 10 * 60 * 1000, // 10 minutos
  refetchOnWindowFocus: false,
  retry: 2,
};

/**
 * Obtener todos los permisos
 */
export const usePermisosQuery = (
  options?: Partial<UseQueryOptions<Permiso[]>>,
): UseQueryResult<Permiso[]> => {
  return useQuery<Permiso[]>({
    queryKey: permisoKeys.list(),
    queryFn: () => permisoService.getAll(),
    ...defaultOptions,
    ...options,
  });
};

/**
 * Obtener permiso por ID
 */
export const usePermisoQuery = (
  id: number,
  options?: Partial<UseQueryOptions<Permiso>>,
): UseQueryResult<Permiso> => {
  return useQuery<Permiso>({
    queryKey: permisoKeys.detail(id),
    queryFn: () => permisoService.getById(id),
    enabled: !!id,
    ...defaultOptions,
    ...options,
  });
};

/**
 * Buscar con filtros
 */
export const usePermisosFiltrosQuery = (
  filtros: FiltrosPermisos,
  options?: Partial<UseQueryOptions<Permiso[]>>,
): UseQueryResult<Permiso[]> => {
  return useQuery<Permiso[]>({
    queryKey: permisoKeys.filtros(filtros),
    queryFn: () => permisoService.buscarPorFiltros(filtros),
    ...defaultOptions,
    ...options,
  });
};

/**
 * Obtener por empleado
 */
export const usePermisosByEmpleadoQuery = (
  empleadoId: number,
  options?: Partial<UseQueryOptions<Permiso[]>>,
): UseQueryResult<Permiso[]> => {
  return useQuery<Permiso[]>({
    queryKey: permisoKeys.empleado(empleadoId),
    queryFn: () => permisoService.getByEmpleado(empleadoId),
    enabled: !!empleadoId,
    ...defaultOptions,
    ...options,
  });
};

/**
 * Obtener pendientes por jefe
 */
export const usePermisosPendientesJefeQuery = (
  jefeId: number,
  options?: Partial<UseQueryOptions<Permiso[]>>,
): UseQueryResult<Permiso[]> => {
  return useQuery<Permiso[]>({
    queryKey: permisoKeys.pendientesJefe(jefeId),
    queryFn: () => permisoService.getPendientesByJefe(jefeId),
    enabled: !!jefeId,
    ...defaultOptions,
    ...options,
  });
};
