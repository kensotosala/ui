import { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from "axios";

/**
 * Interceptor para agregar token de autenticación
 */
const authInterceptor = (config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem("token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

/**
 * Interceptor para manejo de errores
 */
const errorInterceptor = (
  error: AxiosError<{ mensaje?: string; message?: string }>,
) => {
  if (error.response) {
    // Error de respuesta del servidor (4xx, 5xx)
    const mensaje =
      error.response.data?.mensaje ||
      error.response.data?.message ||
      `Error ${error.response.status}: ${error.response.statusText}`;
    throw new Error(mensaje);
  } else if (error.request) {
    // No hubo respuesta del servidor
    throw new Error(
      "No se pudo conectar con el servidor. Verifica tu conexión.",
    );
  } else {
    // Error al configurar la petición
    throw new Error(
      error.message || "Error inesperado al realizar la petición",
    );
  }
};

/**
 * Configura los interceptors en la instancia de Axios
 */
export const setupInterceptors = (instance: AxiosInstance): void => {
  // Request interceptor
  instance.interceptors.request.use(authInterceptor, (error) =>
    Promise.reject(error),
  );

  // Response interceptor
  instance.interceptors.response.use((response) => response, errorInterceptor);
};
