import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  listarSolicitudes,
  aprobarSolicitud,
  rechazarSolicitud,
  type Solicitud,
} from "../services/solicitudesService";

import {
  listarUsuarios,
  autorizarUsuario,
  type UsuarioCognito,
} from "../services/usuariosService";

function Empleado() {
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [usuarios, setUsuarios] = useState<UsuarioCognito[]>([]);

  const [cargando, setCargando] = useState(true);
  const [cargandoUsuarios, setCargandoUsuarios] = useState(true);

  const [procesando, setProcesando] = useState<number | null>(null);
  const [procesandoUsuario, setProcesandoUsuario] = useState<string | null>(
    null
  );

  const [error, setError] = useState("");
  const [errorUsuarios, setErrorUsuarios] = useState("");

  const [mensaje, setMensaje] = useState("");
  const [mensajeUsuarios, setMensajeUsuarios] = useState("");

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

  const cargarUsuarios = async () => {
    try {
      setErrorUsuarios("");

      const datos = await listarUsuarios();

      setUsuarios(datos);
    } catch (err) {
      console.error("Error al cargar usuarios:", err);
      setErrorUsuarios("No se pudieron cargar los usuarios.");
    } finally {
      setCargandoUsuarios(false);
    }
  };

  useEffect(() => {
    cargarSolicitudes();
    cargarUsuarios();
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

  const handleAutorizar = async (username: string) => {
    try {
      setErrorUsuarios("");
      setMensajeUsuarios("");
      setProcesandoUsuario(username);

      await autorizarUsuario(username);

      setMensajeUsuarios(
        "El acceso del usuario fue autorizado correctamente."
      );

      await cargarUsuarios();
    } catch (err) {
      console.error("Error al autorizar usuario:", err);

      setErrorUsuarios(
        "No se pudo autorizar el usuario. Verifica que tengas permisos de empleado."
      );
    } finally {
      setProcesandoUsuario(null);
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
        <section>
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
                  <h3>Solicitud #{solicitud.id}</h3>

                  <p>
                    Cliente: {solicitud.cliente}
                  </p>

                  <p>
                    Tipo de cuenta: {solicitud.tipoCuenta}
                  </p>

                  <p>
                    Monto inicial: $
                    {solicitud.montoInicial.toLocaleString("es-CL")}
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
                        disabled={procesando === solicitud.id}
                      >
                        {procesando === solicitud.id
                          ? "Procesando..."
                          : "Aprobar"}
                      </button>

                      <button
                        onClick={() =>
                          handleRechazar(solicitud.id)
                        }
                        disabled={procesando === solicitud.id}
                      >
                        Rechazar
                      </button>
                    </div>
                  )}
                </article>
              ))}
            </div>
          )}
        </section>

        <hr />

        <section>
          <h2>Usuarios registrados</h2>

          {mensajeUsuarios && <p>{mensajeUsuarios}</p>}
          {errorUsuarios && <p>{errorUsuarios}</p>}

          {cargandoUsuarios ? (
            <p>Cargando usuarios...</p>
          ) : usuarios.length === 0 ? (
            <p>No existen usuarios registrados.</p>
          ) : (
            <div>
              {usuarios.map((usuario) => (
                <article key={usuario.username}>
                  <h3>
                    {usuario.email || "Sin correo"}
                  </h3>

                  <p>
                    Usuario: {usuario.username}
                  </p>

                  <p>
                    Estado: {usuario.estado}
                  </p>

                  <p>
                    Habilitado:{" "}
                    {usuario.habilitado ? "Sí" : "No"}
                  </p>

                  <p>
                    Grupos:{" "}
                    {usuario.grupos.length > 0
                      ? usuario.grupos.join(", ")
                      : "Sin grupos"}
                  </p>

                  <p>
                    Rol: {usuario.rol}
                  </p>

                  <p>
                    {usuario.rol === "Empleado"
                      ? "Acceso: Empleado"
                      : usuario.autorizado
                        ? "Acceso: Autorizado"
                        : "Acceso: No autorizado"}
                  </p>

                  {usuario.rol !== "Empleado" &&
                    !usuario.autorizado && (
                      <button
                        onClick={() =>
                          handleAutorizar(usuario.username)
                        }
                        disabled={
                          procesandoUsuario ===
                          usuario.username
                        }
                      >
                        {procesandoUsuario ===
                        usuario.username
                          ? "Autorizando..."
                          : "Autorizar acceso"}
                      </button>
                    )}
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default Empleado;