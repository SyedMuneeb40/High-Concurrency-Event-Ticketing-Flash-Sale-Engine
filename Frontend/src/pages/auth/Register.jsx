import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  LockKeyhole,
  Eye,
  EyeOff,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";

import { registerUser } from "../../api/authApi";

const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !form.name.trim() ||
      !form.email.trim() ||
      !form.password
    ) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      await registerUser(
        form.name,
        form.email,
        form.password
      );

      toast.success(
        "Account created successfully"
      );

      navigate("/login");

    } catch (error) {
      console.error(error);

      const message =
        error.response?.data ||
        "Registration failed";

      toast.error(
        typeof message === "string"
          ? message
          : "Registration failed"
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">

      <div className="auth-card">

        <div className="auth-brand">

          <div className="auth-logo">
            FT
          </div>

          <span>
            FLASH TICKET
          </span>

        </div>

        <div className="auth-heading">

          <h1>
            Create account
          </h1>

          <p>
            Join Flash Ticket and start
            booking your next experience.
          </p>

        </div>

        <form
          className="auth-form"
          onSubmit={handleSubmit}
        >

          <div className="auth-field">

            <label>
              Full name
            </label>

            <div className="auth-input">

              <User size={16} />

              <input
                name="name"
                type="text"
                placeholder="Your name"
                value={form.name}
                onChange={handleChange}
              />

            </div>

          </div>


          <div className="auth-field">

            <label>
              Email
            </label>

            <div className="auth-input">

              <Mail size={16} />

              <input
                name="email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
              />

            </div>

          </div>


          <div className="auth-field">

            <label>
              Password
            </label>

            <div className="auth-input">

              <LockKeyhole size={16} />

              <input
                name="password"
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                placeholder="Create a password"
                value={form.password}
                onChange={handleChange}
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() =>
                  setShowPassword(
                    !showPassword
                  )
                }
              >
                {showPassword ? (
                  <EyeOff size={15} />
                ) : (
                  <Eye size={15} />
                )}
              </button>

            </div>

          </div>


          <button
            type="submit"
            className="auth-submit"
            disabled={loading}
          >

            {loading
              ? "Creating account..."
              : "Create account"}

            {!loading && (
              <ArrowRight size={15} />
            )}

          </button>

        </form>


        <div className="auth-footer">

          Already have an account?

          <Link to="/login">
            Sign in
          </Link>

        </div>

      </div>

    </main>
  );
};

export default Register;