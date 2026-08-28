import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth";
import { ProtectedRoute, PublicOnlyRoute } from "./components/ProtectedRoute";
import { AppLayout } from "./layouts/AppLayout";
import { LoginPage, SignupPage } from "./pages/auth/AuthPages";
import {
  CustomerDashboard,
  TicketList,
  TicketForm,
  TicketDetails,
} from "./pages/customer/CustomerPages";
import {
  AdminDashboard,
  AdminTickets,
  AdminTicketDetails,
} from "./pages/admin/AdminPages";
export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route
            path="/login"
            element={
              <PublicOnlyRoute>
                <LoginPage />
              </PublicOnlyRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <PublicOnlyRoute>
                <SignupPage />
              </PublicOnlyRoute>
            }
          />
          <Route element={<ProtectedRoute role="customer" />}>
            <Route element={<AppLayout />}>
              <Route path="/customer" element={<CustomerDashboard />} />
              <Route path="/customer/tickets" element={<TicketList />} />
              <Route path="/customer/tickets/create" element={<TicketForm />} />
              <Route path="/customer/tickets/:id" element={<TicketDetails />} />
            </Route>
          </Route>
          <Route element={<ProtectedRoute role="admin" />}>
            <Route element={<AppLayout />}>
              <Route
                path="/admin"
                element={<Navigate to="/admin/dashboard" replace />}
              />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/tickets" element={<AdminTickets />} />
              <Route
                path="/admin/tickets/:id"
                element={<AdminTicketDetails />}
              />
            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
