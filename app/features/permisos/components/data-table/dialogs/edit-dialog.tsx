/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
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
import { Badge } from "@/components/ui/badge";
import { ActualizarPermisoDTO, Permiso } from "../../../types";
import { useEmpleados } from "@/app/features/empleados/hooks/useEmpleado";
import { format } from "date-fns";

// ============================================
// SCHEMA
// ============================================
const permisoEditSchema = z.object({
  EmpleadoId: z.number().min(1, "Debes seleccionar un empleado"),

  FechaPermiso: z
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

  ConGoceSueldo: z.boolean(),
});

type PermisoEditFormValues = z.infer<typeof permisoEditSchema>;

// ============================================
// PROPS
// ============================================
interface PermisoEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: (id: number, data: ActualizarPermisoDTO) => Promise<void>;
  permiso: Permiso | null;
}

// ============================================
// COMPONENTE
// ============================================
export function PermisoEditDialog({
  open,
  onOpenChange,
  onUpdate,
  permiso,
}: PermisoEditDialogProps) {
  const { empleados = [] } = useEmpleados();

  const form = useForm<PermisoEditFormValues>({
    resolver: zodResolver(permisoEditSchema),
    defaultValues: {
      EmpleadoId: 0,
      FechaPermiso: "",
      Motivo: "",
      ConGoceSueldo: true,
    },
  });

  // Cargar datos al abrir
  useEffect(() => {
    if (permiso && open) {
      form.reset({
        EmpleadoId: permiso.empleadoId,
        FechaPermiso: permiso.fechaPermiso
          ? format(new Date(permiso.fechaPermiso), "yyyy-MM-dd")
          : "",
        Motivo: permiso.motivo,
        ConGoceSueldo: permiso.conGoceSalario ?? true,
      });
    }
  }, [permiso, open, form]);

  const handleClose = () => {
    form.reset();
    onOpenChange(false);
  };

  const onSubmit = async (values: PermisoEditFormValues) => {
    if (!permiso) return;

    try {
      const payload: ActualizarPermisoDTO = {
        empleadoId: values.EmpleadoId,
        fechaPermiso: values.FechaPermiso,
        motivo: values.Motivo,
        conGoceSalario: values.ConGoceSueldo,
        estadoSolicitud: permiso.estadoSolicitud ?? undefined,
        fechaAprobacion: permiso.fechaAprobacion ?? undefined,
      };

      await onUpdate(permiso.idPermiso, payload);
      handleClose();
    } catch (error: any) {
      const mensaje =
        error?.response?.data?.message ?? error?.message ?? "Error desconocido";
      alert(`No se pudo actualizar el permiso: ${mensaje}`);
    }
  };

  if (!permiso) return null;

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Solicitud de Permiso</DialogTitle>
          <Separator />
        </DialogHeader>

        {/* Info solo lectura */}
        <div className="bg-muted p-4 rounded-md text-sm">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="font-semibold">ID:</span>
              <p className="text-muted-foreground">#{permiso.idPermiso}</p>
            </div>
            <div>
              <span className="font-semibold">Estado:</span>
              <Badge variant="outline" className="ml-2">
                {permiso.estadoSolicitud ?? "PENDIENTE"}
              </Badge>
            </div>
            <div className="col-span-2">
              <span className="font-semibold">Fecha Solicitud:</span>
              <p className="text-muted-foreground">
                {format(new Date(permiso.fechaSolicitud), "dd/MM/yyyy")}
              </p>
            </div>
          </div>
        </div>

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
              name="FechaPermiso"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fecha del Permiso *</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
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
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Goce sueldo */}
            <FormField
              control={form.control}
              name="ConGoceSueldo"
              render={({ field }) => (
                <FormItem className="flex items-start space-x-3">
                  <FormControl>
                    <Checkbox
                      checked={!!field.value}
                      onCheckedChange={(v) => field.onChange(Boolean(v))}
                    />
                  </FormControl>
                  <div>
                    <FormLabel>Con Goce de Sueldo</FormLabel>
                    <FormDescription>El permiso será pagado</FormDescription>
                  </div>
                </FormItem>
              )}
            />

            {/* Acciones */}
            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancelar
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting
                  ? "Actualizando..."
                  : "Actualizar Solicitud"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
