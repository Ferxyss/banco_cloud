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
      const usernameNormalizado = username.trim().toLowerCase();

      console.log(
        "Intentando iniciar sesión con:",
        usernameNormalizado
      );

      const resultado = await iniciarSesion(
        usernameNormalizado,
        password
      );

      console.log(
        "Resultado de Cognito:",
        resultado
      );

      if (resultado.isSignedIn) {
        navigate("/dashboard");
        return;
      }

      const paso = resultado.nextStep?.signInStep;

      switch (paso) {
        case "CONFIRM_SIGN_UP":
          setError(
            "La cuenta todavía no está confirmada."
          );
          break;

        case "RESET_PASSWORD":
          setError(
            "Debes restablecer la contraseña."
          );
          break;

        case "CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED":
          setError(
            "Cognito requiere establecer una nueva contraseña."
          );
          break;

        default:
          setError(
            `La autenticación requiere un paso adicional: ${
              paso ?? "desconocido"
            }`
          );
          break;
      }
    } catch (err) {
      console.error(
        "ERROR REAL DE COGNITO:",
        err
      );

      if (err instanceof Error) {
        console.error(
          "Nombre del error:",
          err.name
        );

        console.error(
          "Mensaje:",
          err.message
        );

        setError(
          `${err.name}: ${err.message}`
        );
      } else {
        setError(
          "Se produjo un error desconocido al iniciar sesión."
        );
      }
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

      {error && (
        <p>
          {error}
        </p>
      )}

      <hr />

      <button
        type="button"
        onClick={() => navigate("/registro")}
      >
        Crear una cuenta
      </button>
    </div>
  );
}

export default Login;