/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { NominaDTO } from "../../../nomina.types";

interface NominaDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  nomina: NominaDTO | null;
}

export function NominaDetailsDialog({
  open,
  onOpenChange,
  nomina,
}: NominaDetailsDialogProps) {
  if (!nomina) return null;

  const getEstadoBadge = (estado?: string) => {
    const estadoUpper = estado?.toUpperCase() || "PENDIENTE";
    const variants: Record<string, any> = {
      PENDIENTE: "secondary",
      PAGADA: "default",
      ANULADA: "destructive",
    };
    return (
      <Badge variant={variants[estadoUpper] || "secondary"}>
        {estadoUpper}
      </Badge>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-150">
        <DialogHeader>
          <DialogTitle>Detalle de Nómina</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Información del Empleado */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-lg">
            <div>
              <div className="text-sm text-slate-500">Empleado</div>
              <div className="font-semibold">{nomina.nombreEmpleado}</div>
            </div>
            <div>
              <div className="text-sm text-slate-500">Código</div>
              <div className="font-semibold">{nomina.codigoEmpleado}</div>
            </div>
            <div>
              <div className="text-sm text-slate-500">Puesto</div>
              <div className="font-semibold">{nomina.puesto}</div>
            </div>
            <div>
              <div className="text-sm text-slate-500">Departamento</div>
              <div className="font-semibold">{nomina.departamento}</div>
            </div>
          </div>

          {/* Período y Estado */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-slate-500">Período</div>
              <div className="font-medium">
                {new Date(nomina.periodoNomina).toLocaleDateString("es-CR", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
            </div>
            <div>
              <div className="text-sm text-slate-500">Estado</div>
              <div className="mt-1">{getEstadoBadge(nomina.estado)}</div>
            </div>
          </div>

          <Separator />

          {/* Ingresos */}
          <div>
            <h4 className="font-semibold text-sm text-slate-700 mb-2">
              INGRESOS
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between py-2 border-b">
                <span>Salario Base Quincenal</span>
                <span className="font-mono">
                  ₡{nomina.salarioBase.toLocaleString("es-CR")}
                </span>
              </div>
              {nomina.montoHorasExtra && nomina.montoHorasExtra > 0 && (
                <div className="flex justify-between py-2 border-b">
                  <span>
                    Horas Extra ({nomina.horasExtras?.toFixed(2)} hrs)
                  </span>
                  <span className="font-mono text-green-600">
                    +₡{nomina.montoHorasExtra.toLocaleString("es-CR")}
                  </span>
                </div>
              )}
              {nomina.bonificaciones && nomina.bonificaciones > 0 && (
                <div className="flex justify-between py-2 border-b">
                  <span>Bonificaciones</span>
                  <span className="font-mono text-green-600">
                    +₡{nomina.bonificaciones.toLocaleString("es-CR")}
                  </span>
                </div>
              )}
              <div className="flex justify-between py-2 border-b font-semibold bg-slate-50 px-2 rounded">
                <span>Total Bruto</span>
                <span className="font-mono">
                  ₡{nomina.totalBruto.toLocaleString("es-CR")}
                </span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Deducciones */}
          <div>
            <h4 className="font-semibold text-sm text-slate-700 mb-2">
              DEDUCCIONES
            </h4>
            <div className="space-y-2">
              {nomina.deducciones && nomina.deducciones > 0 && (
                <div className="flex justify-between py-2 border-b">
                  <span>CCSS + Impuesto Renta</span>
                  <span className="font-mono text-red-600">
                    -₡{nomina.deducciones.toLocaleString("es-CR")}
                  </span>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Total Neto */}
          <div className="flex justify-between py-3 bg-green-50 px-4 rounded-lg font-bold text-lg">
            <span>Total Neto</span>
            <span className="font-mono text-green-700">
              ₡{nomina.totalNeto.toLocaleString("es-CR")}
            </span>
          </div>

          {/* Fechas */}
          <div className="grid grid-cols-2 gap-4 text-xs text-slate-500 pt-2">
            {nomina.fechaPago && (
              <div>
                <span className="font-medium">Fecha de Pago:</span>{" "}
                {new Date(nomina.fechaPago).toLocaleDateString("es-CR")}
              </div>
            )}
            {nomina.fechaCreacion && (
              <div>
                <span className="font-medium">Creada:</span>{" "}
                {new Date(nomina.fechaCreacion).toLocaleDateString("es-CR")}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
