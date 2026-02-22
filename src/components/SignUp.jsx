import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const checkUsernameExists = async (username) => {
    const { data } = await supabase
      .from("perfiles")
      .select("username")
      .eq("username", username)
      .maybeSingle();
    return !!data;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }
    if (!username.trim()) {
      setError("El nombre de usuario es obligatorio");
      return;
    }
    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    setLoading(true);
    try {
      const exists = await checkUsernameExists(username);
      if (exists) {
        setError("El nombre de usuario ya está en uso");
        setLoading(false);
        return;
      }

      const { error: signUpError } = await signUp(email, password, {
        username: username.trim(),
        nombre: nombre.trim(),
        apellido: apellido.trim(),
      });
      if (signUpError) throw signUpError;

      alert("Registro exitoso. Ya puedes iniciar sesión.");
      navigate("/login");
    } catch (error) {
      console.error(error);
      if (error.message.includes("duplicate key")) {
        setError("El nombre de usuario ya está en uso");
      } else if (error.message.includes("already registered")) {
        setError("Este correo electrónico ya está registrado");
      } else {
        setError(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-body)] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[var(--text-main)]">Crear cuenta</h1>
          <p className="text-[var(--text-muted)] mt-2">Completa tus datos para registrarte</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-500 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-[var(--text-muted)] mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-[var(--bg-body)] border border-[var(--border)] rounded-lg px-4 py-3 text-[var(--text-main)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition"
              placeholder="tu@email.com"
            />
          </div>

          <div>
            <label htmlFor="username" className="block text-sm font-medium text-[var(--text-muted)] mb-1">
              Nombre de usuario <span className="text-red-500">*</span>
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full bg-[var(--bg-body)] border border-[var(--border)] rounded-lg px-4 py-3 text-[var(--text-main)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition"
              placeholder="ej: juan123"
            />
            <p className="text-xs text-[var(--text-muted)] mt-1">Este será tu identificador público</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="nombre" className="block text-sm font-medium text-[var(--text-muted)] mb-1">
                Nombre
              </label>
              <input
                id="nombre"
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="w-full bg-[var(--bg-body)] border border-[var(--border)] rounded-lg px-4 py-3 text-[var(--text-main)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition"
                placeholder="Juan"
              />
            </div>
            <div>
              <label htmlFor="apellido" className="block text-sm font-medium text-[var(--text-muted)] mb-1">
                Apellido
              </label>
              <input
                id="apellido"
                type="text"
                value={apellido}
                onChange={(e) => setApellido(e.target.value)}
                className="w-full bg-[var(--bg-body)] border border-[var(--border)] rounded-lg px-4 py-3 text-[var(--text-main)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition"
                placeholder="Pérez"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-[var(--text-muted)] mb-1">
              Contraseña <span className="text-red-500">*</span>
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-[var(--bg-body)] border border-[var(--border)] rounded-lg px-4 py-3 text-[var(--text-main)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition"
              placeholder="••••••••"
            />
            <p className="text-xs text-[var(--text-muted)] mt-1">Mínimo 6 caracteres</p>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-[var(--text-muted)] mb-1">
              Confirmar contraseña <span className="text-red-500">*</span>
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full bg-[var(--bg-body)] border border-[var(--border)] rounded-lg px-4 py-3 text-[var(--text-main)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[var(--primary)]/20 mt-2"
          >
            {loading ? "Registrando..." : "Registrarse"}
          </button>
        </form>

        <p className="mt-6 text-center text-[var(--text-muted)]">
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="text-[var(--primary)] hover:underline font-medium">
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;