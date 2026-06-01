import { useEffect, useRef } from "react";
import { Bell, MessageCircle, Heart, Star, X, CheckCheck } from "lucide-react";

export interface Notification {
  id: string;
  type: "message" | "like" | "review" | "system";
  title: string;
  body: string;
  time: string;
  read: boolean;
}

interface NotificationPanelProps {
  notifications: Notification[];
  onClose: () => void;
  onMarkAllRead: () => void;
  onMarkRead: (id: string) => void;
}

const TYPE_ICON: Record<Notification["type"], { icon: React.ElementType; color: string }> = {
  message: { icon: MessageCircle, color: "bg-blue-100 text-blue-600" },
  like: { icon: Heart, color: "bg-red-100 text-red-500" },
  review: { icon: Star, color: "bg-amber-100 text-amber-500" },
  system: { icon: Bell, color: "bg-gray-100 text-gray-500" },
};

export function NotificationPanel({
  notifications,
  onClose,
  onMarkAllRead,
  onMarkRead,
}: NotificationPanelProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  const unread = notifications.filter((n) => !n.read).length;

  return (
    <div
      ref={ref}
      className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden"
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-gray-700" />
          <span className="text-gray-900 text-sm" style={{ fontWeight: 600 }}>
            Notificaciones
          </span>
          {unread > 0 && (
            <span className="px-1.5 py-0.5 bg-red-500 text-white text-xs rounded-full" style={{ fontWeight: 600 }}>
              {unread}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {unread > 0 && (
            <button
              onClick={onMarkAllRead}
              className="flex items-center gap-1 text-xs text-amber-600 hover:text-amber-700"
              style={{ fontWeight: 500 }}
            >
              <CheckCheck className="w-3.5 h-3.5" />
              Marcar leídas
            </button>
          )}
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 ml-1">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="max-h-80 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="py-10 text-center">
            <Bell className="w-8 h-8 text-gray-200 mx-auto mb-2" />
            <p className="text-gray-400 text-sm">Sin notificaciones</p>
          </div>
        ) : (
          notifications.map((n) => {
            const { icon: Icon, color } = TYPE_ICON[n.type];
            return (
              <button
                key={n.id}
                onClick={() => onMarkRead(n.id)}
                className={`w-full flex items-start gap-3 px-4 py-3 border-b border-gray-50 last:border-0 text-left hover:bg-gray-50 transition-colors ${
                  !n.read ? "bg-amber-50/50" : ""
                }`}
              >
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-gray-800 text-xs" style={{ fontWeight: n.read ? 400 : 600 }}>
                    {n.title}
                  </p>
                  <p className="text-gray-500 text-xs mt-0.5 leading-relaxed">{n.body}</p>
                  <p className="text-gray-400 text-xs mt-1">{n.time}</p>
                </div>
                {!n.read && (
                  <div className="w-2 h-2 bg-amber-500 rounded-full flex-shrink-0 mt-1.5" />
                )}
              </button>
            );
          })
        )}
      </div>

      {notifications.length > 0 && (
        <div className="px-4 py-2.5 border-t border-gray-100 text-center">
          <p className="text-xs text-gray-400">Haz clic en una notificación para marcarla como leída</p>
        </div>
      )}
    </div>
  );
}
