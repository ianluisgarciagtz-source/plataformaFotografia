import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Camera, Eye, EyeOff, Mail, Lock, User, AlertCircle, Shield } from "lucide-react";
import { useAuth, UserRole } from "../context/AuthContext";
import logoImg from "figma:asset/977b44ea5a012c53b7f6b67e59c48b6c67d79cfe.png";

export function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState<UserRole>("client");
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Por favor completa todos los campos.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const success = login(email, password, isAdminMode ? "admin" : role);
      setLoading(false);
      if (!success) {
        setError("Credenciales incorrectas. Verifica tu email y contraseña.");
        return;
      }
      if (isAdminMode) {
        navigate("/admin");
      } else {
        navigate(role === "photographer" ? "/dashboard/fotografo" : "/dashboard/cliente");
      }
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left panel - image */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1646526822732-4eb6415320a2?w=900&h=1200&fit=crop"
          alt=""
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#030213]/80 to-[#030213]/40" />
        <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-white">
          <Link to="/" className="flex items-center gap-2 mb-12">
            <img src={logoImg} alt="FotoTrabajo" className="h-12 w-auto object-contain" />
          </Link>
          <div className="max-w-sm text-center">
            <h2 className="text-3xl mb-4" style={{ fontWeight: 700 }}>
              Tu talento, más cerca de quien te necesita
            </h2>
            <p className="text-gray-300 leading-relaxed">
              Miles de clientes buscan fotógrafos como tú cada día. Únete y haz crecer tu negocio.
            </p>
          </div>
        </div>
      </div>

      {/* Right panel - form */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <Link to="/" className="flex items-center gap-2 justify-center mb-8 lg:hidden">
            <img src={logoImg} alt="FotoTrabajo" className="h-10 w-auto object-contain" />
          </Link>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
            <h1 className="text-gray-900 mb-1" style={{ fontWeight: 700, fontSize: "1.5rem" }}>
              {isAdminMode ? "Acceso Administrador" : "Bienvenido de vuelta"}
            </h1>
            <p className="text-gray-500 text-sm mb-6">
              {isAdminMode ? "Panel de control exclusivo" : "Inicia sesión en tu cuenta"}
            </p>

            {!isAdminMode && (
              <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-6">
                {(["client", "photographer"] as UserRole[]).map((r) => (
                  <button
                    key={r as string}
                    onClick={() => setRole(r)}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm transition-all ${
                      role === r
                        ? "bg-white text-gray-900 shadow-sm"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                    style={{ fontWeight: role === r ? 600 : 400 }}
                  >
                    {r === "client" ? (
                      <><User className="w-4 h-4" /> Soy cliente</>
                    ) : (
                      <><Camera className="w-4 h-4" /> Soy fotógrafo</>
                    )}
                  </button>
                ))}
              </div>
            )}

            {isAdminMode && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl p-3 mb-5 text-xs text-red-700">
                <Shield className="w-4 h-4 flex-shrink-0" />
                <span>Acceso restringido al personal autorizado.</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs text-gray-600 mb-1.5" style={{ fontWeight: 500 }}>
                  Correo electrónico
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu@email.com"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30 transition-colors"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs text-gray-600" style={{ fontWeight: 500 }}>
                    Contraseña
                  </label>
                  <button type="button" className="text-xs text-amber-500 hover:text-amber-600">
                    ¿Olvidaste tu contraseña?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type={showPass ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 text-red-500 text-xs bg-red-50 px-3 py-2 rounded-lg">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#030213] hover:bg-amber-500 disabled:bg-gray-300 text-white py-3 rounded-xl transition-colors"
                style={{ fontWeight: 600 }}
              >
                {loading ? "Iniciando sesión..." : "Iniciar sesión"}
              </button>
            </form>

            {!isAdminMode && (
              <p className="text-center text-sm text-gray-500 mt-5">
                ¿No tienes cuenta?{" "}
                <Link to="/registro" className="text-amber-500 hover:text-amber-600" style={{ fontWeight: 500 }}>
                  Regístrate gratis
                </Link>
              </p>
            )}

            <button
              type="button"
              onClick={() => { setIsAdminMode(!isAdminMode); setError(""); }}
              className="w-full mt-4 flex items-center justify-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 transition-colors"
            >
              <Shield className="w-3 h-3" />
              {isAdminMode ? "Volver al login normal" : "Acceso administrador"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}