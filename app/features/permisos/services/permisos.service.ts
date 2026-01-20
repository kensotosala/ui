import ApiClient from "@/lib/api/client";
import { AxiosInstance } from "axios";
import {
  Permiso,
  CrearPermisoDTO,
  ActualizarPermisoDTO,
  AprobarRechazarPermisoDTO,
  FiltrosPermisos,
} from "../types";

/**
 * PATRÓN: Repository
 * Servicio para gestión de permisos
 */
class PermisoService {
  private readonly apiClient: AxiosInstance;
  private readonly basePath = "/v1/Permisos";

  constructor() {
    this.apiClient = ApiClient.getInstance();
  }

  /**
   * Obtener todos los permisos
   */
  async getAll(): Promise<Permiso[]> {
    const { data } = await this.apiClient.get<Permiso[]>(this.basePath);
    return data;
  }

  /**
   * Obtener permiso por ID
   */
  async getById(id: number): Promise<Permiso> {
    const { data } = await this.apiClient.get<Permiso>(
      `${this.basePath}/${id}`,
    );
    return data;
  }

  /**
   * Buscar permisos con filtros
   */
  async buscarPorFiltros(filtros: FiltrosPermisos): Promise<Permiso[]> {
    const { data } = await this.apiClient.post<Permiso[]>(
      `${this.basePath}/buscar`,
      filtros,
    );
    return data;
  }

  /**
   * Obtener permisos por empleado
   */
  async getByEmpleado(empleadoId: number): Promise<Permiso[]> {
    const { data } = await this.apiClient.get<Permiso[]>(
      `${this.basePath}/empleado/${empleadoId}`,
    );
    return data;
  }

  /**
   * Obtener solicitudes pendientes de un jefe
   */
  async getPendientesByJefe(jefeId: number): Promise<Permiso[]> {
    const { data } = await this.apiClient.get<Permiso[]>(
      `${this.basePath}/pendientes/jefe/${jefeId}`,
    );
    return data;
  }

  /**
   * Crear nueva solicitud de permiso
   */
  async create(dto: CrearPermisoDTO): Promise<Permiso> {
    const { data } = await this.apiClient.post<Permiso>(this.basePath, dto);
    return data;
  }

  /**
   * Actualizar solicitud de permiso
   */
  async update(id: number, dto: ActualizarPermisoDTO): Promise<Permiso> {
    const { data } = await this.apiClient.put<Permiso>(
      `${this.basePath}/${id}`,
      dto,
    );
    return data;
  }

  /**
   * Eliminar solicitud de permiso
   */
  async delete(id: number): Promise<void> {
    await this.apiClient.delete(`${this.basePath}/${id}`);
  }

  /**
   * Aprobar o rechazar solicitud
   */
  async aprobarRechazar(
    id: number,
    dto: AprobarRechazarPermisoDTO,
  ): Promise<void> {
    await this.apiClient.patch(`${this.basePath}/${id}/aprobar-rechazar`, dto);
  }
}

export const permisoService = new PermisoService();
export default permisoService;
