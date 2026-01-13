/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { empleadoService } from "../services/empleados.service";
import { Empleado, EstadoEmpleado, TipoContrato } from "../types";
import { useToast } from "@/hooks/use-toast";

export const useEmpleadoMutations = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const createMutation = useMutation({
    mutationFn: (
      empleado: Omit<Empleado, "id" | "estado"> & {
        nombreUsuario: string;
        password: string;
      }
    ) => empleadoService.create(empleado),
    onSuccess: (data) => {
      // Invalidar todas las queries relacionadas con empleados
      queryClient.invalidateQueries({ queryKey: ["empleados"] });
      queryClient.invalidateQueries({ queryKey: ["empleados", "activos"] });

      // Si tiene departamento, invalidar queries por departamento
      if (data.departamentoId) {
        queryClient.invalidateQueries({
          queryKey: ["empleados", "departamento", data.departamentoId],
        });
      }

      // Si tiene puesto, invalidar queries por puesto
      if (data.puestoId) {
        queryClient.invalidateQueries({
          queryKey: ["empleados", "puesto", data.puestoId],
        });
      }

      toast({
        title: "Éxito",
        description: "Empleado creado correctamente",
        variant: "default",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description:
          error.response?.data?.message || "Error al crear el empleado",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      empleado,
    }: {
      id: number;
      empleado: Partial<
        Omit<Empleado, "id" | "nombreUsuario" | "password"> & {
          estado?: EstadoEmpleado;
        }
      >;
    }) => empleadoService.update(id, empleado),
    onSuccess: (data, variables) => {
      // Invalidar queries generales y específicas
      queryClient.invalidateQueries({ queryKey: ["empleados"] });
      queryClient.invalidateQueries({ queryKey: ["empleados", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["empleados", "activos"] });

      // Invalidar queries por departamento si cambió
      if (data.departamentoId) {
        queryClient.invalidateQueries({
          queryKey: ["empleados", "departamento", data.departamentoId],
        });
      }

      // Invalidar queries por puesto si cambió
      if (data.puestoId) {
        queryClient.invalidateQueries({
          queryKey: ["empleados", "puesto", data.puestoId],
        });
      }

      toast({
        title: "Éxito",
        description: "Empleado actualizado correctamente",
        variant: "default",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description:
          error.response?.data?.message || "Error al actualizar el empleado",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => empleadoService.delete(id),
    onSuccess: (_, id) => {
      // Invalidar queries más agresivamente al eliminar
      queryClient.invalidateQueries({ queryKey: ["empleados"] });
      queryClient.invalidateQueries({ queryKey: ["empleados", id] });
      queryClient.invalidateQueries({ queryKey: ["empleados", "activos"] });

      // También podríamos invalidar todas las queries de empleados
      // para asegurar que ningún componente muestre datos obsoletos
      queryClient.removeQueries({ queryKey: ["empleados"], exact: false });

      toast({
        title: "Éxito",
        description: "Empleado eliminado correctamente",
        variant: "default",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description:
          error.response?.data?.message || "Error al eliminar el empleado",
        variant: "destructive",
      });
    },
  });

  // Mutación adicional para cambiar estado (activar/desactivar)
  const toggleEstadoMutation = useMutation({
    mutationFn: ({ id, estado }: { id: number; estado: EstadoEmpleado }) =>
      empleadoService.update(id, { estado }),
    onSuccess: (data, variables) => {
      // Invalidar queries afectadas
      queryClient.invalidateQueries({ queryKey: ["empleados"] });
      queryClient.invalidateQueries({ queryKey: ["empleados", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["empleados", "activos"] });

      // Actualizar el cache directamente para mejor UX
      queryClient.setQueryData<Empleado>(["empleados", variables.id], (old) =>
        old ? { ...old, estado: variables.estado } : old
      );

      toast({
        title: "Éxito",
        description: `Empleado ${
          variables.estado === "ACTIVO" ? "activado" : "desactivado"
        } correctamente`,
        variant: "default",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description:
          error.response?.data?.message ||
          "Error al cambiar estado del empleado",
        variant: "destructive",
      });
    },
  });

  // Mutación para cambio de contrato
  const cambiarContratoMutation = useMutation({
    mutationFn: ({
      id,
      tipoContrato,
    }: {
      id: number;
      tipoContrato: TipoContrato;
    }) => empleadoService.update(id, { tipoContrato }),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["empleados", variables.id] });

      // Update cache inmediato
      queryClient.setQueryData<Empleado>(["empleados", variables.id], (old) =>
        old ? { ...old, tipoContrato: variables.tipoContrato } : old
      );

      toast({
        title: "Éxito",
        description: "Tipo de contrato actualizado correctamente",
        variant: "default",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description:
          error.response?.data?.message || "Error al cambiar tipo de contrato",
        variant: "destructive",
      });
    },
  });

  return {
    // Mutaciones básicas CRUD
    createEmpleado: createMutation.mutateAsync,
    updateEmpleado: updateMutation.mutateAsync,
    deleteEmpleado: deleteMutation.mutateAsync,

    // Mutaciones específicas para empleados
    toggleEstadoEmpleado: toggleEstadoMutation.mutateAsync,
    cambiarContratoEmpleado: cambiarContratoMutation.mutateAsync,

    // Estados de carga
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isChangingEstado: toggleEstadoMutation.isPending,
    isChangingContrato: cambiarContratoMutation.isPending,

    // Métodos de mutación directos (para componentes que necesitan más control)
    mutateCreate: createMutation.mutate,
    mutateUpdate: updateMutation.mutate,
    mutateDelete: deleteMutation.mutate,
  };
};
