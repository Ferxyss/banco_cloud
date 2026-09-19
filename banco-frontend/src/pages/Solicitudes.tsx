import { useEffect, useState, type FormEvent } from "react";
import {
  crearSolicitud,
  listarSolicitudes,
  type Solicitud,
} from "../services/solicitudesService";

function Solicitudes() {
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);

  const [tipoCuenta, setTipoCuenta] =
    useState("Cuenta Corriente");

  const [montoInicial, setMontoInicial] =
    useState("");

  const [cargando, setCargando] = useState(true);
  const [enviando, setEnviando] = useState(false);

  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const cargarSolicitudes = async () => {
    try {
      setError("");

      const datos = await listarSolicitudes();

      setSolicitudes(datos);
    } catch (err) {
      console.error(
        "Error al cargar solicitudes:",
        err
      );

      setError(
        "No se pudieron cargar las solicitudes."
      );
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarSolicitudes();
  }, []);

  const handleCrearSolicitud = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setMensaje("");
    setError("");

    const monto = Number(montoInicial);

    if (!monto || monto <= 0) {
      setError(
        "El monto inicial debe ser mayor que 0."
      );

      return;
    }

    try {
      setEnviando(true);

      await crearSolicitud({
        tipoCuenta,
        montoInicial: monto,
      });

      setMontoInicial("");

      setMensaje(
        "Solicitud creada correctamente."
      );

      await cargarSolicitudes();
    } catch (err) {
      console.error(
        "Error al crear solicitud:",
        err
      );

      setError(
        "No se pudo crear la solicitud."
      );
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div>
      <h1>Solicitudes</h1>

      <section>
        <h2>
          Solicitar apertura de cuenta
        </h2>

        <form
          onSubmit={handleCrearSolicitud}
        >
          <div>
            <label htmlFor="tipoCuenta">
              Tipo de cuenta
            </label>

            <select
              id="tipoCuenta"
              value={tipoCuenta}
              onChange={(event) =>
                setTipoCuenta(
                  event.target.value
                )
              }
            >
              <option value="Cuenta Corriente">
                Cuenta Corriente
              </option>

              <option value="Cuenta Ahorro">
                Cuenta Ahorro
              </option>

              <option value="Cuenta Vista">
                Cuenta Vista
              </option>
            </select>
          </div>

          <div>
            <label htmlFor="montoInicial">
              Monto inicial
            </label>

            <input
              id="montoInicial"
              type="number"
              min="1"
              step="0.01"
              value={montoInicial}
              onChange={(event) =>
                setMontoInicial(
                  event.target.value
                )
              }
              required
            />
          </div>

          <button
            type="submit"
            disabled={enviando}
          >
            {enviando
              ? "Enviando..."
              : "Crear solicitud"}
          </button>
        </form>

        {mensaje && <p>{mensaje}</p>}
        {error && <p>{error}</p>}
      </section>

      <section>
        <h2>Mis solicitudes</h2>

        {cargando ? (
          <p>Cargando solicitudes...</p>
        ) : solicitudes.length === 0 ? (
          <p>
            No tienes solicitudes registradas.
          </p>
        ) : (
          <div>
            {solicitudes.map((solicitud) => (
              <article
                key={solicitud.id}
              >
                <h3>
                  {solicitud.tipoCuenta}
                </h3>

                <p>
                  Monto inicial: $
                  {solicitud.montoInicial.toLocaleString(
                    "es-CL"
                  )}
                </p>

                <p>
                  Estado:{" "}
                  {solicitud.estado}
                </p>

                <p>
                  Fecha:{" "}
                  {new Date(
                    solicitud.fechaSolicitud
                  ).toLocaleString(
                    "es-CL"
                  )}
                </p>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Solicitudes;