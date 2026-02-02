/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { Loader2, Sparkles, Calendar } from "lucide-react";
import { toast } from "sonner";
import { GenerarNominaQuincenalDTO } from "../../../nomina.types";

const formSchema = z.object({
  quincena: z.enum(["1", "2"]),
  mes: z.number().min(1).max(12),
  anio: z.number().min(2024).max(2030),
  fechaPago: z.string().min(1, "La fecha de pago es requerida"),
});

interface NominaGenerateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onGenerate: (data: GenerarNominaQuincenalDTO) => Promise<void>;
  isGenerating: boolean;
  defaultQuincena?: number;
  defaultMes?: number;
  defaultAnio?: number;
}

export function NominaGenerateDialog({
  open,
  onOpenChange,
  onGenerate,
  isGenerating,
  defaultQuincena,
  defaultMes,
  defaultAnio,
}: NominaGenerateDialogProps) {
  const now = new Date();
  const mesActual = defaultMes || now.getMonth() + 1;
  const anioActual = defaultAnio || now.getFullYear();
  const quincenaActual = defaultQuincena || (now.getDate() <= 15 ? 1 : 2);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      quincena: String(quincenaActual) as "1" | "2",
      mes: mesActual,
      anio: anioActual,
      fechaPago: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const data: GenerarNominaQuincenalDTO = {
        quincena: parseInt(values.quincena) as 1 | 2,
        mes: values.mes,
        anio: values.anio,
        fechaPago: values.fechaPago,
      };

      await onGenerate(data);
      form.reset();
    } catch (error: any) {
      toast.error("Error al generar nómina", {
        description: error.message,
      });
    }
  };

  const getMesNombre = (mes: number) => {
    const meses = [
      "Enero",
      "Febrero",
      "Marzo",
      "Abril",
      "Mayo",
      "Junio",
      "Julio",
      "Agosto",
      "Septiembre",
      "Octubre",
      "Noviembre",
      "Diciembre",
    ];
    return meses[mes - 1];
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-125">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-blue-600" />
            <DialogTitle>Generar Nueva Nómina</DialogTitle>
          </div>
          <DialogDescription>
            Genera la nómina quincenal para todos los empleados activos según
            las regulaciones de Costa Rica 2026
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="quincena"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quincena</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Quincena" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="1">1ª (1-15)</SelectItem>
                        <SelectItem value="2">2ª (16-fin)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="mes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mes</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(parseInt(value))}
                      defaultValue={String(field.value)}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Mes" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Array.from({ length: 12 }, (_, i) => i + 1).map(
                          (mes) => (
                            <SelectItem key={mes} value={String(mes)}>
                              {getMesNombre(mes)}
                            </SelectItem>
                          ),
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="anio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Año</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value))
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="fechaPago"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fecha de Pago</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input type="date" className="pl-10" {...field} />
                    </div>
                  </FormControl>
                  <FormDescription>
                    Fecha en que se realizará el pago de la nómina
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isGenerating}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isGenerating}
                className="bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generando...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generar Nómina
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
