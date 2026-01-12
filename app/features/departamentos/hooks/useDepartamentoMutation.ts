/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { departamentoService } from "../services/departamentos.service";
import { Departamento } from "../types";
import { useToast } from "@/hooks/use-toast";

export const useDepartamentoMutations = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const createMutation = useMutation({
    mutationFn: departamentoService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departamentos"] });
      toast({
        title: "Éxito",
        description: "Departamento creado correctamente",
        variant: "default",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description:
          error.response?.data?.message || "Error al crear el departamento",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      departamento,
    }: {
      id: number;
      departamento: Partial<
        Pick<
          Departamento,
          "nombreDepartamento" | "descripcion" | "idJefeDepartamento" | "estado"
        >
      >;
    }) => departamentoService.update(id, departamento),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departamentos"] });
      toast({
        title: "Éxito",
        description: "Departamento actualizado correctamente",
        variant: "default",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description:
          error.response?.data?.message ||
          "Error al actualizar el departamento",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: departamentoService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departamentos"] });
      toast({
        title: "Éxito",
        description: "Departamento eliminado correctamente",
        variant: "default",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description:
          error.response?.data?.message || "Error al eliminar el departamento",
        variant: "destructive",
      });
    },
  });

  return {
    createDepartamento: createMutation.mutateAsync,
    updateDepartamento: updateMutation.mutateAsync,
    deleteDepartamento: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};
