import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { iniciarSesion } from "../services/authService";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");
    setCargando(true);

    try {
      const resultado = await iniciarSesion(
        username,
        password
      );

      if (resultado.isSignedIn) {
        navigate("/dashboard");
        return;
      }

      setError(
        "El usuario requiere completar un paso adicional."
      );
    } catch (err) {
      console.error(err);
      setError("Usuario o contraseña incorrectos.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div>
      <h1>Banco Cloud</h1>
      <h2>Iniciar sesión</h2>

      <form onSubmit={handleLogin}>
        <div>
          <label htmlFor="username">
            Correo electrónico
          </label>

          <input
            id="username"
            type="email"
            value={username}
            onChange={(event) =>
              setUsername(event.target.value)
            }
            required
          />
        </div>

        <div>
          <label htmlFor="password">
            Contraseña
          </label>

          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) =>
              setPassword(event.target.value)
            }
            required
          />
        </div>

        <button
          type="submit"
          disabled={cargando}
        >
          {cargando
            ? "Iniciando sesión..."
            : "Iniciar sesión"}
        </button>
      </form>

      {error && <p>{error}</p>}
    </div>
  );
}

export default Login;