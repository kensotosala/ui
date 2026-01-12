export type Departamento = {
  idDepartamento: number;
  nombreDepartamento: string;
  descripcion: string;
  idJefeDepartamento: number | null;
  estado: "ACTIVO" | "INACTIVO";
  fechaCreacion?: string;
  fechaModificacion?: string | null;
};
