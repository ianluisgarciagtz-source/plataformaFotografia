export interface PendingPayment {
  userEmail: string;
  planId: string;
  planName: string;
  billing: "monthly" | "annual";
  price: number;
  createdAt: string;
}

const KEY = "fototrabajo_pending_payments_v1";

export function addPendingPayment(p: PendingPayment) {
  try {
    const raw = localStorage.getItem(KEY);
    const arr: PendingPayment[] = raw ? JSON.parse(raw) : [];
    arr.push(p);
    localStorage.setItem(KEY, JSON.stringify(arr));
  } catch (e) {
    console.error("Failed to store pending payment", e);
  }
}

export function getPendingPayments(): PendingPayment[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error("Failed to read pending payments", e);
    return [];
  }
}

export function clearPendingPayments() {
  try {
    localStorage.removeItem(KEY);
  } catch (e) {
    console.error("Failed to clear pending payments", e);
  }
}

export function removePendingPaymentForEmail(email: string) {
  try {
    const raw = localStorage.getItem(KEY);
    const arr: PendingPayment[] = raw ? JSON.parse(raw) : [];
    const filtered = arr.filter((p) => p.userEmail !== email);
    localStorage.setItem(KEY, JSON.stringify(filtered));
  } catch (e) {
    console.error("Failed to remove pending payment", e);
  }
}
