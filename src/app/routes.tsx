import { createBrowserRouter, Outlet } from "react-router";
import { Navbar } from "./components/Navbar";
import { Landing } from "./pages/Landing";
import { Explore } from "./pages/Explore";
import { PhotographerProfile } from "./pages/PhotographerProfile";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { Subscription } from "./pages/Subscription";
import { PhotographerDashboard } from "./pages/PhotographerDashboard";
import { ClientDashboard } from "./pages/ClientDashboard";
import { Legal } from "./pages/Legal";
import { AdminDashboard } from "./pages/AdminDashboard";

function Root() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}

function AuthLayout() {
  return <Outlet />;
}

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Landing },
      { path: "explorar", Component: Explore },
      { path: "fotografo/:id", Component: PhotographerProfile },
      { path: "planes", Component: Subscription },
      { path: "legal", Component: Legal },
      { path: "dashboard/fotografo", Component: PhotographerDashboard },
      { path: "dashboard/cliente", Component: ClientDashboard },
    ],
  },
  {
    path: "/",
    Component: AuthLayout,
    children: [
      { path: "login", Component: Login },
      { path: "registro", Component: Register },
      { path: "admin", Component: AdminDashboard },
    ],
  },
]);
