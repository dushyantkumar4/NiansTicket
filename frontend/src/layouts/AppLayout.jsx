import {
  Menu,
  LayoutDashboard,
  TicketPlus,
  ListTodo,
  Headphones,
} from "../components/Icons";
import { NavLink, Outlet } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
export function AppLayout() {
  const { user, isAdmin, logout } = useAuth(),
    [open, setOpen] = useState(false);
  const links = isAdmin
    ? [
        ["Dashboard", "/admin/dashboard", LayoutDashboard],
        ["All Tickets", "/admin/tickets", ListTodo],
      ]
    : [
        ["Dashboard", "/customer", LayoutDashboard],
        ["My Tickets", "/customer/tickets", ListTodo],
        ["Create Ticket", "/customer/tickets/create", TicketPlus],
      ];
  const side = (
    <>
      <div className="flex items-center gap-2 px-2 text-xl font-bold text-slate-900">
        <span className="rounded-lg bg-blue-600 p-2 text-white">
          <Headphones size={19} />
        </span>
        Helpdesk
      </div>
      <nav className="mt-8 space-y-1">
        {links.map(([label, to, Icon]) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/customer"}
            onClick={() => setOpen(false)}
            className="nav-link"
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="mt-auto border-t border-slate-200 pt-4">
        <div className="mb-3 px-2">
          <p className="truncate text-sm font-semibold">
            {user?.name || "User"}
          </p>
          <p className="truncate text-xs text-slate-500">{user?.email}</p>
          <span className="mt-1 inline-block rounded bg-slate-100 px-2 py-.5 text-[10px] font-bold uppercase text-slate-600">
            {user?.role || "customer"}
          </span>
        </div>
        <button className="nav-link w-full" onClick={logout}>Log out</button>
      </div>
    </>
  );
  return (
    <div className="min-h-screen md:flex">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-slate-200 bg-white p-5 md:flex">
        {side}
      </aside>
      <header className="flex items-center justify-between border-b border-slate-200 bg-white p-4 md:hidden">
        <div className="flex items-center gap-2 font-bold">
          <Headphones className="text-blue-600" />
          Helpdesk
        </div>
        <button
          className="btn btn-secondary p-2"
          onClick={() => setOpen(!open)}
        >
          <Menu size={20} />
        </button>
      </header>
      {open && (
        <div className="fixed inset-x-0 top-16 bottom-0 z-20 flex flex-col bg-white p-5 md:hidden">
          {side}
        </div>
      )}
      <main className="min-w-0 flex-1 p-4 sm:p-7">
        <Outlet />
      </main>
    </div>
  );
}
