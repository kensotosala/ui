"use client";

import { ColumnDef } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { Permiso, EstadoPermiso } from "../../types";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { JSX } from "react";

/**
 * Obtener color del badge según el estado
 */
const getEstadoBadge = (estado: EstadoPermiso | string | null) => {
  const badges: Record<
    EstadoPermiso,
    {
      variant: "default" | "secondary" | "destructive" | "outline";
      className: string;
    }
  > = {
    [EstadoPermiso.PENDIENTE]: {
      variant: "secondary",
      className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
    },
    [EstadoPermiso.APROBADA]: {
      variant: "default",
      className: "bg-green-100 text-green-800 hover:bg-green-200",
    },
    [EstadoPermiso.RECHAZADA]: {
      variant: "destructive",
      className: "bg-red-100 text-red-800 hover:bg-red-200",
    },
  };

  if (!estado || !(estado in badges)) {
    return badges[EstadoPermiso.PENDIENTE];
  }

  return badges[estado as EstadoPermiso];
};

/**
 * Helper para formatear fechas de manera segura
 */
const formatearFecha = (
  fecha: string | null | undefined,
  formato: string = "dd/MM/yyyy",
): JSX.Element => {
  // Validar que la fecha existe
  if (!fecha) {
    return <span className="text-muted-foreground">—</span>;
  }

  try {
    // Intentar crear la fecha
    const date = new Date(fecha);

    // Validar que la fecha es válida
    if (isNaN(date.getTime())) {
      return <span className="text-destructive text-xs">Fecha inválida</span>;
    }

    return <>{format(date, formato, { locale: es })}</>;
  } catch (error) {
    console.error("Error formateando fecha:", fecha, error);
    return <span className="text-destructive text-xs">Error de fecha</span>;
  }
};

/**
 * Columnas de la tabla de permisos
 */
export const columns = (
  onVer: (permiso: Permiso) => void,
  onEditar: (permiso: Permiso) => void,
  onEliminar: (permiso: Permiso) => void,
  onAprobar?: (permiso: Permiso) => void,
  onRechazar?: (permiso: Permiso) => void,
): ColumnDef<Permiso>[] => [
  {
    accessorKey: "IdPermiso",
    header: "ID",
    cell: ({ getValue }) => (
      <div className="font-medium">{getValue<number>()}</div>
    ),
  },
  {
    accessorKey: "EmpleadoId",
    header: "Empleado",
    cell: ({ row }) => {
      const permiso = row.original;
      return (
        <div>
          <p className="font-medium">Empleado #{permiso.empleadoId}</p>
        </div>
      );
    },
  },
  {
    accessorKey: "FechaSolicitud",
    header: "Fecha Solicitud",
    cell: ({ getValue }) => {
      const fecha = getValue<string | null>();
      return <div className="text-sm">{formatearFecha(fecha)}</div>;
    },
  },
  {
    accessorKey: "FechaPermiso",
    header: "Fecha Permiso",
    cell: ({ getValue }) => {
      const fecha = getValue<string | null>();
      return <div className="text-sm font-medium">{formatearFecha(fecha)}</div>;
    },
  },
  {
    accessorKey: "Motivo",
    header: "Motivo",
    cell: ({ getValue }) => {
      const motivo = getValue<string>();
      return (
        <div className="max-w-50 truncate" title={motivo}>
          {motivo}
        </div>
      );
    },
  },
  {
    accessorKey: "ConGoceSalario",
    header: () => <div className="text-center">Con Goce</div>,
    cell: ({ getValue }) => {
      const conGoce = getValue<boolean | null>();
      return (
        <div className="text-center">
          {conGoce ? (
            <Badge variant="default" className="bg-blue-100 text-blue-800">
              Sí
            </Badge>
          ) : (
            <Badge variant="outline">No</Badge>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "EstadoSolicitud",
    header: "Estado",
    cell: ({ getValue }) => {
      const estado = getValue<string | null>();
      const badgeConfig = getEstadoBadge(estado);
      return (
        <Badge variant={badgeConfig.variant} className={badgeConfig.className}>
          {estado || EstadoPermiso.PENDIENTE}
        </Badge>
      );
    },
  },
  {
    accessorKey: "JefeApruebaId",
    header: "Aprobado Por",
    cell: ({ row }) => {
      const permiso = row.original;
      if (!permiso.jefeApruebaId) {
        return <span className="text-sm text-gray-400">—</span>;
      }
      return (
        <div className="text-sm">
          <p>Jefe #{permiso.jefeApruebaId}</p>
          {permiso.fechaAprobacion && (
            <p className="text-xs text-gray-500">
              {formatearFecha(permiso.fechaAprobacion)}
            </p>
          )}
        </div>
      );
    },
  },
  {
    id: "actions",
    header: () => <div className="text-center">Acciones</div>,
    cell: ({ row }) => {
      const permiso = row.original;
      const puedeEditar = permiso.estadoSolicitud === EstadoPermiso.PENDIENTE;
      const puedeAprobar = permiso.estadoSolicitud === EstadoPermiso.PENDIENTE;

      return (
        <div className="flex justify-center">
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

              <DropdownMenuItem onClick={() => onVer(permiso)}>
                <Eye className="mr-2 h-4 w-4" />
                Ver Detalles
              </DropdownMenuItem>

              {puedeEditar && (
                <DropdownMenuItem onClick={() => onEditar(permiso)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Editar
                </DropdownMenuItem>
              )}

              {puedeAprobar && onAprobar && onRechazar && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => onAprobar(permiso)}
                    className="text-green-600"
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Aprobar
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => onRechazar(permiso)}
                    className="text-red-600"
                  >
                    <XCircle className="mr-2 h-4 w-4" />
                    Rechazar
                  </DropdownMenuItem>
                </>
              )}

              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-600"
                onClick={() => onEliminar(permiso)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Eliminar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
