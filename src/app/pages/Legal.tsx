import { Link } from "react-router";
import { Shield, FileText, AlertTriangle, ChevronRight } from "lucide-react";

const sections = [
  {
    id: "suscripcion",
    icon: FileText,
    color: "amber",
    number: "1",
    title: "Políticas de Suscripción (Fotógrafos)",
    subtitle: "Reglas aplicables al pago para aparecer en la plataforma.",
    blocks: [
      {
        heading: "Servicio",
        text: "La suscripción otorga el derecho de uso de las herramientas de la plataforma y visibilidad ante clientes potenciales. No garantiza una cantidad mínima de contrataciones, ya que esto depende del portafolio y desempeño del fotógrafo.",
      },
      {
        heading: "Renovaciones",
        text: "Las suscripciones (mensuales o anuales) se renovarán automáticamente. Se enviará un aviso 5 días antes de que su suscripción esté por vencer para que pueda tomar una decisión informada.",
      },
      {
        heading: "Política de Devolución",
        bullets: [
          {
            label: "Devolución",
            text: "Si quedó inconforme con la plataforma, tendrá un plazo de 48 horas a partir de la contratación para cancelar y solicitar el reembolso.",
          },
          {
            label: "No Reembolsable",
            text: "No se realizarán devoluciones una vez que el usuario haya hecho uso de las funciones de \"contacto\" o \"postulación\" a clientes, ni por periodos parciales ya utilizados.",
          },
        ],
      },
    ],
  },
  {
    id: "uso",
    icon: Shield,
    color: "blue",
    number: "2",
    title: "Políticas de Uso de la Plataforma",
    subtitle: "Para mantener el estándar de calidad y seguridad en el puente de contratación.",
    blocks: [
      {
        heading: "Veracidad del Portafolio",
        text: "El fotógrafo se compromete a subir únicamente material de su autoría. El uso de imágenes de stock o de otros profesionales resultará en la baja inmediata de la cuenta sin derecho a reembolso.",
      },
      {
        heading: "Conducta",
        text: "Los fotógrafos deben mantener una comunicación respetuosa con clientes y con la plataforma. FotoTrabajo se reserva el derecho de banear cuentas que utilicen el sistema para acoso, fraudes o cualquier actividad ilícita.",
      },
    ],
  },
  {
    id: "responsabilidad",
    icon: AlertTriangle,
    color: "red",
    number: "3",
    title: "Limitación de Responsabilidad",
    subtitle: "El rol de FotoTrabajo dentro de cada relación fotógrafo-cliente.",
    blocks: [
      {
        heading: "Intermediario Digital",
        highlight: true,
        text: "La plataforma actúa estrictamente como un intermediario digital. No existe una relación laboral entre el fotógrafo y la plataforma. La calidad final del servicio fotográfico y el cumplimiento de los contratos individuales son responsabilidad exclusiva de las partes involucradas (Fotógrafo – Cliente).",
      },
    ],
  },
];

const colorMap: Record<string, { bg: string; border: string; icon: string; badge: string; badgeText: string; bullet: string }> = {
  amber: {
    bg: "bg-amber-50",
    border: "border-amber-200",
    icon: "text-amber-500",
    badge: "bg-amber-100",
    badgeText: "text-amber-700",
    bullet: "bg-amber-400",
  },
  blue: {
    bg: "bg-blue-50",
    border: "border-blue-200",
    icon: "text-blue-500",
    badge: "bg-blue-100",
    badgeText: "text-blue-700",
    bullet: "bg-blue-400",
  },
  red: {
    bg: "bg-red-50",
    border: "border-red-200",
    icon: "text-red-500",
    badge: "bg-red-100",
    badgeText: "text-red-700",
    bullet: "bg-red-400",
  },
};

