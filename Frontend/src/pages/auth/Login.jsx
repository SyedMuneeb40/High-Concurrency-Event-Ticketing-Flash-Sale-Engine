import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../../api/authApi";
import { getUserRole } from "../../utils/jwt";
import {
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please enter email and password");
      return;
    }

    try {
      setLoading(true);

      // Login API
      await loginUser(email.toLowerCase(), password);

      // Get role from JWT after successful login
      const role = getUserRole();

      console.log("Logged in user role:", role);

      toast.success("Login successful");

      // ADMIN
      if (role === "ROLE_ADMIN" || role === "ADMIN") {
        navigate("/admin/events");
        return;
      }

      // USER
      navigate("/");
    } catch (error) {
      console.error("Login error:", error);

      const message = error.response?.data;

      toast.error(
        typeof message === "string"
          ? message
          : "Invalid email or password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-card">

        {/* BRAND */}
        <div className="auth-brand">
          <div className="auth-logo">FT</div>
          <span>FLASH TICKET</span>
        </div>

        {/* HEADING */}
        <div className="auth-heading">
          <h1>Welcome back</h1>
          <p>
            Sign in to continue booking amazing events.
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={handleLogin} className="auth-form">

          {/* EMAIL */}
          <div className="auth-field">
            <label>Email</label>

            <div className="auth-input">
              <Mail size={16} />

              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          {/* PASSWORD */}
          <div className="auth-field">
            <label>Password</label>

            <div className="auth-input">
              <LockKeyhole size={16} />

              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? (
                  <EyeOff size={15} />
                ) : (
                  <Eye size={15} />
                )}
              </button>
            </div>
          </div>

          {/* SUBMIT */}
          <button
            type="submit"
            className="auth-submit"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign in"}

            {!loading && <ArrowRight size={15} />}
          </button>
        </form>

        {/* FOOTER */}
        <div className="auth-footer">
          Don't have an account?{" "}
          <Link to="/register">Create account</Link>
        </div>

      </div>
    </main>
  );
};

export default Login;