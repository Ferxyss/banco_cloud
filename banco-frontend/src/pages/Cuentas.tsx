import { useEffect, useState } from "react";
import {
  listarCuentas,
  type Cuenta,
} from "../services/cuentasService";

function Cuentas() {
  const [cuentas, setCuentas] = useState<Cuenta[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  const cargarCuentas = async () => {
    try {
      setError("");

      const datos = await listarCuentas();

      setCuentas(datos);
    } catch (err) {
      console.error("Error al cargar cuentas:", err);
      setError("No se pudieron cargar las cuentas.");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarCuentas();
  }, []);

  if (cargando) {
    return <p>Cargando cuentas...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h1>Mis cuentas</h1>

      {cuentas.length === 0 ? (
        <p>No tienes cuentas registradas.</p>
      ) : (
        <div>
          {cuentas.map((cuenta) => (
            <article key={cuenta.id}>
              <h2>{cuenta.tipoCuenta}</h2>

              <p>
                Número de cuenta:{" "}
                {cuenta.numeroCuenta ?? "Pendiente"}
              </p>

              <p>
                Saldo: $
                {cuenta.saldo.toLocaleString("es-CL")}
              </p>

              <p>
                Cliente: {cuenta.cliente}
              </p>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

export default Cuentas;