import { useState, useEffect } from "react";
import { Link } from "react-router";
import { motion } from "motion/react";
import {
  Search, MapPin, Star, Camera, Users, Shield, Zap,
  ArrowRight, CheckCircle, ChevronRight, Award
} from "lucide-react";
import { PHOTOGRAPHERS, SPECIALTIES } from "../data/mockData";
import { PhotographerCard } from "../components/PhotographerCard";
import { Footer } from "../components/Footer";

export function Landing() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [heroLoaded, setHeroLoaded] = useState(false);

  useEffect(() => {
    setHeroLoaded(true);
  }, []);

  const featuredPhotographers = PHOTOGRAPHERS.filter((p) => p.verified).slice(0, 4);

  const stats = [
    { value: "2,400+", label: "Fotógrafos activos" },
    { value: "15,000+", label: "Sesiones realizadas" },
    { value: "4.8★", label: "Valoración media" },
    { value: "50+", label: "Ciudades en España" },
  ];

  const howItWorks = [
    {
      step: "01",
      icon: MapPin,
      title: "Busca cerca de ti",
      desc: "Ingresa tu ubicación y encuentra fotógrafos profesionales en tu área, ordenados por distancia.",
      color: "bg-amber-50 text-amber-600",
    },
    {
      step: "02",
      icon: Camera,
      title: "Explora portafolios",
      desc: "Navega libremente por los portafolios, filtra por especialidad y compara perfiles sin registrarte.",
      color: "bg-blue-50 text-blue-600",
    },
    {
      step: "03",
      icon: Users,
      title: "Contacta y contrata",
      desc: "Una vez que encuentres tu fotógrafo ideal, crea tu cuenta gratuita de cliente y contacta directamente.",
      color: "bg-green-50 text-green-600",
    },
  ];

  const testimonials = [
    {
      name: "María García",
      role: "Novia feliz",
      avatar: "https://images.unsplash.com/photo-1773336099065-57893268749f?w=80&h=80&fit=crop&crop=face",
      text: "Encontré a mi fotógrafo de boda en 10 minutos. La función de 'cerca de mí' fue increíble, ¡ni sabía que había tantos talentos en mi ciudad!",
      rating: 5,
    },
    {
      name: "Roberto Alonso",
      role: "Emprendedor",
      avatar: "https://images.unsplash.com/photo-1758613654584-86714842a2d5?w=80&h=80&fit=crop&crop=face",
      text: "Para las fotos de mi restaurante necesitaba un especialista en gastronomía. FotoTrabajo me lo puso facilísimo con sus filtros de especialidad.",
      rating: 5,
    },
    {
      name: "Laura Vidal",
      role: "Fotógrafa Pro",
      avatar: "https://images.unsplash.com/photo-1617461073601-b8222743b613?w=80&h=80&fit=crop&crop=face",
      text: "Desde que me registré en FotoTrabajo, mi agenda está llena. El plan Pro vale cada peso: clientes de calidad llegan solos.",
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* HERO */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1745847768366-d44dcef9ef35?w=1600&h=900&fit=crop"
            alt="Fotógrafo profesional"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#030213]/90 via-[#030213]/70 to-[#030213]/30" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: heroLoaded ? 1 : 0, y: heroLoaded ? 0 : 30 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-2xl"
          >
            <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-400/20 border border-amber-400/40 text-amber-300 rounded-full text-sm mb-6">
              <Camera className="w-4 h-4" />
              La plataforma de fotografía más cercana a ti
            </span>
            <h1 className="text-white mb-6" style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)", fontWeight: 700, lineHeight: 1.15 }}>
              Encuentra el fotógrafo{" "}
              <span className="text-amber-400">perfecto</span>{" "}
              cerca de ti
            </h1>
            <p className="text-gray-300 text-lg mb-10 leading-relaxed">
              Conectamos a clientes con fotógrafos profesionales de su ciudad. Explora portafolios, compara precios y contrata al talento más cercano.
            </p>

            {/* Search Box */}
            <div className="bg-white rounded-2xl p-2 flex flex-col sm:flex-row gap-2 shadow-2xl max-w-xl">
              <div className="flex items-center gap-2 flex-1 px-3">
                <Search className="w-5 h-5 text-gray-400 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Tipo de fotografía (ej. boda, retrato...)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 outline-none text-gray-700 text-sm bg-transparent placeholder-gray-400"
                />
              </div>
              <div className="flex items-center gap-2 px-3 border-l border-gray-200">
                <MapPin className="w-5 h-5 text-amber-500 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Tu ciudad"
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-32 outline-none text-gray-700 text-sm bg-transparent placeholder-gray-400"
                />
              </div>
              <Link
                to={`/explorar${searchQuery || selectedCity ? `?q=${searchQuery}&ciudad=${selectedCity}` : ""}`}
                className="flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-5 py-3 rounded-xl transition-colors text-sm"
                style={{ fontWeight: 600 }}
              >
                Buscar
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Quick specialties */}
            <div className="flex flex-wrap gap-2 mt-5">
              {["Bodas", "Retratos", "Moda", "Paisajes", "Eventos"].map((s) => (
                <Link
                  key={s}
                  to={`/explorar?especialidad=${s}`}
                  className="px-3 py-1.5 bg-white/15 hover:bg-amber-400/30 border border-white/20 hover:border-amber-400/50 text-white text-xs rounded-full transition-all"
                >
                  {s}
                </Link>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Stats bar */}
        <div className="absolute bottom-0 left-0 right-0 bg-white/10 backdrop-blur-md border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {stats.map((s) => (
                <div key={s.label} className="text-center">
                  <p className="text-amber-400" style={{ fontWeight: 700, fontSize: "1.25rem" }}>{s.value}</p>
                  <p className="text-white/70 text-xs mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="como-funciona" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm mb-3" style={{ fontWeight: 500 }}>
              Simple y rápido
            </span>
            <h2 className="text-[#030213] mb-4" style={{ fontSize: "2rem", fontWeight: 700 }}>
              Cómo funciona FotoTrabajo
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              En tres pasos encuentras al fotógrafo ideal sin complicaciones. Para los clientes, siempre es gratis explorar.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {howItWorks.map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="relative bg-white rounded-2xl p-8 border border-gray-100 hover:border-amber-200 hover:shadow-lg transition-all duration-300"
              >
                <div className="absolute -top-3 -left-3 w-9 h-9 bg-[#030213] text-white rounded-xl flex items-center justify-center text-xs" style={{ fontWeight: 700 }}>
                  {item.step}
                </div>
                <div className={`w-14 h-14 ${item.color} rounded-2xl flex items-center justify-center mb-5`}>
                  <item.icon className="w-7 h-7" />
                </div>
                <h3 className="text-gray-900 mb-3" style={{ fontWeight: 600 }}>{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                {i < howItWorks.length - 1 && (
                  <ChevronRight className="hidden md:block absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 text-gray-200" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-[#030213]" style={{ fontSize: "1.75rem", fontWeight: 700 }}>
                Busca por especialidad
              </h2>
              <p className="text-gray-500 mt-1 text-sm">Filtra fotógrafos por el tipo de trabajo que necesitas</p>
            </div>
            <Link to="/explorar" className="flex items-center gap-1 text-amber-500 hover:text-amber-600 text-sm" style={{ fontWeight: 500 }}>
              Ver todos <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="flex flex-wrap gap-3">
            {SPECIALTIES.map((spec, i) => {
              const emojis = ["💍", "🧑‍🎨", "🏔️", "👗", "🍽️", "🏛️", "🎉", "👶", "⚽", "📖"];
              return (
                <Link
                  key={spec}
                  to={`/explorar?especialidad=${spec}`}
                  className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 hover:bg-amber-50 border border-gray-200 hover:border-amber-300 rounded-xl text-sm text-gray-700 hover:text-amber-700 transition-all group"
                >
                  <span className="text-base">{emojis[i]}</span>
                  <span style={{ fontWeight: 500 }}>{spec}</span>
                  <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-amber-500" />
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* FEATURED PHOTOGRAPHERS */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <span className="inline-block px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs mb-2" style={{ fontWeight: 500 }}>
                ✨ Verificados y destacados
              </span>
              <h2 className="text-[#030213]" style={{ fontSize: "1.75rem", fontWeight: 700 }}>
                Fotógrafos destacados
              </h2>
            </div>
            <Link
              to="/explorar"
              className="flex items-center gap-1 text-amber-500 hover:text-amber-600 text-sm"
              style={{ fontWeight: 500 }}
            >
              Ver todos <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {featuredPhotographers.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <PhotographerCard photographer={p} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-[#030213]" style={{ fontSize: "1.75rem", fontWeight: 700 }}>
              Lo que dicen nuestros usuarios
            </h2>
            <p className="text-gray-500 mt-2 text-sm">Historias reales de clientes y fotógrafos</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-gray-50 rounded-2xl p-7 border border-gray-100"
              >
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-gray-700 text-sm leading-relaxed mb-5">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <p className="text-gray-900 text-sm" style={{ fontWeight: 600 }}>{t.name}</p>
                    <p className="text-gray-400 text-xs">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FOR PHOTOGRAPHERS CTA */}
      <section className="py-20 bg-[#030213] relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 w-64 h-64 bg-amber-400 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-amber-500 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <Award className="w-12 h-12 text-amber-400 mx-auto mb-5" />
            <h2 className="text-white mb-4" style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)", fontWeight: 700 }}>
              ¿Eres fotógrafo profesional?
            </h2>
            <p className="text-gray-300 text-lg mb-8 leading-relaxed">
              Únete a FotoTrabajo y consigue clientes en tu área. Publica tu portafolio, aparece en búsquedas geolocalizadas y haz crecer tu negocio.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <div className="flex flex-wrap items-center justify-center gap-5 text-sm text-gray-300 mb-6">
                {["Perfil profesional", "Geolocalización", "Clientes cercanos", "Estadísticas"].map((f) => (
                  <div key={f} className="flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-amber-400" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/registro?role=photographer"
                className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-white px-8 py-4 rounded-xl transition-colors text-base"
                style={{ fontWeight: 600 }}
              >
                <Camera className="w-5 h-5" />
                Empezar como fotógrafo
              </Link>
              <Link
                to="/planes"
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white px-8 py-4 rounded-xl transition-colors text-base"
                style={{ fontWeight: 500 }}
              >
                Ver planes y precios
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}