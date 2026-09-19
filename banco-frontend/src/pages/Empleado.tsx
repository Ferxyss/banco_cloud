import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  listarSolicitudes,
  aprobarSolicitud,
  rechazarSolicitud,
  type Solicitud,
} from "../services/solicitudesService";

function Empleado() {
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [cargando, setCargando] = useState(true);
  const [procesando, setProcesando] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

  const navigate = useNavigate();

  const cargarSolicitudes = async () => {
    try {
      setError("");

      const datos = await listarSolicitudes();

      setSolicitudes(datos);
    } catch (err) {
      console.error("Error al cargar solicitudes:", err);
      setError("No se pudieron cargar las solicitudes.");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarSolicitudes();
  }, []);

  const handleAprobar = async (id: number) => {
    try {
      setError("");
      setMensaje("");
      setProcesando(id);

      await aprobarSolicitud(id);

      setMensaje(
        "Solicitud aprobada y cuenta procesada correctamente."
      );

      await cargarSolicitudes();
    } catch (err) {
      console.error("Error al aprobar solicitud:", err);

      setError(
        "No se pudo aprobar la solicitud. Verifica que tengas permisos de empleado."
      );
    } finally {
      setProcesando(null);
    }
  };

  const handleRechazar = async (id: number) => {
    try {
      setError("");
      setMensaje("");
      setProcesando(id);

      await rechazarSolicitud(id);

      setMensaje("Solicitud rechazada correctamente.");

      await cargarSolicitudes();
    } catch (err) {
      console.error("Error al rechazar solicitud:", err);

      setError(
        "No se pudo rechazar la solicitud. Verifica que tengas permisos de empleado."
      );
    } finally {
      setProcesando(null);
    }
  };

  return (
    <div>
      <header>
        <h1>Panel de Empleado</h1>

        <button onClick={() => navigate("/dashboard")}>
          Volver al dashboard
        </button>
      </header>

      <main>
        <h2>Solicitudes de clientes</h2>

        {mensaje && <p>{mensaje}</p>}
        {error && <p>{error}</p>}

        {cargando ? (
          <p>Cargando solicitudes...</p>
        ) : solicitudes.length === 0 ? (
          <p>No existen solicitudes registradas.</p>
        ) : (
          <div>
            {solicitudes.map((solicitud) => (
              <article key={solicitud.id}>
                <h3>
                  Solicitud #{solicitud.id}
                </h3>

                <p>
                  Cliente: {solicitud.cliente}
                </p>

                <p>
                  Tipo de cuenta: {solicitud.tipoCuenta}
                </p>

                <p>
                  Monto inicial: $
                  {solicitud.montoInicial.toLocaleString(
                    "es-CL"
                  )}
                </p>

                <p>
                  Estado: {solicitud.estado}
                </p>

                <p>
                  Fecha:{" "}
                  {new Date(
                    solicitud.fechaSolicitud
                  ).toLocaleString("es-CL")}
                </p>

                {solicitud.estado === "PENDIENTE" && (
                  <div>
                    <button
                      onClick={() =>
                        handleAprobar(solicitud.id)
                      }
                      disabled={
                        procesando === solicitud.id
                      }
                    >
                      {procesando === solicitud.id
                        ? "Procesando..."
                        : "Aprobar"}
                    </button>

                    <button
                      onClick={() =>
                        handleRechazar(solicitud.id)
                      }
                      disabled={
                        procesando === solicitud.id
                      }
                    >
                      Rechazar
                    </button>
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default Empleado;