import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowRight, Paperclip, Plus } from "../../components/Icons";
import { ticketService } from "../../services/api";
import { date, getId, getItems, messageFrom, statusKey } from "../../lib/utils";
import {
  EmptyState,
  ErrorState,
  LoadingState,
  Notice,
  PriorityBadge,
  StatusBadge,
} from "../../components/Common";
import { useAuth } from "../../hooks/useAuth";
const title = "text-2xl font-bold tracking-tight";
function useTickets() {
  const [s, setS] = useState({ loading: true, error: "", items: [] });
  const load = () => {
    setS((x) => ({ ...x, loading: true, error: "" }));
    ticketService
      .list()
      .then((r) => setS({ loading: false, error: "", items: getItems(r.data) }))
      .catch((e) =>
        setS({
          loading: false,
          error: messageFrom(e, "Unable to load tickets."),
          items: [],
        }),
      );
  };
  useEffect(load, []);
  return { ...s, reload: load };
}
function Summary({ tickets }) {
  const count = (k) => tickets.filter((t) => statusKey(t.status) === k).length;
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {[
        ["Total Tickets", tickets.length, "text-blue-600"],
        ["Open", count("open"), "text-sky-600"],
        ["In Progress", count("inprogress"), "text-amber-600"],
        ["Resolved", count("resolved"), "text-emerald-600"],
      ].map(([l, n, c]) => (
        <div className="card p-4" key={l}>
          <p className="text-sm text-slate-500">{l}</p>
          <p className={`mt-2 text-3xl font-bold ${c}`}>{n}</p>
        </div>
      ))}
    </div>
  );
}
export function CustomerDashboard() {
  const { user } = useAuth(),
    { loading, error, items, reload } = useTickets();
  return (
    <div>
      <div className="mb-7 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className={title}>
            Welcome back, {user?.name?.split(" ")[0] || "there"}
          </h1>
          <p className="mt-1 text-slate-500">
            Here’s an overview of your support requests.
          </p>
        </div>
        <Link className="btn btn-primary" to="/customer/tickets/create">
          <Plus size={17} />
          Create ticket
        </Link>
      </div>
      {loading ? (
        <LoadingState text="Loading your tickets..." />
      ) : error ? (
        <ErrorState message={error} retry={reload} />
      ) : (
        <>
          <Summary tickets={items} />
          <section className="card mt-6">
            <div className="flex items-center justify-between border-b border-slate-100 p-5">
              <h2 className="font-semibold">Recent tickets</h2>
              <Link
                className="text-sm font-semibold text-blue-600"
                to="/customer/tickets"
              >
                View all
              </Link>
            </div>
            {items.length ? (
              <TicketTable tickets={items.slice(0, 5)} />
            ) : (
              <EmptyState
                title="No tickets yet."
                action={
                  <Link
                    className="btn btn-primary mt-2"
                    to="/customer/tickets/create"
                  >
                    Create your first ticket
                  </Link>
                }
              />
            )}
          </section>
        </>
      )}
    </div>
  );
}
export function TicketTable({ tickets }) {
  return (
    <div className="table-wrap">
      <table className="data-table">
        <thead>
          <tr>
            <th>Ticket</th>
            <th>Priority</th>
            <th>Status</th>
            <th>Created</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {tickets.map((t) => (
            <tr key={getId(t)}>
              <td>
                <p className="font-medium">{t.title}</p>
                <p className="text-xs text-slate-500">#{getId(t)}</p>
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
                  to={`/customer/tickets/${getId(t)}`}
                >
                  View
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
export function TicketList() {
  const { loading, error, items, reload } = useTickets();
  return (
    <div>
      <div className="mb-7 flex items-end justify-between gap-3">
        <div>
          <h1 className={title}>My tickets</h1>
          <p className="mt-1 text-slate-500">
            Track and review your support requests.
          </p>
        </div>
        <Link className="btn btn-primary" to="/customer/tickets/create">
          <Plus size={17} />
          Create new ticket
        </Link>
      </div>
      {loading ? (
        <LoadingState text="Loading tickets..." />
      ) : error ? (
        <ErrorState message={error} retry={reload} />
      ) : items.length ? (
        <section className="card">
          <TicketTable tickets={items} />
        </section>
      ) : (
        <EmptyState
          title="No tickets found."
          action={
            <Link
              className="btn btn-primary mt-2"
              to="/customer/tickets/create"
            >
              Create New Ticket
            </Link>
          }
        />
      )}
    </div>
  );
}
export function TicketForm() {
  const [f, setF] = useState({
      title: "",
      description: "",
      priority: "Medium",
    }),
    [file, setFile] = useState(null),
    [busy, setBusy] = useState(false),
    [notice, setNotice] = useState(""),
    [error, setError] = useState(""),
    nav = useNavigate();
  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (!f.title.trim() || !f.description.trim())
      return setError("Title and description are required.");
    if (
      file &&
      (file.size > 5 * 1024 * 1024 ||
        !["image/jpeg", "image/png", "application/pdf"].includes(file.type))
    )
      return setError("Attachment must be a JPG, PNG, or PDF under 5 MB.");
    setBusy(true);
    try {
      const d = new FormData();
      Object.entries(f).forEach(([k, v]) => d.append(k, v));
      if (file) d.append("attachment", file);
      const r = await ticketService.create(d),
        created = r.data?.ticket || r.data?.data || r.data;
      setNotice("Ticket created successfully.");
      setTimeout(() => nav(`/customer/tickets/${getId(created)}`), 600);
    } catch (e) {
      setError(messageFrom(e, "Failed to create ticket. Please try again."));
    } finally {
      setBusy(false);
    }
  };
  return (
    <div className="mx-auto max-w-2xl">
      <Link
        to="/customer/tickets"
        className="text-sm font-medium text-blue-600"
      >
        ← Back to tickets
      </Link>
      <h1 className={`${title} mt-4`}>Create a ticket</h1>
      <p className="mt-1 text-slate-500">Tell us what you need help with.</p>
      <form onSubmit={submit} className="card mt-6 space-y-5 p-5 sm:p-7">
        {notice && <Notice>{notice}</Notice>}
        {error && <Notice type="error">{error}</Notice>}
        <label className="block text-sm font-medium">
          Title
          <input
            className="field mt-1.5"
            value={f.title}
            maxLength="120"
            onChange={(e) => setF({ ...f, title: e.target.value })}
            placeholder="Briefly describe your issue"
          />
        </label>
        <label className="block text-sm font-medium">
          Description
          <textarea
            className="field mt-1.5 min-h-36 resize-y"
            value={f.description}
            onChange={(e) => setF({ ...f, description: e.target.value })}
            placeholder="Include any relevant details so we can help quickly."
          />
        </label>
        <label className="block text-sm font-medium">
          Priority
          <select
            className="field mt-1.5"
            value={f.priority}
            onChange={(e) => setF({ ...f, priority: e.target.value })}
          >
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
        </label>
        <label className="block text-sm font-medium">
          Attachment{" "}
          <span className="font-normal text-slate-500">
            (optional, JPG/PNG/PDF, max 5 MB)
          </span>
          <input
            className="field mt-1.5"
            type="file"
            accept="image/jpeg,image/png,application/pdf"
            onChange={(e) => setFile(e.target.files[0])}
          />
        </label>
        <button disabled={busy} className="btn btn-primary">
          {busy ? "Creating ticket..." : "Create Ticket"}{" "}
          <ArrowRight size={17} />
        </button>
      </form>
    </div>
  );
}
export function TicketDetails() {
  const { id } = useParams(),
    [s, setS] = useState({ loading: true, error: "", ticket: null });
  const load = () => {
    setS({ loading: true, error: "", ticket: null });
    ticketService
      .get(id)
      .then((r) =>
        setS({
          loading: false,
          error: "",
          ticket: r.data?.ticket || r.data?.data || r.data,
        }),
      )
      .catch((e) =>
        setS({
          loading: false,
          error: messageFrom(e, "Unable to load ticket."),
          ticket: null,
        }),
      );
  };
  useEffect(load, [id]);
  if (s.loading) return <LoadingState text="Loading ticket..." />;
  if (s.error) return <ErrorState message={s.error} retry={load} />;
  const t = s.ticket,
    h = t.statusHistory || t.history || [];
  return <TicketDetail ticket={t} history={h} back="/customer/tickets" />;
}
export function TicketDetail({ ticket: t, history = [], back }) {
  return (
    <div className="mx-auto max-w-3xl">
      <Link to={back} className="text-sm font-medium text-blue-600">
        ← Back to tickets
      </Link>
      <div className="mt-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm text-slate-500">Ticket #{getId(t)}</p>
          <h1 className={title}>{t.title}</h1>
        </div>
        <StatusBadge status={t.status} />
      </div>
      <section className="card mt-6 p-5 sm:p-7">
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase text-slate-500">
              Priority
            </p>
            <div className="mt-2">
              <PriorityBadge priority={t.priority} />
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase text-slate-500">
              Created
            </p>
            <p className="mt-2 text-sm">{date(t.createdAt)}</p>
          </div>
        </div>
        <div className="mt-6 border-t border-slate-100 pt-5">
          <p className="text-xs font-semibold uppercase text-slate-500">
            Description
          </p>
          <p className="mt-2 whitespace-pre-wrap leading-7 text-slate-700">
            {t.description}
          </p>
        </div>
        {(t.attachment || t.attachmentUrl) && (
          <a
            className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-blue-600"
            href={t.attachmentUrl || t.attachment}
            target="_blank"
          >
            <Paperclip size={16} />
            View attachment
          </a>
        )}
      </section>
      <section className="card mt-6 p-5 sm:p-7">
        <h2 className="font-semibold">Status history</h2>
        <div className="mt-5 space-y-5">
          {history.length ? (
            history.map((x, i) => (
              <div
                key={i}
                className="relative flex gap-3 border-l-2 border-blue-200 pl-5"
              >
                <span className="absolute -left-1.5 top-1 h-3 w-3 rounded-full bg-blue-500" />
                <div>
                  <StatusBadge status={x.status || x.to} />
                  <p className="mt-1 text-sm text-slate-500">
                    {date(x.createdAt || x.changedAt || x.date)}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-slate-500">
              No status changes yet. This ticket is currently{" "}
              {t.status || "Open"}.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
