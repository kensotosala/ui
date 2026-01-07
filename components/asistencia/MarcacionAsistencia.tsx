"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAsistencia } from "@/hooks/useAsistencia";
import {
  Clock,
  CheckCircle,
  LogIn,
  LogOut,
  Loader2,
  User,
  Building,
  Calendar,
  CheckCheck,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

interface MarcacionAsistenciaProps {
  empleadoId: number;
  nombreEmpleado?: string;
  departamento?: string;
}

export const MarcacionAsistencia: React.FC<MarcacionAsistenciaProps> = ({
  empleadoId,
  nombreEmpleado = "Empleado",
  departamento = "Departamento",
}) => {
  const { toast } = useToast();
  const [horaLocal, setHoraLocal] = useState<string>("");
  const [fechaActual, setFechaActual] = useState<string>("");

  const { marcarAsistencia, cargarEstado, isLoading, estado, horaServer } =
    useAsistencia({
      empleadoId,
      onSuccess: (message) => {
        toast({
          title: "✅ Asistencia registrada",
          description: message,
          duration: 5000,
        });
      },
      onError: (error) => {
        toast({
          title: "❌ Error",
          description: error,
          variant: "destructive",
          duration: 5000,
        });
      },
    });

  // Actualizar hora local y fecha
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setHoraLocal(
        now.toLocaleTimeString("es-ES", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );

      setFechaActual(
        now.toLocaleDateString("es-ES", {
          weekday: "long",
          day: "2-digit",
          month: "long",
          year: "numeric",
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Cargar estado inicial
  useEffect(() => {
    cargarEstado();
  }, [cargarEstado]);

  const getEstadoInfo = () => {
    if (!estado)
      return {
        texto: "Cargando...",
        icon: <Loader2 className="h-4 w-4 animate-spin" />,
        color: "bg-gray-100 text-gray-800",
      };

    switch (estado.estado) {
      case "PENDIENTE":
        return {
          texto: "Pendiente de entrada",
          icon: <Clock className="h-4 w-4" />,
          color: "bg-yellow-100 text-yellow-800 border-yellow-300",
        };
      case "PRESENTE":
        return {
          texto: "Presente (pendiente salida)",
          icon: <LogIn className="h-4 w-4" />,
          color: "bg-green-100 text-green-800 border-green-300",
        };
      case "COMPLETO":
        return {
          texto: "Jornada completada",
          icon: <CheckCircle className="h-4 w-4" />,
          color: "bg-blue-100 text-blue-800 border-blue-300",
        };
      default:
        return {
          texto: estado.estado,
          icon: <Clock className="h-4 w-4" />,
          color: "bg-gray-100 text-gray-800",
        };
    }
  };

  const getBotonInfo = () => {
    if (!estado)
      return {
        texto: "Cargando...",
        icon: <Loader2 className="h-5 w-5 animate-spin mr-2" />,
        variant: "default" as const,
        disabled: true,
      };

    if (estado.estado === "PENDIENTE")
      return {
        texto: "Marcar Entrada",
        icon: <LogIn className="h-5 w-5 mr-2" />,
        variant: "default" as const,
        className: "bg-green-600 hover:bg-green-700",
      };
    if (estado.estado === "PRESENTE")
      return {
        texto: "Marcar Salida",
        icon: <LogOut className="h-5 w-5 mr-2" />,
        variant: "default" as const,
        className: "bg-blue-600 hover:bg-blue-700",
      };
    return {
      texto: "Jornada Completada",
      icon: <CheckCheck className="h-5 w-5 mr-2" />,
      variant: "secondary" as const,
      disabled: true,
      className: "bg-gray-300 cursor-not-allowed",
    };
  };

  const estaDeshabilitado = estado?.estado === "COMPLETO";
  const estadoInfo = getEstadoInfo();
  const botonInfo = getBotonInfo();

  return (
    <Card className="w-full shadow-lg border border-gray-200">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row items-stretch gap-6">
          {/* Columna 1: Información del empleado */}
          <div className="flex-1 space-y-4 min-w-62.5">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <User className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">{nombreEmpleado}</h3>
                <div className="flex items-center gap-2 text-gray-600">
                  <Building className="h-4 w-4" />
                  <span className="text-sm">{departamento}</span>
                </div>
                <div className="mt-1">
                  <Badge variant="outline" className="text-xs">
                    ID: {empleadoId}
                  </Badge>
                </div>
              </div>
            </div>

            <Separator />

            {/* Estado actual */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-500">
                ESTADO ACTUAL
              </h4>
              <div
                className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${estadoInfo.color}`}
              >
                {estadoInfo.icon}
                <span className="font-medium">{estadoInfo.texto}</span>
              </div>
            </div>

            {/* Fecha */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-500">FECHA</h4>
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-50">
                <Calendar className="h-4 w-4 text-gray-600" />
                <span className="font-medium">{fechaActual}</span>
              </div>
            </div>
          </div>

          <Separator
            orientation="vertical"
            className="hidden md:block h-auto"
          />

          {/* Columna 2: Tiempos y registro */}
          <div className="flex-1 min-w-75">
            <div className="grid grid-cols-2 gap-4 mb-6">
              {/* Hora Local */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-gray-600">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm">HORA LOCAL</span>
                </div>
                <div className="text-2xl font-mono font-bold bg-gray-50 p-3 rounded-lg">
                  {horaLocal}
                </div>
              </div>

              {/* Hora Servidor */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-gray-600">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm">HORA SERVIDOR</span>
                </div>
                <div className="text-2xl font-mono font-bold bg-gray-50 p-3 rounded-lg">
                  {horaServer || "--:--"}
                </div>
              </div>
            </div>

            {/* Registros del día */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-gray-500">
                REGISTRO DEL DÍA
              </h4>

              <div className="space-y-3">
                {/* Entrada */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-50 rounded-lg">
                      <LogIn className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Entrada</p>
                      <p className="text-xs text-gray-500">Hora de inicio</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-mono font-semibold">
                      {estado?.horaEntrada || "--:--"}
                    </div>
                    <div className="text-xs text-gray-500">HH:MM</div>
                  </div>
                </div>

                {/* Salida */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <LogOut className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Salida</p>
                      <p className="text-xs text-gray-500">
                        Hora de finalización
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-mono font-semibold">
                      {estado?.horaSalida || "--:--"}
                    </div>
                    <div className="text-xs text-gray-500">HH:MM</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Separator
            orientation="vertical"
            className="hidden md:block h-auto"
          />

          {/* Columna 3: Acción */}
          <div className="flex-1 min-w-50">
            <div className="h-full flex flex-col justify-center">
              <div className="space-y-4">
                <div className="text-center">
                  <h4 className="text-lg font-semibold mb-2">
                    ACCIÓN REQUERIDA
                  </h4>
                  <p className="text-sm text-gray-600">
                    {estado?.estado === "PENDIENTE"
                      ? "Presiona el botón para registrar tu entrada"
                      : estado?.estado === "PRESENTE"
                      ? "Presiona el botón para registrar tu salida"
                      : "Tu jornada ha sido completada"}
                  </p>
                </div>

                <div className="flex flex-col items-center">
                  <Button
                    onClick={marcarAsistencia}
                    disabled={isLoading || botonInfo.disabled}
                    variant={botonInfo.variant}
                    className={`w-full py-6 text-lg ${
                      botonInfo.className || ""
                    }`}
                    size="lg"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                        Procesando...
                      </>
                    ) : (
                      <>
                        {botonInfo.icon}
                        {botonInfo.texto}
                      </>
                    )}
                  </Button>

                  {/* Mensajes informativos */}
                  <div className="mt-4 space-y-2 text-center">
                    {estaDeshabilitado && (
                      <div className="flex items-center justify-center gap-2 text-green-600">
                        <CheckCircle className="h-4 w-4" />
                        <p className="text-sm">
                          ✅ Tu jornada ha sido completada
                        </p>
                      </div>
                    )}

                    {estado?.estado === "PRESENTE" && (
                      <div className="flex items-center justify-center gap-2 text-blue-600">
                        <Clock className="h-4 w-4" />
                        <p className="text-sm">
                          ⏰ Recuerda marcar tu salida al finalizar
                        </p>
                      </div>
                    )}

                    {estado?.estado === "PENDIENTE" && (
                      <div className="text-sm text-gray-500">
                        La hora del servidor es la oficial para el registro
                      </div>
                    )}
                  </div>
                </div>

                {/* Información adicional */}
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h5 className="text-sm font-medium mb-2">
                    INFORMACIÓN IMPORTANTE
                  </h5>
                  <ul className="text-xs text-gray-600 space-y-1">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-3 w-3 text-green-600 mt-0.5 shrink-0" />
                      <span>El registro se realiza en tiempo real</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-3 w-3 text-green-600 mt-0.5 shrink-0" />
                      <span>La hora del servidor es la oficial</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-3 w-3 text-green-600 mt-0.5 shrink-0" />
                      <span>Contacta con RRHH ante cualquier incidencia</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
