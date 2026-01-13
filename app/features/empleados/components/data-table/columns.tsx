"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Empleado, EstadoEmpleado, TipoContrato } from "../../types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  MoreHorizontal,
  User,
  Mail,
  Phone,
  Calendar,
  Briefcase,
  Building,
  DollarSign,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const columns = (
  onVer: (empleado: Empleado) => void,
  onEditar: (empleado: Empleado) => void,
  onEliminar: (empleado: Empleado) => void,
  onCambiarEstado?: (empleado: Empleado, nuevoEstado: EstadoEmpleado) => void
): ColumnDef<Empleado>[] => [
  {
    accessorKey: "codigoEmpleado",
    header: "Código",
    cell: ({ getValue }) => (
      <div className="font-mono font-medium">{getValue<string>()}</div>
    ),
  },
  {
    accessorKey: "nombre",
    header: "Nombre",
    cell: ({ row }) => {
      const empleado = row.original;
      const iniciales = `${empleado.nombre.charAt(
        0
      )}${empleado.primerApellido.charAt(0)}`.toUpperCase();

      return (
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9 border">
            <AvatarImage
              src={`https://api.dicebear.com/7.x/initials/svg?seed=${empleado.codigoEmpleado}`}
              alt={`${empleado.nombre} ${empleado.primerApellido}`}
            />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {iniciales}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">
              {empleado.nombre} {empleado.primerApellido}
              {empleado.segundoApellido && ` ${empleado.segundoApellido}`}
            </div>
            <div className="text-sm text-muted-foreground flex items-center gap-1">
              <Mail className="h-3 w-3" />
              {empleado.email}
            </div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "telefono",
    header: "Teléfono",
    cell: ({ getValue }) => (
      <div className="flex items-center gap-1">
        <Phone className="h-3 w-3 text-muted-foreground" />
        {getValue<string>() || "-"}
      </div>
    ),
  },
  {
    accessorKey: "puestoId",
    header: "Puesto",
    cell: ({ row }) => {
      // En una implementación real, esto vendría de un contexto o query
      // Por ahora mostramos el ID
      const empleado = row.original;
      return (
        <div className="flex items-center gap-1">
          <Briefcase className="h-3 w-3 text-muted-foreground" />
          <Badge variant="outline" className="text-xs">
            #{empleado.puestoId}
          </Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "departamentoId",
    header: "Departamento",
    cell: ({ row }) => {
      const empleado = row.original;
      return (
        <div className="flex items-center gap-1">
          <Building className="h-3 w-3 text-muted-foreground" />
          <Badge variant="outline" className="text-xs">
            #{empleado.departamentoId}
          </Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "fechaContratacion",
    header: "Contratación",
    cell: ({ getValue }) => {
      const fecha = getValue<string>();
      if (!fecha) return "-";

      const date = new Date(fecha);
      const ahora = new Date();
      const años = ahora.getFullYear() - date.getFullYear();

      return (
        <div className="flex flex-col">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3 text-muted-foreground" />
            {date.toLocaleDateString("es-ES")}
          </div>
          <div className="text-xs text-muted-foreground">
            {años} {años === 1 ? "año" : "años"}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "salarioBase",
    header: "Salario",
    cell: ({ getValue }) => {
      const salario = getValue<number>();
      return (
        <div className="flex items-center gap-1 font-medium">
          <DollarSign className="h-3 w-3" />
          {salario.toLocaleString("es-ES", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </div>
      );
    },
  },
  {
    accessorKey: "tipoContrato",
    header: "Contrato",
    cell: ({ getValue }) => {
      const tipoContrato = getValue<TipoContrato>();
      const config = {
        FIJO: {
          label: "Fijo",
          color: "bg-green-100 text-green-800 border-green-200",
        },
        TEMPORAL: {
          label: "Temporal",
          color: "bg-yellow-100 text-yellow-800 border-yellow-200",
        },
        PRACTICAS: {
          label: "Prácticas",
          color: "bg-blue-100 text-blue-800 border-blue-200",
        },
      }[tipoContrato];

      return (
        <Badge variant="outline" className={`${config.color} border`}>
          {config.label}
        </Badge>
      );
    },
  },
  {
    accessorKey: "estado",
    header: "Estado",
    cell: ({ row }) => {
      const empleado = row.original;
      const estado = empleado.estado || "ACTIVO";

      return (
        <Badge
          variant={estado === "ACTIVO" ? "default" : "secondary"}
          className={
            estado === "ACTIVO"
              ? "bg-green-100 text-green-800 hover:bg-green-100"
              : "bg-gray-100 text-gray-800 hover:bg-gray-100"
          }
        >
          {estado === "ACTIVO" ? "Activo" : "Inactivo"}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    header: "Acciones",
    cell: ({ row }) => {
      const empleado = row.original;
      const estadoActual = empleado.estado || "ACTIVO";
      const nuevoEstado: EstadoEmpleado =
        estadoActual === "ACTIVO" ? "INACTIVO" : "ACTIVO";

      return (
        <div className="flex justify-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Abrir menú</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                Acciones para {empleado.nombre}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={() => onVer(empleado)}
                className="cursor-pointer"
              >
                <User className="h-4 w-4 mr-2" />
                Ver Detalles
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => onEditar(empleado)}
                className="cursor-pointer"
              >
                <svg
                  className="h-4 w-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                Editar
              </DropdownMenuItem>

              {onCambiarEstado && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => onCambiarEstado(empleado, nuevoEstado)}
                    className={`cursor-pointer ${
                      nuevoEstado === "INACTIVO"
                        ? "text-yellow-600"
                        : "text-green-600"
                    }`}
                  >
                    {estadoActual === "ACTIVO" ? (
                      <>
                        <svg
                          className="h-4 w-4 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        Desactivar Empleado
                      </>
                    ) : (
                      <>
                        <svg
                          className="h-4 w-4 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        Reactivar Empleado
                      </>
                    )}
                  </DropdownMenuItem>
                </>
              )}

              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onEliminar(empleado)}
                className="cursor-pointer text-red-600 focus:text-red-600"
              >
                <svg
                  className="h-4 w-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
                Eliminar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];

// Versión simplificada para casos que no necesitan todas las columnas
export const columnsBasicas = (
  onVer: (empleado: Empleado) => void,
  onEditar: (empleado: Empleado) => void,
  onEliminar: (empleado: Empleado) => void
): ColumnDef<Empleado>[] => [
  {
    accessorKey: "codigoEmpleado",
    header: "Código",
  },
  {
    accessorKey: "nombre",
    header: "Nombre",
    cell: ({ row }) => {
      const empleado = row.original;
      return (
        <div className="font-medium">
          {empleado.nombre} {empleado.primerApellido}
        </div>
      );
    },
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "puestoId",
    header: "Puesto ID",
  },
  {
    accessorKey: "estado",
    header: "Estado",
    cell: ({ getValue }) => {
      const estado = getValue<EstadoEmpleado>() || "ACTIVO";
      return (
        <div
          className={`text-center font-medium ${
            estado === "ACTIVO" ? "text-green-600" : "text-red-500"
          }`}
        >
          {estado === "ACTIVO" ? "Activo" : "Inactivo"}
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
