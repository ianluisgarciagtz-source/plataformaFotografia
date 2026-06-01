import { useState } from "react";
import { Link } from "react-router";
import { CheckCircle, X, Zap, Star, Crown, Camera, ArrowRight, CreditCard } from "lucide-react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { SUBSCRIPTION_PLANS } from "../data/mockData";
import { addPendingPayment } from "../data/pendingPayments";
import { Footer } from "../components/Footer";
import { useAuth } from "../context/AuthContext";

// Replace with your real PayPal Client ID from https://developer.paypal.com
const PAYPAL_CLIENT_ID = "AZDxjDScFpQtjWTOUtWKbyN_bDt4OgqaF4eYXlewfBP4-8aqIotVls6dxe6RnN4WWyeQZwIBcb6B_eQ4";

export function Subscription() {
  const { isAuthenticated, user, activateSubscription } = useAuth();
  const [billing, setBilling] = useState<"monthly" | "annual">("monthly");
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [checkoutDone, setCheckoutDone] = useState(false);
  const [paypalError, setPaypalError] = useState<string | null>(null);
  const [showPayPal, setShowPayPal] = useState(false);
  const [showManualPayment, setShowManualPayment] = useState(false);

  const getPrice = (price: number) => {
    if (billing === "annual") return Math.round(price * 0.8);
    return price;
  };

  const icons: Record<string, React.ElementType> = {
    basic: Zap,
    pro: Star,
    premium: Crown,
  };

  const accentColors: Record<string, string> = {
    basic: "border-gray-200 hover:border-gray-400",
    pro: "border-amber-400 ring-2 ring-amber-400/30",
    premium: "border-purple-400 hover:border-purple-500",
  };

  const buttonColors: Record<string, string> = {
    basic: "bg-gray-900 hover:bg-gray-700 text-white",
    pro: "bg-amber-500 hover:bg-amber-600 text-white",
    premium: "bg-purple-600 hover:bg-purple-700 text-white",
  };

  const handleSelectPlan = (planId: string) => {
    if (!isAuthenticated) {
      window.location.href = "/registro?role=photographer";
      return;
    }
    setSelectedPlan(planId);
    setShowPayPal(true);
    setPaypalError(null);
  };

  const getCurrentPlan = () => SUBSCRIPTION_PLANS.find((p) => p.id === selectedPlan);

  const createOrder = (_data: Record<string, unknown>, actions: { order: { create: (opts: object) => Promise<string> } }) => {
    const plan = getCurrentPlan();
    if (!plan) return Promise.reject("No plan selected");
    const price = getPrice(plan.price);
    return actions.order.create({
      intent: "CAPTURE",
      purchase_units: [
        {
          description: `FotoTrabajo - Plan ${plan.name} (${billing === "monthly" ? "mensual" : "anual"})`,
          amount: {
            currency_code: "MXN",
            value: price.toFixed(2),
          },
        },
      ],
      application_context: {
        brand_name: "FotoTrabajo",
        locale: "es-MX",
        shipping_preference: "NO_SHIPPING",
        user_action: "PAY_NOW",
      },
    });
  };

  const onApprove = (_data: Record<string, unknown>, actions: { order?: { capture: () => Promise<unknown> } }) => {
    return actions.order!.capture().then(() => {
      // Do NOT auto-activate. Create a pending payment for admin verification.
      if (selectedPlan && user) {
        const plan = SUBSCRIPTION_PLANS.find((p) => p.id === selectedPlan);
        const price = plan ? getPrice(plan.price) : 0;
        addPendingPayment({
          userEmail: user.email,
          planId: selectedPlan,
          planName: plan?.name ?? selectedPlan,
          billing,
          price,
          createdAt: new Date().toISOString(),
        });
      }
      setCheckoutDone(true);
      setShowPayPal(false);
    });
  };

  const onError = (err: Record<string, unknown>) => {
    console.error("PayPal error:", err);
    setPaypalError("Ocurrió un error al procesar el pago. Intenta de nuevo.");
  };

  return (
    <PayPalScriptProvider
      options={{
        "client-id": PAYPAL_CLIENT_ID,
        currency: "MXN",
        locale: "es_MX",
        components: "buttons",
        intent: "capture",
      }}
    >
      <div className="min-h-screen bg-gray-50 pt-20">
        {/* Header */}
        <div className="bg-[#030213] py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-400/20 border border-amber-400/30 text-amber-300 rounded-full text-sm mb-5">
              <Camera className="w-4 h-4" />
              Solo para fotógrafos
            </div>
            <h1 className="text-white mb-4" style={{ fontWeight: 700, fontSize: "clamp(1.75rem, 4vw, 2.75rem)" }}>
              Elige tu plan y empieza a conseguir clientes
            </h1>
            <p className="text-gray-300 text-lg mb-8 max-w-xl mx-auto">
              Los clientes siempre exploran gratis. Los fotógrafos necesitan suscripción para publicar su portafolio y aparecer en búsquedas.
            </p>

            {/* Billing Toggle */}
            <div className="inline-flex items-center gap-1 bg-white/10 border border-white/20 rounded-xl p-1">
              {(["monthly", "annual"] as const).map((b) => (
                <button
                  key={b}
                  onClick={() => setBilling(b)}
                  className={`px-5 py-2 rounded-lg text-sm transition-all ${
                    billing === b ? "bg-white text-gray-900" : "text-gray-300 hover:text-white"
                  }`}
                  style={{ fontWeight: billing === b ? 600 : 400 }}
                >
                  {b === "monthly" ? "Mensual" : "Anual"}
                  {b === "annual" && (
                    <span className="ml-1.5 px-1.5 py-0.5 bg-green-500 text-white text-xs rounded-full">-20%</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Plans */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {checkoutDone ? (
            <div className="max-w-md mx-auto text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
                <CheckCircle className="w-10 h-10 text-green-500" />
              </div>
              <h2 className="text-gray-900 mb-3" style={{ fontWeight: 700, fontSize: "1.5rem" }}>
                ¡Pago exitoso!
              </h2>
              <p className="text-gray-500 mb-2">
                Tu suscripción <strong>{getCurrentPlan()?.name}</strong> ha sido activada.
              </p>
              <p className="text-gray-400 text-sm mb-6">
                Recibirás un comprobante de pago en tu correo registrado en PayPal.
              </p>
              <Link
                to="/dashboard/fotografo"
                className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-xl transition-colors"
                style={{ fontWeight: 600 }}
              >
                Ir al dashboard
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <>
              <div className="grid md:grid-cols-3 gap-6">
                {SUBSCRIPTION_PLANS.map((plan) => {
                  const Icon = icons[plan.id];
                  const price = getPrice(plan.price);
                  const isSelected = selectedPlan === plan.id;
                  return (
                    <div
                      key={plan.id}
                      className={`relative bg-white rounded-2xl border-2 p-7 shadow-sm transition-all ${
                        isSelected ? "ring-2 ring-offset-2 " + (plan.id === "basic" ? "ring-gray-400" : plan.id === "pro" ? "ring-amber-400" : "ring-purple-400") : accentColors[plan.id]
                      } ${plan.popular ? "shadow-amber-100" : ""}`}
                    >
                      {plan.popular && (
                        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 bg-amber-500 text-white text-xs rounded-full shadow-sm" style={{ fontWeight: 600 }}>
                          ⭐ Más popular
                        </div>
                      )}

                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                        plan.id === "basic" ? "bg-gray-100 text-gray-600" :
                        plan.id === "pro" ? "bg-amber-100 text-amber-600" :
                        "bg-purple-100 text-purple-600"
                      }`}>
                        <Icon className="w-6 h-6" />
                      </div>

                      <h3 className="text-gray-900 mb-1" style={{ fontWeight: 700 }}>{plan.name}</h3>
                      <p className="text-gray-500 text-xs mb-4">{plan.description}</p>

                      <div className="mb-5">
                        <div className="flex items-end gap-1">
                          <span className="text-gray-900" style={{ fontWeight: 700, fontSize: "2.25rem" }}>${price}</span>
                          <span className="text-gray-400 text-sm mb-1.5"> MXN/{plan.period}</span>
                        </div>
                        {billing === "annual" && (
                          <p className="text-green-600 text-xs mt-0.5" style={{ fontWeight: 500 }}>
                            Ahorras ${(plan.price - price) * 12} MXN/año
                          </p>
                        )}
                      </div>

                      <ul className="space-y-2.5 mb-6">
                        {plan.features.map((f) => (
                          <li key={f} className="flex items-start gap-2 text-sm text-gray-700">
                            <CheckCircle className={`w-4 h-4 flex-shrink-0 mt-0.5 ${
                              plan.id === "basic" ? "text-gray-500" :
                              plan.id === "pro" ? "text-amber-500" :
                              "text-purple-500"
                            }`} />
                            {f}
                          </li>
                        ))}
                        {plan.notIncluded.map((f) => (
                          <li key={f} className="flex items-start gap-2 text-sm text-gray-400">
                            <X className="w-4 h-4 flex-shrink-0 mt-0.5" />
                            {f}
                          </li>
                        ))}
                      </ul>

                      <button
                        onClick={() => handleSelectPlan(plan.id)}
                        className={`w-full py-3 rounded-xl transition-colors text-sm flex items-center justify-center gap-2 ${buttonColors[plan.id]} ${
                          isSelected ? "opacity-80" : ""
                        }`}
                        style={{ fontWeight: 600 }}
                      >
                        <CreditCard className="w-4 h-4" />
                        {isSelected ? "Plan seleccionado" : `Empezar con ${plan.name}`}
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* PayPal Checkout Panel */}
              {showPayPal && selectedPlan && (
                <div className="mt-10 max-w-md mx-auto">
                  <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-gray-900" style={{ fontWeight: 700 }}>Resumen de pago</h3>
                        <p className="text-gray-500 text-xs mt-0.5">Procesado de forma segura por PayPal</p>
                      </div>
                      <button
                        onClick={() => { setShowPayPal(false); setSelectedPlan(null); }}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Order summary */}
                    <div className="bg-gray-50 rounded-xl p-4 mb-5">
                      {(() => {
                        const plan = getCurrentPlan();
                        if (!plan) return null;
                        const price = getPrice(plan.price);
                        return (
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Plan</span>
                              <span className="text-gray-900" style={{ fontWeight: 600 }}>{plan.name}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Período</span>
                              <span className="text-gray-900">{billing === "monthly" ? "Mensual" : "Anual"}</span>
                            </div>
                            <div className="flex justify-between pt-2 border-t border-gray-200">
                              <span className="text-gray-800" style={{ fontWeight: 600 }}>Total</span>
                              <span className="text-gray-900" style={{ fontWeight: 700 }}>${price} MXN</span>
                            </div>
                          </div>
                        );
                      })()}
                    </div>

                    {paypalError && (
                      <div className="mb-4 bg-red-50 border border-red-200 rounded-xl p-3 text-red-600 text-xs">
                        {paypalError}
                      </div>
                    )}

                    <PayPalButtons
                      style={{
                        layout: "vertical",
                        color: "gold",
                        shape: "rect",
                        label: "pay",
                        tagline: false,
                      }}
                      createOrder={createOrder as Parameters<typeof PayPalButtons>[0]["createOrder"]}
                      onApprove={onApprove as Parameters<typeof PayPalButtons>[0]["onApprove"]}
                      onError={onError as Parameters<typeof PayPalButtons>[0]["onError"]}
                    />

                    <button
                      onClick={() => setShowManualPayment(true)}
                      className="mt-4 w-full border border-amber-500 text-amber-700 hover:bg-amber-50 rounded-xl py-3 text-sm font-semibold transition-colors"
                    >
                      Ver datos de pago manual
                    </button>

                    <p className="text-center text-xs text-gray-400 mt-3">
                      🔒 Pago seguro procesado por PayPal. No almacenamos tus datos de tarjeta.
                    </p>
                    <p className="text-center text-xs text-gray-500 mt-3">
                      En un plazo máximo de 24 horas hábiles se le dará acceso al plan seleccionado.
                    </p>
                  </div>
                </div>
              )}

              {showManualPayment && selectedPlan && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                  <div className="w-full max-w-lg bg-white rounded-3xl border border-gray-200 p-6 shadow-2xl">
                    <div className="flex items-start justify-between gap-4 mb-5">
                      <div>
                        <h2 className="text-lg font-semibold text-gray-900">Datos de pago manual</h2>
                        <p className="text-sm text-gray-500">Copia estos datos si el flujo de PayPal no se abre o no funciona en tu navegador.</p>
                      </div>
                      <button onClick={() => setShowManualPayment(false)} className="text-gray-400 hover:text-gray-600">
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="space-y-4 text-sm text-gray-700">
                      <div className="rounded-2xl bg-gray-50 p-4">
                        <p className="text-xs uppercase text-gray-500 mb-2">Referencia</p>
                        <p className="font-semibold">SUB-{selectedPlan.toUpperCase()}-{Date.now()}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="rounded-2xl bg-gray-50 p-4">
                          <p className="text-xs uppercase text-gray-500">Plan</p>
                          <p className="font-semibold">{getCurrentPlan()?.name}</p>
                        </div>
                        <div className="rounded-2xl bg-gray-50 p-4">
                          <p className="text-xs uppercase text-gray-500">Precio</p>
                          <p className="font-semibold">${getCurrentPlan() ? getPrice(getCurrentPlan()!.price) : 0} MXN</p>
                        </div>
                      </div>
                      <div className="rounded-2xl bg-gray-50 p-4">
                        <p className="text-xs uppercase text-gray-500 mb-2">Cuenta PayPal</p>
                        <p className="font-semibold">pagos@fototrabajo.mx</p>
                      </div>
                      <div className="rounded-2xl bg-gray-50 p-4">
                        <p className="text-xs uppercase text-gray-500 mb-2">Concepto</p>
                        <p className="font-semibold">Suscripción FotoTrabajo - {getCurrentPlan()?.name} ({billing === "monthly" ? "Mensual" : "Anual"})</p>
                      </div>
                    </div>
                    <div className="mt-6 flex gap-3">
                      <button
                        onClick={() => {
                          // notify manual payment as pending
                          if (selectedPlan && user) {
                            const plan = SUBSCRIPTION_PLANS.find((p) => p.id === selectedPlan);
                            const price = plan ? getPrice(plan.price) : 0;
                            addPendingPayment({
                              userEmail: user.email,
                              planId: selectedPlan,
                              planName: plan?.name ?? selectedPlan,
                              billing,
                              price,
                              createdAt: new Date().toISOString(),
                            });
                            setShowManualPayment(false);
                            setCheckoutDone(true);
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
                    <p className="text-center text-xs text-gray-500 mt-4">
                      En un plazo máximo de 24 horas hábiles se le dará acceso al plan seleccionado.
                    </p>
                  </div>
                </div>
              )}

              {/* FAQ */}
              <div className="mt-16 max-w-2xl mx-auto">
                <h2 className="text-center text-gray-900 mb-8" style={{ fontWeight: 700, fontSize: "1.5rem" }}>
                  Preguntas frecuentes
                </h2>
                {[
                  {
                    q: "¿Puedo cancelar en cualquier momento?",
                    a: "Sí, puedes cancelar tu suscripción cuando quieras. Tu perfil permanecerá activo hasta el final del período pagado.",
                  },
                  {
                    q: "¿Los clientes necesitan suscripción?",
                    a: "No. Los clientes siempre navegan gratis. Solo los fotógrafos que quieren publicar su trabajo necesitan un plan.",
                  },
                  {
                    q: "¿Puedo cambiar de plan en cualquier momento?",
                    a: "Sí, puedes hacer upgrade o downgrade en cualquier momento desde tu dashboard.",
                  },
                  {
                    q: "¿Qué métodos de pago aceptan?",
                    a: "Aceptamos todos los métodos disponibles en PayPal: tarjetas de crédito/débito (Visa, Mastercard, Amex), saldo PayPal y más.",
                  },
                  {
                    q: "¿Cuál es la garantía de devolución?",
                    a: "Ofrecemos garantía de devolución de hasta 48 horas. Si no estás satisfecho, contáctanos y procesamos tu reembolso sin preguntas.",
                  },
                ].map((faq) => (
                  <div key={faq.q} className="border-b border-gray-200 py-4">
                    <p className="text-gray-800 text-sm mb-1.5" style={{ fontWeight: 600 }}>{faq.q}</p>
                    <p className="text-gray-500 text-sm">{faq.a}</p>
                  </div>
                ))}
              </div>

              {/* Guarantee */}
              <div className="mt-10 bg-amber-50 border border-amber-200 rounded-2xl p-6 text-center max-w-lg mx-auto">
                <div className="text-3xl mb-2">🛡️</div>
                <p className="text-gray-800 text-sm" style={{ fontWeight: 600 }}>Garantía de 48 horas</p>
                <p className="text-gray-500 text-sm mt-1">
                  Si en las primeras 48 horas no estás satisfecho, te devolvemos el dinero sin preguntas.
                </p>
              </div>
            </>
          )}
        </div>

        <Footer />
      </div>
    </PayPalScriptProvider>
  );
}
