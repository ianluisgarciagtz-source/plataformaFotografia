import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import {
  Camera, User, Mail, Lock, Eye, EyeOff,
  MapPin, CheckCircle, ArrowRight, ArrowLeft, Phone
} from "lucide-react";
import { useAuth, UserRole } from "../context/AuthContext";
import { SPECIALTIES } from "../data/mockData";
import logoImg from "figma:asset/977b44ea5a012c53b7f6b67e59c48b6c67d79cfe.png";

type Step = 1 | 2 | 3;

export function Register() {
  const [searchParams] = useSearchParams();
  const initRole = (searchParams.get("role") as UserRole) || "client";
  const { login } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState<Step>(1);
  const [role, setRole] = useState<UserRole>(initRole);
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [specialties, setSpecialtiesState] = useState<string[]>([]);
  const [bio, setBio] = useState("");
  const [experience, setExperience] = useState("1");
  const [agreedTerms, setAgreedTerms] = useState(false);

  const toggleSpecialty = (s: string) => {
    setSpecialtiesState((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );
  };

  const handleNext = () => {
    if (step < 3) setStep((s) => (s + 1) as Step);
  };

  const handleBack = () => {
    if (step > 1) setStep((s) => (s - 1) as Step);
  };

  const handleSubmit = () => {
    setLoading(true);
    setTimeout(() => {
      login(email, password, role, {
        city,
        phone,
        specialties,
        bio,
        experience,
        priceFrom: 0,
        instagram: "",
      });
      setLoading(false);
      navigate(role === "photographer" ? "/planes" : "/dashboard/cliente");
    }, 1000);
  };


  const steps = role === "photographer"
    ? ["Cuenta", "Perfil profesional", "Suscripción"]
    : ["Cuenta", "Preferencias", "Confirmar"];

  const progress = ((step - 1) / (steps.length - 1)) * 100;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-5/12 xl:w-2/5 relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1745847768366-d44dcef9ef35?w=900&h=1200&fit=crop"
          alt=""
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#030213] via-[#030213]/60 to-[#030213]/30" />
        <div className="absolute inset-0 flex flex-col justify-end p-10 text-white">
          <Link to="/" className="flex items-center gap-2 absolute top-8 left-10">
            <img src={logoImg} alt="FotoTrabajo" className="h-10 w-auto object-contain" />
          </Link>

          <div>
            <h2 className="text-2xl mb-3" style={{ fontWeight: 700 }}>
              {role === "photographer"
                ? "Únete como fotógrafo y consigue clientes cercanos"
                : "Descubre fotógrafos increíbles cerca de ti"}
            </h2>
            <div className="space-y-2">
              {(role === "photographer"
                ? ["Perfil profesional visible 24/7", "Clientes geolocaliza dos en tu ciudad", "Herramientas de gestión de portafolio", "Estadísticas de visitas y contactos"]
                : ["Explora sin límites de forma gratuita", "Encuentra el fotógrafo más cercano", "Filtra por especialidad y precio", "Contacta directamente"]
              ).map((f) => (
                <div key={f} className="flex items-center gap-2 text-sm text-gray-300">
                  <CheckCircle className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  {f}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <Link to="/" className="flex items-center gap-2 justify-center mb-6 lg:hidden">
            <img src={logoImg} alt="FotoTrabajo" className="h-10 w-auto object-contain" />
          </Link>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
            <div className="mb-6">
              <h1 className="text-gray-900 mb-1" style={{ fontWeight: 700, fontSize: "1.4rem" }}>
                Crear cuenta
              </h1>
              <p className="text-gray-500 text-sm">
                Paso {step} de {steps.length}: {steps[step - 1]}
              </p>

              {/* Progress */}
              <div className="mt-3 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-500 rounded-full transition-all duration-500"
                  style={{ width: `${progress + 50}%` }}
                />
              </div>
            </div>

            {/* Step 1: Account */}
            {step === 1 && (
              <div className="space-y-4">
                {/* Role toggle */}
                <div>
                  <label className="block text-xs text-gray-500 mb-2" style={{ fontWeight: 600 }}>
                    Tipo de cuenta
                  </label>
                  <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
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
                          <><User className="w-4 h-4" /> Cliente</>
                        ) : (
                          <><Camera className="w-4 h-4" /> Fotógrafo</>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-gray-500 mb-1.5" style={{ fontWeight: 500 }}>
                    Nombre completo
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Tu nombre"
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:border-amber-400 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-gray-500 mb-1.5" style={{ fontWeight: 500 }}>
                    Correo electrónico
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="tu@email.com"
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:border-amber-400 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-gray-500 mb-1.5" style={{ fontWeight: 500 }}>
                    Contraseña
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type={showPass ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Mínimo 8 caracteres"
                      className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:border-amber-400 transition-colors"
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

                <button
                  onClick={handleNext}
                  disabled={!name || !email || !password}
                  className="w-full bg-[#030213] hover:bg-amber-500 disabled:bg-gray-200 disabled:text-gray-400 text-white py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
                  style={{ fontWeight: 600 }}
                >
                  Continuar
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Step 2 */}
            {step === 2 && (
              <div className="space-y-4">
                {role === "photographer" ? (
                  <>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1.5" style={{ fontWeight: 500 }}>
                        Ciudad donde operas
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="text"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          placeholder="Madrid, Barcelona..."
                          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:border-amber-400 transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs text-gray-500 mb-1.5" style={{ fontWeight: 500 }}>
                        Teléfono de contacto
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+34 600 000 000"
                          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:border-amber-400 transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs text-gray-500 mb-2" style={{ fontWeight: 500 }}>
                        Especialidades ({specialties.length} seleccionadas)
                      </label>
                      <div className="flex flex-wrap gap-1.5">
                        {SPECIALTIES.map((s) => (
                          <button
                            key={s}
                            onClick={() => toggleSpecialty(s)}
                            className={`px-3 py-1.5 rounded-lg text-xs border transition-colors ${
                              specialties.includes(s)
                                ? "bg-amber-500 text-white border-amber-500"
                                : "bg-white border-gray-200 text-gray-600 hover:border-amber-300"
                            }`}
                            style={{ fontWeight: specialties.includes(s) ? 500 : 400 }}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs text-gray-500 mb-1.5" style={{ fontWeight: 500 }}>
                        Años de experiencia
                      </label>
                      <select
                        value={experience}
                        onChange={(e) => setExperience(e.target.value)}
                        className="w-full border border-gray-200 rounded-xl px-3 py-3 text-sm text-gray-700 focus:outline-none focus:border-amber-400"
                      >
                        {["1", "2", "3", "4", "5", "6-10", "10+"].map((y) => (
                          <option key={y} value={y}>{y === "1" ? "Menos de 1 año" : `${y} años`}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs text-gray-500 mb-1.5" style={{ fontWeight: 500 }}>
                        Descripción profesional
                      </label>
                      <textarea
                        rows={3}
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        placeholder="Cuéntanos sobre tu trabajo y estilo fotográfico..."
                        className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:border-amber-400 resize-none"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1.5" style={{ fontWeight: 500 }}>
                        Tu ciudad
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="text"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          placeholder="Madrid, Barcelona..."
                          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:border-amber-400 transition-colors"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-2" style={{ fontWeight: 500 }}>
                        ¿Qué tipo de fotografía te interesa?
                      </label>
                      <div className="flex flex-wrap gap-1.5">
                        {SPECIALTIES.map((s) => (
                          <button
                            key={s}
                            onClick={() => toggleSpecialty(s)}
                            className={`px-3 py-1.5 rounded-lg text-xs border transition-colors ${
                              specialties.includes(s)
                                ? "bg-amber-500 text-white border-amber-500"
                                : "bg-white border-gray-200 text-gray-600 hover:border-amber-300"
                            }`}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-gray-400 bg-blue-50 p-3 rounded-lg">
                      💡 Estas preferencias nos ayudarán a mostrarte fotógrafos relevantes según lo que necesitas.
                    </p>
                  </>
                )}

                <div className="flex gap-2">
                  <button
                    onClick={handleBack}
                    className="flex items-center gap-1 px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleNext}
                    className="flex-1 bg-[#030213] hover:bg-amber-500 text-white py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
                    style={{ fontWeight: 600 }}
                  >
                    Continuar <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Confirm */}
            {step === 3 && (
              <div className="space-y-4">
                {role === "photographer" ? (
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-center">
                    <Camera className="w-10 h-10 text-amber-500 mx-auto mb-2" />
                    <p className="text-gray-800 text-sm mb-1" style={{ fontWeight: 600 }}>
                      Necesitas una suscripción para publicar
                    </p>
                    <p className="text-gray-500 text-xs leading-relaxed">
                      Para que tu perfil sea visible y puedas subir tu portafolio, deberás elegir un plan. ¡El primero mes puedes probarlo sin tarjeta!
                    </p>
                  </div>
                ) : (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
                    <CheckCircle className="w-10 h-10 text-green-500 mx-auto mb-2" />
                    <p className="text-gray-800 text-sm mb-1" style={{ fontWeight: 600 }}>
                      ¡Todo listo para explorar gratis!
                    </p>
                    <p className="text-gray-500 text-xs leading-relaxed">
                      Como cliente, accedes a toda la plataforma sin costo. Explora portafolios, busca por ubicación y contacta fotógrafos.
                    </p>
                  </div>
                )}

                {/* Summary */}
                <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Nombre</span>
                    <span className="text-gray-800" style={{ fontWeight: 500 }}>{name || "—"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Email</span>
                    <span className="text-gray-800" style={{ fontWeight: 500 }}>{email || "—"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Tipo</span>
                    <span className="text-amber-600" style={{ fontWeight: 500 }}>
                      {role === "photographer" ? "Fotógrafo" : "Cliente"}
                    </span>
                  </div>
                  {city && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Ciudad</span>
                      <span className="text-gray-800" style={{ fontWeight: 500 }}>{city}</span>
                    </div>
                  )}
                </div>

                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreedTerms}
                    onChange={(e) => setAgreedTerms(e.target.checked)}
                    className="mt-0.5 accent-amber-500"
                  />
                  <span className="text-xs text-gray-500 leading-relaxed">
                    Acepto los{" "}
                    <button className="text-amber-500 hover:underline">términos de uso</button>
                    {" "}y la{" "}
                    <button className="text-amber-500 hover:underline">política de privacidad</button>
                  </span>
                </label>

                <div className="flex gap-2">
                  <button
                    onClick={handleBack}
                    className="flex items-center gap-1 px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={!agreedTerms || loading}
                    className="flex-1 bg-amber-500 hover:bg-amber-600 disabled:bg-gray-200 disabled:text-gray-400 text-white py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
                    style={{ fontWeight: 600 }}
                  >
                    {loading ? "Creando cuenta..." : role === "photographer" ? "Crear cuenta y elegir plan" : "Crear cuenta gratis"}
                    {!loading && <ArrowRight className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            <p className="text-center text-sm text-gray-500 mt-4">
              ¿Ya tienes cuenta?{" "}
              <Link to="/login" className="text-amber-500 hover:text-amber-600" style={{ fontWeight: 500 }}>
                Iniciar sesión
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}