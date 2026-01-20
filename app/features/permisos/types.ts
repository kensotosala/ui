/**
 * Enums
 */
export enum EstadoPermiso {
  PENDIENTE = "PENDIENTE",
  APROBADA = "APROBADA",
  RECHAZADA = "RECHAZADA",
}

export interface Permiso {
  idPermiso: number;
  empleadoId: number;
  jefeApruebaId: number | null;
  fechaPermiso: string;
  fechaSolicitud: string;
  fechaCreacion: string | null;
  fechaAprobacion: string | null;
  fechaModificacion: string | null;
  estadoSolicitud: string | null;
  conGoceSalario: boolean | null;
  motivo: string;
  comentariosRechazo: string | null;
}

/**
 * DTOs
 */
export interface CrearPermisoDTO {
  empleadoId: number;
  fechaPermiso: string;
  motivo: string;
  conGoceSalario?: boolean;
}

export interface ActualizarPermisoDTO {
  empleadoId: number;
  fechaPermiso: string;
  motivo: string;
  conGoceSalario: boolean;
  estadoSolicitud?: string;
  fechaAprobacion?: string;
}

export interface AprobarRechazarPermisoDTO {
  jefeApruebaId: number;
  estadoSolicitud: EstadoPermiso;
  comentariosRechazo?: string;
}

export interface FiltrosPermisos {
  empleadoId?: number;
  departamentoId?: number;
  fechaInicio?: string;
  fechaFin?: string;
  estadoSolicitud?: string;
  jefeApruebaId?: number;
}
