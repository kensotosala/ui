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
import { NominaDTO } from "../../../nomina.types";

interface NominaPagarDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  nomina: NominaDTO | null;
  onConfirm: (id: number) => Promise<void>;
}

export function NominaPagarDialog({
  open,
  onOpenChange,
  nomina,
  onConfirm,
}: NominaPagarDialogProps) {
  if (!nomina) return null;

  const handleConfirm = async () => {
    await onConfirm(nomina.idNomina);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Pagar esta nómina?</AlertDialogTitle>
          <AlertDialogDescription>
            Se pagará la nómina de <strong>{nomina.nombreEmpleado}</strong> (
            {nomina.codigoEmpleado}) por un monto de{" "}
            <strong className="text-green-700">
              ₡{nomina.totalNeto.toLocaleString("es-CR")}
            </strong>
            .
            <br />
            <br />
            Esta acción <strong>no se puede deshacer</strong> y el estado
            cambiará a PAGADA.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            className="bg-green-600 hover:bg-green-700"
          >
            Confirmar Pago
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
