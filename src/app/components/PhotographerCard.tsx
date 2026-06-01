import { Link } from "react-router";
import { MapPin, Star, CheckCircle, Clock } from "lucide-react";
import type { Photographer } from "../data/mockData";

interface Props {
  photographer: Photographer;
  compact?: boolean;
}

export function PhotographerCard({ photographer, compact = false }: Props) {
  const p = photographer;

  return (
    <Link
      to={`/fotografo/${p.id}`}
      className="group block bg-white rounded-2xl border border-gray-100 hover:border-amber-200 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
    >
      {/* Cover Photo */}
      <div className="relative overflow-hidden" style={{ height: compact ? "160px" : "200px" }}>
        <img
          src={p.coverPhoto}
          alt={`Portafolio de ${p.name}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Specialty Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1">
          {p.specialties.slice(0, 2).map((s) => (
            <span
              key={s}
              className="px-2 py-0.5 bg-black/60 backdrop-blur-sm text-white rounded-full text-xs"
            >
              {s}
            </span>
          ))}
        </div>
        {/* Distance badge */}
        <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs text-gray-700 shadow-sm">
          <MapPin className="w-3 h-3 text-amber-500" />
          <span>{p.distance} km</span>
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="flex items-start gap-3">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <img
              src={p.avatar}
              alt={p.name}
              className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-md"
            />
            {p.verified && (
              <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 bg-amber-400 rounded-full flex items-center justify-center border-2 border-white">
                <CheckCircle className="w-3 h-3 text-white" strokeWidth={3} />
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-gray-900 truncate" style={{ fontWeight: 600, fontSize: "0.95rem" }}>
                {p.name}
              </h3>
              <div className="flex items-center gap-1 flex-shrink-0">
                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span className="text-sm text-gray-700" style={{ fontWeight: 500 }}>
                  {p.rating.toFixed(1)}
                </span>
                <span className="text-xs text-gray-400">({p.reviewCount})</span>
              </div>
            </div>
            <div className="flex items-center gap-1 mt-0.5">
              <MapPin className="w-3 h-3 text-gray-400" />
              <span className="text-xs text-gray-500">{p.city}</span>
            </div>
          </div>
        </div>

        {!compact && (
          <p className="mt-3 text-xs text-gray-500 line-clamp-2 leading-relaxed">
            {p.bio}
          </p>
        )}

        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <Clock className="w-3 h-3" />
            <span>{p.responseTime}</span>
          </div>
          <div className="text-right">
            <span className="text-xs text-gray-400">desde </span>
            <span className="text-amber-600" style={{ fontWeight: 600, fontSize: "0.9rem" }}>
              €{p.priceFrom}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
