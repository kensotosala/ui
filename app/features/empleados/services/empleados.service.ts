import axios from "axios";
import { Empleado, EstadoEmpleado } from "../types";

const API_BASE_URL = "https://localhost:7121/api";

export const empleadoService = {
  // Listar todos los empleados
  getAll: async (): Promise<Empleado[]> => {
    const { data } = await axios.get<Empleado[]>(`${API_BASE_URL}/Empleados`);
    return data;
  },

  // Obtener un empleado por ID
  getById: async (id: number): Promise<Empleado> => {
    const { data } = await axios.get<Empleado>(
      `${API_BASE_URL}/Empleados/${id}`
    );
    return data;
  },

  // Crear nuevo empleado
  create: async (
    empleado: Omit<Empleado, "id" | "estado"> & {
      nombreUsuario: string;
      password: string;
    }
  ): Promise<Empleado> => {
    const { data } = await axios.post<Empleado>(
      `${API_BASE_URL}/Empleados`,
      empleado
    );
    return data;
  },

  // Actualizar empleado existente
  update: async (
    id: number,
    empleado: Partial<
      Omit<Empleado, "id" | "nombreUsuario" | "password"> & {
        estado?: EstadoEmpleado;
      }
    >
  ): Promise<Empleado> => {
    const { data } = await axios.put<Empleado>(
      `${API_BASE_URL}/Empleados/${id}`,
      empleado
    );
    return data;
  },

  // Eliminar empleado
  delete: async (id: number): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/Empleados/${id}`);
  },
};
