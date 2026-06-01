import { Instagram, Facebook, Mail } from "lucide-react";
import { Link } from "react-router";
import logoImg from "figma:asset/977b44ea5a012c53b7f6b67e59c48b6c67d79cfe.png";

export function Footer() {
  return (
    <footer className="bg-[#030213] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <img src={logoImg} alt="FotoTrabajo" className="h-10 w-auto object-contain" />
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Conectamos a los mejores fotógrafos con clientes que buscan capturar sus momentos más especiales.
            </p>
            <div className="flex gap-3 mt-5">
              <a
                href="https://www.facebook.com/profile.php?id=61590246838456"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 bg-white/10 hover:bg-amber-500 rounded-lg flex items-center justify-center transition-colors duration-200"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://www.instagram.com/fototrabajo_mex/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 bg-white/10 hover:bg-amber-500 rounded-lg flex items-center justify-center transition-colors duration-200"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Platform */}
          <div>
            <h4 className="text-sm text-gray-200 mb-4" style={{ fontWeight: 600 }}>Plataforma</h4>
            <ul className="space-y-2">
              {[
                { label: "Explorar fotógrafos", href: "/explorar" },
                { label: "Cómo funciona", href: "/#como-funciona" },
                { label: "Planes y precios", href: "/planes" },
                { label: "Para fotógrafos", href: "/registro" },
                { label: "Para clientes", href: "/registro" },
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.href}
                    className="text-sm text-gray-400 hover:text-amber-400 transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-sm text-gray-200 mb-4" style={{ fontWeight: 600 }}>Especialidades</h4>
            <ul className="space-y-2">
              {["Bodas", "Retratos", "Moda", "Eventos", "Paisajes", "Arquitectura", "Comida", "Bebés"].map((cat) => (
                <li key={cat}>
                  <Link
                    to={`/explorar?especialidad=${cat}`}
                    className="text-sm text-gray-400 hover:text-amber-400 transition-colors"
                  >
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-sm text-gray-200 mb-4" style={{ fontWeight: 600 }}>Soporte</h4>
            <ul className="space-y-2">
              {[
                { label: "Centro de ayuda", to: null },
                { label: "Política de privacidad", to: "/legal" },
                { label: "Términos de uso", to: "/legal" },
                { label: "Cookies", to: null },
                { label: "Contacto", to: null },
              ].map((item) => (
                <li key={item.label}>
                  {item.to ? (
                    <Link
                      to={item.to}
                      className="text-sm text-gray-400 hover:text-amber-400 transition-colors"
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <button className="text-sm text-gray-400 hover:text-amber-400 transition-colors text-left">
                      {item.label}
                    </button>
                  )}
                </li>
              ))}
            </ul>
            <div className="mt-5 flex items-center gap-2 text-sm text-gray-400">
              <Mail className="w-4 h-4 text-amber-400" />
              <a href="mailto:fototrabajomx@gmail.com" className="hover:text-amber-400 transition-colors">
                fototrabajomx@gmail.com
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-500">
            © 2026 FotoTrabajo. Todos los derechos reservados.
          </p>
          <p className="text-xs text-gray-500">
            Hecho con ❤️ para conectar talento y momentos
          </p>
        </div>
      </div>
    </footer>
  );
}