/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { usePuestos } from "@/app/features/puestos/hooks/usePuestos";
import { columns } from "@/app/features/puestos/components/puestosTable/columns";
import { DataTable } from "@/app/features/puestos/components/puestosTable/data-table";
import { Puesto } from "@/app/features/puestos/types";
import { PuestoCreateDialog } from "@/app/features/puestos/components/puestosTable/create-dialog";
import { PuestoDetailsDialog } from "@/app/features/puestos/components/puestosTable/detail-dialog";
import { PuestoEditDialog } from "@/app/features/puestos/components/puestosTable/edit-dialog";
import { PuestoDeleteDialog } from "@/app/features/puestos/components/puestosTable/delete-dialog";
import { usePuestoMutations } from "@/app/features/puestos/hooks/usePuestoMutation";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import TableHeader from "@/components/TableHeader";

export function PuestosTable() {
  const { puestos, isLoading, refetch } = usePuestos();
  const { createPuesto, updatePuesto, deletePuesto, isUpdating, isDeleting } =
    usePuestoMutations();

  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [selectedPuesto, setSelectedPuesto] = useState<Puesto | null>(null);

  const handleCreate = async (puestoData: any) => {
    try {
      await createPuesto({
        ...puestoData,
        estado: true,
      });
      setOpenCreate(false);
      refetch();
    } catch (error) {
      console.error("Error al crear puesto:", error);
    }
  };

  const handleEdit = async (puesto: Puesto) => {
    try {
      await updatePuesto({
        id: puesto.idPuesto,
        puesto: {
          nombrePuesto: puesto.nombrePuesto,
          descripcion: puesto.descripcion,
          nivelJerarquico: puesto.nivelJerarquico,
          salarioMinimo: puesto.salarioMinimo,
          salarioMaximo: puesto.salarioMaximo,
          estado: puesto.estado,
        },
      });
      setOpenEdit(false);
      setSelectedPuesto(null);
      refetch();
    } catch (error) {
      console.error("Error al editar puesto:", error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deletePuesto(id);
      setOpenDelete(false);
      setSelectedPuesto(null);
      refetch();
    } catch (error) {
      console.error("Error al eliminar puesto:", error);
    }
  };

  const handleVer = (puesto: Puesto) => {
    setSelectedPuesto(puesto);
    setOpenView(true);
  };

  const handleEditar = (puesto: Puesto) => {
    setSelectedPuesto(puesto);
    setOpenEdit(true);
  };

  const handleEliminar = (puesto: Puesto) => {
    setSelectedPuesto(puesto);
    setOpenDelete(true);
  };

  const tableColumns = columns(handleVer, handleEditar, handleEliminar);

  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  if (puestos.length === 0) {
    return (
      <div className="text-center py-10 border rounded-lg">
        <h3 className="text-lg font-medium">No hay puestos registrados</h3>
        <p className="text-muted-foreground mt-2 mb-4">
          Comience creando un nuevo puesto
        </p>
        <Button onClick={() => setOpenCreate(true)}>Crear Primer Puesto</Button>

        <PuestoCreateDialog
          open={openCreate}
          onOpenChange={setOpenCreate}
          onCreate={handleCreate}
        />
      </div>
    );
  }

  return (
    <>
      <TableHeader
        title="Puestos"
        entity="Puesto"
        onAddClick={() => setOpenCreate(true)}
      />

      <DataTable columns={tableColumns} data={puestos} />

      {/* DIÁLOGOS */}
      <PuestoCreateDialog
        open={openCreate}
        onOpenChange={setOpenCreate}
        onCreate={handleCreate}
      />

      <PuestoDetailsDialog
        open={openView}
        onOpenChange={setOpenView}
        puesto={selectedPuesto}
      />

      <PuestoEditDialog
        open={openEdit}
        onOpenChange={(open) => {
          setOpenEdit(open);
          if (!open) setSelectedPuesto(null);
        }}
        puesto={selectedPuesto}
        onSave={handleEdit}
        isLoading={isUpdating}
      />

      <PuestoDeleteDialog
        open={openDelete}
        onOpenChange={(open) => {
          setOpenDelete(open);
          if (!open) setSelectedPuesto(null);
        }}
        puesto={selectedPuesto}
        isDeleting={isDeleting}
        onConfirm={handleDelete}
      />
    </>
  );
}
