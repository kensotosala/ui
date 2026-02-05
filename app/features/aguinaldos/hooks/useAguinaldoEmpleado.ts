/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useState, useEffect } from "react";
import { aguinaldoService } from "../services/aguinaldo.service";
import { AguinaldoDTO } from "../types";
import { toast } from "sonner";

export function useAguinaldoEmpleado(empleadoId: number) {
  const [aguinaldos, setAguinaldos] = useState<AguinaldoDTO[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchAguinaldos = async () => {
    if (!empleadoId) return;

    try {
      setIsLoading(true);
      const data = await aguinaldoService.obtenerPorEmpleado(empleadoId);
      setAguinaldos(
        data.sort(
          (a, b) =>
            new Date(b.fechaCalculo).getTime() -
            new Date(a.fechaCalculo).getTime(),
        ),
      );
    } catch (error: any) {
      toast.error("Error al cargar aguinaldos", {
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAguinaldos();
  }, [empleadoId]);

  // Estadísticas para el empleado
  const stats = {
    totalAguinaldos: aguinaldos.length,
    totalRecibido: aguinaldos
      .filter((a) => a.estado === "PAGADO")
      .reduce((sum, a) => sum + a.montoAguinaldo, 0),
    ultimoAguinaldo: aguinaldos
      .filter((a) => a.estado === "PAGADO")
      .sort(
        (a, b) =>
          new Date(b.fechaPago || 0).getTime() -
          new Date(a.fechaPago || 0).getTime(),
      )[0],
    pendientes: aguinaldos.filter((a) => a.estado === "PENDIENTE").length,
  };

  return {
    aguinaldos,
    isLoading,
    stats,
    refetch: fetchAguinaldos,
  };
}
