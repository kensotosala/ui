/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

import { useToast } from "@/hooks/use-toast";
import { empleadoService } from "../services/empleados.service";
import { Empleado } from "../types";

interface UpdateEmpleadoPayload {
  id: number;
  data: Partial<Empleado>;
}

export const useEmpleadoMutations = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const invalidateEmpleados = () => {
    queryClient.invalidateQueries({ queryKey: ["empleados"] });
  };

  // Crear empleado
  const createMutation = useMutation({
    mutationFn: empleadoService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["empleados"] });
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

  // Actualizar empleado
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: UpdateEmpleadoPayload) =>
      empleadoService.update(id, data),
    onSuccess: () => {
      invalidateEmpleados();
      toast({
        title: "Éxito",
        description: "Empleado actualizado correctamente",
      });
    },
    onError: (error: AxiosError<any>) => {
      toast({
        title: "Error",
        description:
          error.response?.data?.message ?? "Error al actualizar el empleado",
        variant: "destructive",
      });
    },
  });

  // Eliminar empleado
  const deleteMutation = useMutation({
    mutationFn: (id: number) => empleadoService.delete(id),
    onSuccess: () => {
      invalidateEmpleados();
      toast({
        title: "Éxito",
        description: "Empleado eliminado correctamente",
      });
    },
    onError: (error: AxiosError<any>) => {
      toast({
        title: "Error",
        description:
          error.response?.data?.message ?? "Error al eliminar el empleado",
        variant: "destructive",
      });
    },
  });

  return {
    createEmpleado: createMutation.mutateAsync,
    updateEmpleado: updateMutation.mutateAsync,
    deleteEmpleado: deleteMutation.mutateAsync,

    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};
