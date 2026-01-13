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
import { MoreHorizontal } from "lucide-react";
import { Empleado, EstadoEmpleado } from "../../types";

export const columns = (
  onVer: (empleado: Empleado) => void,
  onEditar: (empleado: Empleado) => void,
  onEliminar: (empleado: Empleado) => void
): ColumnDef<Empleado>[] => [
  {
    accessorKey: "idEmpleado",
    header: "ID",
  },
  {
    accessorKey: "codigoEmpleado",
    header: "Código",
  },
  {
    id: "nombreCompleto",
    header: "Nombre",
    cell: ({ row }) => {
      const { nombre, primerApellido, segundoApellido } = row.original;

      return (
        <span>
          {[nombre, primerApellido, segundoApellido].filter(Boolean).join(" ")}
        </span>
      );
    },
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  // {
  //   accessorKey: "jefeInmediatoId",
  //   header: "Jefe",
  //   cell: ({ getValue }) => (
  //     <div className="text-center">{getValue<number | undefined>() ?? "-"}</div>
  //   ),
  // },
  {
    accessorKey: "estado",
    header: "Estado",
    cell: ({ getValue }) => {
      const estado = getValue<EstadoEmpleado | undefined>();

      if (!estado) {
        return <div className="text-center text-gray-400">-</div>;
      }

      return (
        <div
          className={`font-medium ${
            estado === "ACTIVO" ? "text-green-600" : "text-red-500"
          }`}
        >
          {estado}
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "Acciones",
    cell: ({ row }) => {
      const empleado = row.original;

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

              <DropdownMenuItem onClick={() => onVer(empleado)}>
                Ver
              </DropdownMenuItem>

              <DropdownMenuItem onClick={() => onEditar(empleado)}>
                Editar
              </DropdownMenuItem>

              <DropdownMenuItem
                className="text-red-500"
                onClick={() => onEliminar(empleado)}
              >
                Eliminar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
