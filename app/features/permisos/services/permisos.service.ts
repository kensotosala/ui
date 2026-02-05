// permisos.service.ts
import ApiClient from "@/lib/api/client";
import { AxiosInstance } from "axios";
import {
  Permiso,
  CrearPermisoDTO,
  ActualizarPermisoDTO,
  AprobarRechazarPermisoDTO,
} from "../types";

class PermisoService {
  private readonly apiClient: AxiosInstance;
  private readonly basePath = "/v1/Permisos";

  constructor() {
    this.apiClient = ApiClient.getInstance();
  }

  async getAll(): Promise<Permiso[]> {
    const { data } = await this.apiClient.get<Permiso[]>(this.basePath);
    return data;
  }

  async getById(id: number): Promise<Permiso> {
    const { data } = await this.apiClient.get<Permiso>(
      `${this.basePath}/${id}`,
    );
    return data;
  }

  async create(dto: CrearPermisoDTO): Promise<Permiso> {
    const { data } = await this.apiClient.post<Permiso>(this.basePath, dto);
    return data;
  }

  async update(id: number, dto: ActualizarPermisoDTO): Promise<Permiso> {
    const { data } = await this.apiClient.put<Permiso>(
      `${this.basePath}/${id}`,
      dto,
    );
    return data;
  }

  async delete(id: number): Promise<void> {
    await this.apiClient.delete(`${this.basePath}/${id}`);
  }

  /**
   * Aprobar o rechazar solicitud
   * FIXED: Changed from PATCH to PUT to match backend
   */
  async aprobarRechazar(
    id: number,
    dto: AprobarRechazarPermisoDTO,
  ): Promise<void> {
    await this.apiClient.put(`${this.basePath}/${id}/aprobar-rechazar`, dto);
  }
}

export const permisoService = new PermisoService();
export default permisoService;
