/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { CrearPermisoDTO } from "../../../types";
import { useEmpleados } from "@/app/features/empleados/hooks/useEmpleado";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

// ============================================
// SCHEMA DE VALIDACIÓN
// ============================================
const permisoSchema = z.object({
  EmpleadoId: z.number().min(1, "Debes seleccionar un empleado"),

  FechaPemiso: z
    .string()
    .min(1, "La fecha del permiso es obligatoria")
    .refine((fecha) => {
      const permiso = new Date(fecha);
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);
      return permiso >= hoy;
    }, "La fecha no puede ser en el pasado")
    .refine((fecha) => {
      const permiso = new Date(fecha);
      const limite = new Date();
      limite.setMonth(limite.getMonth() + 3);
      return permiso <= limite;
    }, "Máximo 3 meses de anticipación"),

  Motivo: z
    .string()
    .min(10, "El motivo debe tener al menos 10 caracteres")
    .max(500, "El motivo no puede exceder 500 caracteres"),

  ConGoceSalario: z.boolean(),
});

type PermisoFormValues = z.infer<typeof permisoSchema>;

// ============================================
// PROPS
// ============================================
interface PermisoCreateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (data: CrearPermisoDTO) => Promise<void>;
}

// ============================================
// COMPONENTE
// ============================================
export function PermisoCreateDialog({
  open,
  onOpenChange,
  onCreate,
}: PermisoCreateDialogProps) {
  const { empleados = [] } = useEmpleados();

  const form = useForm<PermisoFormValues>({
    resolver: zodResolver(permisoSchema),
    defaultValues: {
      EmpleadoId: 0,
      FechaPemiso: "",
      Motivo: "",
      ConGoceSalario: true,
    },
  });

  const handleClose = () => {
    form.reset();
    onOpenChange(false);
  };

  const onSubmit = async (values: PermisoFormValues) => {
    try {
      const payload: CrearPermisoDTO = {
        empleadoId: values.EmpleadoId,
        fechaPermiso: values.FechaPemiso,
        motivo: values.Motivo,
        conGoceSalario: values.ConGoceSalario,
      };

      await onCreate(payload);
      handleClose();
    } catch (error: any) {
      const mensaje =
        error?.response?.data?.message ?? error?.message ?? "Error desconocido";
      alert(`No se pudo crear el permiso: ${mensaje}`);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nueva Solicitud de Permiso</DialogTitle>
          <Separator />
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Empleado */}
            <FormField
              control={form.control}
              name="EmpleadoId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Empleado *</FormLabel>
                  <Select
                    value={field.value ? String(field.value) : ""}
                    onValueChange={(v) => field.onChange(Number(v))}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un empleado" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {empleados.map((e) => (
                        <SelectItem
                          key={e.idEmpleado}
                          value={String(e.idEmpleado)}
                        >
                          {e.nombre} {e.primerApellido}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Fecha */}
            <FormField
              control={form.control}
              name="FechaPemiso"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fecha del Permiso *</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormDescription>
                    No puede ser pasada ni mayor a 3 meses
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Motivo */}
            <FormField
              control={form.control}
              name="Motivo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Motivo *</FormLabel>
                  <FormControl>
                    <Textarea rows={4} {...field} />
                  </FormControl>
                  <FormDescription>Entre 10 y 500 caracteres</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Goce de salario */}
            <FormField
              control={form.control}
              name="ConGoceSalario"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3">
                  <FormControl>
                    <Checkbox
                      checked={!!field.value}
                      onCheckedChange={(v) => field.onChange(Boolean(v))}
                    />
                  </FormControl>
                  <div>
                    <FormLabel>Con Goce de Salario</FormLabel>
                    <FormDescription>
                      Marca si el permiso será pagado
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            {/* Acciones */}
            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={form.formState.isSubmitting}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Creando..." : "Crear Solicitud"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
