import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { BarChart3, Search } from "../../components/Icons";
import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { analyticsService, ticketService } from "../../services/api";
import { date, getId, getItems, messageFrom } from "../../lib/utils";
import {
  EmptyState,
  ErrorState,
  LoadingState,
  Notice,
  PriorityBadge,
  StatusBadge,
} from "../../components/Common";
import { TicketDetail } from "../customer/CustomerPages";
const heading = "text-2xl font-bold tracking-tight";
const normalizeAnalytics = (data) => {
  const x = data?.data || data || {};
  return {
    total: x.total || x.totalTickets || 0,
    open: x.open || 0,
    inProgress: x.inProgress || x.in_progress || 0,
    resolved: x.resolved || 0,
  };
};
export function AdminDashboard() {
  const [state, setState] = useState({ loading: true, error: "", data: null });
  const load = () => {
    setState({ loading: true, error: "", data: null });
    analyticsService
      .get()
      .then((r) =>
        setState({
          loading: false,
          error: "",
          data: normalizeAnalytics(r.data),
        }),
      )
      .catch((e) =>
        setState({
          loading: false,
          error: messageFrom(e, "Unable to load analytics."),
          data: null,
        }),
      );
  };
  useEffect(load, []);
  if (state.loading) return <LoadingState text="Loading analytics..." />;
  if (state.error) return <ErrorState message={state.error} retry={load} />;
  const a = state.data,
    chart = [
      { name: "Open", value: a.open, color: "#3b82f6" },
      { name: "In Progress", value: a.inProgress, color: "#f59e0b" },
      { name: "Resolved", value: a.resolved, color: "#10b981" },
    ];
  return (
    <div>
      <div className="mb-7">
        <h1 className={heading}>Admin dashboard</h1>
        <p className="mt-1 text-slate-500">
          A snapshot of support ticket activity.
        </p>
      </div>
      {!a.total ? (
        <EmptyState title="No analytics data available." />
      ) : (
        <>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {[
              ["Total Tickets", a.total, "text-blue-600"],
              ["Open", a.open, "text-sky-600"],
              ["In Progress", a.inProgress, "text-amber-600"],
              ["Resolved", a.resolved, "text-emerald-600"],
            ].map(([l, n, c]) => (
              <div className="card p-4" key={l}>
                <p className="text-sm text-slate-500">{l}</p>
                <p className={`mt-2 text-3xl font-bold ${c}`}>{n}</p>
              </div>
            ))}
          </div>
          <section className="card mt-6 p-5">
            <div className="flex items-center gap-2">
              <BarChart3 className="text-blue-600" />
              <h2 className="font-semibold">Tickets by status</h2>
            </div>
            <div className="mt-4 h-72">
              <ResponsiveContainer>
                <BarChart data={chart}>
                  <Tooltip />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                    {chart.map((x) => (
                      <Cell key={x.name} fill={x.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
export function AdminTickets() {
  const [filters, setFilters] = useState({
      search: "",
      status: "",
      priority: "",
    }),
    [query, setQuery] = useState(filters),
    [state, setState] = useState({
      loading: true,
      error: "",
      items: [],
      page: 1,
      totalPages: 1,
    });
  const load = (page = state.page) => {
    setState((x) => ({ ...x, loading: true, error: "" }));
    ticketService
      .list({ ...query, page, limit: 10 })
      .then((r) => {
        const d = r.data?.data || r.data || {};
        setState({
          loading: false,
          error: "",
          items: getItems(r.data),
          page: d.page || r.data?.page || page,
          totalPages: d.totalPages || r.data?.totalPages || 1,
        });
      })
      .catch((e) =>
        setState((x) => ({
          ...x,
          loading: false,
          error: messageFrom(e, "Unable to load tickets."),
        })),
      );
  };
  useEffect(() => {
    load(1);
  }, [query]);
  const apply = (e) => {
    e.preventDefault();
    setQuery(filters);
  };
  return (
    <div>
      <div className="mb-7">
        <h1 className={heading}>All tickets</h1>
        <p className="mt-1 text-slate-500">
          Search, review, and manage support requests.
        </p>
      </div>
      <form
        onSubmit={apply}
        className="card mb-5 grid gap-3 p-4 md:grid-cols-4"
      >
        <input
          className="field"
          placeholder="Search tickets..."
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
        />
        <select
          className="field"
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
        >
          <option value="">All statuses</option>
          <option>Open</option>
          <option>In Progress</option>
          <option>Resolved</option>
        </select>
        <select
          className="field"
          value={filters.priority}
          onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
        >
          <option value="">All priorities</option>
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>
        <button className="btn btn-primary">
          <Search size={17} />
          Apply filters
        </button>
      </form>
      {state.loading ? (
        <LoadingState text="Loading tickets..." />
      ) : state.error ? (
        <ErrorState message={state.error} retry={() => load()} />
      ) : state.items.length ? (
        <section className="card">
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Title</th>
                  <th>Customer</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {state.items.map((t) => (
                  <tr key={getId(t)}>
                    <td className="text-slate-500">#{getId(t)}</td>
                    <td className="font-medium">{t.title}</td>
                    <td>
                      {t.customer?.name ||
                        t.customer?.email ||
                        t.user?.email ||
                        "—"}
                    </td>
                    <td>
                      <PriorityBadge priority={t.priority} />
                    </td>
                    <td>
                      <StatusBadge status={t.status} />
                    </td>
                    <td className="text-slate-500">{date(t.createdAt)}</td>
                    <td>
                      <Link
                        className="font-medium text-blue-600"
                        to={`/admin/tickets/${getId(t)}`}
                      >
                        Manage
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between border-t border-slate-100 p-4">
            <button
              className="btn btn-secondary"
              disabled={state.page <= 1}
              onClick={() => load(state.page - 1)}
            >
              Previous
            </button>
            <span className="text-sm text-slate-500">
              Page {state.page} of {state.totalPages}
            </span>
            <button
              className="btn btn-secondary"
              disabled={state.page >= state.totalPages}
              onClick={() => load(state.page + 1)}
            >
              Next
            </button>
          </div>
        </section>
      ) : (
        <EmptyState title="No tickets match your search or filters." />
      )}
    </div>
  );
}
export function AdminTicketDetails() {
  const { id } = useParams(),
    [state, setState] = useState({ loading: true, error: "", ticket: null }),
    [status, setStatus] = useState(""),
    [busy, setBusy] = useState(false),
    [notice, setNotice] = useState("");
  const load = () => {
    setState({ loading: true, error: "", ticket: null });
    ticketService
      .get(id)
      .then((r) => {
        const t = r.data?.ticket || r.data?.data || r.data;
        setState({ loading: false, error: "", ticket: t });
        setStatus(t.status || "Open");
      })
      .catch((e) =>
        setState({
          loading: false,
          error: messageFrom(e, "Unable to load ticket."),
          ticket: null,
        }),
      );
  };
  useEffect(load, [id]);
  const update = async () => {
    setBusy(true);
    try {
      await ticketService.updateStatus(id, status);
      setNotice("Status updated successfully.");
      load();
    } catch (e) {
      setNotice(messageFrom(e, "Unable to update status."));
    } finally {
      setBusy(false);
    }
  };
  if (state.loading) return <LoadingState text="Loading ticket..." />;
  if (state.error) return <ErrorState message={state.error} retry={load} />;
  const t = state.ticket;
  return (
    <div>
      {notice && (
        <Notice type={notice.includes("successfully") ? "success" : "error"}>
          {notice}
        </Notice>
      )}
      <TicketDetail
        ticket={t}
        history={t.statusHistory || t.history || []}
        back="/admin/tickets"
      />
      <section className="card mx-auto mt-6 max-w-3xl p-5">
        <h2 className="font-semibold">Update ticket status</h2>
        <p className="mt-1 text-sm text-slate-500">
          Customer:{" "}
          {t.customer?.name ||
            t.customer?.email ||
            t.user?.email ||
            "Not available"}
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <select
            className="field max-w-xs"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option>Open</option>
            <option>In Progress</option>
            <option>Resolved</option>
          </select>
          <button disabled={busy} onClick={update} className="btn btn-primary">
            {busy ? "Updating..." : "Update Status"}
          </button>
        </div>
      </section>
    </div>
  );
}
