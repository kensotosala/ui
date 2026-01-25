"use client";

import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import TableHeader from "@/components/TableHeader";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import {
  Incapacidad,
  RegistrarIncapacidadDTO,
  ActualizarIncapacidadDTO,
} from "../../types";

import { useEmpleados } from "@/app/features/empleados/hooks/useEmpleado";

import { IncapacidadCreateDialog } from "./dialogs/create-dialog";
import { IncapacidadDetailsDialog } from "./dialogs/details-dialog";

import { IncapacidadDeleteDialog } from "./dialogs/delete-dialog";
import { useIncapacidad } from "../../hooks/useIncapacidad";
import { IncapacidadUpdateDialog } from "./dialogs/edit-dialog";

export function IncapacidadesTable() {
  const {
    incapacidades,
    isLoading,
    refetch,
    registrarIncapacidad,
    actualizarIncapacidad,
    eliminarIncapacidad,
    isDeleting,
  } = useIncapacidad();

  const { empleados } = useEmpleados();

  const [openCreate, setOpenCreate] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openView, setOpenView] = useState(false);

  const [selectedIncapacidad, setSelectedIncapacidad] =
    useState<Incapacidad | null>(null);

  const handleCreate = async (data: RegistrarIncapacidadDTO) => {
    try {
      await registrarIncapacidad(data);
      setOpenCreate(false);
      refetch();
    } catch (error) {
      console.error("Error al crear incapacidad:", error);
      throw error;
    }
  };

  const handleUpdate = async (data: ActualizarIncapacidadDTO) => {
    try {
      await actualizarIncapacidad(data);
      setOpenUpdate(false);
      setSelectedIncapacidad(null);
      refetch();
    } catch (error) {
      console.error("Error al actualizar incapacidad:", error);
      throw error;
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await eliminarIncapacidad(id);
      setOpenDelete(false);
      setSelectedIncapacidad(null);
      refetch();
    } catch (error) {
      console.error("Error al eliminar incapacidad:", error);
      throw error;
    }
  };

  const handleVer = (incapacidad: Incapacidad) => {
    setSelectedIncapacidad(incapacidad);
    setOpenView(true);
  };

  const handleEditar = (incapacidad: Incapacidad) => {
    setSelectedIncapacidad(incapacidad);
    setOpenUpdate(true);
  };

  const handleEliminar = (incapacidad: Incapacidad) => {
    setSelectedIncapacidad(incapacidad);
    setOpenDelete(true);
  };

  const tableColumns = columns(
    handleVer,
    handleEditar,
    handleEliminar,
    empleados,
  );

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

  if (!incapacidades || incapacidades.length === 0) {
    return (
      <div className="text-center py-10 border rounded-lg">
        <h3 className="text-lg font-medium">
          No hay registros de incapacidades
        </h3>
        <p className="text-muted-foreground mt-2 mb-4">
          Comience creando un nuevo registro
        </p>
        <Button onClick={() => setOpenCreate(true)}>
          Crear Primer Registro
        </Button>

        <IncapacidadCreateDialog
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
        title="Incapacidades"
        entity="Incapacidad"
        onAddClick={() => setOpenCreate(true)}
      />

      <DataTable columns={tableColumns} data={incapacidades} />

      {/* DIÁLOGOS */}
      <IncapacidadCreateDialog
        open={openCreate}
        onOpenChange={setOpenCreate}
        onCreate={handleCreate}
      />

      <IncapacidadDetailsDialog
        open={openView}
        onOpenChange={setOpenView}
        incapacidad={selectedIncapacidad}
      />

      <IncapacidadUpdateDialog
        open={openUpdate}
        onOpenChange={(open: boolean | ((prevState: boolean) => boolean)) => {
          setOpenUpdate(open);
          if (!open) setSelectedIncapacidad(null);
        }}
        incapacidad={selectedIncapacidad}
        onUpdate={handleUpdate}
      />

      <IncapacidadDeleteDialog
        open={openDelete}
        onOpenChange={(open: boolean | ((prevState: boolean) => boolean)) => {
          setOpenDelete(open);
          if (!open) setSelectedIncapacidad(null);
        }}
        incapacidad={selectedIncapacidad}
        isDeleting={isDeleting}
        onConfirm={handleDelete}
      />
    </>
  );
}
