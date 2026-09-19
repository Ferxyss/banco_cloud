import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  cerrarSesion,
  obtenerGrupos,
  obtenerUsuarioActual,
} from "../services/authService";

function Dashboard() {
  const [usuario, setUsuario] = useState("");
  const [rol, setRol] = useState("");
  const [cargando, setCargando] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const cargarDatosUsuario = async () => {
      try {
        const usuarioActual = await obtenerUsuarioActual();
        const grupos = await obtenerGrupos();

        if (usuarioActual) {
          setUsuario(usuarioActual.username);
        }

        if (grupos.includes("Empleado")) {
          setRol("Empleado");
        } else if (grupos.includes("Cliente")) {
          setRol("Cliente");
        }
      } catch (error) {
        console.error(
          "Error al obtener datos del usuario:",
          error
        );
      } finally {
        setCargando(false);
      }
    };

    cargarDatosUsuario();
  }, []);

  const handleLogout = async () => {
    try {
      await cerrarSesion();
      navigate("/");
    } catch (error) {
      console.error(
        "Error al cerrar sesión:",
        error
      );
    }
  };

  if (cargando) {
    return <p>Cargando información...</p>;
  }

  return (
    <div>
      <header>
        <h1>Banco Cloud</h1>

        <div>
          <p>
            Usuario:{" "}
            {usuario || "No identificado"}
          </p>

          <p>
            Rol: {rol || "Sin rol"}
          </p>

          <button onClick={handleLogout}>
            Cerrar sesión
          </button>
        </div>
      </header>

      <main>
        <section>
          <h2>Bienvenido a Banco Cloud</h2>

          <p>
            Gestiona tus cuentas y solicitudes desde
            este panel.
          </p>
        </section>

        <section>
          <h2>Accesos</h2>

          <button
            onClick={() => navigate("/cuentas")}
          >
            Mis cuentas
          </button>

          <button
            onClick={() =>
              navigate("/solicitudes")
            }
          >
            Solicitudes
          </button>

          {rol === "Empleado" && (
            <button
              onClick={() =>
                navigate("/empleado")
              }
            >
              Panel de empleado
            </button>
          )}
        </section>

        {rol === "Empleado" && (
          <section>
            <h2>Administración</h2>

            <p>
              Puedes gestionar las solicitudes de los
              clientes y procesar la apertura de cuentas.
            </p>
          </section>
        )}
      </main>
    </div>
  );
}

export default Dashboard;