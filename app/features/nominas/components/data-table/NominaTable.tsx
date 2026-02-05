// components/nomina/NominaTable.tsx - CON FILTROS
"use client";

import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DataTable } from "./data-table";
import { Plus, Filter, X } from "lucide-react";
import { useNomina } from "../../hooks/useNomina";
import { GenerarNominaQuincenalDTO, NominaDTO } from "../../nomina.types";
import { columns } from "./nomina-columns";
import { NominaGenerateDialog } from "./dialogs/nomina-generate-dialog";
import { PagarTodasNominasButton } from "../PagarTodasNominasButton";
import { NominaDetailsDialog } from "./dialogs/nomina-details-dialog";
import { NominaPagarDialog } from "./dialogs/nomina-pagar-dialog";
import { NominaAnularDialog } from "./dialogs/nomina-anular-dialog";

interface NominaTableProps {
  quincena?: number;
  mes?: number;
  anio?: number;
}

export function NominaTable({
  quincena: initialQuincena,
  mes: initialMes,
  anio: initialAnio,
}: NominaTableProps) {
  // Estados de filtros (iniciar sin filtros para ver todas)
  const [quincenaFilter, setQuincenaFilter] = useState<number | undefined>(
    undefined,
  );
  const [mesFilter, setMesFilter] = useState<number | undefined>(undefined);
  const [anioFilter, setAnioFilter] = useState<number | undefined>(undefined);
  const [estadoFilter, setEstadoFilter] = useState<string>("TODOS");
  const [searchFilter, setSearchFilter] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const {
    nominas,
    isLoading,
    refetch,
    generarNomina,
    pagarNomina,
    anularNomina,
    isDeleting,
    isGenerating,
  } = useNomina(quincenaFilter, mesFilter, anioFilter);

  const [openGenerate, setOpenGenerate] = useState(false);
  const [openDetails, setOpenDetails] = useState(false);
  const [openPagar, setOpenPagar] = useState(false);
  const [openAnular, setOpenAnular] = useState(false);

  const [selectedNomina, setSelectedNomina] = useState<NominaDTO | null>(null);

  const handleGenerate = async (data: GenerarNominaQuincenalDTO) => {
    try {
      await generarNomina(data);
      setOpenGenerate(false);
      refetch();
    } catch (error) {
      console.error("Error al generar nómina:", error);
      throw error;
    }
  };

  const handlePagar = async (id: number) => {
    try {
      await pagarNomina(id);
      setOpenPagar(false);
      setSelectedNomina(null);
      refetch();
    } catch (error) {
      console.error("Error al pagar nómina:", error);
      throw error;
    }
  };

  const handleAnular = async (id: number) => {
    try {
      await anularNomina(id);
      setOpenAnular(false);
      setSelectedNomina(null);
      refetch();
    } catch (error) {
      console.error("Error al anular nómina:", error);
      throw error;
    }
  };

  const handleVer = (nomina: NominaDTO) => {
    setSelectedNomina(nomina);
    setOpenDetails(true);
  };

  const handlePagarClick = (nomina: NominaDTO) => {
    setSelectedNomina(nomina);
    setOpenPagar(true);
  };

  const handleAnularClick = (nomina: NominaDTO) => {
    setSelectedNomina(nomina);
    setOpenAnular(true);
  };

  const handleClearFilters = () => {
    setQuincenaFilter(undefined);
    setMesFilter(undefined);
    setAnioFilter(undefined);
    setEstadoFilter("TODOS");
    setSearchFilter("");
  };

  // Filtrar nóminas por estado y búsqueda
  const nominasFiltradas = (nominas || []).filter((nomina) => {
    // Filtro por estado
    if (
      estadoFilter !== "TODOS" &&
      nomina.estado?.toUpperCase() !== estadoFilter
    ) {
      return false;
    }

    // Filtro por búsqueda (nombre empleado o código)
    if (searchFilter) {
      const search = searchFilter.toLowerCase();
      const matchNombre = nomina.nombreEmpleado?.toLowerCase().includes(search);
      const matchCodigo = nomina.codigoEmpleado?.toLowerCase().includes(search);
      return matchNombre || matchCodigo;
    }

    return true;
  });

  const tableColumns = columns(handleVer, handlePagarClick, handleAnularClick);

  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4">
            {/* Título y botones principales */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle className="text-2xl font-bold bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Nómina Quincenal
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  {nominasFiltradas.length} de {nominas?.length || 0} nóminas
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <Button
                  onClick={() => setShowFilters(!showFilters)}
                  variant="outline"
                  className="gap-2"
                >
                  <Filter className="h-4 w-4" />
                  Filtros
                  {(quincenaFilter ||
                    mesFilter ||
                    anioFilter ||
                    estadoFilter !== "TODOS" ||
                    searchFilter) && (
                    <span className="ml-1 bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full">
                      Activos
                    </span>
                  )}
                </Button>

                <Button
                  onClick={() => setOpenGenerate(true)}
                  variant="outline"
                  className="gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Generar Nómina
                </Button>

                <PagarTodasNominasButton
                  nominas={nominasFiltradas}
                  onSuccess={refetch}
                />
              </div>
            </div>

            {/* Panel de filtros */}
            {showFilters && (
              <div className="border rounded-lg p-4 bg-slate-50 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Filtros de Búsqueda</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClearFilters}
                    className="gap-2"
                  >
                    <X className="h-4 w-4" />
                    Limpiar filtros
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  {/* Búsqueda por nombre */}
                  <div className="space-y-2">
                    <Label>Buscar empleado</Label>
                    <Input
                      placeholder="Nombre o código..."
                      value={searchFilter}
                      onChange={(e) => setSearchFilter(e.target.value)}
                    />
                  </div>

                  {/* Filtro por quincena */}
                  <div className="space-y-2">
                    <Label>Quincena</Label>
                    <Select
                      value={quincenaFilter?.toString() || "TODAS"}
                      onValueChange={(value) =>
                        setQuincenaFilter(
                          value === "TODAS" ? undefined : parseInt(value),
                        )
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Todas" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="TODAS">Todas</SelectItem>
                        <SelectItem value="1">1ª Quincena</SelectItem>
                        <SelectItem value="2">2ª Quincena</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Filtro por mes */}
                  <div className="space-y-2">
                    <Label>Mes</Label>
                    <Select
                      value={mesFilter?.toString() || "TODOS"}
                      onValueChange={(value) =>
                        setMesFilter(
                          value === "TODOS" ? undefined : parseInt(value),
                        )
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Todos" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="TODOS">Todos</SelectItem>
                        <SelectItem value="1">Enero</SelectItem>
                        <SelectItem value="2">Febrero</SelectItem>
                        <SelectItem value="3">Marzo</SelectItem>
                        <SelectItem value="4">Abril</SelectItem>
                        <SelectItem value="5">Mayo</SelectItem>
                        <SelectItem value="6">Junio</SelectItem>
                        <SelectItem value="7">Julio</SelectItem>
                        <SelectItem value="8">Agosto</SelectItem>
                        <SelectItem value="9">Septiembre</SelectItem>
                        <SelectItem value="10">Octubre</SelectItem>
                        <SelectItem value="11">Noviembre</SelectItem>
                        <SelectItem value="12">Diciembre</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Filtro por año */}
                  <div className="space-y-2">
                    <Label>Año</Label>
                    <Select
                      value={anioFilter?.toString() || "TODOS"}
                      onValueChange={(value) =>
                        setAnioFilter(
                          value === "TODOS" ? undefined : parseInt(value),
                        )
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Todos" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="TODOS">Todos</SelectItem>
                        <SelectItem value="2024">2024</SelectItem>
                        <SelectItem value="2025">2025</SelectItem>
                        <SelectItem value="2026">2026</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Filtro por estado */}
                  <div className="space-y-2">
                    <Label>Estado</Label>
                    <Select
                      value={estadoFilter}
                      onValueChange={setEstadoFilter}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="TODOS">Todos</SelectItem>
                        <SelectItem value="PENDIENTE">Pendientes</SelectItem>
                        <SelectItem value="PAGADA">Pagadas</SelectItem>
                        <SelectItem value="ANULADA">Anuladas</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent>
          {nominasFiltradas.length === 0 && (nominas?.length || 0) > 0 ? (
            <div className="text-center py-12 border-2 border-dashed rounded-lg">
              <p className="text-muted-foreground">
                No se encontraron nóminas con los filtros aplicados
              </p>
              <Button
                variant="link"
                onClick={handleClearFilters}
                className="mt-2"
              >
                Limpiar filtros
              </Button>
            </div>
          ) : nominasFiltradas.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed rounded-lg">
              <h3 className="text-lg font-medium">
                No hay nóminas registradas
              </h3>
              <p className="text-muted-foreground mt-2 mb-4">
                Genere una nueva nómina quincenal para comenzar
              </p>
              <Button
                onClick={() => setOpenGenerate(true)}
                className="bg-linear-to-r from-blue-600 to-indigo-600"
              >
                <Plus className="mr-2 h-4 w-4" />
                Generar Nómina
              </Button>
            </div>
          ) : (
            <DataTable columns={tableColumns} data={nominasFiltradas} />
          )}
        </CardContent>
      </Card>

      {/* DIÁLOGOS */}
      <NominaGenerateDialog
        open={openGenerate}
        onOpenChange={setOpenGenerate}
        onGenerate={handleGenerate}
        isGenerating={isGenerating}
        defaultQuincena={initialQuincena}
        defaultMes={initialMes}
        defaultAnio={initialAnio}
      />

      <NominaDetailsDialog
        open={openDetails}
        onOpenChange={setOpenDetails}
        nomina={selectedNomina}
      />

      <NominaPagarDialog
        open={openPagar}
        onOpenChange={(open) => {
          setOpenPagar(open);
          if (!open) setSelectedNomina(null);
        }}
        nomina={selectedNomina}
        onConfirm={handlePagar}
      />

      <NominaAnularDialog
        open={openAnular}
        onOpenChange={(open) => {
          setOpenAnular(open);
          if (!open) setSelectedNomina(null);
        }}
        nomina={selectedNomina}
        isDeleting={isDeleting}
        onConfirm={handleAnular}
      />
    </div>
  );
}
