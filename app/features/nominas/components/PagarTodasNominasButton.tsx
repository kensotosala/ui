/* eslint-disable @typescript-eslint/no-explicit-any */
// components/nomina/PagarTodasNominasButton.tsx
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
import { DollarSign, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { NominaDTO } from "../nomina.types";
import { nominaService } from "../services/nomina.service";

interface PagarTodasNominasButtonProps {
  nominas: NominaDTO[];
  onSuccess: () => void;
}

export function PagarTodasNominasButton({
  nominas,
  onSuccess,
}: PagarTodasNominasButtonProps) {
  const [isPaying, setIsPaying] = useState(false);
  const [open, setOpen] = useState(false);

  // Filtrar solo nóminas pendientes
  const nominasPendientes = nominas.filter(
    (n) => n.estado?.toUpperCase() === "PENDIENTE",
  );

  const totalAPagar = nominasPendientes.reduce(
    (sum, n) => sum + n.totalNeto,
    0,
  );

  const handlePagarTodas = async () => {
    if (nominasPendientes.length === 0) {
      toast.info("No hay nóminas pendientes por pagar");
      return;
    }

    setIsPaying(true);

    try {
      let exitosas = 0;
      let fallidas = 0;
      const errores: string[] = [];

      // Pagar cada nómina pendiente
      for (const nomina of nominasPendientes) {
        try {
          await nominaService.pagarNomina(nomina.idNomina);
          exitosas++;
        } catch (error: any) {
          fallidas++;
          errores.push(
            `${nomina.nombreEmpleado}: ${error.message || "Error desconocido"}`,
          );
        }
      }

      // Mostrar resultado
      if (exitosas > 0 && fallidas === 0) {
        toast.success(`✅ Se pagaron ${exitosas} nóminas exitosamente`, {
          description: `Total: ₡${totalAPagar.toLocaleString("es-CR")}`,
        });
      } else if (exitosas > 0 && fallidas > 0) {
        toast.warning(`⚠️ Se pagaron ${exitosas} nóminas`, {
          description: `${fallidas} fallaron. Ver detalles en consola.`,
        });
        console.error("Errores al pagar nóminas:", errores);
      } else {
        toast.error("❌ No se pudo pagar ninguna nómina", {
          description: "Revisa los errores en consola",
        });
        console.error("Errores:", errores);
      }

      setOpen(false);
      onSuccess();
    } catch (error: any) {
      toast.error("Error al pagar nóminas", {
        description: error.message,
      });
    } finally {
      setIsPaying(false);
    }
  };

  if (nominasPendientes.length === 0) {
    return (
      <Button disabled variant="outline" className="gap-2">
        <DollarSign className="h-4 w-4" />
        No hay nóminas pendientes
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
              Pagar Todas ({nominasPendientes.length})
            </>
          )}
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            ¿Pagar todas las nóminas pendientes?
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-3">
            <p>
              Se pagarán <strong>{nominasPendientes.length} nóminas</strong> por
              un total de:
            </p>

            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="text-2xl font-bold text-green-700">
                ₡{totalAPagar.toLocaleString("es-CR")}
              </div>
              <div className="text-sm text-green-600 mt-1">Total a pagar</div>
            </div>

            <div className="text-sm text-slate-600 bg-slate-50 p-3 rounded">
              <strong>Empleados:</strong>
              <ul className="mt-2 space-y-1 max-h-32 overflow-y-auto">
                {nominasPendientes.slice(0, 5).map((n) => (
                  <li key={n.idNomina} className="text-xs">
                    • {n.nombreEmpleado} - ₡
                    {n.totalNeto.toLocaleString("es-CR")}
                  </li>
                ))}
                {nominasPendientes.length > 5 && (
                  <li className="text-xs text-slate-500">
                    ... y {nominasPendientes.length - 5} más
                  </li>
                )}
              </ul>
            </div>

            <p className="text-red-600 font-semibold">
              ⚠️ Esta acción no se puede deshacer
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPaying}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handlePagarTodas}
            disabled={isPaying}
            className="bg-green-600 hover:bg-green-700"
          >
            {isPaying ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Pagando {nominasPendientes.length} nóminas...
              </>
            ) : (
              <>
                <DollarSign className="mr-2 h-4 w-4" />
                Confirmar Pago
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
