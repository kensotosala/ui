/* eslint-disable @typescript-eslint/no-explicit-any */

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
import { MoreHorizontal, Eye, DollarSign, Ban } from "lucide-react";
import { NominaDTO } from "../../nomina.types";

const getEstadoBadge = (estado?: string) => {
  const estadoUpper = estado?.toUpperCase() || "PENDIENTE";

  const variants: Record<string, { variant: any; className: string }> = {
    PENDIENTE: {
      variant: "secondary",
      className: "bg-yellow-100 text-yellow-800 border-yellow-300",
    },
    PAGADA: {
      variant: "default",
      className: "bg-green-100 text-green-800 border-green-300",
    },
    ANULADA: {
      variant: "destructive",
      className: "bg-red-100 text-red-800 border-red-300",
    },
  };

  const config = variants[estadoUpper] || variants.PENDIENTE;

  return (
    <Badge variant={config.variant} className={config.className}>
      {estadoUpper}
    </Badge>
  );
};

export const columns = (
  onVer: (nomina: NominaDTO) => void,
  onPagar: (nomina: NominaDTO) => void,
  onAnular: (nomina: NominaDTO) => void,
): ColumnDef<NominaDTO>[] => [
  {
    accessorKey: "nombreEmpleado",
    header: "Empleado",
    cell: ({ row }) => (
      <div>
        <div className="font-medium">{row.original.nombreEmpleado}</div>
        <div className="text-xs text-muted-foreground">
          {row.original.codigoEmpleado}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "puesto",
    header: "Puesto",
    cell: ({ row }) => (
      <div className="text-sm text-slate-600">{row.original.puesto}</div>
    ),
  },
  {
    accessorKey: "departamento",
    header: "Departamento",
    cell: ({ row }) => (
      <div className="text-sm text-slate-500">{row.original.departamento}</div>
    ),
  },
  {
    accessorKey: "salarioBase",
    header: "Salario Base",
    cell: ({ row }) => (
      <div className="text-right font-mono text-sm">
        ₡{row.original.salarioBase.toLocaleString("es-CR")}
      </div>
    ),
  },
  {
    accessorKey: "totalBruto",
    header: "Total Bruto",
    cell: ({ row }) => (
      <div className="text-right font-mono text-sm font-semibold">
        ₡{row.original.totalBruto.toLocaleString("es-CR")}
      </div>
    ),
  },
  {
    accessorKey: "deducciones",
    header: "Deducciones",
    cell: ({ row }) => (
      <div className="text-right font-mono text-sm text-red-600">
        ₡{(row.original.deducciones || 0).toLocaleString("es-CR")}
      </div>
    ),
  },
  {
    accessorKey: "totalNeto",
    header: "Total Neto",
    cell: ({ row }) => (
      <div className="text-right font-mono text-sm font-bold text-green-700">
        ₡{row.original.totalNeto.toLocaleString("es-CR")}
      </div>
    ),
  },
  {
    accessorKey: "estado",
    header: "Estado",
    cell: ({ row }) => getEstadoBadge(row.original.estado),
  },
  {
    id: "acciones",
    header: "Acciones",
    cell: ({ row }) => {
      const nomina = row.original;
      const isPendiente = nomina.estado?.toUpperCase() === "PENDIENTE";
      const isPagada = nomina.estado?.toUpperCase() === "PAGADA";

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
            <DropdownMenuItem onClick={() => onVer(nomina)}>
              <Eye className="mr-2 h-4 w-4" />
              Ver detalles
            </DropdownMenuItem>

            {isPendiente && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => onPagar(nomina)}>
                  <DollarSign className="mr-2 h-4 w-4" />
                  Pagar nómina
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onAnular(nomina)}
                  className="text-destructive focus:text-destructive"
                >
                  <Ban className="mr-2 h-4 w-4" />
                  Anular nómina
                </DropdownMenuItem>
              </>
            )}

            {isPagada && (
              <DropdownMenuItem disabled className="text-muted-foreground">
                Nómina ya pagada
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
