import { createElement } from "react";
const makeIcon =
  (symbol) =>
  ({ className = "", size = 16 }) =>
    createElement(
      "span",
      {
        className: `inline-flex items-center justify-center ${className}`,
        style: { width: size, height: size },
        "aria-hidden": true,
      },
      symbol,
    );
export const AlertCircle = makeIcon("!");
export const CheckCircle2 = makeIcon("✓");
export const Inbox = makeIcon("□");
export const LoaderCircle = makeIcon("↻");
export const Menu = makeIcon("☰");
export const LayoutDashboard = makeIcon("▦");
export const TicketPlus = makeIcon("+");
export const ListTodo = makeIcon("☷");
export const LogOut = makeIcon("↪");
export const Headphones = makeIcon("◉");
export const ArrowRight = makeIcon("→");
export const Paperclip = makeIcon("⌕");
export const Plus = makeIcon("+");
export const BarChart3 = makeIcon("▥");
export const Search = makeIcon("⌕");
