import { useState } from "react";
import { useParams, Link } from "react-router";
import {
  MapPin, Star, CheckCircle, Clock, MessageCircle, Heart,
  Share2, Camera, ChevronLeft, Instagram, X, ZoomIn,
  Award, Calendar, Flag
} from "lucide-react";
import { PHOTOGRAPHERS } from "../data/mockData";
import type { Photographer } from "../data/mockData";
import { Footer } from "../components/Footer";
import { useAuth } from "../context/AuthContext";

export function PhotographerProfile() {
  const { id } = useParams();
  const { isAuthenticated, user: authUser, photographerProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<"portfolio" | "reseñas" | "info">("portfolio");
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messageSent, setMessageSent] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reportSent, setReportSent] = useState(false);

  // First look in mock data, then check if it's the logged-in photographer's own profile
  const mockPhotographer = PHOTOGRAPHERS.find((p) => p.id === id);
  const isOwnProfile = authUser?.role === "photographer" && authUser.id === id && photographerProfile;
  const ownAsPhotographer: Photographer | null = isOwnProfile && photographerProfile ? {
    id: authUser!.id,
    name: authUser!.name,
    avatar: authUser!.avatar || "https://images.unsplash.com/photo-1575299833801-85ce40813bac?w=200&h=200&fit=crop&crop=face",
    coverPhoto: photographerProfile.coverPhoto || "https://images.unsplash.com/photo-1768777278961-df45d3c2aa22?w=1200&h=500&fit=crop",
    city: photographerProfile.city || "Mi ciudad",
    country: "México",
    distance: 0.1,
    rating: 0,
    reviewCount: 0,
    specialties: photographerProfile.specialties.length ? photographerProfile.specialties : ["Fotografía general"],
    priceFrom: photographerProfile.priceFrom || 0,
    bio: photographerProfile.bio || "Fotógrafo disponible para sesiones.",
    portfolio: [],
    reviews: [],
    verified: false,
    responseTime: "< 24 horas",
    yearsExperience: parseInt(photographerProfile.experience) || 1,
    instagram: photographerProfile.instagram,
    lat: 19.4326,
    lng: -99.1332,
  } : null;

  const photographer = mockPhotographer || ownAsPhotographer;

  if (!photographer) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <div className="text-center">
          <Camera className="w-16 h-16 text-gray-200 mx-auto mb-4" />
          <h2 className="text-gray-700 mb-2">Fotógrafo no encontrado</h2>
          <Link to="/explorar" className="text-amber-500 hover:text-amber-600 text-sm">
            Volver a explorar
          </Link>
        </div>
      </div>
    );
  }

  const p = photographer;
  const categories = ["Todos", ...Array.from(new Set(p.portfolio.map((item) => item.category)))];
  const filteredPortfolio = selectedCategory === "Todos"
    ? p.portfolio
    : p.portfolio.filter((item) => item.category === selectedCategory);

  const handleContact = () => {
    if (!isAuthenticated) {
      window.location.href = "/login";
      return;
    }
    setContactOpen(true);
  };

  const handleSendMessage = () => {
    setMessageSent(true);
    setTimeout(() => {
      setContactOpen(false);
      setMessageSent(false);
      setMessage("");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Cover Photo */}
      <div className="relative h-72 sm:h-96 overflow-hidden">
        <img
          src={p.coverPhoto}
          alt={`Portafolio de ${p.name}`}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

        {/* Back button */}
        <div className="absolute top-20 left-4">
          <Link
            to="/explorar"
            className="flex items-center gap-1.5 px-3 py-2 bg-black/40 backdrop-blur-sm text-white text-sm rounded-lg hover:bg-black/60 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Volver
          </Link>
        </div>

        {/* Actions */}
        <div className="absolute top-20 right-4 flex gap-2">
          <button
            onClick={() => setSaved(!saved)}
            className={`w-9 h-9 rounded-lg flex items-center justify-center backdrop-blur-sm transition-colors ${
              saved ? "bg-red-500 text-white" : "bg-black/40 text-white hover:bg-black/60"
            }`}
          >
            <Heart className={`w-4 h-4 ${saved ? "fill-white" : ""}`} />
          </button>
          <button className="w-9 h-9 bg-black/40 backdrop-blur-sm text-white rounded-lg flex items-center justify-center hover:bg-black/60 transition-colors">
            <Share2 className="w-4 h-4" />
          </button>
          {isAuthenticated && (
            <button
              onClick={() => setReportOpen(true)}
              className="w-9 h-9 bg-black/40 backdrop-blur-sm text-white rounded-lg flex items-center justify-center hover:bg-red-500/80 transition-colors"
              title="Reportar perfil"
            >
              <Flag className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Profile Header */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 -mt-16 relative z-10 p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row gap-5">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <img
                src={p.avatar}
                alt={p.name}
                className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl object-cover border-4 border-white shadow-lg"
              />
              {p.verified && (
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-amber-400 rounded-full flex items-center justify-center border-2 border-white shadow">
                  <CheckCircle className="w-4 h-4 text-white" strokeWidth={2.5} />
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="text-gray-900" style={{ fontWeight: 700, fontSize: "1.5rem" }}>
                      {p.name}
                    </h1>
                    {p.verified && (
                      <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs rounded-full" style={{ fontWeight: 500 }}>
                        ✓ Verificado Pro
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    <MapPin className="w-4 h-4 text-amber-500" />
                    <span className="text-gray-600 text-sm">{p.city}, {p.country}</span>
                    <span className="text-gray-400 text-sm ml-2">· {p.distance} km de ti</span>
                  </div>
                </div>
                <button
                  onClick={handleContact}
                  className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-xl transition-colors shadow-sm"
                  style={{ fontWeight: 600 }}
                >
                  <MessageCircle className="w-4 h-4" />
                  Contactar
                </button>
              </div>

              {/* Stats */}
              <div className="flex flex-wrap gap-5 mt-4">
                <div className="flex items-center gap-1.5">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span className="text-gray-900 text-sm" style={{ fontWeight: 600 }}>{p.rating}</span>
                  <span className="text-gray-400 text-xs">({p.reviewCount} reseñas)</span>
                </div>
                <div className="flex items-center gap-1.5 text-gray-600">
                  <Clock className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Responde en {p.responseTime}</span>
                </div>
                <div className="flex items-center gap-1.5 text-gray-600">
                  <Award className="w-4 h-4 text-blue-500" />
                  <span className="text-sm">{p.yearsExperience} años de experiencia</span>
                </div>
                {p.instagram && (
                  <div className="flex items-center gap-1.5 text-gray-600">
                    <Instagram className="w-4 h-4 text-pink-500" />
                    <span className="text-sm">{p.instagram}</span>
                  </div>
                )}
              </div>

              {/* Specialties */}
              <div className="flex flex-wrap gap-1.5 mt-4">
                {p.specialties.map((s) => (
                  <span key={s} className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Price */}
          <div className="mt-5 pt-5 border-t border-gray-100 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Precio desde <span className="text-amber-600 text-lg" style={{ fontWeight: 700 }}>€{p.priceFrom}</span>
              <span className="text-gray-400"> / sesión</span>
            </p>
            <button
              onClick={handleContact}
              className="text-sm text-amber-600 hover:text-amber-700 flex items-center gap-1"
              style={{ fontWeight: 500 }}
            >
              <Calendar className="w-4 h-4" />
              Consultar disponibilidad
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-6 flex gap-1 bg-white border border-gray-100 rounded-xl p-1 shadow-sm">
          {(["portfolio", "reseñas", "info"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 text-sm rounded-lg transition-colors capitalize ${
                activeTab === tab
                  ? "bg-[#030213] text-white"
                  : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"
              }`}
              style={{ fontWeight: 500 }}
            >
              {tab === "portfolio" ? "Portafolio" : tab === "reseñas" ? `Reseñas (${p.reviewCount})` : "Información"}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="mt-6 mb-10">
          {activeTab === "portfolio" && (
            <div>
              {/* Category filter */}
              <div className="flex gap-2 flex-wrap mb-5">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg text-xs transition-colors ${
                      selectedCategory === cat
                        ? "bg-amber-500 text-white"
                        : "bg-white border border-gray-200 text-gray-600 hover:border-amber-300"
                    }`}
                    style={{ fontWeight: 500 }}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Photo grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {filteredPortfolio.map((item) => (
                  <div
                    key={item.id}
                    className="relative group cursor-pointer rounded-xl overflow-hidden bg-gray-100"
                    style={{ aspectRatio: "4/3" }}
                    onClick={() => setLightboxImg(item.url)}
                  >
                    <img
                      src={item.url}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                      <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                      <p className="text-white text-xs" style={{ fontWeight: 500 }}>{item.title}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "reseñas" && (
            <div className="space-y-4">
              {p.reviews.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <Star className="w-10 h-10 mx-auto mb-3 text-gray-200" />
                  <p>Aún no hay reseñas. ¡Sé el primero!</p>
                </div>
              ) : (
                p.reviews.map((r) => (
                  <div key={r.id} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
                    <div className="flex items-start gap-3">
                      <img src={r.avatar} alt={r.author} className="w-10 h-10 rounded-full object-cover" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <p className="text-gray-900 text-sm" style={{ fontWeight: 600 }}>{r.author}</p>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-400">{r.date}</span>
                            <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full">{r.category}</span>
                          </div>
                        </div>
                        <div className="flex gap-0.5 my-1.5">
                          {Array.from({ length: r.rating }).map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                          ))}
                        </div>
                        <p className="text-gray-600 text-sm leading-relaxed">{r.text}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === "info" && (
            <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
              <h3 className="text-gray-900 mb-3" style={{ fontWeight: 600 }}>Sobre mí</h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-6">{p.bio}</p>

              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { label: "Ciudad", value: `${p.city}, ${p.country}` },
                  { label: "Experiencia", value: `${p.yearsExperience} años` },
                  { label: "Tiempo de respuesta", value: p.responseTime },
                  { label: "Precio base", value: `Desde €${p.priceFrom}` },
                ].map((item) => (
                  <div key={item.label} className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-400 mb-1">{item.label}</p>
                    <p className="text-gray-800 text-sm" style={{ fontWeight: 500 }}>{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Lightbox */}
      {lightboxImg && (
        <div
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
          onClick={() => setLightboxImg(null)}
        >
          <button className="absolute top-4 right-4 w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors">
            <X className="w-5 h-5" />
          </button>
          <img
            src={lightboxImg}
            alt=""
            className="max-h-[90vh] max-w-full rounded-lg shadow-2xl object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      {/* Contact Modal */}
      {contactOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-gray-900" style={{ fontWeight: 600 }}>
                Contactar a {p.name}
              </h3>
              <button onClick={() => setContactOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {messageSent ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
                <p className="text-gray-700" style={{ fontWeight: 500 }}>¡Mensaje enviado!</p>
                <p className="text-gray-400 text-sm mt-1">{p.name} recibirá tu mensaje pronto.</p>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl mb-4">
                  <img src={p.avatar} alt={p.name} className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <p className="text-sm text-gray-800" style={{ fontWeight: 500 }}>{p.name}</p>
                    <p className="text-xs text-green-500">Responde en {p.responseTime}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1" style={{ fontWeight: 500 }}>Asunto</label>
                    <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-amber-400">
                      <option>Consulta de precio</option>
                      <option>Disponibilidad</option>
                      <option>Información del servicio</option>
                      <option>Otro</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1" style={{ fontWeight: 500 }}>Mensaje</label>
                    <textarea
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder={`Hola ${p.name}, estoy interesado/a en...`}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-amber-400 resize-none"
                    />
                  </div>
                  <button
                    onClick={handleSendMessage}
                    disabled={!message.trim()}
                    className="w-full bg-amber-500 hover:bg-amber-600 disabled:bg-gray-200 disabled:text-gray-400 text-white py-3 rounded-xl transition-colors"
                    style={{ fontWeight: 500 }}
                  >
                    Enviar mensaje
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Report Modal */}
      {reportOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-gray-900" style={{ fontWeight: 600 }}>
                Reportar perfil
              </h3>
              <button onClick={() => { setReportOpen(false); setReportSent(false); setReportReason(""); }} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {reportSent ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Flag className="w-8 h-8 text-amber-500" />
                </div>
                <p className="text-gray-700" style={{ fontWeight: 500 }}>Reporte enviado</p>
                <p className="text-gray-400 text-sm mt-1">Nuestro equipo revisará el contenido en las próximas 24 horas.</p>
              </div>
            ) : (
              <>
                <p className="text-gray-500 text-sm mb-4">
                  Ayúdanos a mantener FotoTrabajo seguro. ¿Por qué reportas este perfil?
                </p>
                <div className="space-y-2 mb-4">
                  {[
                    "Contenido inapropiado o explícito",
                    "Información falsa o engañosa",
                    "Spam o actividad comercial no autorizada",
                    "Acoso o comportamiento abusivo",
                    "Violación de derechos de autor",
                    "Otro motivo",
                  ].map((reason) => (
                    <button
                      key={reason}
                      onClick={() => setReportReason(reason)}
                      className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition-colors ${
                        reportReason === reason
                          ? "border-red-400 bg-red-50 text-red-700"
                          : "border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      {reason}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => { if (reportReason) setReportSent(true); }}
                  disabled={!reportReason}
                  className="w-full bg-red-500 hover:bg-red-600 disabled:bg-gray-200 disabled:text-gray-400 text-white py-3 rounded-xl transition-colors"
                  style={{ fontWeight: 500 }}
                >
                  Enviar reporte
                </button>
              </>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
