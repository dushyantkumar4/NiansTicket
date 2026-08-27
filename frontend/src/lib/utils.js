export const getId = (t) => t?._id || t?.id || t?.ticketId;
export const getItems = (r) => r?.tickets || r?.data?.tickets || r?.data || [];
export const messageFrom = (e, f = "Something went wrong. Please try again.") =>
  e?.response?.data?.message || e?.response?.data?.error || e?.message || f;
export const date = (v) =>
  v
    ? new Date(v).toLocaleString([], {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : "—";
export const statusKey = (s) =>
  String(s || "open")
    .toLowerCase()
    .replace(/[ _-]/g, "");
