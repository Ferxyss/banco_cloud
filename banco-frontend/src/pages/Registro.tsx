import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import {
  confirmarRegistro,
  registrarUsuario,
} from "../services/authService";

function Registro() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [codigo, setCodigo] = useState("");

  const [registroRealizado, setRegistroRealizado] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleRegistro = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setMensaje("");
    setError("");

    try {
      const resultado = await registrarUsuario(
        email,
        password
      );

      if (
        resultado.nextStep.signUpStep === "CONFIRM_SIGN_UP"
      ) {
        setRegistroRealizado(true);

        setMensaje(
          "Usuario registrado. Revisa tu correo para obtener el código de confirmación."
        );
      } else {
        setMensaje("Registro completado.");
      }
    } catch (err) {
      console.error(err);
      setError(
        "No se pudo registrar el usuario. Revisa el correo y la contraseña."
      );
    }
  };

  const handleConfirmacion = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setMensaje("");
    setError("");

    try {
      const resultado = await confirmarRegistro(
        email,
        codigo
      );

      if (
        resultado.nextStep.signUpStep === "DONE"
      ) {
        setMensaje(
          "Cuenta confirmada correctamente. Ya puedes iniciar sesión."
        );

        setTimeout(() => {
          navigate("/");
        }, 1500);
      }
    } catch (err) {
      console.error(err);
      setError(
        "El código de confirmación no es válido."
      );
    }
  };

  return (
    <div>
      <h1>Banco Cloud</h1>

      {!registroRealizado ? (
        <>
          <h2>Crear cuenta</h2>

          <form onSubmit={handleRegistro}>
            <div>
              <label htmlFor="email">
                Correo electrónico
              </label>

              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
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

            <button type="submit">
              Crear cuenta
            </button>
          </form>
        </>
      ) : (
        <>
          <h2>Confirmar cuenta</h2>

          <p>
            Revisa el correo:
            <br />
            <strong>{email}</strong>
          </p>

          <form onSubmit={handleConfirmacion}>
            <div>
              <label htmlFor="codigo">
                Código de confirmación
              </label>

              <input
                id="codigo"
                type="text"
                value={codigo}
                onChange={(event) =>
                  setCodigo(event.target.value)
                }
                required
              />
            </div>

            <button type="submit">
              Confirmar cuenta
            </button>
          </form>
        </>
      )}

      {mensaje && <p>{mensaje}</p>}
      {error && <p>{error}</p>}

      <button
        type="button"
        onClick={() => navigate("/")}
      >
        Volver al inicio de sesión
      </button>
    </div>
  );
}

export default Registro;