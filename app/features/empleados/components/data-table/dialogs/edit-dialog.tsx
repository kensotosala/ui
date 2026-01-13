/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";

import { useEffect, useState } from "react";
import { Empleado, TipoContrato } from "@/app/features/empleados/types";
import { Mail, Phone, DollarSign, User, Shield, Calendar } from "lucide-react";

interface EmpleadoEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  empleado: Empleado | null;
  onSave: (empleado: Empleado) => void;
  isLoading: boolean;
  puestos?: Array<{ id: number; nombre: string }>;
  departamentos?: Array<{ id: number; nombre: string }>;
  empleados?: Array<{ id: number; nombre: string; primerApellido: string }>;
  roles?: Array<{ id: number; nombre: string }>;
}

type FormErrors = {
  nombre?: string;
  primerApellido?: string;
  email?: string;
  telefono?: string;
  puestoId?: string;
  departamentoId?: string;
  salarioBase?: string;
  nombreUsuario?: string;
  rolId?: string;
};

export function EmpleadoEditDialog({
  open,
  onOpenChange,
  empleado,
  onSave,
  isLoading,
  puestos = [],
  departamentos = [],
  empleados = [],
  roles = [],
}: EmpleadoEditDialogProps) {
  const [form, setForm] = useState<Empleado | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (empleado) {
      setForm({ ...empleado });
      setErrors({});
    }
  }, [empleado]);

  if (!form) return null;

  const validate = (data: Empleado): FormErrors => {
    const newErrors: FormErrors = {};

    if (!data.nombre.trim()) {
      newErrors.nombre = "El nombre es obligatorio";
    }

    if (!data.primerApellido.trim()) {
      newErrors.primerApellido = "El primer apellido es obligatorio";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!data.email || !emailRegex.test(data.email)) {
      newErrors.email = "Email inválido";
    }

    if (!data.telefono?.trim()) {
      newErrors.telefono = "El teléfono es obligatorio";
    }

    if (!data.puestoId || data.puestoId <= 0) {
      newErrors.puestoId = "Seleccione un puesto válido";
    }

    if (!data.departamentoId || data.departamentoId <= 0) {
      newErrors.departamentoId = "Seleccione un departamento válido";
    }

    if (!data.salarioBase || data.salarioBase <= 0) {
      newErrors.salarioBase = "El salario debe ser mayor a 0";
    }

    if (!data.nombreUsuario?.trim()) {
      newErrors.nombreUsuario = "El nombre de usuario es obligatorio";
    }

    if (!data.rolId || data.rolId <= 0) {
      newErrors.rolId = "Seleccione un rol válido";
    }

    return newErrors;
  };

  const handleSave = () => {
    if (!form) return;

    const validationErrors = validate(form);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      onSave(form);
    }
  };

  const handleChange = (field: keyof Empleado, value: any) => {
    if (!form) return;

    const updated = { ...form, [field]: value };
    setForm(updated);

    // Limpiar error específico cuando el campo es editado
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleNumericChange = (field: keyof Empleado, value: string) => {
    const numValue = value === "" ? 0 : parseFloat(value);
    handleChange(field, numValue);
  };

  const hasErrors = Object.keys(errors).length > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Editar Empleado
          </DialogTitle>
          <DialogDescription>
            Actualice la información del empleado {form.nombre}{" "}
            {form.primerApellido}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Información Personal */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Información Personal</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nombre">
                  Nombre <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="nombre"
                  value={form.nombre}
                  onChange={(e) => handleChange("nombre", e.target.value)}
                  className={errors.nombre ? "border-red-500" : ""}
                />
                {errors.nombre && (
                  <p className="text-sm text-red-500">{errors.nombre}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="primerApellido">
                  Primer Apellido <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="primerApellido"
                  value={form.primerApellido}
                  onChange={(e) =>
                    handleChange("primerApellido", e.target.value)
                  }
                  className={errors.primerApellido ? "border-red-500" : ""}
                />
                {errors.primerApellido && (
                  <p className="text-sm text-red-500">
                    {errors.primerApellido}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="segundoApellido">Segundo Apellido</Label>
                <Input
                  id="segundoApellido"
                  value={form.segundoApellido || ""}
                  onChange={(e) =>
                    handleChange("segundoApellido", e.target.value)
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">
                  Email <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    className={`pl-10 ${errors.email ? "border-red-500" : ""}`}
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="telefono">
                  Teléfono <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="telefono"
                    value={form.telefono}
                    onChange={(e) => handleChange("telefono", e.target.value)}
                    className={`pl-10 ${
                      errors.telefono ? "border-red-500" : ""
                    }`}
                  />
                </div>
                {errors.telefono && (
                  <p className="text-sm text-red-500">{errors.telefono}</p>
                )}
              </div>
            </div>
          </div>

          <Separator />

          {/* Información Laboral */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Información Laboral</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="puestoId">
                  Puesto <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={form.puestoId.toString()}
                  onValueChange={(value) =>
                    handleChange("puestoId", parseInt(value))
                  }
                >
                  <SelectTrigger
                    className={errors.puestoId ? "border-red-500" : ""}
                  >
                    <SelectValue placeholder="Seleccionar puesto" />
                  </SelectTrigger>
                  <SelectContent>
                    {puestos.map((puesto) => (
                      <SelectItem key={puesto.id} value={puesto.id.toString()}>
                        {puesto.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.puestoId && (
                  <p className="text-sm text-red-500">{errors.puestoId}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="departamentoId">
                  Departamento <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={form.departamentoId.toString()}
                  onValueChange={(value) =>
                    handleChange("departamentoId", parseInt(value))
                  }
                >
                  <SelectTrigger
                    className={errors.departamentoId ? "border-red-500" : ""}
                  >
                    <SelectValue placeholder="Seleccionar departamento" />
                  </SelectTrigger>
                  <SelectContent>
                    {departamentos.map((depto) => (
                      <SelectItem key={depto.id} value={depto.id.toString()}>
                        {depto.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.departamentoId && (
                  <p className="text-sm text-red-500">
                    {errors.departamentoId}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="jefeInmediatoId">Jefe Inmediato</Label>
                <Select
                  value={form.jefeInmediatoId?.toString() || ""}
                  onValueChange={(value) =>
                    handleChange(
                      "jefeInmediatoId",
                      value ? parseInt(value) : undefined
                    )
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sin jefe asignado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Sin jefe asignado</SelectItem>
                    {empleados
                      .filter((emp) => emp.id !== form.id) // No permitir que sea su propio jefe
                      .map((emp) => (
                        <SelectItem key={emp.id} value={emp.id.toString()}>
                          {emp.nombre} {emp.primerApellido}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tipoContrato">Tipo de Contrato</Label>
                <Select
                  value={form.tipoContrato}
                  onValueChange={(value) =>
                    handleChange("tipoContrato", value as TipoContrato)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="FIJO">Contrato Fijo</SelectItem>
                    <SelectItem value="TEMPORAL">Contrato Temporal</SelectItem>
                    <SelectItem value="PRACTICAS">Prácticas</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="salarioBase">
                  Salario Base <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="salarioBase"
                    type="number"
                    step="0.01"
                    min="0"
                    value={form.salarioBase}
                    onChange={(e) =>
                      handleNumericChange("salarioBase", e.target.value)
                    }
                    className={`pl-10 ${
                      errors.salarioBase ? "border-red-500" : ""
                    }`}
                  />
                </div>
                {errors.salarioBase && (
                  <p className="text-sm text-red-500">{errors.salarioBase}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="fechaContratacion">Fecha de Contratación</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="fechaContratacion"
                    type="date"
                    value={form.fechaContratacion}
                    onChange={(e) =>
                      handleChange("fechaContratacion", e.target.value)
                    }
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Información de Sistema */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Información de Sistema</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nombreUsuario">
                  Nombre de Usuario <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="nombreUsuario"
                    value={form.nombreUsuario || ""}
                    onChange={(e) =>
                      handleChange("nombreUsuario", e.target.value)
                    }
                    className={`pl-10 ${
                      errors.nombreUsuario ? "border-red-500" : ""
                    }`}
                  />
                </div>
                {errors.nombreUsuario && (
                  <p className="text-sm text-red-500">{errors.nombreUsuario}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="rolId">
                  Rol <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Shield className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Select
                    value={form.rolId.toString()}
                    onValueChange={(value) =>
                      handleChange("rolId", parseInt(value))
                    }
                  >
                    <SelectTrigger
                      className={`pl-10 ${
                        errors.rolId ? "border-red-500" : ""
                      }`}
                    >
                      <SelectValue placeholder="Seleccionar rol" />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map((rol) => (
                        <SelectItem key={rol.id} value={rol.id.toString()}>
                          {rol.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {errors.rolId && (
                  <p className="text-sm text-red-500">{errors.rolId}</p>
                )}
              </div>
            </div>

            {/* Estado */}
            <div className="flex items-center gap-3 pt-2">
              <Switch
                id="estado"
                checked={form.estado === "ACTIVO"}
                onCheckedChange={(checked) =>
                  handleChange("estado", checked ? "ACTIVO" : "INACTIVO")
                }
              />
              <Label htmlFor="estado" className="cursor-pointer">
                Empleado Activo
              </Label>
              <span className="text-sm text-gray-500 ml-2">
                {form.estado === "ACTIVO"
                  ? "✓ Activo en el sistema"
                  : "✗ Inactivo en el sistema"}
              </span>
            </div>
          </div>

          {/* Notas/Observaciones */}
          <div className="space-y-2">
            <Label htmlFor="notas">Notas / Observaciones</Label>
            <Textarea
              id="notas"
              value={form.notas || ""}
              onChange={(e) => handleChange("notas", e.target.value)}
              placeholder="Notas adicionales sobre el empleado..."
              rows={3}
            />
          </div>

          {/* Acciones */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              disabled={hasErrors || isLoading}
              className="min-w-30"
            >
              {isLoading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
                  Guardando...
                </>
              ) : (
                "Guardar Cambios"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Versión simplificada (compatible con el patrón de departamentos)
export function EmpleadoEditDialogSimple({
  open,
  onOpenChange,
  empleado,
  onSave,
  isLoading,
}: EmpleadoEditDialogProps) {
  const [form, setForm] = useState<Empleado | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    setForm(empleado);
    setErrors({});
  }, [empleado]);

  if (!form) return null;

  const validate = (data: Empleado): FormErrors => {
    const newErrors: FormErrors = {};

    if (!data.nombre.trim()) {
      newErrors.nombre = "El nombre es obligatorio";
    }

    if (!data.primerApellido.trim()) {
      newErrors.primerApellido = "El primer apellido es obligatorio";
    }

    if (!data.email.trim()) {
      newErrors.email = "El email es obligatorio";
    }

    return newErrors;
  };

  const handleSave = () => {
    const validationErrors = validate(form);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      onSave(form);
    }
  };

  const hasErrors = Object.keys(errors).length > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Editar Empleado</DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          {/* Nombre */}
          <div className="space-y-2">
            <Label htmlFor="nombre">Nombre</Label>
            <Input
              id="nombre"
              value={form.nombre}
              onChange={(e) => {
                const updated = { ...form, nombre: e.target.value };
                setForm(updated);
                setErrors(validate(updated));
              }}
            />
            {errors.nombre && (
              <p className="text-sm text-red-500">{errors.nombre}</p>
            )}
          </div>

          {/* Primer Apellido */}
          <div className="space-y-2">
            <Label htmlFor="primerApellido">Primer Apellido</Label>
            <Input
              id="primerApellido"
              value={form.primerApellido}
              onChange={(e) => {
                const updated = { ...form, primerApellido: e.target.value };
                setForm(updated);
                setErrors(validate(updated));
              }}
            />
            {errors.primerApellido && (
              <p className="text-sm text-red-500">{errors.primerApellido}</p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={form.email}
              onChange={(e) => {
                const updated = { ...form, email: e.target.value };
                setForm(updated);
                setErrors(validate(updated));
              }}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email}</p>
            )}
          </div>

          {/* Teléfono */}
          <div className="space-y-2">
            <Label htmlFor="telefono">Teléfono</Label>
            <Input
              id="telefono"
              value={form.telefono}
              onChange={(e) => setForm({ ...form, telefono: e.target.value })}
            />
          </div>

          {/* Puesto ID */}
          <div className="space-y-2">
            <Label htmlFor="puestoId">Puesto ID</Label>
            <Input
              id="puestoId"
              type="number"
              min={0}
              value={form.puestoId}
              onChange={(e) =>
                setForm({
                  ...form,
                  puestoId: parseInt(e.target.value) || 0,
                })
              }
            />
          </div>

          {/* Estado */}
          <div className="flex items-center gap-3">
            <Switch
              id="estado"
              checked={form.estado === "ACTIVO"}
              onCheckedChange={(checked) =>
                setForm({ ...form, estado: checked ? "ACTIVO" : "INACTIVO" })
              }
            />
            <Label htmlFor="estado">Activo</Label>
          </div>

          {/* Acciones */}
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="secondary" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={hasErrors || isLoading}>
              {isLoading ? "Guardando..." : "Guardar cambios"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
