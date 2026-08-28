import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Headphones } from "../../components/Icons";
import { authService } from "../../services/api";
import { useAuth } from "../../hooks/useAuth";
import { messageFrom } from "../../lib/utils";
import { Notice } from "../../components/Common";
import { AuthNavbar } from "../../components/AuthNavbar";

function AuthShell({ title, subtitle, children }) {
  return (
    <main className="min-h-screen bg-slate-50">
      <AuthNavbar />
      <section className="mx-auto w-full max-w-md px-4 py-12">
        <div className="mb-7 flex items-center justify-center gap-2 text-2xl font-bold">
          <span className="rounded-lg bg-blue-600 p-2 text-white">
            <Headphones size={21} />
          </span>
          Helpdesk
        </div>
        <div className="card p-6 sm:p-8">
          <h1 className="text-2xl font-bold">{title}</h1>
          <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
          {children}
        </div>
      </section>
    </main>
  );
}
const destination = (user) =>
  user.role === "admin" ? "/admin/dashboard" : "/customer/tickets/create";
export function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" }),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false),
    nav = useNavigate(),
    { save } = useAuth();
  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.email || !form.password)
      return setError("Email and password are required.");
    setBusy(true);
    try {
      const user = save((await authService.login(form)).data);
      nav(destination(user));
    } catch (e) {
      setError(messageFrom(e, "Unable to sign in."));
    } finally {
      setBusy(false);
    }
  };
  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in with your Helpdesk email and password."
    >
      {error && <Notice type="error">{error}</Notice>}
      <form onSubmit={submit} className="mt-6 space-y-4">
        <label className="block text-sm font-medium">
          Email
          <input
            className="field mt-1.5"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="you@example.com"
          />
        </label>
        <label className="block text-sm font-medium">
          Password
          <input
            className="field mt-1.5"
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </label>
        <button disabled={busy} className="btn btn-primary w-full">
          {busy ? "Signing in..." : "Sign in"}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-slate-600">
        Don’t have an account?{" "}
        <Link className="font-semibold text-blue-600" to="/signup">
          Create account
        </Link>
      </p>
    </AuthShell>
  );
}
export function SignupPage() {
  const [form, setForm] = useState({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    }),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false),
    nav = useNavigate(),
    { save } = useAuth();
  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.name || !form.email || !form.password)
      return setError("Please complete all required fields.");
    if (form.password !== form.confirmPassword)
      return setError("Passwords do not match.");
    setBusy(true);
    try {
      const user = save(
        (
          await authService.signup({
            name: form.name,
            email: form.email,
            password: form.password,
          })
        ).data,
      );
      nav(destination(user));
    } catch (e) {
      setError(messageFrom(e, "Unable to create your account."));
    } finally {
      setBusy(false);
    }
  };
  return (
    <AuthShell
      title="Create account"
      subtitle="Create a Helpdesk customer account."
    >
      {error && <Notice type="error">{error}</Notice>}
      <form onSubmit={submit} className="mt-6 space-y-3">
        <label className="block text-sm font-medium">
          Name
          <input
            className="field mt-1"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </label>
        <label className="block text-sm font-medium">
          Email
          <input
            className="field mt-1"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </label>
        <label className="block text-sm font-medium">
          Password
          <input
            className="field mt-1"
            type="password"
            minLength="6"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </label>
        <label className="block text-sm font-medium">
          Confirm password
          <input
            className="field mt-1"
            type="password"
            value={form.confirmPassword}
            onChange={(e) =>
              setForm({ ...form, confirmPassword: e.target.value })
            }
          />
        </label>
        <button disabled={busy} className="btn btn-primary mt-2 w-full">
          {busy ? "Creating account..." : "Create account"}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-slate-600">
        Already have an account?{" "}
        <Link className="font-semibold text-blue-600" to="/login">
          Sign in
        </Link>
      </p>
    </AuthShell>
  );
}
