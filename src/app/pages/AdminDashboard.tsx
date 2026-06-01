import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import {
  Users, User, Camera, CreditCard, DollarSign, Shield,
  Ban, Trash2, Search, CheckCircle, XCircle,
  LogOut, BarChart2, AlertTriangle, ChevronDown, ChevronUp, Image
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { getPendingPayments, removePendingPaymentForEmail } from "../data/pendingPayments";
import logoImg from "figma:asset/977b44ea5a012c53b7f6b67e59c48b6c67d79cfe.png";

type Tab = "stats" | "users" | "publications";

interface MockUser {
  id: string;
  name: string;
  email: string;
  role: "photographer" | "client";
  city: string;
  plan: string | null;
  planCost: number;
  joinedDate: string;
  planPending?: boolean;
  banned: boolean;
  publications: number;
}

interface MockPublication {
  id: string;
  photographerId: string;
  photographerName: string;
  title: string;
  specialty: string;
  city: string;
  date: string;
  flagged: boolean;
  removed: boolean;
  imageUrl: string;
}

const INITIAL_USERS: MockUser[] = [
  { id: "p1", name: "Carlos Ruiz", email: "carlos@mail.com", role: "photographer", city: "CDMX", plan: "Pro", planCost: 160, planPending: false, joinedDate: "2024-01-15", banned: false, publications: 12 },
  { id: "p2", name: "Sofía Mendoza", email: "sofia@mail.com", role: "photographer", city: "Guadalajara", plan: "Premium", planCost: 220, planPending: false, joinedDate: "2024-02-03", banned: false, publications: 28 },
  { id: "p3", name: "Héctor Vega", email: "hector@mail.com", role: "photographer", city: "Monterrey", plan: "Básico", planCost: 80, planPending: false, joinedDate: "2024-02-20", banned: false, publications: 5 },
  { id: "p4", name: "Diana Torres", email: "diana@mail.com", role: "photographer", city: "Puebla", plan: "Pro", planCost: 160, planPending: false, joinedDate: "2024-03-10", banned: false, publications: 19 },
  { id: "p5", name: "Roberto Flores", email: "roberto@mail.com", role: "photographer", city: "Tijuana", plan: "Básico", planCost: 80, planPending: false, joinedDate: "2024-03-25", banned: true, publications: 3 },
  { id: "p6", name: "Lucía Castro", email: "lucia@mail.com", role: "photographer", city: "CDMX", plan: "Premium", planCost: 220, planPending: false, joinedDate: "2024-04-01", banned: false, publications: 41 },
  { id: "c1", name: "Ana García", email: "ana@mail.com", role: "client", city: "CDMX", plan: null, planCost: 0, planPending: false, joinedDate: "2024-01-20", banned: false, publications: 0 },
  { id: "c2", name: "Miguel Santos", email: "miguel@mail.com", role: "client", city: "Guadalajara", plan: null, planCost: 0, planPending: false, joinedDate: "2024-02-10", banned: false, publications: 0 },
  { id: "c3", name: "Patricia Gómez", email: "patricia@mail.com", role: "client", city: "Monterrey", plan: null, planCost: 0, planPending: false, joinedDate: "2024-03-05", banned: false, publications: 0 },
  { id: "c4", name: "Fernando López", email: "fernando@mail.com", role: "client", city: "Puebla", plan: null, planCost: 0, planPending: false, joinedDate: "2024-04-15", banned: true, publications: 0 },
];

const INITIAL_PUBLICATIONS: MockPublication[] = [
  { id: "pub1", photographerId: "p1", photographerName: "Carlos Ruiz", title: "Sesión de bodas en Teotihuacán", specialty: "Bodas", city: "CDMX", date: "2024-04-10", flagged: false, removed: false, imageUrl: "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=300&h=200&fit=crop" },
  { id: "pub2", photographerId: "p2", photographerName: "Sofía Mendoza", title: "Retrato empresarial corporativo", specialty: "Retratos", city: "Guadalajara", date: "2024-04-12", flagged: false, removed: false, imageUrl: "https://images.unsplash.com/photo-1521038199265-bc482db0f923?w=300&h=200&fit=crop" },
  { id: "pub3", photographerId: "p3", photographerName: "Héctor Vega", title: "Fotografía de producto ecommerce", specialty: "Producto", city: "Monterrey", date: "2024-04-14", flagged: true, removed: false, imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=200&fit=crop" },
  { id: "pub4", photographerId: "p4", photographerName: "Diana Torres", title: "Quinceañera jardín botánico", specialty: "Eventos", city: "Puebla", date: "2024-04-16", flagged: false, removed: false, imageUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?w=300&h=200&fit=crop" },
  { id: "pub5", photographerId: "p5", photographerName: "Roberto Flores", title: "Contenido inapropiado reportado", specialty: "Bodas", city: "Tijuana", date: "2024-04-18", flagged: true, removed: false, imageUrl: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=300&h=200&fit=crop" },
  { id: "pub6", photographerId: "p6", photographerName: "Lucía Castro", title: "Fotografía aérea con drone", specialty: "Arquitectura", city: "CDMX", date: "2024-04-20", flagged: false, removed: false, imageUrl: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=300&h=200&fit=crop" },
  { id: "pub7", photographerId: "p1", photographerName: "Carlos Ruiz", title: "Sesión de maternidad al atardecer", specialty: "Familia", city: "CDMX", date: "2024-04-22", flagged: false, removed: false, imageUrl: "https://images.unsplash.com/photo-1491013516836-7db643ee125a?w=300&h=200&fit=crop" },
  { id: "pub8", photographerId: "p2", photographerName: "Sofía Mendoza", title: "Moda editorial primavera 2024", specialty: "Moda", city: "Guadalajara", date: "2024-04-24", flagged: false, removed: false, imageUrl: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=300&h=200&fit=crop" },
];

const PLAN_COLORS: Record<string, string> = {
  Básico: "bg-gray-100 text-gray-700",
  Pro: "bg-amber-100 text-amber-700",
  Premium: "bg-purple-100 text-purple-700",
};

function StatCard({ icon: Icon, label, value, sub, color }: { icon: React.ElementType; label: string; value: string | number; sub?: string; color: string }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${color}`}>
        <Icon className="w-5 h-5" />
      </div>
      <p className="text-gray-500 text-xs mb-1">{label}</p>
      <p className="text-gray-900" style={{ fontWeight: 700, fontSize: "1.6rem" }}>{value}</p>
      {sub && <p className="text-gray-400 text-xs mt-0.5">{sub}</p>}
    </div>
  );
}

export function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("stats");
  const [users, setUsers] = useState<MockUser[]>(INITIAL_USERS);
  // Merge pending payments into users on mount
  useEffect(() => {
    const pend = getPendingPayments();
    if (pend.length === 0) return;
    setUsers((prev) =>
      prev.map((u) => {
        const p = pend.find((x) => x.userEmail === u.email);
        if (p) {
          return { ...u, plan: p.planName, planCost: p.price, planPending: true };
        }
        return u;
      })
    );
  }, []);
  const [publications, setPublications] = useState<MockPublication[]>(INITIAL_PUBLICATIONS);
  const [searchUser, setSearchUser] = useState("");
  const [searchPub, setSearchPub] = useState("");
  const [filterRole, setFilterRole] = useState<"all" | "photographer" | "client">("all");
  const [filterPlan, setFilterPlan] = useState<"all" | "paid" | "free">("all");
  const [confirmBan, setConfirmBan] = useState<string | null>(null);
  const [confirmRemove, setConfirmRemove] = useState<string | null>(null);
  const [expandedStats, setExpandedStats] = useState(true);
  // Assign plan modal state
  const [assignPlanUser, setAssignPlanUser] = useState<string | null>(null);
  const [assignPlanChoice, setAssignPlanChoice] = useState<string | null>(null);
  const [assignPlanPending, setAssignPlanPending] = useState<boolean>(true);

  if (!user || user.role !== "admin") {
    navigate("/login");
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const toggleBan = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, banned: !u.banned } : u))
    );
    setConfirmBan(null);
  };

  const removePublication = (pubId: string) => {
    setPublications((prev) =>
      prev.map((p) => (p.id === pubId ? { ...p, removed: true } : p))
    );
    setConfirmRemove(null);
  };

  const openAssignPlan = (userId: string) => {
    const u = users.find((x) => x.id === userId);
    setAssignPlanUser(userId);
    setAssignPlanChoice(u?.plan ?? "Básico");
    setAssignPlanPending(true);
  };

  const cancelAssignPlan = () => {
    setAssignPlanUser(null);
    setAssignPlanChoice(null);
    setAssignPlanPending(true);
  };

  const confirmAssignPlan = () => {
    if (!assignPlanUser || !assignPlanChoice) return;
    const cost = assignPlanChoice === "Básico" ? 80 : assignPlanChoice === "Pro" ? 160 : 220;
    setUsers((prev) => prev.map((u) => u.id === assignPlanUser ? { ...u, plan: assignPlanChoice, planCost: cost, planPending: assignPlanPending } : u));
    // remove pending payment if exists for this user
    const u = users.find((x) => x.id === assignPlanUser);
    if (u) removePendingPaymentForEmail(u.email);
    cancelAssignPlan();
  };

  // Derived stats
  const photographers = users.filter((u) => u.role === "photographer");
  const clients = users.filter((u) => u.role === "client");
  const paidSubs = photographers.filter((u) => u.plan && !u.banned);
  const monthlyRevenue = paidSubs.reduce((sum, u) => sum + u.planCost, 0);
  const basicCount = photographers.filter((u) => u.plan === "Básico").length;
  const proCount = photographers.filter((u) => u.plan === "Pro").length;
  const premiumCount = photographers.filter((u) => u.plan === "Premium").length;
  const bannedUsers = users.filter((u) => u.banned).length;
  const flaggedPubs = publications.filter((p) => p.flagged && !p.removed).length;
  const activePubs = publications.filter((p) => !p.removed).length;

  const filteredUsers = users.filter((u) => {
    const matchSearch = u.name.toLowerCase().includes(searchUser.toLowerCase()) ||
      u.email.toLowerCase().includes(searchUser.toLowerCase());
    const matchRole = filterRole === "all" || u.role === filterRole;
    const matchPlan = filterPlan === "all" ||
      (filterPlan === "paid" && u.plan) ||
      (filterPlan === "free" && !u.plan);
    return matchSearch && matchRole && matchPlan;
  });

  const filteredPubs = publications.filter((p) => {
    const matchSearch = p.title.toLowerCase().includes(searchPub.toLowerCase()) ||
      p.photographerName.toLowerCase().includes(searchPub.toLowerCase());
    return matchSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Topbar */}
      <header className="bg-[#030213] border-b border-white/10 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <img src={logoImg} alt="FotoTrabajo" className="h-8 w-auto object-contain" />
            <div className="h-5 w-px bg-white/20" />
            <div className="flex items-center gap-1.5 text-amber-400">
              <Shield className="w-4 h-4" />
              <span className="text-sm" style={{ fontWeight: 600 }}>Panel Admin</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-gray-400 text-xs hidden sm:block">
              {user.email}
            </span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors px-3 py-1.5 rounded-lg hover:bg-white/10"
            >
              <LogOut className="w-3.5 h-3.5" />
              Salir
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Page title */}
        <div className="mb-6">
          <h1 className="text-gray-900" style={{ fontWeight: 700, fontSize: "1.5rem" }}>
            Panel de Administración
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">Gestión completa de FotoTrabajo</p>
        </div>

        {/* Alert: flagged content */}
        {flaggedPubs > 0 && (
          <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
            <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <div>
              <p className="text-red-700 text-sm" style={{ fontWeight: 600 }}>
                {flaggedPubs} publicación{flaggedPubs > 1 ? "es" : ""} reportada{flaggedPubs > 1 ? "s" : ""} pendiente{flaggedPubs > 1 ? "s" : ""} de revisión
              </p>
              <button
                onClick={() => setTab("publications")}
                className="text-red-600 text-xs hover:underline mt-0.5"
              >
                Ver publicaciones →
              </button>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 bg-white border border-gray-200 rounded-xl p-1 mb-6 w-fit">
          {([
            { key: "stats", label: "Estadísticas", icon: BarChart2 },
            { key: "users", label: "Usuarios", icon: Users },
            { key: "publications", label: "Publicaciones", icon: Image },
          ] as { key: Tab; label: string; icon: React.ElementType }[]).map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm transition-all ${
                tab === key
                  ? "bg-[#030213] text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-800"
              }`}
              style={{ fontWeight: tab === key ? 600 : 400 }}
            >
              <Icon className="w-4 h-4" />
              {label}
              {key === "publications" && flaggedPubs > 0 && (
                <span className="w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {flaggedPubs}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ── STATS TAB ── */}
        {tab === "stats" && (
          <div className="space-y-6">
            {/* KPI Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard icon={Users} label="Total de cuentas" value={users.length} sub={`${bannedUsers} baneadas`} color="bg-blue-100 text-blue-600" />
              <StatCard icon={Camera} label="Fotógrafos" value={photographers.length} sub={`${paidSubs.length} con suscripción activa`} color="bg-amber-100 text-amber-600" />
              <StatCard icon={CreditCard} label="Suscripciones activas" value={paidSubs.length} sub="planes de pago" color="bg-green-100 text-green-600" />
              <StatCard icon={DollarSign} label="Ingresos / mes" value={`$${monthlyRevenue.toLocaleString()} MXN`} sub="suscripciones vigentes" color="bg-purple-100 text-purple-600" />
            </div>

            {/* Revenue breakdown */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-gray-900" style={{ fontWeight: 600 }}>Desglose de suscripciones</h2>
                  <button onClick={() => setExpandedStats(!expandedStats)} className="text-gray-400 hover:text-gray-600">
                    {expandedStats ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>
                {expandedStats && (
                  <div className="space-y-3">
                    {[
                      { plan: "Básico", count: basicCount, price: 80, color: "bg-gray-200" },
                      { plan: "Pro", count: proCount, price: 160, color: "bg-amber-400" },
                      { plan: "Premium", count: premiumCount, price: 220, color: "bg-purple-500" },
                    ].map(({ plan, count, price, color }) => (
                      <div key={plan}>
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <div className={`w-2.5 h-2.5 rounded-full ${color}`} />
                            <span className="text-gray-700 text-sm">{plan}</span>
                          </div>
                          <div className="text-right">
                            <span className="text-gray-900 text-sm" style={{ fontWeight: 600 }}>
                              {count} usuario{count !== 1 ? "s" : ""}
                            </span>
                            <span className="text-gray-400 text-xs ml-2">
                              ${(count * price).toLocaleString()} MXN/mes
                            </span>
                          </div>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${color}`}
                            style={{ width: `${paidSubs.length ? (count / paidSubs.length) * 100 : 0}%` }}
                          />
                        </div>
                      </div>
                    ))}
                    <div className="pt-3 border-t border-gray-100 flex justify-between items-center">
                      <span className="text-gray-500 text-sm">Total mensual estimado</span>
                      <span className="text-gray-900" style={{ fontWeight: 700 }}>
                        ${monthlyRevenue.toLocaleString()} MXN
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500 text-sm">Proyección anual</span>
                      <span className="text-green-700 text-sm" style={{ fontWeight: 600 }}>
                        ${(monthlyRevenue * 12).toLocaleString()} MXN
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h2 className="text-gray-900 mb-4" style={{ fontWeight: 600 }}>Resumen de plataforma</h2>
                <div className="space-y-3">
                  {[
                    { label: "Clientes registrados", value: clients.length, icon: User },
                    { label: "Publicaciones activas", value: activePubs, icon: Image },
                    { label: "Publicaciones reportadas", value: flaggedPubs, icon: AlertTriangle, highlight: flaggedPubs > 0 },
                    { label: "Usuarios baneados", value: bannedUsers, icon: Ban, highlight: bannedUsers > 0 },
                    { label: "Sin suscripción (fotógrafos)", value: photographers.length - paidSubs.length, icon: XCircle },
                  ].map(({ label, value, icon: Icon, highlight }) => (
                    <div key={label} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                      <div className="flex items-center gap-2">
                        <Icon className={`w-4 h-4 ${highlight ? "text-red-500" : "text-gray-400"}`} />
                        <span className="text-gray-600 text-sm">{label}</span>
                      </div>
                      <span className={`text-sm ${highlight ? "text-red-600" : "text-gray-900"}`} style={{ fontWeight: 600 }}>
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent activity */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="text-gray-900 mb-4" style={{ fontWeight: 600 }}>Registro de actividad reciente</h2>
              <div className="space-y-3">
                {[
                  { action: "Nueva suscripción Pro", user: "Diana Torres", time: "Hace 2h", type: "success" },
                  { action: "Publicación reportada", user: "Roberto Flores", time: "Hace 5h", type: "warning" },
                  { action: "Usuario baneado", user: "Roberto Flores", time: "Hace 1 día", type: "danger" },
                  { action: "Nueva suscripción Premium", user: "Lucía Castro", time: "Hace 2 días", type: "success" },
                  { action: "Cancelación de suscripción", user: "Usuario anónimo", time: "Hace 3 días", type: "neutral" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                      item.type === "success" ? "bg-green-500" :
                      item.type === "warning" ? "bg-amber-500" :
                      item.type === "danger" ? "bg-red-500" : "bg-gray-300"
                    }`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-800 text-sm" style={{ fontWeight: 500 }}>{item.action}</p>
                      <p className="text-gray-400 text-xs">{item.user}</p>
                    </div>
                    <span className="text-gray-400 text-xs whitespace-nowrap">{item.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── USERS TAB ── */}
        {tab === "users" && (
          <div className="space-y-4">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchUser}
                  onChange={(e) => setSearchUser(e.target.value)}
                  placeholder="Buscar por nombre o email..."
                  className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-amber-400 bg-white"
                />
              </div>
              <div className="flex gap-2">
                <select
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value as typeof filterRole)}
                  className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:border-amber-400 bg-white"
                >
                  <option value="all">Todos los roles</option>
                  <option value="photographer">Fotógrafos</option>
                  <option value="client">Clientes</option>
                </select>
                <select
                  value={filterPlan}
                  onChange={(e) => setFilterPlan(e.target.value as typeof filterPlan)}
                  className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:border-amber-400 bg-white"
                >
                  <option value="all">Todos los planes</option>
                  <option value="paid">Con suscripción</option>
                  <option value="free">Sin suscripción</option>
                </select>
              </div>
            </div>

            <div className="text-xs text-gray-400 px-1">
              {filteredUsers.length} usuario{filteredUsers.length !== 1 ? "s" : ""} encontrado{filteredUsers.length !== 1 ? "s" : ""}
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50">
                      <th className="text-left px-4 py-3 text-xs text-gray-500" style={{ fontWeight: 600 }}>Usuario</th>
                      <th className="text-left px-4 py-3 text-xs text-gray-500" style={{ fontWeight: 600 }}>Rol</th>
                      <th className="text-left px-4 py-3 text-xs text-gray-500" style={{ fontWeight: 600 }}>Ciudad</th>
                      <th className="text-left px-4 py-3 text-xs text-gray-500" style={{ fontWeight: 600 }}>Plan / Costo</th>
                      <th className="text-left px-4 py-3 text-xs text-gray-500" style={{ fontWeight: 600 }}>Registro</th>
                      <th className="text-left px-4 py-3 text-xs text-gray-500" style={{ fontWeight: 600 }}>Estado</th>
                      <th className="text-right px-4 py-3 text-xs text-gray-500" style={{ fontWeight: 600 }}>Acción</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filteredUsers.map((u) => (
                      <tr key={u.id} className={`hover:bg-gray-50 transition-colors ${u.banned ? "opacity-60" : ""}`}>
                        <td className="px-4 py-3">
                          <div>
                            <p className="text-gray-900 text-sm" style={{ fontWeight: 500 }}>{u.name}</p>
                            <p className="text-gray-400 text-xs">{u.email}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${
                            u.role === "photographer" ? "bg-amber-100 text-amber-700" : "bg-blue-100 text-blue-700"
                          }`} style={{ fontWeight: 500 }}>
                            {u.role === "photographer" ? <Camera className="w-3 h-3" /> : <Users className="w-3 h-3" />}
                            {u.role === "photographer" ? "Fotógrafo" : "Cliente"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-600 text-sm">{u.city}</td>
                        <td className="px-4 py-3">
                          {u.plan ? (
                            <div>
                              <div className="flex items-center gap-2">
                                <span className={`inline-block px-2 py-0.5 rounded-full text-xs ${PLAN_COLORS[u.plan]}`} style={{ fontWeight: 500 }}>
                                  {u.plan}
                                </span>
                                {u.planPending && (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-50 text-amber-700 rounded-full text-xxs text-xs" style={{ fontWeight: 600 }}>
                                    Pendiente verificación
                                  </span>
                                )}
                              </div>
                              <p className="text-green-600 text-xs mt-0.5" style={{ fontWeight: 500 }}>${u.planCost} MXN/mes</p>
                            </div>
                          ) : (
                            <span className="text-gray-400 text-xs">Sin plan</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-gray-500 text-xs">{u.joinedDate}</td>
                        <td className="px-4 py-3">
                          {u.banned ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-100 text-red-700 rounded-full text-xs" style={{ fontWeight: 500 }}>
                              <Ban className="w-3 h-3" /> Baneado
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs" style={{ fontWeight: 500 }}>
                              <CheckCircle className="w-3 h-3" /> Activo
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {u.role === "photographer" && (
                              <button
                                onClick={() => openAssignPlan(u.id)}
                                className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-amber-200 text-amber-700 hover:bg-amber-50"
                                style={{ fontWeight: 500 }}
                              >
                                <CreditCard className="w-3 h-3" />
                                Asignar plan
                              </button>
                            )}

                            {confirmBan === u.id ? (
                              <div className="flex items-center justify-end gap-2">
                                <span className="text-xs text-gray-500">¿Confirmar?</span>
                                <button
                                  onClick={() => toggleBan(u.id)}
                                  className="text-xs bg-red-500 text-white px-2 py-1 rounded-lg hover:bg-red-600"
                                  style={{ fontWeight: 500 }}
                                >
                                  Sí
                                </button>
                                <button
                                  onClick={() => setConfirmBan(null)}
                                  className="text-xs text-gray-500 hover:text-gray-700 px-2 py-1"
                                >
                                  No
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => setConfirmBan(u.id)}
                                className={`inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-colors ${
                                  u.banned
                                    ? "border-green-200 text-green-700 hover:bg-green-50"
                                    : "border-red-200 text-red-600 hover:bg-red-50"
                                }`}
                                style={{ fontWeight: 500 }}
                              >
                                <Ban className="w-3 h-3" />
                                {u.banned ? "Desbanear" : "Banear"}
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ── PUBLICATIONS TAB ── */}
        {tab === "publications" && (
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchPub}
                onChange={(e) => setSearchPub(e.target.value)}
                placeholder="Buscar publicaciones o fotógrafo..."
                className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-amber-400 bg-white"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {filteredPubs.map((pub) => (
                <div
                  key={pub.id}
                  className={`bg-white rounded-2xl border shadow-sm overflow-hidden transition-all ${
                    pub.removed
                      ? "border-gray-100 opacity-50"
                      : pub.flagged
                      ? "border-red-300 ring-1 ring-red-200"
                      : "border-gray-100"
                  }`}
                >
                  <div className="relative">
                    <img
                      src={pub.imageUrl}
                      alt={pub.title}
                      className="w-full h-36 object-cover"
                    />
                    {pub.flagged && !pub.removed && (
                      <div className="absolute top-2 left-2 flex items-center gap-1 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full" style={{ fontWeight: 600 }}>
                        <AlertTriangle className="w-3 h-3" />
                        Reportada
                      </div>
                    )}
                    {pub.removed && (
                      <div className="absolute inset-0 bg-gray-900/70 flex items-center justify-center">
                        <span className="text-white text-sm" style={{ fontWeight: 600 }}>Publicación eliminada</span>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <p className="text-gray-900 text-sm mb-0.5" style={{ fontWeight: 600 }}>{pub.title}</p>
                    <p className="text-gray-500 text-xs mb-1">{pub.photographerName} · {pub.city}</p>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{pub.specialty}</span>
                      <span className="text-xs text-gray-400">{pub.date}</span>
                    </div>

                    {!pub.removed && (
                      confirmRemove === pub.id ? (
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500 flex-1">¿Eliminar esta publicación?</span>
                          <button
                            onClick={() => removePublication(pub.id)}
                            className="text-xs bg-red-500 text-white px-3 py-1.5 rounded-lg hover:bg-red-600"
                            style={{ fontWeight: 500 }}
                          >
                            Eliminar
                          </button>
                          <button
                            onClick={() => setConfirmRemove(null)}
                            className="text-xs text-gray-500 hover:text-gray-700 px-2 py-1.5"
                          >
                            Cancelar
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setConfirmRemove(pub.id)}
                          className="w-full flex items-center justify-center gap-1.5 text-xs border border-red-200 text-red-600 hover:bg-red-50 py-2 rounded-xl transition-colors"
                          style={{ fontWeight: 500 }}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Eliminar publicación
                        </button>
                      )
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Confirm modal overlay */}
      {/* Assign plan modal */}
      {assignPlanUser && (
        <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={cancelAssignPlan} />
          <div className="relative w-full max-w-md bg-white rounded-3xl border border-gray-200 p-6 shadow-2xl">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Asignar plan</h3>
                <p className="text-sm text-gray-500">Selecciona el plan y marca si está pendiente de verificación.</p>
              </div>
              <button onClick={cancelAssignPlan} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs text-gray-500 uppercase mb-1">Plan</label>
                <select value={assignPlanChoice ?? "Básico"} onChange={(e) => setAssignPlanChoice(e.target.value)} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm">
                  <option value="Básico">Básico - $80 MXN/mes</option>
                  <option value="Pro">Pro - $160 MXN/mes</option>
                  <option value="Premium">Premium - $220 MXN/mes</option>
                </select>
              </div>

              <div className="flex items-center gap-3">
                <input id="pending" type="checkbox" checked={assignPlanPending} onChange={(e) => setAssignPlanPending(e.target.checked)} className="w-4 h-4" />
                <label htmlFor="pending" className="text-sm text-gray-700">Marcar como pendiente de verificación (pago en revisión)</label>
              </div>

              <div className="flex gap-3">
                <button onClick={confirmAssignPlan} className="flex-1 bg-amber-500 hover:bg-amber-600 text-white px-4 py-3 rounded-xl text-sm font-semibold">Asignar</button>
                <button onClick={cancelAssignPlan} className="flex-1 border border-gray-200 px-4 py-3 rounded-xl text-sm text-gray-700">Cancelar</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {(confirmBan || confirmRemove) && (
        <div
          className="fixed inset-0 bg-black/20 z-30"
          onClick={() => { setConfirmBan(null); setConfirmRemove(null); }}
        />
      )}
    </div>
  );
}
