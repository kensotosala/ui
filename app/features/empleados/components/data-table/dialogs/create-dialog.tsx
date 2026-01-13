/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  CalendarIcon,
  User,
  Mail,
  Phone,
  DollarSign,
  Lock,
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { TipoContrato } from "@/app/features/empleados/types";

interface EmpleadoCreateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (data: {
    codigoEmpleado: string;
    nombre: string;
    primerApellido: string;
    segundoApellido?: string;
    email: string;
    telefono: string;
    fechaContratacion: string;
    puestoId: number;
    departamentoId: number;
    jefeInmediatoId?: number;
    salarioBase: number;
    tipoContrato: TipoContrato;
    nombreUsuario: string;
    password: string;
    rolId: number;
  }) => Promise<void>;
  puestos?: Array<{ id: number; nombre: string }>;
  departamentos?: Array<{ id: number; nombre: string }>;
  empleados?: Array<{ id: number; nombre: string; primerApellido: string }>;
  roles?: Array<{ id: number; nombre: string }>;
}

export function EmpleadoCreateDialog({
  open,
  onOpenChange,
  onCreate,
  puestos = [],
  departamentos = [],
  empleados = [],
  roles = [],
}: EmpleadoCreateDialogProps) {
  const [formData, setFormData] = useState({
    codigoEmpleado: "",
    nombre: "",
    primerApellido: "",
    segundoApellido: "",
    email: "",
    telefono: "",
    fechaContratacion: new Date(),
    puestoId: 0,
    departamentoId: 0,
    jefeInmediatoId: undefined as number | undefined,
    salarioBase: 0,
    tipoContrato: "FIJO" as TipoContrato,
    nombreUsuario: "",
    password: "",
    rolId: 0,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Generar código de empleado automáticamente al abrir
  useEffect(() => {
    if (open) {
      // Generar código aleatorio (en producción usar lógica del backend)
      const randomCode = `EMP${Math.floor(1000 + Math.random() * 9000)}`;
      setFormData((prev) => ({ ...prev, codigoEmpleado: randomCode }));
    }
  }, [open]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.nombre.trim()) newErrors.nombre = "El nombre es requerido";
    if (!formData.primerApellido.trim())
      newErrors.primerApellido = "El apellido es requerido";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !emailRegex.test(formData.email)) {
      newErrors.email = "Email inválido";
    }

    if (!formData.telefono.trim()) newErrors.telefono = "Teléfono es requerido";
    if (!formData.puestoId) newErrors.puestoId = "Seleccione un puesto";
    if (!formData.departamentoId)
      newErrors.departamentoId = "Seleccione un departamento";
    if (!formData.salarioBase || formData.salarioBase <= 0)
      newErrors.salarioBase = "Salario inválido";
    if (!formData.nombreUsuario.trim())
      newErrors.nombreUsuario = "Nombre de usuario requerido";
    if (!formData.password || formData.password.length < 6)
      newErrors.password = "Mínimo 6 caracteres";
    if (!formData.rolId) newErrors.rolId = "Seleccione un rol";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await onCreate({
        ...formData,
        fechaContratacion: format(formData.fechaContratacion, "yyyy-MM-dd"),
        segundoApellido: formData.segundoApellido || undefined,
        jefeInmediatoId: formData.jefeInmediatoId || undefined,
      });

      // Reset form
      setFormData({
        codigoEmpleado: "",
        nombre: "",
        primerApellido: "",
        segundoApellido: "",
        email: "",
        telefono: "",
        fechaContratacion: new Date(),
        puestoId: 0,
        departamentoId: 0,
        jefeInmediatoId: undefined,
        salarioBase: 0,
        tipoContrato: "FIJO",
        nombreUsuario: "",
        password: "",
        rolId: 0,
      });
      setErrors({});
      onOpenChange(false);
    } catch (error) {
      console.error("Error al crear empleado:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when field is edited
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const generarPassword = () => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let password = "";
    for (let i = 0; i < 8; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    handleChange("password", password);
  };

  const generarUsuario = () => {
    if (formData.nombre && formData.primerApellido) {
      const usuario = `${formData.nombre
        .charAt(0)
        .toLowerCase()}${formData.primerApellido.toLowerCase()}`;
      handleChange("nombreUsuario", usuario);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Crear Nuevo Empleado
          </DialogTitle>
          <DialogDescription>
            Complete todos los campos requeridos para registrar un nuevo
            empleado en el sistema.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Información Personal */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Información Personal</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="codigoEmpleado">
                  Código de Empleado <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="codigoEmpleado"
                  value={formData.codigoEmpleado}
                  onChange={(e) =>
                    handleChange("codigoEmpleado", e.target.value)
                  }
                  placeholder="EMP001"
                  required
                  className={errors.codigoEmpleado ? "border-red-500" : ""}
                />
                {errors.codigoEmpleado && (
                  <p className="text-sm text-red-500">
                    {errors.codigoEmpleado}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="fechaContratacion">
                  Fecha de Contratación <span className="text-red-500">*</span>
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.fechaContratacion && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.fechaContratacion ? (
                        format(formData.fechaContratacion, "PPP", {
                          locale: es,
                        })
                      ) : (
                        <span>Seleccionar fecha</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.fechaContratacion}
                      onSelect={(date) =>
                        date && handleChange("fechaContratacion", date)
                      }
                      initialFocus
                      locale={es}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nombre">
                  Nombre <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="nombre"
                  value={formData.nombre}
                  onChange={(e) => handleChange("nombre", e.target.value)}
                  placeholder="Juan"
                  required
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
                  value={formData.primerApellido}
                  onChange={(e) =>
                    handleChange("primerApellido", e.target.value)
                  }
                  placeholder="Pérez"
                  required
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
                  value={formData.segundoApellido}
                  onChange={(e) =>
                    handleChange("segundoApellido", e.target.value)
                  }
                  placeholder="González"
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
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    placeholder="juan.perez@empresa.com"
                    required
                    className="pl-10"
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
                    value={formData.telefono}
                    onChange={(e) => handleChange("telefono", e.target.value)}
                    placeholder="+34 600 123 456"
                    required
                    className="pl-10"
                  />
                </div>
                {errors.telefono && (
                  <p className="text-sm text-red-500">{errors.telefono}</p>
                )}
              </div>
            </div>
          </div>

          {/* Información Laboral */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Información Laboral</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="puestoId">
                  Puesto <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.puestoId.toString()}
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
                  value={formData.departamentoId.toString()}
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
                  value={formData.jefeInmediatoId?.toString() || ""}
                  onValueChange={(value) =>
                    handleChange("jefeInmediatoId", parseInt(value))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar jefe" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Sin jefe asignado</SelectItem>
                    {empleados.map((emp) => (
                      <SelectItem key={emp.id} value={emp.id.toString()}>
                        {emp.nombre} {emp.primerApellido}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tipoContrato">
                  Tipo de Contrato <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.tipoContrato}
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
                    value={formData.salarioBase}
                    onChange={(e) =>
                      handleChange(
                        "salarioBase",
                        parseFloat(e.target.value) || 0
                      )
                    }
                    placeholder="30000.00"
                    required
                    className="pl-10"
                  />
                </div>
                {errors.salarioBase && (
                  <p className="text-sm text-red-500">{errors.salarioBase}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="rolId">
                  Rol <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.rolId.toString()}
                  onValueChange={(value) =>
                    handleChange("rolId", parseInt(value))
                  }
                >
                  <SelectTrigger
                    className={errors.rolId ? "border-red-500" : ""}
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
                {errors.rolId && (
                  <p className="text-sm text-red-500">{errors.rolId}</p>
                )}
              </div>
            </div>
          </div>

          {/* Credenciales de Acceso */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Credenciales de Acceso</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nombreUsuario">
                  Nombre de Usuario <span className="text-red-500">*</span>
                </Label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="nombreUsuario"
                      value={formData.nombreUsuario}
                      onChange={(e) =>
                        handleChange("nombreUsuario", e.target.value)
                      }
                      placeholder="jperez"
                      required
                      className="pl-10"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={generarUsuario}
                  >
                    Generar
                  </Button>
                </div>
                {errors.nombreUsuario && (
                  <p className="text-sm text-red-500">{errors.nombreUsuario}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">
                  Contraseña Temporal <span className="text-red-500">*</span>
                </Label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="password"
                      type="text"
                      value={formData.password}
                      onChange={(e) => handleChange("password", e.target.value)}
                      placeholder="Contraseña temporal"
                      required
                      className="pl-10"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={generarPassword}
                  >
                    Generar
                  </Button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-500">{errors.password}</p>
                )}
                <p className="text-xs text-gray-500">
                  El empleado deberá cambiar esta contraseña en su primer acceso
                </p>
              </div>
            </div>
          </div>

          {/* Acciones */}
          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
                  Creando Empleado...
                </>
              ) : (
                "Crear Empleado"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
