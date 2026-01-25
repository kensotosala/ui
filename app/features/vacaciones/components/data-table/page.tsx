"use client";

import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import TableHeader from "@/components/TableHeader";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import {
  ListarVacacionesDTO,
  CrearVacacionDTO,
  ActualizarVacacionDTO,
} from "../../vacaciones.types";
import { useEmpleados } from "@/app/features/empleados/hooks/useEmpleado";
import { useVacaciones } from "../../hooks/useVacaciones";
import { VacacionCreateDialog } from "./dialogs/create-dialog";
import { VacacionDetailsDialog } from "./dialogs/details-dialog";
import { VacacionEditDialog } from "./dialogs/edit-dialog";
import { VacacionDeleteDialog } from "./dialogs/delete-dialog";

export function VacacionesTable() {
  const { vacaciones, isLoading, refetch, crear, actualizar, cancelar } =
    useVacaciones();

  const { empleados } = useEmpleados();

  const [openCreate, setOpenCreate] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openView, setOpenView] = useState(false);

  const [selectedVacacion, setSelectedVacacion] =
    useState<ListarVacacionesDTO | null>(null);

  const handleCreate = async (data: CrearVacacionDTO) => {
    try {
      await crear.mutateAsync(data);
      setOpenCreate(false);
      refetch();
    } catch (error) {
      console.error("Error al crear vacación:", error);
      throw error;
    }
  };

  const handleUpdate = async (data: ActualizarVacacionDTO) => {
    if (!selectedVacacion) return;

    try {
      await actualizar.mutateAsync({
        id: selectedVacacion.idVacacion,
        dto: data,
      });
      setOpenUpdate(false);
      setSelectedVacacion(null);
      refetch();
    } catch (error) {
      console.error("Error al actualizar vacación:", error);
      throw error;
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await cancelar.mutateAsync(id);
      setOpenDelete(false);
      setSelectedVacacion(null);
      refetch();
    } catch (error) {
      console.error("Error al cancelar vacación:", error);
      throw error;
    }
  };

  const handleVer = (vacacion: ListarVacacionesDTO) => {
    setSelectedVacacion(vacacion);
    setOpenView(true);
  };

  const handleEditar = (vacacion: ListarVacacionesDTO) => {
    setSelectedVacacion(vacacion);
    setOpenUpdate(true);
  };

  const handleEliminar = (vacacion: ListarVacacionesDTO) => {
    setSelectedVacacion(vacacion);
    setOpenDelete(true);
  };

  const tableColumns = columns(
    handleVer,
    handleEditar,
    handleEliminar,
    undefined,
    undefined,
    empleados,
    false,
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

  if (!vacaciones || vacaciones.length === 0) {
    return (
      <div className="text-center py-10 border rounded-lg">
        <h3 className="text-lg font-medium">
          No hay solicitudes de vacaciones
        </h3>
        <p className="text-muted-foreground mt-2 mb-4">
          Comience creando una nueva solicitud
        </p>
        <Button onClick={() => setOpenCreate(true)}>
          Crear Primera Solicitud
        </Button>

        <VacacionCreateDialog
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
        title="Vacaciones"
        entity="Solicitud"
        onAddClick={() => setOpenCreate(true)}
      />

      <DataTable columns={tableColumns} data={vacaciones} />

      <VacacionCreateDialog
        open={openCreate}
        onOpenChange={setOpenCreate}
        onCreate={handleCreate}
      />

      <VacacionDetailsDialog
        open={openView}
        onOpenChange={setOpenView}
        vacacion={selectedVacacion}
      />

      <VacacionEditDialog
        open={openUpdate}
        onOpenChange={(open: boolean | ((prevState: boolean) => boolean)) => {
          setOpenUpdate(open);
          if (!open) setSelectedVacacion(null);
        }}
        vacacion={selectedVacacion}
        onUpdate={handleUpdate}
      />

      <VacacionDeleteDialog
        open={openDelete}
        onOpenChange={(open: boolean | ((prevState: boolean) => boolean)) => {
          setOpenDelete(open);
          if (!open) setSelectedVacacion(null);
        }}
        vacacion={selectedVacacion}
        isDeleting={cancelar.isPending}
        onConfirm={handleDelete}
      />
    </>
  );
}
