import { Link, useNavigate } from "react-router-dom";
import { User, LogOut, Shield } from "lucide-react";
import { logoutUser } from "../api/authApi";
import { getUserRole } from "../utils/jwt";
import { toast } from "sonner";

const Navbar = () => {
  const navigate = useNavigate();

  const token = localStorage.getItem("accessToken");
  const role = getUserRole();

  const isLoggedIn = Boolean(token);

  const isAdmin =
    role === "ADMIN" ||
    role === "ROLE_ADMIN";

  const handleLogout = async () => {
    try {
      await logoutUser();

      localStorage.removeItem("accessToken");

      toast.success("Logged out successfully");

      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);

      localStorage.removeItem("accessToken");

      navigate("/login");
    }
  };

  const handleMyBookings = () => {
    console.log("MY BOOKINGS CLICKED");
    navigate("/my-bookings");
  };

  return (
    <header className="navbar">
      <div className="navbar-container">

        {/* ================= LOGO ================= */}

        <Link
          to="/"
          className="navbar-logo"
        >
          <div className="navbar-logo-icon">
            FT
          </div>

          <span>
            FLASH TICKET
          </span>
        </Link>


        {/* ================= NAV LINKS ================= */}

        <nav className="navbar-links">

          <Link to="/">
            Events
          </Link>


          {isLoggedIn && !isAdmin && (
            <button
              type="button"
              onClick={handleMyBookings}
              className="navbar-link-button"
            >
              My bookings
            </button>
          )}


          {isAdmin && (
            <Link to="/admin/events">
              <Shield size={15} />
              Admin events
            </Link>
          )}


          {isAdmin && (
            <Link to="/admin/dashboard">
              <Shield size={15} />
              Admin Dashboard
            </Link>
          )}

        </nav>


        {/* ================= RIGHT ACTIONS ================= */}

        <div className="navbar-actions">

          {isLoggedIn ? (
            <>

              <div className="navbar-user">

                <User size={15} />

                <span>
                  {isAdmin
                    ? "Admin"
                    : "Account"}
                </span>

              </div>


              <button
                type="button"
                className="navbar-logout"
                onClick={handleLogout}
              >

                <LogOut size={15} />

                <span>
                  Logout
                </span>

              </button>

            </>
          ) : (
            <>

              <Link
                to="/login"
                className="navbar-login"
              >
                Login
              </Link>


              <Link
                to="/register"
                className="navbar-register"
              >
                Get started
              </Link>

            </>
          )}

        </div>

      </div>
    </header>
  );
};

export default Navbar;