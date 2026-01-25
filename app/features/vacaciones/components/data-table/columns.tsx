// src/features/vacaciones/components/columns.tsx

"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal,
  Eye,
  Pencil,
  Trash2,
  CheckCircle,
  XCircle,
} from "lucide-react";

import { Empleado } from "@/app/features/empleados/types";
import { ListarVacacionesDTO } from "../../vacaciones.types";

// ========================================
// CONSTANTES - Estados de Vacaciones
// ========================================

export const ESTADOS_VACACION = {
  PENDIENTE: "PENDIENTE",
  APROBADA: "APROBADA",
  RECHAZADA: "RECHAZADA",
  CANCELADA: "CANCELADA",
} as const;

// ========================================
// FUNCIONES AUXILIARES
// ========================================

/**
 * Obtiene el texto en español del estado
 */
const getEstadoLabel = (estado: string | null): string => {
  const labels: Record<string, string> = {
    [ESTADOS_VACACION.PENDIENTE]: "Pendiente",
    [ESTADOS_VACACION.APROBADA]: "Aprobada",
    [ESTADOS_VACACION.RECHAZADA]: "Rechazada",
    [ESTADOS_VACACION.CANCELADA]: "Cancelada",
  };
  return estado ? labels[estado] || estado : "Sin estado";
};

/**
 * Obtiene el variant del Badge según el estado
 */
const getEstadoVariant = (
  estado: string | null,
): "default" | "secondary" | "destructive" | "outline" => {
  switch (estado) {
    case ESTADOS_VACACION.PENDIENTE:
      return "outline"; // Amarillo/gris
    case ESTADOS_VACACION.APROBADA:
      return "default"; // Verde (default en shadcn)
    case ESTADOS_VACACION.RECHAZADA:
      return "destructive"; // Rojo
    case ESTADOS_VACACION.CANCELADA:
      return "secondary"; // Gris
    default:
      return "secondary";
  }
};

/**
 * Calcula los días de vacaciones entre dos fechas
 */
const calcularDias = (fechaInicio: string, fechaFin: string): number => {
  const inicio = new Date(fechaInicio);
  const fin = new Date(fechaFin);
  const diferencia = fin.getTime() - inicio.getTime();
  const dias = Math.ceil(diferencia / (1000 * 60 * 60 * 24)) + 1;
  return dias > 0 ? dias : 0;
};

// ========================================
// DEFINICIÓN DE COLUMNAS
// ========================================


