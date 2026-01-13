/* eslint-disable @typescript-eslint/no-explicit-any */
export type TipoContrato = "FIJO" | "TEMPORAL" | "PRACTICAS";
export type EstadoEmpleado = "ACTIVO" | "INACTIVO";

export interface Empleado {
  fechaModificacion: any;
  notas: any;
  observaciones: any;
  fechaCreacion: any;
  id?: number;
  codigoEmpleado: string;
  nombre: string;
  primerApellido: string;
  segundoApellido?: string;
  email: string;
  telefono: string;
  fechaContratacion: string; // YYYY-MM-DD
  puestoId: number;
  departamentoId: number;
  jefeInmediatoId?: number;
  salarioBase: number;
  tipoContrato: TipoContrato;
  estado?: EstadoEmpleado;
  nombreUsuario?: string;
  password?: string;
  rolId: number;
}
