/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useState, useEffect } from "react";

import { toast } from "sonner";
import { nominaService } from "../services/nomina.service";
import { NominaDTO } from "../nomina.types";

export function useNominaEmpleado(empleadoId: number) {
  const [nominas, setNominas] = useState<NominaDTO[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNominas = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await nominaService.obtenerNominasEmpleado(empleadoId);
      setNominas(data);
    } catch (err: any) {
      setError(err.message);
      toast.error("Error al cargar nóminas", {
        description: err.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (empleadoId) {
      fetchNominas();
    }
  }, [empleadoId]);

  const refetch = fetchNominas;

  // Calcular estadísticas
  const stats = {
    totalNominas: nominas.length,
    totalPagado: nominas
      .filter((n) => n.estado?.toUpperCase() === "PAGADA")
      .reduce((sum, n) => sum + n.totalNeto, 0),
    ultimoPago: nominas
      .filter((n) => n.estado?.toUpperCase() === "PAGADA")
      .sort(
        (a, b) =>
          new Date(b.fechaPago).getTime() - new Date(a.fechaPago).getTime(),
      )[0],
    pendientes: nominas.filter((n) => n.estado?.toUpperCase() === "PENDIENTE")
      .length,
  };

  return {
    nominas,
    isLoading,
    error,
    refetch,
    stats,
  };
}
