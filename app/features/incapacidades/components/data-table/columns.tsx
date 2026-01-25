"use client";

import { ColumnDef } from "@tanstack/react-table";
import {
  Incapacidad,
  TIPOS_INCAPACIDAD,
  ESTADOS_INCAPACIDAD,
} from "../../types";
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
  ExternalLink,
} from "lucide-react";
import { Empleado } from "@/app/features/empleados/types";

const getTipoLabel = (tipo: string) => {
  const labels: Record<string, string> = {
    [TIPOS_INCAPACIDAD.ENFERMEDAD]: "Enfermedad",
    [TIPOS_INCAPACIDAD.ACCIDENTE]: "Accidente",
    [TIPOS_INCAPACIDAD.MATERNIDAD]: "Maternidad",
    [TIPOS_INCAPACIDAD.PATERNIDAD]: "Paternidad",
  };
  return labels[tipo] || tipo;
};

export const columns = (
  onVer: (incapacidad: Incapacidad) => void,
  onEditar: (incapacidad: Incapacidad) => void,
  onEliminar: (incapacidad: Incapacidad) => void,
  empleados: Empleado[],
): ColumnDef<Incapacidad>[] => [
  {
    accessorKey: "empleadoId",
    header: "Empleado",
    cell: ({ row }) => {
      const empleado = empleados.find(
        (e) => e.idEmpleado === row.original.empleadoId,
      );
      return empleado
        ? `${empleado.nombre} ${empleado.primerApellido}`
        : "Desconocido";
    },
  },
  {
    accessorKey: "tipoIncapacidad",
    header: "Tipo",
    cell: ({ row }) => getTipoLabel(row.original.tipoIncapacidad),
  },
  {
    accessorKey: "estado",
    header: "Estado",
    cell: ({ row }) => {
      const estado = row.original.estado;
      const variant =
        estado === ESTADOS_INCAPACIDAD.ACTIVA ? "default" : "secondary";

      return <Badge variant={variant}>{estado}</Badge>;
    },
  },
  {
    accessorKey: "fechaInicio",
    header: "Fecha Inicio",
    cell: ({ row }) => {
      const fecha = new Date(row.original.fechaInicio);
      return fecha.toLocaleDateString("es-CR");
    },
  },
  {
    accessorKey: "fechaFin",
    header: "Fecha Fin",
    cell: ({ row }) => {
      const fecha = new Date(row.original.fechaFin);
      return fecha.toLocaleDateString("es-CR");
    },
  },
  {
    accessorKey: "diagnostico",
    header: "Diagnóstico",
    cell: ({ row }) => {
      const diagnostico = row.original.diagnostico;
      return (
        <div className="max-w-50 truncate" title={diagnostico}>
          {diagnostico}
        </div>
      );
    },
  },
  {
    accessorKey: "archivoAdjunto",
    header: "Adjunto",
    cell: ({ row }) => {
      const archivo = row.original.archivoAdjunto;
      if (!archivo) return <span className="text-muted-foreground">-</span>;

      return (
        <Button variant="ghost" size="sm" asChild className="h-8 px-2">
          <a
            href={archivo}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
          >
            <ExternalLink className="h-4 w-4" />
          </a>
        </Button>
      );
    },
  },
  {
    id: "acciones",
    header: "Acciones",
    cell: ({ row }) => {
      const incapacidad = row.original;

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
            <DropdownMenuItem onClick={() => onVer(incapacidad)}>
              <Eye className="mr-2 h-4 w-4" />
              Ver detalles
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEditar(incapacidad)}>
              <Pencil className="mr-2 h-4 w-4" />
              Editar
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onEliminar(incapacidad)}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Eliminar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
