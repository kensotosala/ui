"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Permiso, EstadoPermiso } from "../../../types";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  Calendar,
  User,
  FileText,
  CheckCircle,
  DollarSign,
  MessageSquare,
} from "lucide-react";

interface PermisoDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  permiso: Permiso | null;
}

/**
 * Configuración del badge según estado
 */
const getEstadoBadge = (estado: string | null) => {
  const badges: Record<
    EstadoPermiso,
    {
      variant: "default" | "secondary" | "destructive" | "outline";
      className: string;
    }
  > = {
    [EstadoPermiso.PENDIENTE]: {
      variant: "secondary",
      className: "bg-yellow-100 text-yellow-800",
    },
    [EstadoPermiso.APROBADA]: {
      variant: "default",
      className: "bg-green-100 text-green-800",
    },
    [EstadoPermiso.RECHAZADA]: {
      variant: "destructive",
      className: "bg-red-100 text-red-800",
    },
  };

  if (!estado || !(estado in badges)) {
    return badges[EstadoPermiso.PENDIENTE];
  }

  return badges[estado as EstadoPermiso];
};

export function PermisoDetailsDialog({
  open,
  onOpenChange,
  permiso,
}: PermisoDetailsDialogProps) {
  if (!permiso) return null;

  const badgeConfig = getEstadoBadge(permiso.estadoSolicitud);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Detalle de Solicitud de Permiso</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Información del Empleado */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <User className="h-4 w-4" />
              <span>Información del Empleado</span>
            </div>
            <Separator />
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground">ID Empleado</p>
                <p className="text-sm font-medium">#{permiso.empleadoId}</p>
              </div>
            </div>
          </section>

          {/* Información de la Solicitud */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <Calendar className="h-4 w-4" />
              <span>Información de la Solicitud</span>
            </div>
            <Separator />
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground">
                  Fecha de Solicitud
                </p>
                <p className="text-sm font-medium">
                  {format(
                    new Date(permiso.fechaSolicitud),
                    "dd 'de' MMMM 'de' yyyy",
                    { locale: es },
                  )}
                </p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground">Estado</p>
                <Badge
                  variant={badgeConfig.variant}
                  className={badgeConfig.className}
                >
                  {permiso.estadoSolicitud || EstadoPermiso.PENDIENTE}
                </Badge>
              </div>

              <div>
                <p className="text-xs text-muted-foreground">
                  Fecha del Permiso
                </p>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-blue-500" />
                  <p className="text-sm font-medium">
                    {format(new Date(permiso.fechaPermiso), "dd/MM/yyyy", {
                      locale: es,
                    })}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-xs text-muted-foreground">
                  Con Goce de Salario
                </p>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-green-600" />
                  {permiso.conGoceSalario ? (
                    <Badge className="bg-blue-100 text-blue-800">Sí</Badge>
                  ) : (
                    <Badge variant="outline">No</Badge>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Motivo */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <FileText className="h-4 w-4" />
              <span>Motivo</span>
            </div>
            <Separator />
            <p className="text-sm bg-gray-50 p-3 rounded-md">
              {permiso.motivo}
            </p>
          </section>

          {/* Información de Aprobación */}
          {(permiso.jefeApruebaId || permiso.fechaAprobacion) && (
            <section className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <CheckCircle className="h-4 w-4" />
                <span>Información de Aprobación</span>
              </div>
              <Separator />
              <div className="bg-blue-50 p-4 rounded-md space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  {permiso.jefeApruebaId && (
                    <div>
                      <p className="text-xs text-muted-foreground">
                        {permiso.estadoSolicitud === EstadoPermiso.RECHAZADA
                          ? "Rechazado por"
                          : "Aprobado por"}
                      </p>
                      <p className="text-sm font-medium">
                        Jefe #{permiso.jefeApruebaId}
                      </p>
                    </div>
                  )}

                  {permiso.fechaAprobacion && (
                    <div>
                      <p className="text-xs text-muted-foreground">
                        {permiso.estadoSolicitud === EstadoPermiso.RECHAZADA
                          ? "Fecha de Rechazo"
                          : "Fecha de Aprobación"}
                      </p>
                      <p className="text-sm">
                        {format(
                          new Date(permiso.fechaAprobacion),
                          "dd/MM/yyyy HH:mm",
                          { locale: es },
                        )}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </section>
          )}

          {/* Comentarios de Rechazo */}
          {permiso.comentariosRechazo &&
            permiso.estadoSolicitud === EstadoPermiso.RECHAZADA && (
              <section className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <MessageSquare className="h-4 w-4" />
                  <span>Comentarios de Rechazo</span>
                </div>
                <Separator />
                <div className="bg-red-50 p-3 rounded-md border border-red-200">
                  <p className="text-sm text-red-900">
                    {permiso.comentariosRechazo}
                  </p>
                </div>
              </section>
            )}

          {/* Metadatos */}
          {(permiso.fechaCreacion || permiso.fechaModificacion) && (
            <section className="space-y-2">
              <Separator />
              <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground">
                {permiso.fechaCreacion && (
                  <div>
                    <span className="font-medium">Creado:</span>{" "}
                    {format(
                      new Date(permiso.fechaCreacion),
                      "dd/MM/yyyy HH:mm",
                      {
                        locale: es,
                      },
                    )}
                  </div>
                )}
                {permiso.fechaModificacion && (
                  <div>
                    <span className="font-medium">Última modificación:</span>{" "}
                    {format(
                      new Date(permiso.fechaModificacion),
                      "dd/MM/yyyy HH:mm",
                      { locale: es },
                    )}
                  </div>
                )}
              </div>
            </section>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
