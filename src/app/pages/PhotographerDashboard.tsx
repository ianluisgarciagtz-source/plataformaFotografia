import { useState } from "react";
import { Link, useNavigate } from "react-router";
import {
  Camera, BarChart2, Image, Settings, CreditCard, Eye,
  MessageCircle, Heart, TrendingUp, Upload, Star, CheckCircle,
  AlertCircle, Plus, Trash2, Edit, MapPin, Bell, LogOut, ChevronRight,
  Zap, Crown, X, ArrowRight
} from "lucide-react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { addPendingPayment } from "../data/pendingPayments";
import { useAuth } from "../context/AuthContext";
import { PHOTOGRAPHERS, SPECIALTIES } from "../data/mockData";
import { NotificationPanel, Notification } from "../components/NotificationPanel";
import { ChatPanel, Conversation } from "../components/ChatPanel";

const PAYPAL_CLIENT_ID = "AZDxjDScFpQtjWTOUtWKbyN_bDt4OgqaF4eYXlewfBP4-8aqIotVls6dxe6RnN4WWyeQZwIBcb6B_eQ4";

const PLANS = [
  { id: "basic",   name: "Básico",  monthly: 80,  annual: 64,  icon: Zap,    color: "bg-gray-100 text-gray-600",   border: "border-gray-200" },
  { id: "pro",     name: "Pro",     monthly: 160, annual: 128, icon: Star,   color: "bg-amber-100 text-amber-600", border: "border-amber-400" },
  { id: "premium", name: "Premium", monthly: 220, annual: 176, icon: Crown,  color: "bg-purple-100 text-purple-600", border: "border-purple-400" },
];

type Tab = "resumen" | "portafolio" | "suscripcion" | "estadisticas" | "perfil" | "mensajes";

const now = () => new Date().toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" });

const INITIAL_NOTIFICATIONS: Notification[] = [
  { id: "n1", type: "message", title: "Nuevo mensaje de María García", body: "Hola, me interesa saber si tienes disponibilidad para...", time: "hace 2h", read: false },
  { id: "n2", type: "message", title: "Nuevo mensaje de Pedro Ruiz", body: "¿Cuánto costaría una sesión de familia con 4 personas?", time: "hace 5h", read: false },
  { id: "n3", type: "review", title: "Nueva valoración 5 estrellas", body: "Un cliente dejó una reseña positiva en tu perfil.", time: "hace 1 día", read: false },
  { id: "n4", type: "system", title: "Tu suscripción Pro está activa", body: "Siguiente renovación: 9 de mayo, 2026.", time: "hace 3 días", read: true },
];

const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: "p1",
    name: "María García",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop",
    lastMsg: "Hola, me interesa saber si tienes disponibilidad para...",
    time: "hace 2h",
    unread: 1,
    messages: [
      { id: "m1", from: "them", text: "Hola, me interesa saber si tienes disponibilidad para una sesión de bodas el 15 de junio.", time: "10:30" },
      { id: "m2", from: "me", text: "¡Hola María! Sí, ese día tengo disponible. ¿Qué tipo de cobertura necesitas?", time: "10:45" },
      { id: "m3", from: "them", text: "Cobertura completa desde la ceremonia hasta el banquete.", time: "11:00" },
    ],
  },
  {
    id: "p2",
    name: "Pedro Ruiz",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop",
    lastMsg: "¿Cuánto costaría una sesión de familia con 4 personas?",
    time: "hace 5h",
    unread: 1,
    messages: [
      { id: "m1", from: "them", text: "Buenos días, ¿cuánto costaría una sesión de familia con 4 personas?", time: "08:00" },
    ],
  },
  {
    id: "p3",
    name: "Empresa Eventos SL",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=80&h=80&fit=crop",
    lastMsg: "Necesitamos cobertura para nuestro evento corporativo...",
    time: "ayer",
    unread: 0,
    messages: [
      { id: "m1", from: "them", text: "Necesitamos cobertura para nuestro evento corporativo del próximo mes.", time: "15:30" },
      { id: "m2", from: "me", text: "Con gusto. ¿Me puede dar más detalles sobre el evento?", time: "16:00" },
      { id: "m3", from: "them", text: "Es una gala de 300 personas en el Hotel Marquis.", time: "16:15" },
      { id: "m4", from: "me", text: "Perfecto, le envío mi propuesta con presupuesto detallado.", time: "16:30" },
    ],
  },
];

