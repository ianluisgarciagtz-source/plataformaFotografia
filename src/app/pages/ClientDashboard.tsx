import { useState } from "react";
import { Link, useNavigate } from "react-router";
import {
  Heart, Search, MapPin, Star, Bell, LogOut, User,
  MessageCircle, ChevronRight, Camera
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { PHOTOGRAPHERS } from "../data/mockData";
import { PhotographerCard } from "../components/PhotographerCard";
import { NotificationPanel, Notification } from "../components/NotificationPanel";
import { ChatPanel, Conversation } from "../components/ChatPanel";

type Tab = "guardados" | "buscar" | "mensajes" | "perfil";

const INITIAL_NOTIFICATIONS: Notification[] = [
  { id: "n1", type: "message", title: "Nuevo mensaje de Carlos Ruiz", body: "¡Claro! Tengo disponibilidad para ese fin de semana.", time: "hace 2h", read: false },
  { id: "n2", type: "system", title: "Bienvenido a FotoTrabajo", body: "Tu cuenta está activa. Empieza a explorar fotógrafos cercanos.", time: "hace 1 día", read: false },
  { id: "n3", type: "review", title: "Tu reseña fue publicada", body: "Tu valoración para Sofía Mendoza ya es visible.", time: "hace 3 días", read: true },
];

const now = () => new Date().toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" });

const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: "c1",
    name: PHOTOGRAPHERS[0].name,
    avatar: PHOTOGRAPHERS[0].avatar,
    lastMsg: "¡Claro! Tengo disponibilidad para ese fin de semana.",
    time: "hace 2h",
    unread: 1,
    messages: [
      { id: "m1", from: "me", text: "Hola, me interesa saber si tienes disponibilidad para una sesión de bodas el 15 de junio.", time: "10:30" },
      { id: "m2", from: "them", text: "¡Hola! Sí, ese día tengo disponible. ¿Qué tipo de cobertura necesitas?", time: "10:45" },
      { id: "m3", from: "me", text: "Cobertura completa, desde la ceremonia hasta la recepción.", time: "11:00" },
      { id: "m4", from: "them", text: "¡Claro! Tengo disponibilidad para ese fin de semana. ¿Qué tipo de sesión necesitas?", time: "11:05" },
    ],
  },
  {
    id: "c2",
    name: PHOTOGRAPHERS[1].name,
    avatar: PHOTOGRAPHERS[1].avatar,
    lastMsg: "Perfecto, te envío el presupuesto detallado a tu email.",
    time: "ayer",
    unread: 0,
    messages: [
      { id: "m1", from: "me", text: "Buenos días, ¿tienes disponibilidad para retratos corporativos?", time: "09:15" },
      { id: "m2", from: "them", text: "¡Claro! Trabajo con empresas frecuentemente. ¿Para cuántas personas?", time: "09:30" },
      { id: "m3", from: "me", text: "Somos un equipo de 12 personas.", time: "09:35" },
      { id: "m4", from: "them", text: "Perfecto, te envío el presupuesto detallado a tu email.", time: "09:40" },
    ],
  },
  {
    id: "c3",
    name: PHOTOGRAPHERS[4]?.name || "Fotógrafo",
    avatar: PHOTOGRAPHERS[4]?.avatar || "",
    lastMsg: "Mi precio base para gastronomía es $300 MXN.",
    time: "hace 3 días",
    unread: 0,
    messages: [
      { id: "m1", from: "me", text: "Hola, ¿trabajas con restaurantes para fotografía gastronómica?", time: "16:00" },
      { id: "m2", from: "them", text: "Sí, trabajo con restaurantes habitualmente. Mi precio base para gastronomía es $300 MXN.", time: "16:20" },
    ],
  },
];