export function Legal() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-[#030213] text-white">
        <div className="max-w-4xl mx-auto px-4 py-16 sm:py-20">
          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-gray-400 text-sm mb-8">
            <Link to="/" className="hover:text-amber-400 transition-colors">Inicio</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-gray-300">Políticas y Términos</span>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-amber-500/20 border border-amber-500/30 rounded-xl flex items-center justify-center flex-shrink-0 mt-1">
              <Shield className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <h1 className="text-white mb-3" style={{ fontWeight: 700, fontSize: "clamp(1.6rem, 4vw, 2.4rem)" }}>
                Políticas de Privacidad y Términos de Uso
              </h1>
              <p className="text-gray-400 leading-relaxed max-w-2xl">
                En FotoTrabajo nos comprometemos a la transparencia. Aquí encontrarás todas las reglas que
                rigen el uso de la plataforma, tanto para fotógrafos como para clientes.
              </p>
              <p className="text-gray-500 text-sm mt-4">
                Última actualización: 12 de abril de 2026
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Index nav */}
      <div className="border-b border-gray-200 bg-white sticky top-0 z-20 shadow-sm">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex gap-1 overflow-x-auto py-3 scrollbar-hide">
            {sections.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-gray-600 hover:bg-amber-50 hover:text-amber-600 transition-colors"
                style={{ fontWeight: 500 }}
              >
                <s.icon className="w-3.5 h-3.5" />
                {s.number}. {s.title.split("(")[0].trim()}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-12 space-y-10">
        {sections.map((section) => {
          const c = colorMap[section.color];
          const Icon = section.icon;
          return (
            <div
              key={section.id}
              id={section.id}
              className={`rounded-2xl border ${c.border} ${c.bg} overflow-hidden scroll-mt-20`}
            >
              {/* Section header */}
              <div className="px-6 pt-6 pb-4 flex items-start gap-4">
                <div className={`w-10 h-10 rounded-xl ${c.badge} flex items-center justify-center flex-shrink-0`}>
                  <Icon className={`w-5 h-5 ${c.icon}`} />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${c.badge} ${c.badgeText}`} style={{ fontWeight: 600 }}>
                      Sección {section.number}
                    </span>
                  </div>
                  <h2 className="text-gray-900" style={{ fontWeight: 700, fontSize: "1.15rem" }}>
                    {section.title}
                  </h2>
                  <p className="text-gray-500 text-sm mt-0.5">{section.subtitle}</p>
                </div>
              </div>

              {/* Divider */}
              <div className={`h-px mx-6 ${c.border} border-t`} />

              {/* Blocks */}
              <div className="px-6 pb-6 pt-4 space-y-5">
                {section.blocks.map((block, bi) => (
                  <div key={bi}>
                    <h3 className="text-gray-800 mb-2" style={{ fontWeight: 600, fontSize: "0.95rem" }}>
                      {block.heading}
                    </h3>
                    {block.highlight ? (
                      <blockquote className={`border-l-4 ${c.border} pl-4 py-2 bg-white/70 rounded-r-xl`}>
                        <p className="text-gray-700 text-sm leading-relaxed italic">
                          "{block.text}"
                        </p>
                      </blockquote>
                    ) : block.bullets ? (
                      <div className="space-y-3">
                        {block.bullets.map((b, bii) => (
                          <div key={bii} className="flex gap-3 bg-white/70 rounded-xl p-3">
                            <div className={`w-1.5 h-1.5 rounded-full ${c.bullet} flex-shrink-0 mt-1.5`} />
                            <div>
                              <span className="text-gray-800 text-sm" style={{ fontWeight: 600 }}>{b.label}: </span>
                              <span className="text-gray-600 text-sm leading-relaxed">{b.text}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-600 text-sm leading-relaxed">{block.text}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {/* Footer note */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 text-center">
          <p className="text-gray-500 text-sm leading-relaxed">
            ¿Tienes dudas sobre nuestras políticas?{" "}
            <a href="mailto:legal@fototrabajo.mx" className="text-amber-500 hover:text-amber-600" style={{ fontWeight: 500 }}>
              Contáctanos en legal@fototrabajo.mx
            </a>
            . Al usar la plataforma, aceptas todos los términos descritos en este documento.
          </p>
        </div>
      </div>
    </div>
  );
}
