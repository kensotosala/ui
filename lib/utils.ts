import { useEmpleados } from "@/app/features/empleados/hooks/useEmpleado";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function useNombreEmpleado(idEmpleado: number | null): string {
  const { empleados } = useEmpleados();

  if (!idEmpleado) return "Empleado no definido";

  const emp = empleados.find((e) => e.idEmpleado === idEmpleado);

  return emp
    ? `${emp.nombre} ${emp.primerApellido} ${emp.segundoApellido ?? ""}`.trim()
    : `Empleado #${idEmpleado}`;
}

export const stringToDatetime = (fecha: string | undefined): string => {
  if (!fecha) return "Fecha no definida";
  return new Date(fecha).toString();
};
