import { useState, useMemo } from "react";
import { useSearchParams } from "react-router";
import { Search, MapPin, SlidersHorizontal, X, Star, CheckCircle, ChevronDown, MapIcon, Camera } from "lucide-react";
import { SPECIALTIES } from "../data/mockData";
import type { Photographer } from "../data/mockData";
import { PhotographerCard } from "../components/PhotographerCard";
import { Footer } from "../components/Footer";
import { useAuth } from "../context/AuthContext";

export function Explore() {
  const { user, photographerProfile, subscription, registeredPhotographers } = useAuth();
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [selectedSpecialty, setSelectedSpecialty] = useState(searchParams.get("especialidad") || "");
  const [maxDistance, setMaxDistance] = useState(50);
  const [minRating, setMinRating] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000);
  const [onlyVerified, setOnlyVerified] = useState(false);
  const [sortBy, setSortBy] = useState<"distancia" | "valoracion" | "precio" | "reseñas">("distancia");
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "map">("grid");

  // Build the full list: use the registered photographers list and inject the current photographer with active subscription if necessary
  const allPhotographers = useMemo((): Photographer[] => {
    const basePhotographers = registeredPhotographers;
    if (user?.role === "photographer" && subscription && photographerProfile) {
      const myCard: Photographer = {
        id: user.id,
        name: user.name,
        avatar: user.avatar || "https://images.unsplash.com/photo-1575299833801-85ce40813bac?w=200&h=200&fit=crop&crop=face",
        coverPhoto: photographerProfile.coverPhoto || "https://images.unsplash.com/photo-1768777278961-df45d3c2aa22?w=1200&h=500&fit=crop",
        city: photographerProfile.city || "Mi ciudad",
        country: "México",
        distance: 0.1,
        rating: 0,
        reviewCount: 0,
        specialties: photographerProfile.specialties.length ? photographerProfile.specialties : ["Fotografía general"],
        priceFrom: photographerProfile.priceFrom || 0,
        bio: photographerProfile.bio || "Fotógrafo profesional disponible para sesiones.",
        portfolio: [],
        reviews: [],
        verified: false,
        responseTime: "< 24 horas",
        yearsExperience: parseInt(photographerProfile.experience) || 1,
        instagram: photographerProfile.instagram,
        lat: 19.4326,
        lng: -99.1332,
      };
      return [myCard, ...basePhotographers.filter((p) => p.id !== user.id)];
    }
    return basePhotographers;
  }, [registeredPhotographers, user, photographerProfile, subscription]);

  const filtered = useMemo(() => {
    let list = allPhotographers.filter((p) => {
      if (searchQuery && !p.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !p.bio.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !p.specialties.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()))) return false;
      if (selectedSpecialty && !p.specialties.includes(selectedSpecialty)) return false;
      if (p.distance > maxDistance) return false;
      if (p.rating < minRating) return false;
      if (p.priceFrom > maxPrice) return false;
      if (onlyVerified && !p.verified) return false;
      return true;
    });

    list = [...list].sort((a, b) => {
      if (sortBy === "distancia") return a.distance - b.distance;
      if (sortBy === "valoracion") return b.rating - a.rating;
      if (sortBy === "precio") return a.priceFrom - b.priceFrom;
      if (sortBy === "reseñas") return b.reviewCount - a.reviewCount;
      return 0;
    });
    return list;
  }, [allPhotographers, searchQuery, selectedSpecialty, maxDistance, minRating, maxPrice, onlyVerified, sortBy]);

  const activeFiltersCount = [
    selectedSpecialty,
    maxDistance < 50 ? "dist" : "",
    minRating > 0 ? "rat" : "",
    maxPrice < 1000 ? "price" : "",
    onlyVerified ? "ver" : "",
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#030213] pt-20 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-white mb-2" style={{ fontSize: "1.75rem", fontWeight: 700 }}>
            Explorar fotógrafos
          </h1>
          <p className="text-gray-400 text-sm">
            {filtered.length} fotógrafo{filtered.length !== 1 ? "s" : ""} encontrado{filtered.length !== 1 ? "s" : ""}
          </p>

          {/* Search bar */}
          <div className="mt-5 flex gap-2">
            <div className="flex-1 flex items-center gap-2 bg-white rounded-xl px-4 py-3 shadow-sm">
              <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <input
                type="text"
                placeholder="Nombre, especialidad, estilo..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 outline-none text-gray-700 text-sm bg-transparent placeholder-gray-400"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")}>
                  <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                </button>
              )}
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm transition-colors ${
                showFilters || activeFiltersCount > 0
                  ? "bg-amber-500 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
              style={{ fontWeight: 500 }}
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filtros
              {activeFiltersCount > 0 && (
                <span className="w-5 h-5 bg-white text-amber-600 rounded-full text-xs flex items-center justify-center" style={{ fontWeight: 700 }}>
                  {activeFiltersCount}
                </span>
              )}
            </button>
          </div>

          {/* Specialty pills */}
          <div className="mt-3 flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            <button
              onClick={() => setSelectedSpecialty("")}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs transition-colors ${
                !selectedSpecialty ? "bg-amber-500 text-white" : "bg-white/10 text-gray-300 hover:bg-white/20"
              }`}
              style={{ fontWeight: 500 }}
            >
              Todos
            </button>
            {SPECIALTIES.map((s) => (
              <button
                key={s}
                onClick={() => setSelectedSpecialty(s === selectedSpecialty ? "" : s)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs transition-colors ${
                  selectedSpecialty === s ? "bg-amber-500 text-white" : "bg-white/10 text-gray-300 hover:bg-white/20"
                }`}
                style={{ fontWeight: 500 }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Filters panel */}
      {showFilters && (
        <div className="bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
              {/* Distance */}
              <div>
                <label className="block text-xs text-gray-500 mb-2" style={{ fontWeight: 600 }}>
                  Distancia máxima: <span className="text-amber-600">{maxDistance} km</span>
                </label>
                <input
                  type="range"
                  min={1}
                  max={100}
                  value={maxDistance}
                  onChange={(e) => setMaxDistance(+e.target.value)}
                  className="w-full accent-amber-500"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>1 km</span><span>100 km</span>
                </div>
              </div>

              {/* Min rating */}
              <div>
                <label className="block text-xs text-gray-500 mb-2" style={{ fontWeight: 600 }}>
                  Valoración mínima
                </label>
                <div className="flex gap-1.5">
                  {[0, 3, 3.5, 4, 4.5].map((r) => (
                    <button
                      key={r}
                      onClick={() => setMinRating(r)}
                      className={`flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs border transition-colors ${
                        minRating === r
                          ? "bg-amber-500 text-white border-amber-500"
                          : "border-gray-200 text-gray-600 hover:border-amber-300"
                      }`}
                    >
                      {r === 0 ? "Todos" : (
                        <><Star className="w-3 h-3 fill-current" /> {r}+</>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Max price */}
              <div>
                <label className="block text-xs text-gray-500 mb-2" style={{ fontWeight: 600 }}>
                  Precio máx. desde: <span className="text-amber-600">€{maxPrice}</span>
                </label>
                <input
                  type="range"
                  min={50}
                  max={1000}
                  step={50}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(+e.target.value)}
                  className="w-full accent-amber-500"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>€50</span><span>€1000</span>
                </div>
              </div>

              {/* Verified only */}
              <div>
                <label className="block text-xs text-gray-500 mb-2" style={{ fontWeight: 600 }}>
                  Opciones
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <div
                    onClick={() => setOnlyVerified(!onlyVerified)}
                    className={`w-10 h-5 rounded-full transition-colors relative ${
                      onlyVerified ? "bg-amber-500" : "bg-gray-300"
                    }`}
                  >
                    <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                      onlyVerified ? "translate-x-5" : "translate-x-0.5"
                    }`} />
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-700">
                    <CheckCircle className="w-3.5 h-3.5 text-amber-500" />
                    Solo verificados
                  </div>
                </label>
              </div>
            </div>

            {/* Reset */}
            {activeFiltersCount > 0 && (
              <button
                onClick={() => {
                  setSelectedSpecialty("");
                  setMaxDistance(50);
                  setMinRating(0);
                  setMaxPrice(1000);
                  setOnlyVerified(false);
                }}
                className="mt-4 text-xs text-red-500 hover:text-red-600 flex items-center gap-1"
              >
                <X className="w-3.5 h-3.5" /> Limpiar filtros
              </button>
            )}
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Sort + view toggle */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-gray-500">
            <span className="text-gray-800" style={{ fontWeight: 600 }}>{filtered.length}</span> resultados
          </p>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded-md transition-colors ${viewMode === "grid" ? "bg-gray-100 text-gray-800" : "text-gray-400 hover:text-gray-600"}`}
              >
                <div className="grid grid-cols-2 gap-0.5 w-3.5 h-3.5">
                  {[0,1,2,3].map(i => <div key={i} className="bg-current rounded-sm" />)}
                </div>
              </button>
              <button
                onClick={() => setViewMode("map")}
                className={`p-1.5 rounded-md transition-colors ${viewMode === "map" ? "bg-gray-100 text-gray-800" : "text-gray-400 hover:text-gray-600"}`}
              >
                <MapIcon className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="appearance-none bg-white border border-gray-200 rounded-lg px-3 py-2 pr-8 text-sm text-gray-700 cursor-pointer focus:outline-none focus:border-amber-400"
              >
                <option value="distancia">Más cercano</option>
                <option value="valoracion">Mejor valorado</option>
                <option value="precio">Menor precio</option>
                <option value="reseñas">Más reseñas</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {viewMode === "map" ? (
          <MapView photographers={filtered} />
        ) : (
          <>
            {filtered.length === 0 ? (
              <div className="text-center py-20">
                <Camera className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                <h3 className="text-gray-500 mb-2">No se encontraron fotógrafos</h3>
                <p className="text-gray-400 text-sm">Prueba ajustando los filtros o amplía el radio de búsqueda</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {filtered.map((p) => (
                  <PhotographerCard key={p.id} photographer={p} />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      <Footer />
    </div>
  );
}

// Simple map view placeholder
function MapView({ photographers }: { photographers: Photographer[] }) {
  const [selected, setSelected] = useState<string | null>(null);
  const selectedP = photographers.find((p) => p.id === selected);

  return (
    <div className="relative bg-white rounded-2xl border border-gray-200 overflow-hidden" style={{ height: "600px" }}>
      {/* Simulated map */}
      <div className="w-full h-full relative bg-gradient-to-br from-blue-50 to-green-50">
        {/* Grid lines */}
        <svg className="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#94a3b8" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>

        {/* Map label */}
        <div className="absolute top-4 left-4 bg-white/80 backdrop-blur px-3 py-1.5 rounded-lg text-xs text-gray-500 border border-gray-200">
          📍 Vista de mapa (simulada) — {photographers.length} fotógrafos en área
        </div>

        {/* Photographer pins */}
        {photographers.map((p, i) => {
          const x = 10 + ((i * 137) % 80);
          const y = 15 + ((i * 97) % 70);
          return (
            <button
              key={p.id}
              onClick={() => setSelected(p.id === selected ? null : p.id)}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 group"
              style={{ left: `${x}%`, top: `${y}%` }}
            >
              <div className={`relative transition-transform ${selected === p.id ? "scale-125" : "hover:scale-110"}`}>
                <div className={`w-10 h-10 rounded-full border-3 shadow-lg overflow-hidden ${selected === p.id ? "border-amber-500 border-4" : "border-white border-2"}`}>
                  <img src={p.avatar} alt={p.name} className="w-full h-full object-cover" />
                </div>
                <div className={`absolute -bottom-1 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded-full text-white text-xs shadow ${selected === p.id ? "bg-amber-500" : "bg-[#030213]"}`} style={{ whiteSpace: "nowrap", fontWeight: 600 }}>
                  €{p.priceFrom}
                </div>
              </div>
            </button>
          );
        })}

        {/* Selected card */}
        {selectedP && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-72 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden">
            <div className="relative h-32">
              <img src={selectedP.coverPhoto} alt="" className="w-full h-full object-cover" />
              <button
                onClick={() => setSelected(null)}
                className="absolute top-2 right-2 w-6 h-6 bg-black/50 rounded-full flex items-center justify-center"
              >
                <X className="w-3.5 h-3.5 text-white" />
              </button>
            </div>
            <div className="p-3">
              <div className="flex items-center gap-2">
                <img src={selectedP.avatar} alt="" className="w-8 h-8 rounded-full object-cover" />
                <div>
                  <p className="text-sm text-gray-900" style={{ fontWeight: 600 }}>{selectedP.name}</p>
                  <p className="text-xs text-gray-500">{selectedP.city} · {selectedP.distance} km</p>
                </div>
                <div className="ml-auto flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  <span className="text-xs text-gray-700" style={{ fontWeight: 500 }}>{selectedP.rating}</span>
                </div>
              </div>
              <a
                href={`/fotografo/${selectedP.id}`}
                className="mt-3 block text-center bg-amber-500 hover:bg-amber-600 text-white text-xs py-2 rounded-lg transition-colors"
                style={{ fontWeight: 500 }}
              >
                Ver perfil completo
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}