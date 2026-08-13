import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";

/* USER & PUBLIC */
import Home from "./pages/user/Home";
import EventDetails from "./pages/user/EventDetails";
import Receipt from "./pages/user/Receipt";
import MyBookings from "./pages/user/MyBookings";

/* AUTH */
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

/* ADMIN */
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminEvents from "./pages/admin/AdminEvents";
import AddEvent from "./pages/admin/AddEvent";
import EditEvent from "./pages/admin/EditEvent";
import ManageEvents from "./pages/admin/ManageEvents";

/* ROUTE GUARDS */
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";

import Navbar from "./components/Navbar";

function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        richColors
      />

      <Navbar />

      <Routes>

        {/* ================= PUBLIC ================= */}

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/event/:id"
          element={<EventDetails />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />


        {/* ================= LOGGED-IN USER ================= */}

        <Route element={<ProtectedRoute />}>

          <Route
            path="/my-bookings"
            element={<MyBookings />}
          />

          <Route
            path="/receipt/:id"
            element={<Receipt />}
          />

        </Route>


        {/* ================= ADMIN ================= */}

        <Route element={<ProtectedRoute />}>

          <Route element={<AdminRoute />}>

            <Route
              path="/admin"
              element={<AdminDashboard />}
            />

            <Route
              path="/admin/dashboard"
              element={<AdminDashboard />}
            />

            <Route
              path="/admin/events"
              element={<AdminEvents />}
            />

            <Route
              path="/admin/events/manage"
              element={<ManageEvents />}
            />

            <Route
              path="/admin/events/add"
              element={<AddEvent />}
            />

            <Route
              path="/admin/events/edit/:id"
              element={<EditEvent />}
            />

          </Route>

        </Route>


        {/* ================= FALLBACK ================= */}

        <Route
          path="*"
          element={<Home />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;