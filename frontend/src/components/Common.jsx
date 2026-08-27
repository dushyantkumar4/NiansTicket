import { AlertCircle, CheckCircle2, Inbox, LoaderCircle } from "./Icons";
import { statusKey } from "../lib/utils";
export function StatusBadge({ status }) {
  const s = statusKey(status),
    c =
      s === "resolved"
        ? "bg-emerald-100 text-emerald-700"
        : s === "inprogress"
          ? "bg-amber-100 text-amber-700"
          : "bg-blue-100 text-blue-700";
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${c}`}
    >
      {status || "Open"}
    </span>
  );
}
export function PriorityBadge({ priority }) {
  const p = String(priority || "medium").toLowerCase(),
    c =
      p === "high"
        ? "bg-rose-100 text-rose-700"
        : p === "low"
          ? "bg-slate-100 text-slate-600"
          : "bg-violet-100 text-violet-700";
  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${c}`}>
      {priority || "Medium"}
    </span>
  );
}
export function LoadingState({ text = "Loading..." }) {
  return (
    <div className="flex min-h-48 items-center justify-center gap-2 text-slate-500">
      <LoaderCircle className="animate-spin" size={20} />
      {text}
    </div>
  );
}
export function ErrorState({ message = "Unable to load data.", retry }) {
  return (
    <div className="card flex min-h-40 flex-col items-center justify-center gap-3 p-6 text-center text-slate-600">
      <AlertCircle className="text-rose-500" />
      <p>{message}</p>
      {retry && (
        <button onClick={retry} className="btn btn-secondary">
          Try again
        </button>
      )}
    </div>
  );
}
export function EmptyState({ title = "No results found.", action }) {
  return (
    <div className="card flex min-h-44 flex-col items-center justify-center gap-2 p-6 text-center">
      <Inbox className="text-slate-400" />
      <p className="font-medium text-slate-700">{title}</p>
      {action}
    </div>
  );
}
export function Notice({ type = "success", children }) {
  return (
    <div
      className={`mb-4 flex items-center gap-2 rounded-lg p-3 text-sm ${type === "success" ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}
    >
      {type === "success" ? (
        <CheckCircle2 size={16} />
      ) : (
        <AlertCircle size={16} />
      )}{" "}
      {children}
    </div>
  );
}
