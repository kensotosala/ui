export const ROLES = [
  { id: 1, nombre: "ADMIN" },
  { id: 2, nombre: "EMPLEADO" },
] as const;

export type RolNombre = (typeof ROLES)[number]["nombre"];
