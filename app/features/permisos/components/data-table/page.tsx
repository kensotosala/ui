"use client";

import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import TableHeader from "@/components/TableHeader";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import {
  Permiso,
  CrearPermisoDTO,
  ActualizarPermisoDTO,
  AprobarRechazarPermisoDTO,
  EstadoPermiso,
} from "../../types";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useEmpleados } from "@/app/features/empleados/hooks/useEmpleado";
import { usePermisos } from "../../hooks/usePermisos";
import { PermisoCreateDialog } from "./dialogs/create-dialog";
import { PermisoDetailsDialog } from "./dialogs/details-dialog";
import { PermisoEditDialog } from "./dialogs/edit-dialog";
import { PermisoDeleteDialog } from "./dialogs/delete-dialog";
import { useAuthContext } from "@/components/providers/AuthProvider";
import { toast } from "react-toastify";

export function PermisosTable() {
  const {
    permisos,
    isLoading,
    refetch,
    createPermiso,
    updatePermiso,
    deletePermiso,
    aprobarRechazarPermiso,
    isDeleting,
  } = usePermisos();

  const { empleados } = useEmpleados();

  const { user } = useAuthContext();

  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [openAprobar, setOpenAprobar] = useState(false);
  const [openRechazar, setOpenRechazar] = useState(false);

  const [selectedPermiso, setSelectedPermiso] = useState<Permiso | null>(null);
  const [, setJefeAprobador] = useState<number | null>(null);
  const [comentariosRechazo, setComentariosRechazo] = useState("");

  const handleCreate = async (data: CrearPermisoDTO) => {
    try {
      await createPermiso(data);
      setOpenCreate(false);
      refetch();
    } catch (error) {
      console.error("Error al crear permiso:", error);
    }
  };

  const handleEdit = async (id: number, data: ActualizarPermisoDTO) => {
    try {
      await updatePermiso({ id, data });
      setOpenEdit(false);
      setSelectedPermiso(null);
      refetch();
    } catch (error) {
      console.error("Error al editar permiso:", error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deletePermiso(id);
      setOpenDelete(false);
      setSelectedPermiso(null);
      refetch();
    } catch (error) {
      console.error("Error al eliminar permiso:", error);
    }
  };

  // Updated component handlers
  const handleAprobar = async () => {
    if (!selectedPermiso) {
      toast.error("Debe seleccionar un permiso");
      return;
    }

    if (!user) {
      toast.error("Debe estar autenticado para aprobar");
      return;
    }

    // Validate current state
    if (selectedPermiso.estadoSolicitud !== EstadoPermiso.PENDIENTE) {
      toast.error("Solo se pueden aprobar permisos pendientes");
      return;
    }

    try {
      const dto: AprobarRechazarPermisoDTO = {
        estadoSolicitud: EstadoPermiso.APROBADA,
        jefeApruebaId: user.employeeId!,
      };

      await aprobarRechazarPermiso({
        id: selectedPermiso.idPermiso,
        data: dto,
      });

      toast.success("Permiso aprobado exitosamente");
      setOpenAprobar(false);
      setSelectedPermiso(null);
      refetch();
    } catch (error) {
      console.error("Error al aprobar:", error);
      toast.error("Error al aprobar el permiso");
    }
  };

  const handleRechazar = async () => {
    if (!selectedPermiso) {
      toast.error("Debe seleccionar un permiso");
      return;
    }

    if (!user) {
      toast.error("Debe estar autenticado para rechazar");
      return;
    }

    // Validate current state
    if (selectedPermiso.estadoSolicitud !== EstadoPermiso.PENDIENTE) {
      toast.error("Solo se pueden rechazar permisos pendientes");
      return;
    }

    // CRITICAL: Validate required comments
    if (!comentariosRechazo.trim()) {
      toast.error("Los comentarios son obligatorios al rechazar");
      return;
    }

    try {
      const dto: AprobarRechazarPermisoDTO = {
        estadoSolicitud: EstadoPermiso.RECHAZADA,
        jefeApruebaId: user.employeeId!,
        comentariosRechazo: comentariosRechazo.trim(),
      };

      await aprobarRechazarPermiso({
        id: selectedPermiso.idPermiso,
        data: dto,
      });

      toast.success("Permiso rechazado exitosamente");
      setOpenRechazar(false);
      setSelectedPermiso(null);
      setComentariosRechazo("");
      refetch();
    } catch (error) {
      console.error("Error al rechazar:", error);
      toast.error("Error al rechazar el permiso");
    }
  };

  const handleVer = (permiso: Permiso) => {
    setSelectedPermiso(permiso);
    setOpenView(true);
  };

  const handleEditar = (permiso: Permiso) => {
    setSelectedPermiso(permiso);
    setOpenEdit(true);
  };

  const handleEliminar = (permiso: Permiso) => {
    setSelectedPermiso(permiso);
    setOpenDelete(true);
  };

  const handleAprobarClick = (permiso: Permiso) => {
    setSelectedPermiso(permiso);
    setOpenAprobar(true);
  };

  const handleRechazarClick = (permiso: Permiso) => {
    setSelectedPermiso(permiso);
    setOpenRechazar(true);
  };

  const tableColumns = columns(
    handleVer,
    handleEditar,
    handleEliminar,
    handleAprobarClick,
    handleRechazarClick,
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

  if (permisos.length === 0) {
    return (
      <div className="text-center py-10 border rounded-lg">
        <h3 className="text-lg font-medium">No hay solicitudes de permisos</h3>
        <p className="text-muted-foreground mt-2 mb-4">
          Comience creando una nueva solicitud
        </p>
        <Button onClick={() => setOpenCreate(true)}>
          Crear Primera Solicitud
        </Button>

        <PermisoCreateDialog
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
        title="Permisos"
        entity="Solicitud"
        onAddClick={() => setOpenCreate(true)}
      />

      <DataTable columns={tableColumns} data={permisos} />

      {/* DIÁLOGOS */}
      <PermisoCreateDialog
        open={openCreate}
        onOpenChange={setOpenCreate}
        onCreate={handleCreate}
      />

      <PermisoDetailsDialog
        open={openView}
        onOpenChange={setOpenView}
        permiso={selectedPermiso}
      />

      <PermisoEditDialog
        open={openEdit}
        onOpenChange={(open: boolean | ((prevState: boolean) => boolean)) => {
          setOpenEdit(open);
          if (!open) setSelectedPermiso(null);
        }}
        permiso={selectedPermiso}
        onUpdate={handleEdit}
      />

      <PermisoDeleteDialog
        open={openDelete}
        onOpenChange={(open: boolean | ((prevState: boolean) => boolean)) => {
          setOpenDelete(open);
          if (!open) setSelectedPermiso(null);
        }}
        permiso={selectedPermiso}
        isDeleting={isDeleting}
        onConfirm={handleDelete}
      />

      {/* Diálogo de Aprobación */}
      <Dialog
        open={openAprobar}
        onOpenChange={(open) => {
          setOpenAprobar(open);
          if (!open) {
            setSelectedPermiso(null);
            setJefeAprobador(null);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Aprobar Solicitud de Permiso</DialogTitle>
          </DialogHeader>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setOpenAprobar(false);
                setJefeAprobador(null);
              }}
            >
              Cancelar
            </Button>
            <Button onClick={handleAprobar}>Aprobar Solicitud</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo de Rechazo */}
      <Dialog
        open={openRechazar}
        onOpenChange={(open) => {
          setOpenRechazar(open);
          if (!open) {
            setSelectedPermiso(null);
            setComentariosRechazo("");
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rechazar Solicitud de Permiso</DialogTitle>
            <DialogDescription>
              Proporcione los motivos del rechazo. Este campo es obligatorio.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="comentarios">
                Comentarios de Rechazo <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="comentarios"
                placeholder="Ingrese los motivos del rechazo..."
                value={comentariosRechazo}
                onChange={(e) => setComentariosRechazo(e.target.value)}
                rows={4}
                className={!comentariosRechazo.trim() ? "border-red-300" : ""}
              />
              {!comentariosRechazo.trim() && (
                <p className="text-sm text-red-500 mt-1">
                  Este campo es obligatorio
                </p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setOpenRechazar(false);
                setComentariosRechazo("");
              }}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleRechazar}
              disabled={!comentariosRechazo.trim()}
            >
              Rechazar Solicitud
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
