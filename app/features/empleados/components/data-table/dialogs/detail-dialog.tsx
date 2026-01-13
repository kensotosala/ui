"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Calendar,
  Mail,
  Phone,
  Briefcase,
  Building,
  User,
  DollarSign,
  Clock,
  Shield,
  Users,
} from "lucide-react";
import { Empleado, EstadoEmpleado, TipoContrato } from "../../../types";

interface EmpleadoDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  empleado: Empleado | null;
  nombrePuesto?: string;
  nombreDepartamento?: string;
  nombreJefe?: string;
  nombreRol?: string;
}

export function EmpleadoDetailsDialog({
  open,
  onOpenChange,
  empleado,
  nombrePuesto = "No especificado",
  nombreDepartamento = "No especificado",
  nombreJefe = "No asignado",
  nombreRol = "No especificado",
}: EmpleadoDetailsDialogProps) {
  if (!empleado) return null;

  const calcularAntiguedad = () => {
    try {
      const fechaContratacion = new Date(empleado.fechaContratacion);
      const ahora = new Date();

      let años = ahora.getFullYear() - fechaContratacion.getFullYear();
      let meses = ahora.getMonth() - fechaContratacion.getMonth();

      if (meses < 0) {
        años--;
        meses += 12;
      }

      if (años === 0 && meses === 0) {
        const dias = Math.floor(
          (ahora.getTime() - fechaContratacion.getTime()) /
            (1000 * 60 * 60 * 24)
        );
        return `${dias} ${dias === 1 ? "día" : "días"}`;
      }

      if (años === 0) {
        return `${meses} ${meses === 1 ? "mes" : "meses"}`;
      }

      return `${años} ${años === 1 ? "año" : "años"} ${
        meses > 0 ? `y ${meses} ${meses === 1 ? "mes" : "meses"}` : ""
      }`;
    } catch {
      return "No disponible";
    }
  };

  const getContratoColor = (tipo: TipoContrato) => {
    switch (tipo) {
      case "FIJO":
        return "bg-green-100 text-green-800";
      case "TEMPORAL":
        return "bg-yellow-100 text-yellow-800";
      case "PRACTICAS":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getEstadoColor = (estado: EstadoEmpleado) => {
    return estado === "ACTIVO"
      ? "bg-green-100 text-green-800 hover:bg-green-100"
      : "bg-gray-100 text-gray-800 hover:bg-gray-100";
  };

  const getContratoLabel = (tipo: TipoContrato) => {
    switch (tipo) {
      case "FIJO":
        return "Contrato Fijo";
      case "TEMPORAL":
        return "Contrato Temporal";
      case "PRACTICAS":
        return "Prácticas/Formación";
      default:
        return tipo;
    }
  };

  const iniciales = `${empleado.nombre.charAt(
    0
  )}${empleado.primerApellido.charAt(0)}`.toUpperCase();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <User className="h-6 w-6" />
            Detalle del Empleado
          </DialogTitle>
          <DialogDescription>
            Información completa del empleado en el sistema
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Encabezado con foto y datos principales */}
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="shrink-0">
              <Avatar className="h-24 w-24 border-4 border-gray-100">
                <AvatarImage
                  src={`https://api.dicebear.com/7.x/initials/svg?seed=${empleado.codigoEmpleado}`}
                  alt={`${empleado.nombre} ${empleado.primerApellido}`}
                />
                <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                  {iniciales}
                </AvatarFallback>
              </Avatar>
            </div>

            <div className="flex-1 space-y-3">
              <div>
                <h2 className="text-2xl font-bold">
                  {empleado.nombre} {empleado.primerApellido}
                  {empleado.segundoApellido && ` ${empleado.segundoApellido}`}
                </h2>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className="font-mono">
                    {empleado.codigoEmpleado}
                  </Badge>
                  <Badge
                    variant="outline"
                    className={getEstadoColor(empleado.estado || "ACTIVO")}
                  >
                    {empleado.estado === "ACTIVO" ? "Activo" : "Inactivo"}
                  </Badge>
                  <Badge
                    variant="outline"
                    className={getContratoColor(empleado.tipoContrato)}
                  >
                    {getContratoLabel(empleado.tipoContrato)}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">{empleado.email}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">
                    {empleado.telefono || "No especificado"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Información Organizacional */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Building className="h-5 w-5" />
              Información Organizacional
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Puesto</span>
                </div>
                <p className="font-medium">{nombrePuesto}</p>
                <div className="text-xs text-gray-500">
                  ID: {empleado.puestoId}
                </div>
              </div>

              <div className="space-y-2 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Departamento</span>
                </div>
                <p className="font-medium">{nombreDepartamento}</p>
                <div className="text-xs text-gray-500">
                  ID: {empleado.departamentoId}
                </div>
              </div>

              <div className="space-y-2 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Jefe Inmediato</span>
                </div>
                <p className="font-medium">{nombreJefe}</p>
                {empleado.jefeInmediatoId && (
                  <div className="text-xs text-gray-500">
                    ID: {empleado.jefeInmediatoId}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Información Laboral */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Información Laboral
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">
                    Fecha Contratación
                  </span>
                </div>
                <p className="font-medium">
                  {new Date(empleado.fechaContratacion).toLocaleDateString(
                    "es-ES",
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }
                  )}
                </p>
              </div>

              <div className="space-y-2 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Antigüedad</span>
                </div>
                <p className="font-medium">{calcularAntiguedad()}</p>
              </div>

              <div className="space-y-2 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Salario Base</span>
                </div>
                <p className="font-medium">
                  {empleado.salarioBase.toLocaleString("es-ES", {
                    style: "currency",
                    currency: "USD",
                    minimumFractionDigits: 2,
                  })}
                </p>
                <div className="text-xs text-gray-500">Anual</div>
              </div>

              <div className="space-y-2 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Rol del Sistema</span>
                </div>
                <p className="font-medium">{nombreRol}</p>
                <div className="text-xs text-gray-500">
                  ID: {empleado.rolId}
                </div>
              </div>
            </div>
          </div>

          {/* Información de Sistema */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Información de Sistema</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Usuario del Sistema</p>
                <p className="font-medium">
                  {empleado.nombreUsuario || "No asignado"}
                </p>
              </div>

              <div className="space-y-2 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Última Actualización</p>
                <p className="font-medium">
                  {empleado.fechaModificacion
                    ? new Date(empleado.fechaModificacion).toLocaleDateString(
                        "es-ES",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )
                    : "No disponible"}
                </p>
              </div>
            </div>
          </div>

          {/* Notas / Observaciones */}
          {(empleado.notas || empleado.observaciones) && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Notas y Observaciones</h3>

              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-gray-700 whitespace-pre-line">
                  {empleado.notas || empleado.observaciones}
                </p>
              </div>
            </div>
          )}

          {/* Pie con información de auditoría */}
          <div className="pt-4 border-t text-xs text-gray-500">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="font-medium">ID Interno:</span>{" "}
                {empleado.id || "No disponible"}
              </div>
              <div className="text-right">
                <span className="font-medium">Creado:</span>{" "}
                {empleado.fechaCreacion
                  ? new Date(empleado.fechaCreacion).toLocaleDateString("es-ES")
                  : "No disponible"}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Versión simplificada (compatible con el patrón de departamentos)
export function EmpleadoDetailsDialogSimple({
  open,
  onOpenChange,
  empleado,
}: EmpleadoDetailsDialogProps) {
  if (!empleado) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Detalle del Empleado</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 text-sm">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-muted-foreground">ID</p>
              <p className="font-medium">{empleado.id || "-"}</p>
            </div>

            <div>
              <p className="text-muted-foreground">Estado</p>
              <Badge
                variant={empleado.estado === "ACTIVO" ? "default" : "secondary"}
              >
                {empleado.estado || "ACTIVO"}
              </Badge>
            </div>

            <div className="col-span-2">
              <p className="text-muted-foreground">Código</p>
              <p className="font-medium">{empleado.codigoEmpleado}</p>
            </div>

            <div className="col-span-2">
              <p className="text-muted-foreground">Nombre Completo</p>
              <p className="font-medium">
                {empleado.nombre} {empleado.primerApellido}
                {empleado.segundoApellido && ` ${empleado.segundoApellido}`}
              </p>
            </div>

            <div>
              <p className="text-muted-foreground">Email</p>
              <p>{empleado.email}</p>
            </div>

            <div>
              <p className="text-muted-foreground">Teléfono</p>
              <p>{empleado.telefono || "-"}</p>
            </div>

            <div>
              <p className="text-muted-foreground">Puesto ID</p>
              <p>{empleado.puestoId}</p>
            </div>

            <div>
              <p className="text-muted-foreground">Departamento ID</p>
              <p>{empleado.departamentoId}</p>
            </div>

            <div>
              <p className="text-muted-foreground">Tipo de Contrato</p>
              <p>{empleado.tipoContrato}</p>
            </div>

            <div>
              <p className="text-muted-foreground">Salario Base</p>
              <p>${empleado.salarioBase.toLocaleString()}</p>
            </div>

            <div>
              <p className="text-muted-foreground">Fecha Contratación</p>
              <p>
                {new Date(empleado.fechaContratacion).toLocaleDateString(
                  "es-ES"
                )}
              </p>
            </div>

            <div>
              <p className="text-muted-foreground">Jefe Inmediato ID</p>
              <p>{empleado.jefeInmediatoId || "-"}</p>
            </div>

            <div>
              <p className="text-muted-foreground">Rol ID</p>
              <p>{empleado.rolId}</p>
            </div>

            <div>
              <p className="text-muted-foreground">Usuario Sistema</p>
              <p>{empleado.nombreUsuario || "-"}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
