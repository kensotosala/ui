"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { Loader2 } from "lucide-react";
import { NominaDTO } from "../../../nomina.types";

interface NominaAnularDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  nomina: NominaDTO | null;
  isDeleting: boolean;
  onConfirm: (id: number) => Promise<void>;
}

export function NominaAnularDialog({
  open,
  onOpenChange,
  nomina,
  isDeleting,
  onConfirm,
}: NominaAnularDialogProps) {
  if (!nomina) return null;

  const handleConfirm = async () => {
    await onConfirm(nomina.idNomina);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Anular esta nómina?</AlertDialogTitle>
          <AlertDialogDescription>
            Se anulará la nómina de <strong>{nomina.nombreEmpleado}</strong> (
            {nomina.codigoEmpleado}) por un monto de{" "}
            <strong className="text-red-700">
              ₡{nomina.totalNeto.toLocaleString("es-CR")}
            </strong>
            .
            <br />
            <br />
            Esta acción <strong>no se puede deshacer</strong> y el estado
            cambiará a ANULADA.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700"
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Anulando...
              </>
            ) : (
              "Anular Nómina"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
