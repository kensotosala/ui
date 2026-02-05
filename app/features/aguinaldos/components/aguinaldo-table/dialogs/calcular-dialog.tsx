// app/features/aguinaldo/components/dialogs/calcular-dialog.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, Calculator, AlertCircle, CheckCircle2 } from "lucide-react";
import { ResultadoCalculoAguinaldoDTO } from "../../../types";
import { useAguinaldo } from "../../../hooks/useAguinaldo";
import { ScrollArea } from "@/components/ui/scroll-area";

interface CalcularAguinaldoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  anio: number;
  onSuccess: () => void;
}

export function CalcularAguinaldoDialog({
  open,
  onOpenChange,
  anio,
  onSuccess,
}: CalcularAguinaldoDialogProps) {
  const currentYear = new Date().getFullYear();
  const [selectedAnio, setSelectedAnio] = useState(anio.toString());
  const [step, setStep] = useState<"config" | "resultados">("config");
  const [resultados, setResultados] = useState<ResultadoCalculoAguinaldoDTO[]>(
    [],
  );
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const {
    calcularAguinaldosMasivo,
    registrarAguinaldos,
    isCalculating,
    isRegistering,
  } = useAguinaldo(parseInt(selectedAnio));

  const handleCalcular = async () => {
    try {
      const calculos = await calcularAguinaldosMasivo({
        anio: parseInt(selectedAnio),
      });

      setResultados(calculos);
      setSelectedIds(calculos.map((c) => c.empleadoId));
      setStep("resultados");
    } catch (error) {
      console.error("Error al calcular:", error);
    }
  };

  const handleRegistrar = async () => {
    try {
      const calculosSeleccionados = resultados.filter((r) =>
        selectedIds.includes(r.empleadoId),
      );

      await registrarAguinaldos(parseInt(selectedAnio), calculosSeleccionados);

      onSuccess();
      handleClose();
    } catch (error) {
      console.error("Error al registrar:", error);
    }
  };

  const handleClose = () => {
    setStep("config");
    setResultados([]);
    setSelectedIds([]);
    onOpenChange(false);
  };

  const toggleEmpleado = (empleadoId: number) => {
    setSelectedIds((prev) =>
      prev.includes(empleadoId)
        ? prev.filter((id) => id !== empleadoId)
        : [...prev, empleadoId],
    );
  };

  const toggleAll = () => {
    setSelectedIds((prev) =>
      prev.length === resultados.length
        ? []
        : resultados.map((r) => r.empleadoId),
    );
  };

  const totalSeleccionado = resultados
    .filter((r) => selectedIds.includes(r.empleadoId))
    .reduce((sum, r) => sum + r.montoAguinaldo, 0);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            {step === "config"
              ? "Calcular Aguinaldos"
              : "Resultados del Cálculo"}
          </DialogTitle>
          <DialogDescription>
            {step === "config"
              ? "Selecciona el año y calcula los aguinaldos según legislación CR"
              : `${resultados.length} aguinaldos calculados - Selecciona cuáles registrar`}
          </DialogDescription>
        </DialogHeader>

        {step === "config" && (
          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label>Año del Aguinaldo</Label>
              <Select value={selectedAnio} onValueChange={setSelectedAnio}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={(currentYear - 1).toString()}>
                    {currentYear - 1}
                  </SelectItem>
                  <SelectItem value={currentYear.toString()}>
                    {currentYear}
                  </SelectItem>
                  <SelectItem value={(currentYear + 1).toString()}>
                    {currentYear + 1}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="pt-6">
                <div className="flex gap-3">
                  <AlertCircle className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                  <div className="space-y-2 text-sm">
                    <p className="font-semibold text-blue-900">
                      Legislación de Costa Rica - Artículo 229
                    </p>
                    <ul className="space-y-1 text-blue-800">
                      <li>
                        • Período: 1 de diciembre {Number(selectedAnio) - 1} al
                        30 de noviembre {selectedAnio}
                      </li>
                      <li>
                        • Cálculo: Promedio de salarios brutos del período
                      </li>
                      <li>
                        • Aguinaldo = Salario promedio × (Días trabajados / 365)
                      </li>
                      <li>
                        • Mínimo: 1 mes de salario (si trabajó el año completo)
                      </li>
                      <li>• Debe pagarse antes del 20 de diciembre</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {step === "resultados" && (
          <div className="flex-1 overflow-hidden flex flex-col space-y-4">
            {/* Resumen */}
            <div className="grid grid-cols-3 gap-4">
              <Card className="bg-blue-50">
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold text-blue-900">
                    {resultados.length}
                  </div>
                  <p className="text-xs text-blue-700">Total calculados</p>
                </CardContent>
              </Card>
              <Card className="bg-green-50">
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold text-green-900">
                    {selectedIds.length}
                  </div>
                  <p className="text-xs text-green-700">Seleccionados</p>
                </CardContent>
              </Card>
              <Card className="bg-purple-50">
                <CardContent className="pt-6">
                  <div className="text-xl font-bold text-purple-900">
                    ₡
                    {totalSeleccionado.toLocaleString("es-CR", {
                      maximumFractionDigits: 0,
                    })}
                  </div>
                  <p className="text-xs text-purple-700">Total a registrar</p>
                </CardContent>
              </Card>
            </div>

            {/* Checkbox para seleccionar todos */}
            <div className="flex items-center space-x-2 px-2">
              <Checkbox
                id="select-all"
                checked={selectedIds.length === resultados.length}
                onCheckedChange={toggleAll}
              />
              <label
                htmlFor="select-all"
                className="text-sm font-medium cursor-pointer"
              >
                Seleccionar todos
              </label>
            </div>

            {/* Lista de resultados */}
            <ScrollArea className="flex-1 border rounded-lg">
              <div className="p-4 space-y-2">
                {resultados.map((resultado) => (
                  <Card
                    key={resultado.empleadoId}
                    className={`cursor-pointer transition-colors ${
                      selectedIds.includes(resultado.empleadoId)
                        ? "bg-blue-50 border-blue-300"
                        : "hover:bg-slate-50"
                    }`}
                    onClick={() => toggleEmpleado(resultado.empleadoId)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <Checkbox
                          checked={selectedIds.includes(resultado.empleadoId)}
                          onCheckedChange={() =>
                            toggleEmpleado(resultado.empleadoId)
                          }
                          onClick={(e) => e.stopPropagation()}
                        />

                        <div className="flex-1 grid grid-cols-4 gap-4">
                          <div>
                            <p className="font-semibold text-sm">
                              {resultado.nombreEmpleado}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {resultado.diasTrabajados} días trabajados
                            </p>
                          </div>

                          <div className="text-right">
                            <p className="text-xs text-muted-foreground">
                              Salario Promedio
                            </p>
                            <p className="font-mono text-sm">
                              ₡
                              {resultado.salarioPromedio.toLocaleString(
                                "es-CR",
                              )}
                            </p>
                          </div>

                          <div className="text-right">
                            <p className="text-xs text-muted-foreground">
                              Monto Aguinaldo
                            </p>
                            <p className="font-mono text-sm font-bold text-green-700">
                              ₡
                              {resultado.montoAguinaldo.toLocaleString("es-CR")}
                            </p>
                          </div>

                          <div className="flex items-center justify-end">
                            <CheckCircle2
                              className={`h-5 w-5 ${
                                selectedIds.includes(resultado.empleadoId)
                                  ? "text-green-600"
                                  : "text-slate-300"
                              }`}
                            />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}

        <DialogFooter>
          {step === "config" ? (
            <>
              <Button variant="outline" onClick={handleClose}>
                Cancelar
              </Button>
              <Button
                onClick={handleCalcular}
                disabled={isCalculating}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isCalculating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Calculando...
                  </>
                ) : (
                  <>
                    <Calculator className="mr-2 h-4 w-4" />
                    Calcular Aguinaldos
                  </>
                )}
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={() => setStep("config")}>
                Volver
              </Button>
              <Button
                onClick={handleRegistrar}
                disabled={selectedIds.length === 0 || isRegistering}
                className="bg-green-600 hover:bg-green-700"
              >
                {isRegistering ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Registrando...
                  </>
                ) : (
                  <>Registrar {selectedIds.length} Aguinaldos</>
                )}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
