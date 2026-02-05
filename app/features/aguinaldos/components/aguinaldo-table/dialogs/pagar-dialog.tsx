// app/features/aguinaldo/components/dialogs/pagar-dialog.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, DollarSign, AlertTriangle } from "lucide-react";
import { AguinaldoDTO } from "../../../types";

interface AguinaldoPagarDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  aguinaldo: AguinaldoDTO | null;
  onConfirm: (id: number, fechaPago: string) => Promise<void>;
}

export function AguinaldoPagarDialog({
  open,
  onOpenChange,
  aguinaldo,
  onConfirm,
}: AguinaldoPagarDialogProps) {
  const [fechaPago, setFechaPago] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [isPaying, setIsPaying] = useState(false);

  if (!aguinaldo) return null;

  const handlePagar = async () => {
    setIsPaying(true);
    try {
      await onConfirm(aguinaldo.idAguinaldo, fechaPago);
    } finally {
      setIsPaying(false);
    }
  };

  // Verificar si es después del 20 de diciembre
  const fechaPagoDate = new Date(fechaPago);
  const anio = fechaPagoDate.getFullYear();
  const fechaLimite = new Date(anio, 11, 20); // 20 de diciembre
  const esTarde = fechaPagoDate > fechaLimite;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-green-600" />
            Pagar Aguinaldo
          </DialogTitle>
          <DialogDescription>
            Confirma el pago del aguinaldo para este empleado
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Info del Empleado */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="pt-6 space-y-2">
              <div>
                <p className="text-sm text-blue-900 font-medium">Empleado</p>
                <p className="text-lg font-bold text-blue-700">
                  {aguinaldo.nombreEmpleado}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-blue-700">Código</p>
                  <p className="font-semibold text-blue-900">
                    {aguinaldo.codigoEmpleado}
                  </p>
                </div>
                <div>
                  <p className="text-blue-700">Departamento</p>
                  <p className="font-semibold text-blue-900">
                    {aguinaldo.departamento}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Monto a Pagar */}
          <Card className="bg-green-50 border-green-200">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-green-700 mb-2">
                  Monto del Aguinaldo
                </p>
                <p className="text-4xl font-bold text-green-700">
                  ₡{aguinaldo.montoAguinaldo.toLocaleString("es-CR")}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Fecha de Pago */}
          <div className="space-y-2">
            <Label htmlFor="fechaPago">Fecha de Pago</Label>
            <Input
              id="fechaPago"
              type="date"
              value={fechaPago}
              onChange={(e) => setFechaPago(e.target.value)}
              max={new Date().toISOString().split("T")[0]}
            />
          </div>

          {/* Advertencia si es tarde */}
          {esTarde && (
            <Card className="bg-yellow-50 border-yellow-300">
              <CardContent className="pt-4 pb-4">
                <div className="flex gap-3">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-semibold text-yellow-900 mb-1">
                      ⚠️ Pago fuera de fecha legal
                    </p>
                    <p className="text-yellow-800">
                      Según el Código de Trabajo de Costa Rica, el aguinaldo
                      debe pagarse antes del 20 de diciembre. Esta fecha es
                      posterior.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Advertencia general */}
          <Card className="bg-red-50 border-red-200">
            <CardContent className="pt-4 pb-4">
              <p className="text-sm text-red-800">
                <strong>⚠️ Esta acción no se puede deshacer.</strong>
                <br />
                El aguinaldo cambiará a estado PAGADO y se registrará la fecha
                de pago.
              </p>
            </CardContent>
          </Card>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            onClick={handlePagar}
            disabled={isPaying || !fechaPago}
            className="bg-green-600 hover:bg-green-700"
          >
            {isPaying ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Procesando...
              </>
            ) : (
              <>
                <DollarSign className="mr-2 h-4 w-4" />
                Confirmar Pago
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