export function PhotographerDashboard() {
  const { user, photographerProfile, subscription, logout, updateProfile, activateSubscription } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>("resumen");
  const [uploading, setUploading] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);
  const [showNotifications, setShowNotifications] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>(INITIAL_CONVERSATIONS);
  const [activeConv, setActiveConv] = useState<string | null>(null);
  const [savedProfile, setSavedProfile] = useState(false);

  // Profile form state — initialized from context
  const [formName, setFormName] = useState(user?.name || "");
  const [formEmail, setFormEmail] = useState(user?.email || "");
  const [formPhone, setFormPhone] = useState(photographerProfile?.phone || "");
  const [formCity, setFormCity] = useState(photographerProfile?.city || "");
  const [formBio, setFormBio] = useState(photographerProfile?.bio || "");
  const [formSpecialties, setFormSpecialties] = useState<string[]>(photographerProfile?.specialties || []);
  const [formPrice, setFormPrice] = useState(String(photographerProfile?.priceFrom || 0));
  const [formInstagram, setFormInstagram] = useState(photographerProfile?.instagram || "");
  const [formExperience, setFormExperience] = useState(photographerProfile?.experience || "1");

  // Subscription plan change modal
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [selectedNewPlan, setSelectedNewPlan] = useState<string | null>(null);
  const [planBilling, setPlanBilling] = useState<"monthly" | "annual">("monthly");
  const [paypalError, setPaypalError] = useState<string | null>(null);
  const [planChangeDone, setPlanChangeDone] = useState(false);
  const [showManualPayment, setShowManualPayment] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;
  const totalUnreadMessages = conversations.reduce((s, c) => s + c.unread, 0);

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
    const replies = ["Muchas gracias por la respuesta.", "Entendido, quedamos en contacto.", "Perfecto, te confirmo pronto."];
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
    setConversations((prev) => prev.map((c) => c.id === convId ? { ...c, unread: 0 } : c));
    setActiveTab("mensajes");
  };

  const demoPhotographer = PHOTOGRAPHERS[0];

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleSaveProfile = () => {
    updateProfile({
      name: formName,
      email: formEmail,
      city: formCity,
      phone: formPhone,
      bio: formBio,
      specialties: formSpecialties,
      priceFrom: Number(formPrice),
      instagram: formInstagram,
      experience: formExperience,
    });
    setSavedProfile(true);
    setTimeout(() => setSavedProfile(false), 2500);
  };

  const toggleFormSpecialty = (s: string) => {
    setFormSpecialties((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );
  };

  const getNewPlanPrice = () => {
    const plan = PLANS.find((p) => p.id === selectedNewPlan);
    if (!plan) return 0;
    return planBilling === "monthly" ? plan.monthly : plan.annual;
  };

  const createPlanOrder = (_data: Record<string, unknown>, actions: { order: { create: (o: object) => Promise<string> } }) => {
    const plan = PLANS.find((p) => p.id === selectedNewPlan);
    if (!plan) return Promise.reject("No plan");
    return actions.order.create({
      intent: "CAPTURE",
      purchase_units: [{
        description: `FotoTrabajo – Plan ${plan.name} (${planBilling === "monthly" ? "mensual" : "anual"})`,
        amount: { currency_code: "MXN", value: getNewPlanPrice().toFixed(2) },
      }],
      application_context: { brand_name: "FotoTrabajo", locale: "es_MX", shipping_preference: "NO_SHIPPING", user_action: "PAY_NOW" },
    });
  };

  const onPlanApprove = (_data: Record<string, unknown>, actions: { order?: { capture: () => Promise<unknown> } }) => {
    return actions.order!.capture().then(() => {
      // mark as pending for admin verification
      if (selectedNewPlan && user) {
        const plan = PLANS.find((p) => p.id === selectedNewPlan);
        addPendingPayment({
          userEmail: user.email,
          planId: selectedNewPlan,
          planName: plan?.name ?? selectedNewPlan,
          billing: planBilling,
          price: getNewPlanPrice(),
          createdAt: new Date().toISOString(),
        });
      }
      setPlanChangeDone(true);
    });
  };

  const stats = [
    { label: "Visitas este mes", value: "0", change: "—", icon: Eye, color: "text-blue-600 bg-blue-50" },
    { label: "Mensajes recibidos", value: "0", change: "—", icon: MessageCircle, color: "text-green-600 bg-green-50" },
    { label: "Guardados", value: "0", change: "—", icon: Heart, color: "text-red-500 bg-red-50" },
    { label: "Valoración media", value: "—", change: "Sin datos aún", icon: Star, color: "text-amber-600 bg-amber-50" },
  ];

  const mockPortfolio = demoPhotographer.portfolio.map((item) => ({
    ...item,
    views: 0,
    likes: 0,
  }));

  const navItems: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: "resumen", label: "Resumen", icon: BarChart2 },
    { id: "portafolio", label: "Portafolio", icon: Image },
    { id: "mensajes", label: "Mensajes", icon: MessageCircle },
    { id: "estadisticas", label: "Estadísticas", icon: TrendingUp },
    { id: "suscripcion", label: "Suscripción", icon: CreditCard },
    { id: "perfil", label: "Configuración", icon: Settings },
  ];

  const simulateUpload = () => {
    setUploading(true);
    setTimeout(() => setUploading(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex pt-16">
      {/* Sidebar */}
      <aside className="w-64 bg-[#030213] flex-shrink-0 hidden md:flex flex-col h-[calc(100vh-4rem)] sticky top-16">
        {/* User info */}
        <div className="p-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            {user?.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full object-cover border-2 border-amber-400" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center">
                <Camera className="w-5 h-5 text-white" />
              </div>
            )}
            <div className="min-w-0">
              <p className="text-white text-sm truncate" style={{ fontWeight: 600 }}>{user?.name || "Fotógrafo"}</p>
              <div className="flex items-center gap-1">
                {subscription ? (
                  <>
                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                    <span className="text-green-400 text-xs">Plan {subscription.planName} activo</span>
                  </>
                ) : (
                  <>
                    <div className="w-1.5 h-1.5 bg-amber-400 rounded-full" />
                    <span className="text-amber-400 text-xs">Sin suscripción</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => { setActiveTab(item.id); if (item.id !== "mensajes") setActiveConv(null); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${
                activeTab === item.id
                  ? "bg-amber-500 text-white"
                  : "text-gray-400 hover:text-white hover:bg-white/10"
              }`}
              style={{ fontWeight: activeTab === item.id ? 600 : 400 }}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
              {item.id === "mensajes" && totalUnreadMessages > 0 && (
                <span className="ml-auto w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center" style={{ fontWeight: 600 }}>
                  {totalUnreadMessages}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="p-3 border-t border-white/10 space-y-1">
          <Link
            to={`/fotografo/${user?.id || "p1"}`}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <Eye className="w-4 h-4" />
            Ver mi perfil público
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-400 hover:text-red-400 hover:bg-red-900/20 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        {/* Mobile tab bar */}
        <div className="md:hidden bg-white border-b border-gray-200 sticky top-16 z-10 flex overflow-x-auto">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => { setActiveTab(item.id); if (item.id !== "mensajes") setActiveConv(null); }}
              className={`flex-shrink-0 flex flex-col items-center gap-1 px-4 py-3 text-xs border-b-2 transition-colors relative ${
                activeTab === item.id
                  ? "border-amber-500 text-amber-600"
                  : "border-transparent text-gray-500"
              }`}
            >
              <div className="relative">
                <item.icon className="w-4 h-4" />
                {item.id === "mensajes" && totalUnreadMessages > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center" style={{ fontSize: "9px" }}>
                    {totalUnreadMessages}
                  </span>
                )}
              </div>
              {item.label}
            </button>
          ))}
        </div>

        <div className="p-6 max-w-5xl mx-auto">
          {/* RESUMEN */}
          {activeTab === "resumen" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-gray-900" style={{ fontWeight: 700, fontSize: "1.5rem" }}>
                    ¡Hola, {user?.name?.split(" ")[0] || "fotógrafo"}! 👋
                  </h1>
                  <p className="text-gray-500 text-sm mt-1">Aquí tienes el resumen de tu actividad este mes</p>
                </div>
                <div className="relative">
                  <button
                    onClick={() => setShowNotifications((v) => !v)}
                    className="relative p-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    <Bell className="w-5 h-5 text-gray-600" />
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
              </div>

              {/* Stats grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {stats.map((s) => (
                  <div key={s.label} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                    <div className={`w-10 h-10 rounded-xl ${s.color} flex items-center justify-center mb-3`}>
                      <s.icon className="w-5 h-5" />
                    </div>
                    <p className="text-gray-900" style={{ fontWeight: 700, fontSize: "1.4rem" }}>{s.value}</p>
                    <p className="text-gray-500 text-xs mt-0.5">{s.label}</p>
                    <p className="text-green-600 text-xs mt-1" style={{ fontWeight: 500 }}>{s.change}</p>
                  </div>
                ))}
              </div>

              {/* Subscription status */}
              {subscription ? (
                <div className={`rounded-2xl p-5 text-white mb-6 ${
                  subscription.planId === "premium" ? "bg-gradient-to-r from-purple-600 to-purple-700" :
                  subscription.planId === "pro" ? "bg-gradient-to-r from-amber-500 to-amber-600" :
                  "bg-gradient-to-r from-gray-700 to-gray-800"
                }`}>
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <CheckCircle className="w-5 h-5" />
                        <span style={{ fontWeight: 600 }}>Plan {subscription.planName} activo</span>
                      </div>
                      <p className="text-white/70 text-sm">Próxima renovación: {subscription.renewsAt}</p>
                    </div>
                    <button
                      onClick={() => setActiveTab("suscripcion")}
                      className="px-4 py-2 bg-white/20 hover:bg-white/30 border border-white/30 text-white text-sm rounded-xl transition-colors"
                      style={{ fontWeight: 500 }}
                    >
                      Gestionar plan
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-6">
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <AlertCircle className="w-5 h-5 text-amber-500" />
                        <span className="text-gray-800" style={{ fontWeight: 600 }}>Sin suscripción activa</span>
                      </div>
                      <p className="text-gray-500 text-sm">Activa un plan para aparecer en búsquedas y subir tu portafolio.</p>
                    </div>
                    <button
                      onClick={() => setActiveTab("suscripcion")}
                      className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-sm rounded-xl transition-colors"
                      style={{ fontWeight: 500 }}
                    >
                      Activar plan →
                    </button>
                  </div>
                </div>
              )}

              {/* Recent portfolio */}
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-gray-900" style={{ fontWeight: 600 }}>Últimas fotos subidas</h3>
                  <button
                    onClick={() => setActiveTab("portafolio")}
                    className="text-xs text-amber-500 hover:text-amber-600"
                    style={{ fontWeight: 500 }}
                  >
                    Ver todo →
                  </button>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {mockPortfolio.slice(0, 6).map((item) => (
                    <div key={item.id} className="relative rounded-lg overflow-hidden bg-gray-100" style={{ aspectRatio: "1" }}>
                      <img src={item.url} alt={item.title} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent messages */}
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 mt-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-gray-900" style={{ fontWeight: 600 }}>Mensajes recientes</h3>
                  <button onClick={() => setActiveTab("mensajes")} className="text-xs text-amber-500 hover:text-amber-600" style={{ fontWeight: 500 }}>
                    Ver todos →
                  </button>
                </div>
                {conversations.map((conv) => (
                  <button
                    key={conv.id}
                    onClick={() => openConversation(conv.id)}
                    className="w-full flex items-start gap-3 py-3 border-b border-gray-100 last:border-0 hover:bg-gray-50 -mx-2 px-2 rounded-lg transition-colors text-left"
                  >
                    <img src={conv.avatar} alt="" className="w-9 h-9 rounded-full object-cover flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-800" style={{ fontWeight: conv.unread > 0 ? 600 : 400 }}>{conv.name}</p>
                        <span className="text-xs text-gray-400">{conv.time}</span>
                      </div>
                      <p className="text-xs text-gray-500 truncate mt-0.5">{conv.lastMsg}</p>
                    </div>
                    {conv.unread > 0 && <div className="w-2 h-2 bg-amber-500 rounded-full mt-1.5 flex-shrink-0" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* PORTAFOLIO */}
          {activeTab === "portafolio" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-gray-900" style={{ fontWeight: 700, fontSize: "1.4rem" }}>Mi portafolio</h1>
                  <p className="text-gray-500 text-sm mt-0.5">{mockPortfolio.length} / 100 fotos (Plan Pro)</p>
                </div>
                <button
                  onClick={simulateUpload}
                  className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-4 py-2.5 rounded-xl text-sm transition-colors"
                  style={{ fontWeight: 500 }}
                >
                  <Upload className="w-4 h-4" />
                  {uploading ? "Subiendo..." : "Subir fotos"}
                </button>
              </div>

              {/* Upload zone */}
              <div className="border-2 border-dashed border-gray-200 hover:border-amber-400 rounded-2xl p-8 text-center mb-6 transition-colors cursor-pointer group" onClick={simulateUpload}>
                {uploading ? (
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 border-3 border-amber-500 border-t-transparent rounded-full animate-spin mb-3" />
                    <p className="text-gray-600 text-sm">Subiendo fotos...</p>
                  </div>
                ) : (
                  <>
                    <Upload className="w-10 h-10 text-gray-300 group-hover:text-amber-400 mx-auto mb-3 transition-colors" />
                    <p className="text-gray-600 text-sm" style={{ fontWeight: 500 }}>Arrastra fotos aquí o haz clic para seleccionar</p>
                    <p className="text-gray-400 text-xs mt-1">JPG, PNG, WebP hasta 20 MB · Máx. 10 fotos a la vez</p>
                  </>
                )}
              </div>

              {/* Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {mockPortfolio.map((item) => (
                  <div key={item.id} className="group relative bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    <div className="relative" style={{ aspectRatio: "4/3" }}>
                      <img src={item.url} alt={item.title} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                        <button className="w-8 h-8 bg-white/90 rounded-lg flex items-center justify-center hover:bg-white transition-colors">
                          <Edit className="w-3.5 h-3.5 text-gray-700" />
                        </button>
                        <button className="w-8 h-8 bg-red-500/90 rounded-lg flex items-center justify-center hover:bg-red-500 transition-colors">
                          <Trash2 className="w-3.5 h-3.5 text-white" />
                        </button>
                      </div>
                    </div>
                    <div className="p-3">
                      <p className="text-gray-800 text-xs truncate" style={{ fontWeight: 500 }}>{item.title}</p>
                      <div className="flex items-center gap-3 mt-1.5">
                        <span className="flex items-center gap-1 text-xs text-gray-400">
                          <Eye className="w-3 h-3" /> {item.views}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-gray-400">
                          <Heart className="w-3 h-3" /> {item.likes}
                        </span>
                        <span className="ml-auto text-xs px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded">{item.category}</span>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Add more */}
                <button
                  onClick={simulateUpload}
                  className="bg-gray-50 border-2 border-dashed border-gray-200 hover:border-amber-400 rounded-xl flex flex-col items-center justify-center gap-2 transition-colors group"
                  style={{ aspectRatio: "4/3" }}
                >
                  <Plus className="w-8 h-8 text-gray-300 group-hover:text-amber-400 transition-colors" />
                  <span className="text-xs text-gray-400 group-hover:text-amber-500 transition-colors">Añadir foto</span>
                </button>
              </div>
            </div>
          )}

          {/* MENSAJES */}
          {activeTab === "mensajes" && (
            <div>
              {activeConv && conversations.find((c) => c.id === activeConv) ? (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden" style={{ height: "520px" }}>
                  <ChatPanel
                    conversation={conversations.find((c) => c.id === activeConv)!}
                    myName={user?.name || "Tú"}
                    onBack={() => setActiveConv(null)}
                    onSend={sendMessage}
                  />
                </div>
              ) : (
                <>
                  <h1 className="text-gray-900 mb-5" style={{ fontWeight: 700, fontSize: "1.4rem" }}>Mensajes</h1>
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

          {/* ESTADÍSTICAS */}
          {activeTab === "estadisticas" && (
            <div>
              <h1 className="text-gray-900 mb-6" style={{ fontWeight: 700, fontSize: "1.4rem" }}>Estadísticas</h1>

              {/* Chart placeholder */}
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 mb-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-gray-700" style={{ fontWeight: 600 }}>Visitas al perfil</h3>
                  <select className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 text-gray-600 focus:outline-none">
                    <option>Últimos 30 días</option>
                    <option>Últimos 90 días</option>
                  </select>
                </div>

                {/* Bar chart — empty for new account */}
                <div className="flex items-end gap-1.5 h-32">
                  {Array.from({ length: 30 }, (_, i) => (
                    <div
                      key={i}
                      className="flex-1 bg-gray-100 rounded-t-sm"
                      style={{ height: "8%", minWidth: "4px" }}
                      title={`Día ${i + 1}: 0 visitas`}
                    />
                  ))}
                </div>
                <p className="text-center text-xs text-gray-400 mt-3">Aún no hay datos. Tu gráfica aparecerá cuando recibas visitas.</p>
                <div className="flex justify-between text-xs text-gray-400 mt-2">
                  <span>1 Mar</span>
                  <span>15 Mar</span>
                  <span>30 Mar</span>
                </div>
              </div>

              {/* Source stats */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                  <h3 className="text-gray-700 mb-4" style={{ fontWeight: 600 }}>Fuentes de tráfico</h3>
                  {[
                    { label: "Búsqueda local", pct: 62, color: "bg-amber-500" },
                    { label: "Explorar por especialidad", pct: 23, color: "bg-blue-500" },
                    { label: "Búsqueda directa", pct: 10, color: "bg-green-500" },
                    { label: "Otros", pct: 5, color: "bg-gray-400" },
                  ].map((s) => (
                    <div key={s.label} className="mb-3">
                      <div className="flex justify-between text-xs text-gray-600 mb-1">
                        <span>{s.label}</span>
                        <span style={{ fontWeight: 500 }}>{s.pct}%</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className={`h-full ${s.color} rounded-full`} style={{ width: `${s.pct}%` }} />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                  <h3 className="text-gray-700 mb-4" style={{ fontWeight: 600 }}>Fotos más vistas</h3>
                  {mockPortfolio.slice(0, 4).map((item) => (
                    <div key={item.id} className="flex items-center gap-3 mb-3">
                      <img src={item.url} alt="" className="w-10 h-10 rounded-lg object-cover" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-700 truncate" style={{ fontWeight: 500 }}>{item.title}</p>
                        <p className="text-xs text-gray-400">{item.views} vistas</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* SUSCRIPCIÓN */}
          {activeTab === "suscripcion" && (
            <PayPalScriptProvider options={{ "client-id": PAYPAL_CLIENT_ID, currency: "MXN", locale: "es_MX", components: "buttons", intent: "capture" }}>
              <div>
                <h1 className="text-gray-900 mb-6" style={{ fontWeight: 700, fontSize: "1.4rem" }}>Mi suscripción</h1>

                {!subscription ? (
                  /* ── NO SUBSCRIPTION ── */
                  <div>
                    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 text-center mb-6">
                      <CreditCard className="w-10 h-10 text-amber-400 mx-auto mb-3" />
                      <p className="text-gray-800 mb-1" style={{ fontWeight: 600 }}>Sin suscripción activa</p>
                      <p className="text-gray-500 text-sm mb-4">Necesitas un plan para que tu perfil aparezca en las búsquedas y puedas subir tu portafolio.</p>
                      <button
                        onClick={() => { setShowPlanModal(true); setPlanChangeDone(false); setSelectedNewPlan(null); }}
                        className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-5 py-2.5 rounded-xl text-sm transition-colors"
                        style={{ fontWeight: 600 }}
                      >
                        Activar suscripción
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Plan cards preview */}
                    <div className="grid sm:grid-cols-3 gap-4">
                      {PLANS.map((plan) => (
                        <button
                          key={plan.id}
                          onClick={() => { setShowPlanModal(true); setSelectedNewPlan(plan.id); setPlanChangeDone(false); }}
                          className="bg-white rounded-2xl border-2 border-gray-100 hover:border-amber-400 p-5 text-left transition-colors"
                        >
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${plan.color}`}>
                            <plan.icon className="w-5 h-5" />
                          </div>
                          <p className="text-gray-900 text-sm" style={{ fontWeight: 600 }}>{plan.name}</p>
                          <p className="text-gray-500 text-xs mt-0.5">${plan.monthly} MXN/mes</p>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  /* ── ACTIVE SUBSCRIPTION ── */
                  <div>
                    <div className={`rounded-2xl p-6 text-white mb-6 ${
                      subscription.planId === "premium"
                        ? "bg-gradient-to-r from-purple-600 to-purple-700"
                        : subscription.planId === "pro"
                        ? "bg-gradient-to-r from-amber-500 to-orange-500"
                        : "bg-gradient-to-r from-gray-700 to-gray-800"
                    }`}>
                      <div className="flex items-start justify-between gap-4 flex-wrap">
                        <div>
                          <p className="text-white/70 text-sm mb-1">Plan actual</p>
                          <h2 className="text-2xl mb-1" style={{ fontWeight: 700 }}>Plan {subscription.planName}</h2>
                          <p className="text-white/70 text-sm">
                            ${subscription.price} MXN/{subscription.billing === "monthly" ? "mes" : "año"} · Renovación el {subscription.renewsAt}
                          </p>
                        </div>
                        <div className="bg-white/20 px-4 py-2 rounded-xl text-sm" style={{ fontWeight: 500 }}>
                          ✓ Activo
                        </div>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-5 pt-5 border-t border-white/20">
                        <div><p className="text-white/70 text-xs">Activado</p><p className="text-white text-sm mt-0.5" style={{ fontWeight: 600 }}>{subscription.activatedAt}</p></div>
                        <div><p className="text-white/70 text-xs">Facturación</p><p className="text-white text-sm mt-0.5" style={{ fontWeight: 600 }}>{subscription.billing === "monthly" ? "Mensual" : "Anual"}</p></div>
                        <div><p className="text-white/70 text-xs">Visible en búsquedas</p><p className="text-white text-sm mt-0.5" style={{ fontWeight: 600 }}>Sí ✓</p></div>
                      </div>
                    </div>

                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 mb-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-gray-700" style={{ fontWeight: 600 }}>Cambiar de plan</h3>
                      </div>
                      <div className="grid sm:grid-cols-3 gap-3">
                        {PLANS.filter((p) => p.id !== subscription.planId).map((plan) => (
                          <button
                            key={plan.id}
                            onClick={() => { setShowPlanModal(true); setSelectedNewPlan(plan.id); setPlanChangeDone(false); setPaypalError(null); }}
                            className={`border-2 ${plan.border} rounded-xl p-4 text-left hover:shadow-sm transition-all`}
                          >
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2 ${plan.color}`}>
                              <plan.icon className="w-4 h-4" />
                            </div>
                            <p className="text-gray-900 text-sm" style={{ fontWeight: 600 }}>{plan.name}</p>
                            <p className="text-gray-500 text-xs">${plan.monthly} MXN/mes</p>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Billing history — only if subscribed */}
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                      <h3 className="text-gray-700 mb-4" style={{ fontWeight: 600 }}>Historial de pagos</h3>
                      <div className="flex items-center justify-between py-3">
                        <div>
                          <p className="text-sm text-gray-800" style={{ fontWeight: 500 }}>Plan {subscription.planName} ({subscription.billing === "monthly" ? "Mensual" : "Anual"})</p>
                          <p className="text-xs text-gray-400">{subscription.activatedAt}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-gray-700" style={{ fontWeight: 600 }}>${subscription.price} MXN</span>
                          <span className="text-xs px-2 py-0.5 bg-green-100 text-green-600 rounded-full">Pagado</span>
                        </div>
                      </div>
                    </div>

                    <button className="mt-4 text-sm text-red-500 hover:text-red-600">
                      Cancelar suscripción
                    </button>
                  </div>
                )}

                {/* ── PayPal Plan Modal ── */}
                {showPlanModal && (
                  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl">
                      <div className="flex items-center justify-between mb-5">
                        <h3 className="text-gray-900" style={{ fontWeight: 700 }}>
                          {planChangeDone ? "Pago completado" : "Selecciona tu plan"}
                        </h3>
                        <button
                          onClick={() => { setShowPlanModal(false); setSelectedNewPlan(null); setPlanChangeDone(false); }}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>

                      {planChangeDone ? (
                        <div className="text-center py-6">
                          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle className="w-8 h-8 text-green-500" />
                          </div>
                          <p className="text-gray-800 mb-2" style={{ fontWeight: 600 }}>¡Suscripción activada!</p>
                          <p className="text-gray-500 text-sm mb-4">Tu plan {PLANS.find(p => p.id === selectedNewPlan)?.name} está activo. Ya apareces en búsquedas.</p>
                          <button
                            onClick={() => { setShowPlanModal(false); setPlanChangeDone(false); }}
                            className="bg-amber-500 hover:bg-amber-600 text-white px-5 py-2.5 rounded-xl text-sm transition-colors"
                            style={{ fontWeight: 600 }}
                          >
                            Continuar
                          </button>
                        </div>
                      ) : (
                        <>
                          {/* Plan selector */}
                          <div className="grid grid-cols-3 gap-2 mb-4">
                            {PLANS.map((plan) => (
                              <button
                                key={plan.id}
                                onClick={() => setSelectedNewPlan(plan.id)}
                                className={`border-2 rounded-xl p-3 text-center transition-all ${
                                  selectedNewPlan === plan.id ? plan.border + " shadow-sm" : "border-gray-100 hover:border-gray-300"
                                }`}
                              >
                                <div className={`w-7 h-7 rounded-lg flex items-center justify-center mb-1.5 mx-auto ${plan.color}`}>
                                  <plan.icon className="w-4 h-4" />
                                </div>
                                <p className="text-gray-900 text-xs" style={{ fontWeight: 600 }}>{plan.name}</p>
                                <p className="text-gray-500 text-xs">${plan.monthly}/mes</p>
                              </button>
                            ))}
                          </div>

                          {/* Billing toggle */}
                          <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-4">
                            {(["monthly", "annual"] as const).map((b) => (
                              <button
                                key={b}
                                onClick={() => setPlanBilling(b)}
                                className={`flex-1 py-2 rounded-lg text-xs transition-all ${
                                  planBilling === b ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"
                                }`}
                                style={{ fontWeight: planBilling === b ? 600 : 400 }}
                              >
                                {b === "monthly" ? "Mensual" : "Anual (−20%)"}
                              </button>
                            ))}
                          </div>

                          {selectedNewPlan && (
                            <>
                              {/* Summary */}
                              <div className="bg-gray-50 rounded-xl p-3 mb-4 flex justify-between text-sm">
                                <span className="text-gray-600">
                                  Plan {PLANS.find(p => p.id === selectedNewPlan)?.name} · {planBilling === "monthly" ? "mensual" : "anual"}
                                </span>
                                <span className="text-gray-900" style={{ fontWeight: 700 }}>${getNewPlanPrice()} MXN</span>
                              </div>

                              {paypalError && (
                                <p className="text-red-500 text-xs mb-3 bg-red-50 p-2 rounded-lg">{paypalError}</p>
                              )}

                              <PayPalButtons
                                style={{ layout: "vertical", color: "gold", shape: "rect", label: "pay", tagline: false }}
                                createOrder={createPlanOrder as Parameters<typeof PayPalButtons>[0]["createOrder"]}
                                onApprove={onPlanApprove as Parameters<typeof PayPalButtons>[0]["onApprove"]}
                                onError={() => setPaypalError("Error al procesar el pago. Intenta de nuevo.")}
                              />
                              <button
                                  onClick={() => setShowManualPayment(true)}
                                className="mt-4 w-full border border-amber-500 text-amber-700 hover:bg-amber-50 rounded-xl py-3 text-sm font-semibold transition-colors"
                              >
                                Ver datos de pago manual
                              </button>
                              <p className="text-center text-xs text-gray-400 mt-2">
                                🔒 Pago seguro vía PayPal
                              </p>
                            </>
                          )}

                          {!selectedNewPlan && (
                            <p className="text-center text-xs text-gray-400 mt-2">Selecciona un plan para ver las opciones de pago</p>
                          )}
                        </>
                      )}

                      {showManualPayment && selectedNewPlan && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                          <div className="w-full max-w-lg bg-white rounded-3xl border border-gray-200 p-6 shadow-2xl">
                            <div className="flex items-start justify-between gap-4 mb-5">
                              <div>
                                <h2 className="text-lg font-semibold text-gray-900">Datos de pago manual</h2>
                                <p className="text-sm text-gray-500">Usa estos datos si el checkout de PayPal no se abre correctamente.</p>
                              </div>
                              <button onClick={() => setShowManualPayment(false)} className="text-gray-400 hover:text-gray-600">
                                <X className="w-5 h-5" />
                              </button>
                            </div>
                            <div className="space-y-4 text-sm text-gray-700">
                              <div className="rounded-2xl bg-gray-50 p-4">
                                <p className="text-xs uppercase text-gray-500 mb-2">Referencia</p>
                                <p className="font-semibold">SUB-{selectedNewPlan.toUpperCase()}-{Date.now()}</p>
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="rounded-2xl bg-gray-50 p-4">
                                  <p className="text-xs uppercase text-gray-500">Plan</p>
                                  <p className="font-semibold">{PLANS.find((p) => p.id === selectedNewPlan)?.name}</p>
                                </div>
                                <div className="rounded-2xl bg-gray-50 p-4">
                                  <p className="text-xs uppercase text-gray-500">Precio</p>
                                  <p className="font-semibold">${getNewPlanPrice()} MXN</p>
                                </div>
                              </div>
                              <div className="rounded-2xl bg-gray-50 p-4">
                                <p className="text-xs uppercase text-gray-500 mb-2">Cuenta PayPal</p>
                                <p className="font-semibold">pagos@fototrabajo.mx</p>
                              </div>
                              <div className="rounded-2xl bg-gray-50 p-4">
                                <p className="text-xs uppercase text-gray-500 mb-2">Concepto</p>
                                <p className="font-semibold">Suscripción FotoTrabajo - {PLANS.find((p) => p.id === selectedNewPlan)?.name} ({planBilling === "monthly" ? "Mensual" : "Anual"})</p>
                              </div>
                            </div>
                            <div className="mt-6 flex gap-3">
                              <button
                                onClick={() => {
                                  if (selectedNewPlan && user) {
                                    const plan = PLANS.find((p) => p.id === selectedNewPlan);
                                    addPendingPayment({
                                      userEmail: user.email,
                                      planId: selectedNewPlan,
                                      planName: plan?.name ?? selectedNewPlan,
                                      billing: planBilling,
                                      price: getNewPlanPrice(),
                                      createdAt: new Date().toISOString(),
                                    });
                                    setShowManualPayment(false);
                                    setPlanChangeDone(true);
                                  } else {
                                    setShowManualPayment(false);
                                  }
                                }}
                                className="flex-1 bg-amber-500 hover:bg-amber-600 text-white px-4 py-3 rounded-xl text-sm font-semibold"
                              >
                                Notificar pago realizado
                              </button>
                              <button
                                onClick={() => setShowManualPayment(false)}
                                className="flex-1 rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
                              >
                                Cerrar
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </PayPalScriptProvider>
          )}

          {/* PERFIL */}
          {activeTab === "perfil" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-gray-900" style={{ fontWeight: 700, fontSize: "1.4rem" }}>Configuración del perfil</h1>
                {savedProfile && (
                  <div className="flex items-center gap-1.5 text-green-600 text-sm bg-green-50 px-3 py-1.5 rounded-xl border border-green-200">
                    <CheckCircle className="w-4 h-4" />
                    Guardado correctamente
                  </div>
                )}
              </div>

              <div className="space-y-5">
                {/* Avatar */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                  <h3 className="text-gray-700 mb-4" style={{ fontWeight: 600 }}>Foto de perfil</h3>
                  <div className="flex items-center gap-4">
                    <img
                      src={user?.avatar || demoPhotographer.avatar}
                      alt=""
                      className="w-20 h-20 rounded-xl object-cover border border-gray-200"
                    />
                    <div>
                      <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                        <Upload className="w-4 h-4" />
                        Cambiar foto
                      </button>
                      <p className="text-xs text-gray-400 mt-1.5">JPG o PNG, máx. 5 MB</p>
                    </div>
                  </div>
                </div>

                {/* Basic info */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                  <h3 className="text-gray-700 mb-4" style={{ fontWeight: 600 }}>Información básica</h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1.5" style={{ fontWeight: 500 }}>Nombre completo</label>
                      <input
                        type="text"
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                        className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:border-amber-400 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1.5" style={{ fontWeight: 500 }}>Email</label>
                      <input
                        type="email"
                        value={formEmail}
                        onChange={(e) => setFormEmail(e.target.value)}
                        className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:border-amber-400 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1.5" style={{ fontWeight: 500 }}>Teléfono de contacto</label>
                      <input
                        type="tel"
                        value={formPhone}
                        onChange={(e) => setFormPhone(e.target.value)}
                        placeholder="+52 55 0000 0000"
                        className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:border-amber-400 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1.5" style={{ fontWeight: 500 }}>Ciudad principal</label>
                      <input
                        type="text"
                        value={formCity}
                        onChange={(e) => setFormCity(e.target.value)}
                        placeholder="CDMX, Guadalajara..."
                        className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:border-amber-400 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1.5" style={{ fontWeight: 500 }}>Precio base (MXN / sesión)</label>
                      <input
                        type="number"
                        value={formPrice}
                        onChange={(e) => setFormPrice(e.target.value)}
                        placeholder="1500"
                        className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:border-amber-400 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1.5" style={{ fontWeight: 500 }}>Instagram</label>
                      <input
                        type="text"
                        value={formInstagram}
                        onChange={(e) => setFormInstagram(e.target.value)}
                        placeholder="@tuusuario"
                        className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:border-amber-400 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1.5" style={{ fontWeight: 500 }}>Años de experiencia</label>
                      <select
                        value={formExperience}
                        onChange={(e) => setFormExperience(e.target.value)}
                        className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:border-amber-400"
                      >
                        {["1", "2", "3", "4", "5", "6-10", "10+"].map((y) => (
                          <option key={y} value={y}>{y === "1" ? "Menos de 1 año" : `${y} años`}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-xs text-gray-500 mb-1.5" style={{ fontWeight: 500 }}>Descripción profesional</label>
                    <textarea
                      rows={4}
                      value={formBio}
                      onChange={(e) => setFormBio(e.target.value)}
                      placeholder="Cuéntanos sobre tu trabajo, estilo y lo que te hace único..."
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:border-amber-400 resize-none"
                    />
                  </div>

                  <div className="mt-4">
                    <label className="block text-xs text-gray-500 mb-2" style={{ fontWeight: 500 }}>
                      Especialidades ({formSpecialties.length} seleccionadas)
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {SPECIALTIES.map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => toggleFormSpecialty(s)}
                          className={`px-3 py-1.5 rounded-lg text-xs border transition-colors ${
                            formSpecialties.includes(s)
                              ? "bg-amber-500 text-white border-amber-500"
                              : "bg-white border-gray-200 text-gray-600 hover:border-amber-300"
                          }`}
                          style={{ fontWeight: formSpecialties.includes(s) ? 500 : 400 }}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mt-5 flex items-center gap-3">
                    <button
                      onClick={handleSaveProfile}
                      className="bg-[#030213] hover:bg-amber-500 text-white px-6 py-2.5 rounded-xl text-sm transition-colors"
                      style={{ fontWeight: 600 }}
                    >
                      Guardar cambios
                    </button>
                    <p className="text-xs text-gray-400">Los cambios se reflejan en tu perfil público y en las búsquedas.</p>
                  </div>
                </div>

                {/* Location note */}
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  <p className="text-amber-700 text-xs leading-relaxed">
                    Tu ubicación solo es visible de forma aproximada (por ciudad). Nunca se muestra tu dirección exacta a los clientes.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