export const columns = (
  onVer: (vacacion: ListarVacacionesDTO) => void,
  onEditar: (vacacion: ListarVacacionesDTO) => void,
  onEliminar: (vacacion: ListarVacacionesDTO) => void,
  onAprobar?: (vacacion: ListarVacacionesDTO) => void,
  onRechazar?: (vacacion: ListarVacacionesDTO) => void,
  empleados?: Empleado[],
  esJefe: boolean = false,
): ColumnDef<ListarVacacionesDTO>[] => [
  // ========================================
  // COLUMNA: ID
  // ========================================
  {
    accessorKey: "idVacacion",
    header: "ID",
    cell: ({ row }) => {
      return <span className="font-medium">#{row.original.idVacacion}</span>;
    },
  },

  // ========================================
  // COLUMNA: EMPLEADO
  // ========================================
  {
    accessorKey: "empleadoId",
    header: "Empleado",
    cell: ({ row }) => {
      // Si tenemos la lista de empleados, mostrar nombre completo
      if (empleados) {
        const empleado = empleados.find(
          (e) => e.idEmpleado === row.original.empleadoId,
        );
        return empleado
          ? `${empleado.nombre} ${empleado.primerApellido}`
          : `Empleado #${row.original.empleadoId}`;
      }
      // Si no, solo mostrar el ID
      return `Empleado #${row.original.empleadoId}`;
    },
  },

  // ========================================
  // COLUMNA: FECHA INICIO
  // ========================================
  {
    accessorKey: "fechaInicio",
    header: "Fecha Inicio",
    cell: ({ row }) => {
      const fecha = new Date(row.original.fechaInicio);
      return (
        <span className="whitespace-nowrap">
          {fecha.toLocaleDateString("es-CR", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        </span>
      );
    },
  },

  // ========================================
  // COLUMNA: FECHA FIN
  // ========================================
  {
    accessorKey: "fechaFin",
    header: "Fecha Fin",
    cell: ({ row }) => {
      const fecha = new Date(row.original.fechaFin);
      return (
        <span className="whitespace-nowrap">
          {fecha.toLocaleDateString("es-CR", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        </span>
      );
    },
  },

  // ========================================
  // COLUMNA: DÍAS (CALCULADO)
  // ========================================
  {
    id: "dias",
    header: "Días",
    cell: ({ row }) => {
      const dias = calcularDias(
        row.original.fechaInicio,
        row.original.fechaFin,
      );
      return (
        <span className="font-semibold text-blue-600">
          {dias} {dias === 1 ? "día" : "días"}
        </span>
      );
    },
  },

  // ========================================
  // COLUMNA: ESTADO
  // ========================================
  {
    accessorKey: "estadoSolicitud",
    header: "Estado",
    cell: ({ row }) => {
      const estado = row.original.estadoSolicitud;
      const variant = getEstadoVariant(estado);
      const label = getEstadoLabel(estado);

      return <Badge variant={variant}>{label}</Badge>;
    },
  },

  // ========================================
  // COLUMNA: FECHA SOLICITUD
  // ========================================
  {
    accessorKey: "fechaSolicitud",
    header: "Solicitado",
    cell: ({ row }) => {
      const fecha = new Date(row.original.fechaSolicitud);
      return (
        <span className="text-sm text-muted-foreground">
          {fecha.toLocaleDateString("es-CR")}
        </span>
      );
    },
  },

  // ========================================
  // COLUMNA: JEFE QUE APROBÓ (Opcional)
  // ========================================
  {
    accessorKey: "jefeApruebaId",
    header: "Aprobó",
    cell: ({ row }) => {
      const jefeId = row.original.jefeApruebaId;

      if (!jefeId) {
        return <span className="text-muted-foreground">-</span>;
      }

      // Si tenemos la lista de empleados, buscar el nombre del jefe
      if (empleados) {
        const jefe = empleados.find((e) => e.idEmpleado === jefeId);
        return jefe ? (
          <span className="text-sm">
            {jefe.nombre} {jefe.primerApellido}
          </span>
        ) : (
          <span className="text-sm">Jefe #{jefeId}</span>
        );
      }

      return <span className="text-sm">Jefe #{jefeId}</span>;
    },
  },

  // ========================================
  // COLUMNA: ACCIONES
  // ========================================
  {
    id: "acciones",
    header: "Acciones",
    cell: ({ row }) => {
      const vacacion = row.original;
      const esPendiente =
        vacacion.estadoSolicitud === ESTADOS_VACACION.PENDIENTE;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Abrir menú</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
            <DropdownMenuSeparator />

            {/* Ver detalles - Siempre disponible */}
            <DropdownMenuItem onClick={() => onVer(vacacion)}>
              <Eye className="mr-2 h-4 w-4" />
              Ver detalles
            </DropdownMenuItem>

            {/* Editar - Solo si está pendiente */}
            {esPendiente && (
              <DropdownMenuItem onClick={() => onEditar(vacacion)}>
                <Pencil className="mr-2 h-4 w-4" />
                Editar
              </DropdownMenuItem>
            )}

            {/* Acciones de jefe - Solo si es jefe y está pendiente */}
            {esJefe && esPendiente && onAprobar && onRechazar && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => onAprobar(vacacion)}
                  className="text-green-600 focus:text-green-600"
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Aprobar
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onRechazar(vacacion)}
                  className="text-orange-600 focus:text-orange-600"
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  Rechazar
                </DropdownMenuItem>
              </>
            )}

            {/* Cancelar/Eliminar - Solo si está pendiente */}
            {esPendiente && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => onEliminar(vacacion)}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Cancelar solicitud
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
