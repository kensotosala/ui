"use client";

import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import TableHeader from "@/components/TableHeader";
import { GenerarNominaQuincenalDTO, NominaDTO } from "../../nomina.types";
import { columns } from "./nomina-columns";
import { NominaGenerateDialog } from "./dialogs/nomina-generate-dialog";
import { DataTable } from "./data-table";
import { NominaDetailsDialog } from "./dialogs/nomina-details-dialog";
import { NominaPagarDialog } from "./dialogs/nomina-pagar-dialog";
import { NominaAnularDialog } from "./dialogs/nomina-anular-dialog";
import { useNomina } from "../../hooks/useNomina";

interface NominaTableProps {
  quincena?: number;
  mes?: number;
  anio?: number;
}

export function NominaTable({ quincena, mes, anio }: NominaTableProps) {
  const {
    nominas,
    isLoading,
    refetch,
    generarNomina,
    pagarNomina,
    anularNomina,
    isDeleting,
    isGenerating,
  } = useNomina(quincena, mes, anio);

  const [openGenerate, setOpenGenerate] = useState(false);
  const [openDetails, setOpenDetails] = useState(false);
  const [openPagar, setOpenPagar] = useState(false);
  const [openAnular, setOpenAnular] = useState(false);

  const [selectedNomina, setSelectedNomina] = useState<NominaDTO | null>(null);

  const handleGenerate = async (data: GenerarNominaQuincenalDTO) => {
    try {
      await generarNomina(data);
      setOpenGenerate(false);
      refetch();
    } catch (error) {
      console.error("Error al generar nómina:", error);
      throw error;
    }
  };

  const handlePagar = async (id: number) => {
    try {
      await pagarNomina(id);
      setOpenPagar(false);
      setSelectedNomina(null);
      refetch();
    } catch (error) {
      console.error("Error al pagar nómina:", error);
      throw error;
    }
  };

  const handleAnular = async (id: number) => {
    try {
      await anularNomina(id);
      setOpenAnular(false);
      setSelectedNomina(null);
      refetch();
    } catch (error) {
      console.error("Error al anular nómina:", error);
      throw error;
    }
  };

  const handleVer = (nomina: NominaDTO) => {
    setSelectedNomina(nomina);
    setOpenDetails(true);
  };

  const handlePagarClick = (nomina: NominaDTO) => {
    setSelectedNomina(nomina);
    setOpenPagar(true);
  };

  const handleAnularClick = (nomina: NominaDTO) => {
    setSelectedNomina(nomina);
    setOpenAnular(true);
  };

  const tableColumns = columns(handleVer, handlePagarClick, handleAnularClick);

  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  if (!nominas || nominas.length === 0) {
    return (
      <div className="text-center py-10 border rounded-lg bg-linear-to-br from-slate-50 to-blue-50">
        <div className="max-w-md mx-auto">
          <h3 className="text-lg font-medium">No hay nóminas registradas</h3>
          <p className="text-muted-foreground mt-2 mb-4">
            Genere una nueva nómina quincenal para comenzar
          </p>
          <Button
            onClick={() => setOpenGenerate(true)}
            className="bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
          >
            Generar Nómina
          </Button>

          <NominaGenerateDialog
            open={openGenerate}
            onOpenChange={setOpenGenerate}
            onGenerate={handleGenerate}
            isGenerating={isGenerating}
            defaultQuincena={quincena}
            defaultMes={mes}
            defaultAnio={anio}
          />
        </div>
      </div>
    );
  }

  return (
    <>
      <TableHeader
        title="Nómina Quincenal"
        entity="Nómina"
        onAddClick={() => setOpenGenerate(true)}
      />

      <DataTable columns={tableColumns} data={nominas} />

      {/* DIÁLOGOS */}
      <NominaGenerateDialog
        open={openGenerate}
        onOpenChange={setOpenGenerate}
        onGenerate={handleGenerate}
        isGenerating={isGenerating}
        defaultQuincena={quincena}
        defaultMes={mes}
        defaultAnio={anio}
      />

      <NominaDetailsDialog
        open={openDetails}
        onOpenChange={setOpenDetails}
        nomina={selectedNomina}
      />

      <NominaPagarDialog
        open={openPagar}
        onOpenChange={(open) => {
          setOpenPagar(open);
          if (!open) setSelectedNomina(null);
        }}
        nomina={selectedNomina}
        onConfirm={handlePagar}
      />

      <NominaAnularDialog
        open={openAnular}
        onOpenChange={(open) => {
          setOpenAnular(open);
          if (!open) setSelectedNomina(null);
        }}
        nomina={selectedNomina}
        isDeleting={isDeleting}
        onConfirm={handleAnular}
      />
    </>
  );
}
