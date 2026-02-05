// app/features/aguinaldo/components/dialogs/anular-dialog.tsx
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
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Ban, AlertTriangle } from "lucide-react";
import { AguinaldoDTO } from "../../../types";

interface AguinaldoAnularDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  aguinaldo: AguinaldoDTO | null;
  onConfirm: (id: number) => Promise<void>;
}

export function AguinaldoAnularDialog({
  open,
  onOpenChange,
  aguinaldo,
  onConfirm,
}: AguinaldoAnularDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  if (!aguinaldo) return null;

  const handleAnular = async () => {
    setIsDeleting(true);
    try {
      await onConfirm(aguinaldo.idAguinaldo);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <Ban className="h-5 w-5" />
            Anular Aguinaldo
          </DialogTitle>
          <DialogDescription>
            ¿Estás seguro de que deseas anular este aguinaldo?
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Info del Empleado */}
          <Card className="bg-slate-50 border-slate-200">
            <CardContent className="pt-6 space-y-2">
              <div>
                <p className="text-sm text-muted-foreground">Empleado</p>
                <p className="text-lg font-bold">{aguinaldo.nombreEmpleado}</p>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Código</p>
                  <p className="font-semibold">{aguinaldo.codigoEmpleado}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Departamento</p>
                  <p className="font-semibold">{aguinaldo.departamento}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Monto a Anular */}
          <Card className="bg-red-50 border-red-200">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-red-700 mb-2">Monto del Aguinaldo</p>
                <p className="text-4xl font-bold text-red-700">
                  ₡{aguinaldo.montoAguinaldo.toLocaleString("es-CR")}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Detalles */}
          <Card className="bg-slate-50">
            <CardContent className="pt-4 pb-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Año</p>
                  <p className="font-semibold">
                    {new Date(aguinaldo.fechaCalculo).getFullYear()}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Días Trabajados</p>
                  <p className="font-semibold">
                    {aguinaldo.diasTrabajados} días
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Estado Actual</p>
                  <p className="font-semibold">{aguinaldo.estado}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Salario Promedio</p>
                  <p className="font-semibold">
                    ₡{aguinaldo.salarioPromedio.toLocaleString("es-CR")}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Advertencia */}
          <Card className="bg-red-50 border-red-300">
            <CardContent className="pt-4 pb-4">
              <div className="flex gap-3">
                <AlertTriangle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
                <div className="text-sm text-red-800 space-y-2">
                  <p className="font-semibold">
                    ⚠️ Esta acción no se puede deshacer
                  </p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>El aguinaldo cambiará a estado ANULADO</li>
                    <li>No se podrá pagar ni modificar</li>
                    <li>Se mantendrá en el historial como anulado</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            onClick={handleAnular}
            disabled={isDeleting}
            variant="destructive"
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Anulando...
              </>
            ) : (
              <>
                <Ban className="mr-2 h-4 w-4" />
                Anular Aguinaldo
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
