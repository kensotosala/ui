/* eslint-disable @typescript-eslint/no-explicit-any */
// app/features/aguinaldo/components/dialogs/PagarTodosButton.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { DollarSign, Loader2, AlertTriangle, Gift } from "lucide-react";
import { toast } from "sonner";
import { aguinaldoService } from "../../services/aguinaldo.service";
import { AguinaldoDTO } from "../../types";

interface PagarTodosAguinaldosButtonProps {
  aguinaldos: AguinaldoDTO[];
  onSuccess: () => void;
}

export function PagarTodosAguinaldosButton({
  aguinaldos,
  onSuccess,
}: PagarTodosAguinaldosButtonProps) {
  const [isPaying, setIsPaying] = useState(false);
  const [open, setOpen] = useState(false);
  const [fechaPago, setFechaPago] = useState(
    new Date().toISOString().split("T")[0],
  );

  // Filtrar solo aguinaldos pendientes
  const aguinaldosPendientes = aguinaldos.filter(
    (a) => a.estado?.toUpperCase() === "PENDIENTE",
  );

  const totalAPagar = aguinaldosPendientes.reduce(
    (sum, a) => sum + a.montoAguinaldo,
    0,
  );

  const handlePagarTodos = async () => {
    if (aguinaldosPendientes.length === 0) {
      toast.info("No hay aguinaldos pendientes por pagar");
      return;
    }

    setIsPaying(true);

    try {
      const ids = aguinaldosPendientes.map((a) => a.idAguinaldo);
      const resultado = await aguinaldoService.pagarAguinaldosMasivo({
        idsAguinaldos: ids,
        fechaPago,
      });

      if (resultado.exitosos > 0 && resultado.fallidos === 0) {
        toast.success(`✅ Se pagaron ${resultado.exitosos} aguinaldos`, {
          description: `Total: ₡${totalAPagar.toLocaleString("es-CR")}`,
        });
      } else if (resultado.exitosos > 0 && resultado.fallidos > 0) {
        toast.warning(`⚠️ Se pagaron ${resultado.exitosos} aguinaldos`, {
          description: `${resultado.fallidos} fallaron. Ver consola.`,
        });
        console.error("Errores:", resultado.errores);
      } else {
        toast.error("❌ No se pudo pagar ningún aguinaldo", {
          description: "Revisa los errores en consola",
        });
        console.error("Errores:", resultado.errores);
      }

      setOpen(false);
      onSuccess();
    } catch (error: any) {
      toast.error("Error al pagar aguinaldos", {
        description: error.message,
      });
    } finally {
      setIsPaying(false);
    }
  };

  // Verificar si es después del 20 de diciembre
  const fechaPagoDate = new Date(fechaPago);
  const anio = fechaPagoDate.getFullYear();
  const fechaLimite = new Date(anio, 11, 20); // 20 de diciembre
  const esTarde = fechaPagoDate > fechaLimite;

  if (aguinaldosPendientes.length === 0) {
    return (
      <Button disabled variant="outline" className="gap-2">
        <Gift className="h-4 w-4" />
        No hay aguinaldos pendientes
      </Button>
    );
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          className="gap-2 bg-green-600 hover:bg-green-700"
          disabled={isPaying}
        >
          {isPaying ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Pagando...
            </>
          ) : (
            <>
              <DollarSign className="h-4 w-4" />
              Pagar Todos ({aguinaldosPendientes.length})
            </>
          )}
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-2xl">
            ¿Pagar todos los aguinaldos pendientes?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Se pagarán {aguinaldosPendientes.length} aguinaldos por un total de:
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-4">
          {/* Total a Pagar */}
          <Card className="bg-green-50 border-2 border-green-300">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-green-700 mb-2">Total a Pagar</p>
                <p className="text-5xl font-bold text-green-700">
                  ₡{totalAPagar.toLocaleString("es-CR")}
                </p>
                <p className="text-sm text-green-600 mt-2">
                  {aguinaldosPendientes.length} empleado
                  {aguinaldosPendientes.length !== 1 ? "s" : ""}
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
                      Los aguinaldos deben pagarse antes del 20 de diciembre
                      según el Código de Trabajo de Costa Rica.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Lista de Empleados */}
          <div>
            <p className="text-sm font-semibold mb-2">Empleados:</p>
            <Card>
              <CardContent className="pt-4 pb-4">
                <div className="max-h-64 overflow-y-auto space-y-2">
                  {aguinaldosPendientes.slice(0, 10).map((a, index) => (
                    <div key={a.idAguinaldo}>
                      {index > 0 && <Separator className="my-2" />}
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex-1">
                          <p className="font-medium">{a.nombreEmpleado}</p>
                          <p className="text-xs text-muted-foreground">
                            {a.codigoEmpleado} • {a.departamento}
                          </p>
                        </div>
                        <p className="font-mono font-semibold text-green-700">
                          ₡{a.montoAguinaldo.toLocaleString("es-CR")}
                        </p>
                      </div>
                    </div>
                  ))}
                  {aguinaldosPendientes.length > 10 && (
                    <p className="text-xs text-center text-muted-foreground pt-2">
                      ... y {aguinaldosPendientes.length - 10} más
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Advertencia */}
          <Card className="bg-red-50 border-red-200">
            <CardContent className="pt-4 pb-4">
              <p className="text-sm text-red-800">
                <strong>⚠️ Esta acción no se puede deshacer.</strong>
                <br />
                Todos los aguinaldos cambiarán a estado PAGADO.
              </p>
            </CardContent>
          </Card>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPaying}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handlePagarTodos}
            disabled={isPaying || !fechaPago}
            className="bg-green-600 hover:bg-green-700"
          >
            {isPaying ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Pagando {aguinaldosPendientes.length} aguinaldos...
              </>
            ) : (
              <>
                <DollarSign className="mr-2 h-4 w-4" />
                Confirmar Pago Masivo
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
