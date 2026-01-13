Actúa como un experto en React con más de 15 años de experiencia, sigue las instrucciones que te adjunto dando una solución sencilla y con buenas prácticas, entiendes?

Instrucciones:
Arregla este código, no use useROles, los roles que manejo son ADMIN y EMPLEADO

/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import TableHeader from "@/components/TableHeader";

import { Empleado } from "../../types";
import { columns } from "./columns";
import { EmpleadoCreateDialog } from "./dialogs/create-dialog";
import { Button } from "@/components/ui/button";
import { DataTable } from "./data-table";
import { EmpleadoDetailsDialog } from "./dialogs/detail-dialog";
import { EmpleadoEditDialog } from "./dialogs/edit-dialog";
import { EmpleadoDeleteDialog } from "./dialogs/delete-dialog";

import { usePuestos } from "@/app/features/puestos/hooks/usePuestos";
import { useDepartamentos } from "@/app/features/departamentos/hooks/useDepartamentos";

import { Card, CardContent } from "@/components/ui/card";
import { Users, UserCheck, UserX, TrendingUp } from "lucide-react";
import { useEmpleados, useEmpleadosActivos } from "../../hooks/useEmpleado";
import { useEmpleadoMutations } from "../../hooks/useEmpleadosMutation";

export function EmpleadosTable() {
  const { empleados, isLoading, refetch } = useEmpleados();
  const { empleados: empleadosActivos } = useEmpleadosActivos();
  const { puestos } = usePuestos();
  const { departamentos } = useDepartamentos();
  const { roles } = useRoles();

  const {
    createEmpleado,
    updateEmpleado,
    deleteEmpleado,
    toggleEstadoEmpleado,

    isUpdating,
    isDeleting,
    isChangingEstado,
  } = useEmpleadoMutations();

  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [selectedEmpleado, setSelectedEmpleado] = useState<Empleado | null>(
    null
  );

  // Cargar datos adicionales necesarios para formularios
  const [isLoadingData, setIsLoadingData] = useState(true);

  useEffect(() => {
    if (!isLoading && puestos && departamentos && roles) {
      setIsLoadingData(false);
    }
  }, [isLoading, puestos, departamentos, roles]);

  const handleCreate = async (empleadoData: any) => {
    try {
      await createEmpleado(empleadoData);
      setOpenCreate(false);
      refetch();
    } catch (error) {
      console.error("Error al crear empleado:", error);
    }
  };

  const handleEdit = async (empleado: Empleado) => {
    try {
      await updateEmpleado({
        id: empleado.id!,
        empleado: {
          nombre: empleado.nombre,
          primerApellido: empleado.primerApellido,
          segundoApellido: empleado.segundoApellido,
          email: empleado.email,
          telefono: empleado.telefono,
          fechaContratacion: empleado.fechaContratacion,
          puestoId: empleado.puestoId,
          departamentoId: empleado.departamentoId,
          jefeInmediatoId: empleado.jefeInmediatoId,
          salarioBase: empleado.salarioBase,
          tipoContrato: empleado.tipoContrato,
          estado: empleado.estado,
          rolId: empleado.rolId,
          nombreUsuario: empleado.nombreUsuario,
        },
      });
      setOpenEdit(false);
      setSelectedEmpleado(null);
      refetch();
    } catch (error) {
      console.error("Error al editar empleado:", error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteEmpleado(id);
      setOpenDelete(false);
      setSelectedEmpleado(null);
      refetch();
    } catch (error) {
      console.error("Error al eliminar empleado:", error);
    }
  };

  const handleCambiarEstado = async (
    empleado: Empleado,
    nuevoEstado: "ACTIVO" | "INACTIVO"
  ) => {
    try {
      await toggleEstadoEmpleado({ id: empleado.id!, estado: nuevoEstado });
      refetch();
    } catch (error) {
      console.error("Error al cambiar estado del empleado:", error);
    }
  };

  const handleVer = (empleado: Empleado) => {
    setSelectedEmpleado(empleado);
    setOpenView(true);
  };

  const handleEditar = (empleado: Empleado) => {
    setSelectedEmpleado(empleado);
    setOpenEdit(true);
  };

  const handleEliminar = (empleado: Empleado) => {
    setSelectedEmpleado(empleado);
    setOpenDelete(true);
  };

  const getNombrePuesto = (puestoId: number) => {
    return (
      puestos?.find((p) => p.id === puestoId)?.nombre || `Puesto #${puestoId}`
    );
  };

  const getNombreDepartamento = (departamentoId: number) => {
    return (
      departamentos?.find((d) => d.id === departamentoId)?.nombre ||
      `Depto #${departamentoId}`
    );
  };

  const getNombreJefe = (jefeId?: number) => {
    if (!jefeId) return "No asignado";
    const jefe = empleados.find((e) => e.id === jefeId);
    return jefe
      ? `${jefe.nombre} ${jefe.primerApellido}`
      : `Empleado #${jefeId}`;
  };

  const getNombreRol = (rolId: number) => {
    return roles?.find((r) => r.id === rolId)?.nombre || `Rol #${rolId}`;
  };

  const tableColumns = columns(
    handleVer,
    handleEditar,
    handleEliminar,
    handleCambiarEstado
  );

  // Estadísticas
  const empleadosActivosCount = empleados.filter(
    (e) => e.estado === "ACTIVO"
  ).length;
  const empleadosInactivosCount = empleados.length - empleadosActivosCount;
  const promedioSalario =
    empleados.length > 0
      ? empleados.reduce((sum, e) => sum + e.salarioBase, 0) / empleados.length
      : 0;

  if (isLoading || isLoadingData) {
    return (
      <div className="space-y-6">
        {/* Skeletons para estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-lg" />
          ))}
        </div>

        {/* Skeletons para tabla */}
        <div className="space-y-3">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
    );
  }

  if (empleados.length === 0) {
    return (
      <div className="text-center py-10 border rounded-lg">
        <div className="mb-6">
          <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium">No hay empleados registrados</h3>
          <p className="text-muted-foreground mt-2 mb-4">
            Comience registrando el primer empleado en el sistema
          </p>
        </div>

        <Button onClick={() => setOpenCreate(true)} size="lg">
          Registrar Primer Empleado
        </Button>

        <EmpleadoCreateDialog
          open={openCreate}
          onOpenChange={setOpenCreate}
          onCreate={handleCreate}
          puestos={puestos || []}
          departamentos={departamentos || []}
          empleados={empleadosActivos}
          roles={roles || []}
        />
      </div>
    );
  }

  return (
    <>
      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Empleados
                </p>
                <p className="text-2xl font-bold">{empleados.length}</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Activos</p>
                <p className="text-2xl font-bold text-green-600">
                  {empleadosActivosCount}
                </p>
              </div>
              <UserCheck className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Inactivos</p>
                <p className="text-2xl font-bold text-gray-600">
                  {empleadosInactivosCount}
                </p>
              </div>
              <UserX className="h-8 w-8 text-gray-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Salario Promedio
                </p>
                <p className="text-2xl font-bold text-purple-600">
                  $
                  {promedioSalario.toLocaleString("es-ES", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <TableHeader
        title="Empleados"
        entity="Empleado"
        onAddClick={() => setOpenCreate(true)}
      />

      <DataTable
        columns={tableColumns}
        data={empleados}
        searchPlaceholder="Buscar por nombre, email o código..."
        searchableColumns={[
          "nombre",
          "primerApellido",
          "email",
          "codigoEmpleado",
        ]}
        exportEnabled={true}
        loading={isLoading}
        onAddNew={() => setOpenCreate(true)}
        onRefresh={refetch}
        rowClassName={(empleado) =>
          empleado.estado === "INACTIVO" ? "opacity-50 bg-gray-50" : ""
        }
      />

      {/* DIÁLOGOS */}
      <EmpleadoCreateDialog
        open={openCreate}
        onOpenChange={setOpenCreate}
        onCreate={handleCreate}
        puestos={puestos || []}
        departamentos={departamentos || []}
        empleados={empleadosActivos}
        roles={roles || []}
      />

      <EmpleadoDetailsDialog
        open={openView}
        onOpenChange={setOpenView}
        empleado={selectedEmpleado}
        nombrePuesto={
          selectedEmpleado ? getNombrePuesto(selectedEmpleado.puestoId) : ""
        }
        nombreDepartamento={
          selectedEmpleado
            ? getNombreDepartamento(selectedEmpleado.departamentoId)
            : ""
        }
        nombreJefe={
          selectedEmpleado
            ? getNombreJefe(selectedEmpleado.jefeInmediatoId)
            : ""
        }
        nombreRol={selectedEmpleado ? getNombreRol(selectedEmpleado.rolId) : ""}
      />

      <EmpleadoEditDialog
        open={openEdit}
        onOpenChange={(open) => {
          setOpenEdit(open);
          if (!open) setSelectedEmpleado(null);
        }}
        empleado={selectedEmpleado}
        onSave={handleEdit}
        isLoading={isUpdating || isChangingEstado}
        puestos={puestos || []}
        departamentos={departamentos || []}
        empleados={empleadosActivos}
        roles={roles || []}
      />

      <EmpleadoDeleteDialog
        open={openDelete}
        onOpenChange={(open) => {
          setOpenDelete(open);
          if (!open) setSelectedEmpleado(null);
        }}
        empleado={selectedEmpleado}
        isDeleting={isDeleting}
        onConfirm={handleDelete}
        tieneRegistrosAsociados={selectedEmpleado ? true : false}
        registrosAsociados={["Asistencias", "Permisos", "Nóminas"]}
      />
    </>
  );
}





