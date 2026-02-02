/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";

import { toast } from "sonner";
import {
  GenerarNominaQuincenalDTO,
  NominaDTO,
  ResumenNominaQuincenalDTO,
} from "../nomina.types";
import { nominaService } from "../services/nomina.service";

export function useNomina(quincena?: number, mes?: number, anio?: number) {
  const [nominas, setNominas] = useState<NominaDTO[]>([]);
  const [resumen, setResumen] = useState<ResumenNominaQuincenalDTO | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchNominas = async () => {
    if (!quincena || !mes || !anio) {
      const allNominas = await nominaService.listarNominas();
      setNominas(allNominas);
      return;
    }

    const nominasQuincena = await nominaService.obtenerNominasQuincena(
      quincena,
      mes,
      anio,
    );
    setNominas(nominasQuincena);
  };

  const fetchResumen = async () => {
    if (!quincena || !mes || !anio) return;

    const resumenData = await nominaService.obtenerResumenQuincena(
      quincena,
      mes,
      anio,
    );
    setResumen(resumenData);
  };

  const loadData = async () => {
    try {
      setIsLoading(true);
      await Promise.all([fetchNominas(), fetchResumen()]);
    } catch (error: any) {
      toast.error("Error al cargar nóminas", {
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [quincena, mes, anio]);

  const generarNomina = async (data: GenerarNominaQuincenalDTO) => {
    setIsGenerating(true);
    try {
      await nominaService.generarNominaQuincenal(data);
      toast.success("Nómina generada exitosamente");
      await loadData();
    } catch (error: any) {
      toast.error("Error al generar nómina", {
        description: error.message,
      });
      throw error;
    } finally {
      setIsGenerating(false);
    }
  };

  const aprobarNomina = async (id: number) => {
    try {
      await nominaService.aprobarNomina(id);
      toast.success("Nómina aprobada");
      await loadData();
    } catch (error: any) {
      toast.error("Error al aprobar nómina", {
        description: error.message,
      });
      throw error;
    }
  };

  const pagarNomina = async (id: number) => {
    try {
      await nominaService.pagarNomina(id);
      toast.success("Nómina pagada correctamente");
      await loadData();
    } catch (error: any) {
      toast.error("Error al pagar nómina", {
        description: error.message,
      });
      throw error;
    }
  };

  const anularNomina = async (id: number) => {
    setIsDeleting(true);
    try {
      await nominaService.anularNomina(id);
      toast.warning("Nómina anulada");
      await loadData();
    } catch (error: any) {
      toast.error("Error al anular nómina", {
        description: error.message,
      });
      throw error;
    } finally {
      setIsDeleting(false);
    }
  };

  const refetch = loadData;

  return {
    nominas,
    resumen,
    isLoading,
    isGenerating,
    isDeleting,
    refetch,
    generarNomina,
    aprobarNomina,
    pagarNomina,
    anularNomina,
  };
}
