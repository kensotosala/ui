"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Empleado } from "../../../types";

type EmpleadoCreateForm = Omit<Empleado, "id" | "estado"> & {
  nombreUsuario: string;
  password: string;
};

interface EmpleadoCreateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (data: EmpleadoCreateForm) => Promise<void>;
}

const initialFormData: EmpleadoCreateForm = {
  codigoEmpleado: "",
  nombre: "",
  primerApellido: "",
  segundoApellido: "",
  email: "",
  telefono: "",
  fechaContratacion: "",
  puestoId: 0,
  departamentoId: 0,
  jefeInmediatoId: undefined,
  salarioBase: 0,
  tipoContrato: "FIJO",
  nombreUsuario: "",
  password: "",
  rolId: 0,
};

export function EmpleadoCreateDialog({
  open,
  onOpenChange,
  onCreate,
}: EmpleadoCreateDialogProps) {
  const [formData, setFormData] = useState<EmpleadoCreateForm>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = <K extends keyof EmpleadoCreateForm>(
    field: K,
    value: EmpleadoCreateForm[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await onCreate(formData);
      setFormData(initialFormData);
      onOpenChange(false);
    } catch (error) {
      console.error("Error al crear empleado:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Crear nuevo empleado</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Código</Label>
              <Input
                value={formData.codigoEmpleado}
                onChange={(e) => handleChange("codigoEmpleado", e.target.value)}
                required
              />
            </div>

            <div>
              <Label>Email</Label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                required
              />
            </div>

            <div>
              <Label>Nombre</Label>
              <Input
                value={formData.nombre}
                onChange={(e) => handleChange("nombre", e.target.value)}
                required
              />
            </div>

            <div>
              <Label>Primer apellido</Label>
              <Input
                value={formData.primerApellido}
                onChange={(e) => handleChange("primerApellido", e.target.value)}
                required
              />
            </div>

            <div>
              <Label>Segundo apellido</Label>
              <Input
                value={formData.segundoApellido ?? ""}
                onChange={(e) =>
                  handleChange("segundoApellido", e.target.value)
                }
              />
            </div>

            <div>
              <Label>Teléfono</Label>
              <Input
                value={formData.telefono}
                onChange={(e) => handleChange("telefono", e.target.value)}
              />
            </div>

            <div>
              <Label>Departamento ID</Label>
              <Input
                type="number"
                value={formData.departamentoId}
                onChange={(e) =>
                  handleChange("departamentoId", Number(e.target.value))
                }
                required
              />
            </div>

            <div>
              <Label>Puesto ID</Label>
              <Input
                type="number"
                value={formData.puestoId}
                onChange={(e) =>
                  handleChange("puestoId", Number(e.target.value))
                }
                required
              />
            </div>

            <div>
              <Label>Salario base</Label>
              <Input
                type="number"
                value={formData.salarioBase}
                onChange={(e) =>
                  handleChange("salarioBase", Number(e.target.value))
                }
              />
            </div>

            <div>
              <Label>Usuario</Label>
              <Input
                value={formData.nombreUsuario}
                onChange={(e) => handleChange("nombreUsuario", e.target.value)}
                required
              />
            </div>

            <div>
              <Label>Contraseña</Label>
              <Input
                type="password"
                value={formData.password}
                onChange={(e) => handleChange("password", e.target.value)}
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creando..." : "Crear empleado"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