export function ClientDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>("guardados");
  const [searchQuery, setSearchQuery] = useState("");

  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);
  const [showNotifications, setShowNotifications] = useState(false);

  const [conversations, setConversations] = useState<Conversation[]>(INITIAL_CONVERSATIONS);
  const [activeConv, setActiveConv] = useState<string | null>(null);

  const savedPhotographers = PHOTOGRAPHERS.filter((_, i) => i < 3);
  const recentlyViewed = PHOTOGRAPHERS.filter((_, i) => i >= 3 && i < 6);

  const unreadCount = notifications.filter((n) => !n.read).length;
  const totalUnreadMessages = conversations.reduce((s, c) => s + c.unread, 0);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const markAllRead = () => setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  const markRead = (id: string) => setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));

  const sendMessage = (convId: string, text: string) => {
    setConversations((prev) =>
      prev.map((c) =>
        c.id !== convId ? c : {
          ...c,
          lastMsg: text,
          time: "ahora",
          unread: 0,
          messages: [...c.messages, { id: "msg-" + Date.now(), from: "me", text, time: now() }],
        }
      )
    );
    // Simulate a reply after 1.5s
    const conv = conversations.find((c) => c.id === convId);
    if (!conv) return;
    const replies = [
      "Perfecto, te contactaré para confirmar los detalles.",
      "¡Genial! Quedo pendiente de tu confirmación.",
      "De acuerdo, me parece bien. ¿Tienes alguna pregunta más?",
      "Entendido, con gusto te ayudo.",
    ];
    const reply = replies[Math.floor(Math.random() * replies.length)];
    setTimeout(() => {
      setConversations((prev) =>
        prev.map((c) =>
          c.id !== convId ? c : {
            ...c,
            lastMsg: reply,
            time: "ahora",
            messages: [...c.messages, { id: "reply-" + Date.now(), from: "them", text: reply, time: now() }],
          }
        )
      );
    }, 1500);
  };

  const openConversation = (convId: string) => {
    setActiveConv(convId);
    setConversations((prev) =>
      prev.map((c) => c.id === convId ? { ...c, unread: 0 } : c)
    );
    setActiveTab("mensajes");
  };

  const navItems: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: "guardados", label: "Guardados", icon: Heart },
    { id: "buscar", label: "Buscar", icon: Search },
    { id: "mensajes", label: "Mensajes", icon: MessageCircle },
    { id: "perfil", label: "Mi perfil", icon: User },
  ];

  const activeConvData = conversations.find((c) => c.id === activeConv);

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      {/* Header */}
      <div className="bg-[#030213] text-white px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              {user?.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-14 h-14 rounded-2xl object-cover border-2 border-amber-400" />
              ) : (
                <div className="w-14 h-14 rounded-2xl bg-amber-500 flex items-center justify-center">
                  <User className="w-7 h-7 text-white" />
                </div>
              )}
              <div>
                <h1 className="text-xl" style={{ fontWeight: 700 }}>Hola, {user?.name?.split(" ")[0] || "usuario"}</h1>
                <p className="text-gray-400 text-sm mt-0.5">Cuenta de cliente · Gratis</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {/* Bell button */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications((v) => !v)}
                  className="relative p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-colors"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center" style={{ fontWeight: 600 }}>
                      {unreadCount}
                    </span>
                  )}
                </button>
                {showNotifications && (
                  <NotificationPanel
                    notifications={notifications}
                    onClose={() => setShowNotifications(false)}
                    onMarkAllRead={markAllRead}
                    onMarkRead={markRead}
                  />
                )}
              </div>
              <button
                onClick={handleLogout}
                className="p-2 bg-white/10 hover:bg-red-900/30 text-red-300 hover:text-red-400 rounded-xl transition-colors"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            {[
              { label: "Fotógrafos guardados", value: savedPhotographers.length },
              { label: "Vistos recientemente", value: recentlyViewed.length },
              { label: "Mensajes enviados", value: 5 },
            ].map((s) => (
              <div key={s.label} className="bg-white/10 rounded-xl p-3 text-center">
                <p className="text-amber-400 text-xl" style={{ fontWeight: 700 }}>{s.value}</p>
                <p className="text-gray-400 text-xs mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tab bar */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex overflow-x-auto">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => { setActiveTab(item.id); if (item.id !== "mensajes") setActiveConv(null); }}
              className={`flex-shrink-0 flex items-center gap-2 px-4 py-4 text-sm border-b-2 transition-colors relative ${
                activeTab === item.id
                  ? "border-amber-500 text-amber-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
              style={{ fontWeight: activeTab === item.id ? 600 : 400 }}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
              {item.id === "mensajes" && totalUnreadMessages > 0 && (
                <span className="w-4 h-4 bg-amber-500 text-white text-xs rounded-full flex items-center justify-center" style={{ fontWeight: 600 }}>
                  {totalUnreadMessages}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* GUARDADOS */}
        {activeTab === "guardados" && (
          <div>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-gray-900" style={{ fontWeight: 700 }}>Fotógrafos guardados</h2>
              <Link to="/explorar" className="text-xs text-amber-500 hover:text-amber-600 flex items-center gap-1" style={{ fontWeight: 500 }}>
                Explorar más <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {savedPhotographers.length === 0 ? (
              <div className="text-center py-16">
                <Heart className="w-14 h-14 text-gray-200 mx-auto mb-4" />
                <p className="text-gray-500">Aún no tienes fotógrafos guardados</p>
                <Link to="/explorar" className="inline-block mt-3 text-amber-500 hover:text-amber-600 text-sm" style={{ fontWeight: 500 }}>
                  Explorar fotógrafos
                </Link>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                {savedPhotographers.map((p) => (
                  <div key={p.id} className="relative">
                    <PhotographerCard photographer={p} />
                    <button className="absolute top-3 right-3 w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center shadow-sm hover:bg-red-600 transition-colors">
                      <Heart className="w-4 h-4 text-white fill-white" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Recently viewed */}
            <div>
              <h3 className="text-gray-800 mb-4" style={{ fontWeight: 600 }}>Vistos recientemente</h3>
              <div className="space-y-3">
                {recentlyViewed.map((p) => (
                  <Link
                    key={p.id}
                    to={`/fotografo/${p.id}`}
                    className="flex items-center gap-3 bg-white rounded-xl p-3 border border-gray-100 hover:border-amber-200 hover:shadow-sm transition-all"
                  >
                    <img src={p.avatar} alt={p.name} className="w-11 h-11 rounded-xl object-cover flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-800 text-sm truncate" style={{ fontWeight: 500 }}>{p.name}</p>
                      <div className="flex items-center gap-2 text-xs text-gray-400 mt-0.5">
                        <MapPin className="w-3 h-3" />
                        <span>{p.city}</span>
                        <span>·</span>
                        <span>{p.specialties.slice(0, 2).join(", ")}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                        <span className="text-xs text-gray-700" style={{ fontWeight: 500 }}>{p.rating}</span>
                      </div>
                      <span className="text-xs text-amber-600" style={{ fontWeight: 500 }}>desde ${p.priceFrom} MXN</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* BUSCAR */}
        {activeTab === "buscar" && (
          <div>
            <h2 className="text-gray-900 mb-5" style={{ fontWeight: 700 }}>Buscar fotógrafos</h2>

            <div className="flex gap-2 mb-6">
              <div className="flex-1 flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-3 focus-within:border-amber-400 transition-colors">
                <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Nombre, especialidad, ciudad..."
                  className="flex-1 outline-none text-sm text-gray-700 placeholder-gray-400"
                />
              </div>
              <Link
                to={`/explorar${searchQuery ? `?q=${searchQuery}` : ""}`}
                className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-4 py-3 rounded-xl text-sm transition-colors"
                style={{ fontWeight: 500 }}
              >
                <Search className="w-4 h-4" />
                Buscar
              </Link>
            </div>

            <div className="mb-6">
              <p className="text-xs text-gray-500 mb-3" style={{ fontWeight: 600 }}>POR ESPECIALIDAD</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  { emoji: "💍", label: "Bodas" },
                  { emoji: "🧑‍🎨", label: "Retratos" },
                  { emoji: "🏔️", label: "Paisajes" },
                  { emoji: "👗", label: "Moda" },
                  { emoji: "🍽️", label: "Comida" },
                  { emoji: "🎉", label: "Eventos" },
                ].map((s) => (
                  <Link
                    key={s.label}
                    to={`/explorar?especialidad=${s.label}`}
                    className="flex items-center gap-2 bg-white border border-gray-100 hover:border-amber-300 hover:bg-amber-50 rounded-xl px-3 py-3 text-sm text-gray-700 transition-all"
                  >
                    <span>{s.emoji}</span>
                    <span style={{ fontWeight: 500 }}>{s.label}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-gray-400 ml-auto" />
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs text-gray-500 mb-3" style={{ fontWeight: 600 }}>MÁS CERCANOS A TI</p>
              <div className="grid sm:grid-cols-2 gap-4">
                {PHOTOGRAPHERS.sort((a, b) => a.distance - b.distance).slice(0, 4).map((p) => (
                  <PhotographerCard key={p.id} photographer={p} compact />
                ))}
              </div>
              <Link
                to="/explorar"
                className="mt-4 flex items-center justify-center gap-2 border border-amber-300 text-amber-600 hover:bg-amber-50 py-3 rounded-xl text-sm transition-colors"
                style={{ fontWeight: 500 }}
              >
                Ver todos los fotógrafos cercanos
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}

        {/* MENSAJES */}
        {activeTab === "mensajes" && (
          <div>
            {activeConvData ? (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden" style={{ height: "520px" }}>
                <ChatPanel
                  conversation={activeConvData}
                  myName={user?.name || "Tú"}
                  onBack={() => setActiveConv(null)}
                  onSend={sendMessage}
                />
              </div>
            ) : (
              <>
                <h2 className="text-gray-900 mb-5" style={{ fontWeight: 700 }}>Mensajes</h2>
                <div className="space-y-2">
                  {conversations.map((conv) => (
                    <button
                      key={conv.id}
                      onClick={() => openConversation(conv.id)}
                      className="w-full flex items-center gap-3 bg-white rounded-xl p-4 border border-gray-100 hover:border-amber-200 transition-all text-left"
                    >
                      <div className="relative flex-shrink-0">
                        <img src={conv.avatar} alt="" className="w-12 h-12 rounded-full object-cover" />
                        {conv.unread > 0 && (
                          <span className="absolute -top-1 -right-1 w-5 h-5 bg-amber-500 text-white text-xs rounded-full flex items-center justify-center" style={{ fontWeight: 600 }}>
                            {conv.unread}
                          </span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-gray-800 text-sm" style={{ fontWeight: conv.unread > 0 ? 600 : 500 }}>
                            {conv.name}
                          </p>
                          <span className="text-xs text-gray-400 flex-shrink-0">{conv.time}</span>
                        </div>
                        <p className="text-xs text-gray-500 truncate mt-0.5">{conv.lastMsg}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-300 flex-shrink-0" />
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* PERFIL */}
        {activeTab === "perfil" && (
          <div>
            <h2 className="text-gray-900 mb-5" style={{ fontWeight: 700 }}>Mi perfil</h2>

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 mb-4">
              <div className="flex items-center gap-4 mb-5 pb-5 border-b border-gray-100">
                {user?.avatar ? (
                  <img src={user.avatar} alt="" className="w-16 h-16 rounded-2xl object-cover" />
                ) : (
                  <div className="w-16 h-16 rounded-2xl bg-amber-100 flex items-center justify-center">
                    <User className="w-8 h-8 text-amber-600" />
                  </div>
                )}
                <div>
                  <p className="text-gray-900" style={{ fontWeight: 600 }}>{user?.name || "Cliente"}</p>
                  <p className="text-gray-500 text-sm">{user?.email}</p>
                  <span className="inline-block mt-1 px-2 py-0.5 bg-green-100 text-green-600 text-xs rounded-full">
                    Cuenta gratuita
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                {[
                  { label: "Nombre", value: user?.name || "Ana García" },
                  { label: "Email", value: user?.email || "ana@demo.com" },
                  { label: "Ciudad", value: "CDMX" },
                  { label: "Teléfono", value: "+52 55 0000 0000" },
                ].map((field) => (
                  <div key={field.label}>
                    <label className="block text-xs text-gray-500 mb-1.5" style={{ fontWeight: 500 }}>{field.label}</label>
                    <input
                      defaultValue={field.value}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                ))}
                <button className="bg-[#030213] hover:bg-amber-500 text-white px-5 py-2.5 rounded-xl text-sm transition-colors mt-2" style={{ fontWeight: 500 }}>
                  Guardar cambios
                </button>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 text-center">
              <Camera className="w-10 h-10 text-amber-500 mx-auto mb-3" />
              <p className="text-gray-800 text-sm mb-1" style={{ fontWeight: 600 }}>¿Eres fotógrafo?</p>
              <p className="text-gray-500 text-xs mb-3">
                Crea tu perfil profesional y consigue clientes en tu zona.
              </p>
              <Link
                to="/registro?role=photographer"
                className="inline-flex items-center gap-1 text-sm text-amber-600 hover:text-amber-700"
                style={{ fontWeight: 500 }}
              >
                Crear cuenta de fotógrafo →
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
