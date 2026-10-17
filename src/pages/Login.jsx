import { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { mainApi as api } from "../api/apiMain.js";
import useUserStore from "../stores/user.store.js";
import { loginSchema } from "../validations/RegisLogin.js";
import { EyeIcon, EyeSlashIcon } from "../icons/index.jsx";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const login = useUserStore((state) => state.login);
  const navigate = useNavigate();
  const token = useUserStore((state) => state.token);

  const parsed = loginSchema.safeParse({ email, password });
  const canSubmit = parsed.success;

  async function handleLogin() {
    if (loading) return; // re-entry guard while a request is in flight
    const result = loginSchema.safeParse({ email, password });
    if (!result.success) {
      setErrors(result.error.flatten().fieldErrors);
      return;
    }
    setErrors({});
    setLoading(true);

    try {
      await login(result.data);

      console.log("Login Success");
      alert("Login Successful!");
      navigate("/");
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Login failed. Invalid credentials.";
      console.error("Login Error:", message);
      setErrors({ submit: [message] });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 p-4">
      {/* card */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        {/* title */}
        <div className="mb-6">
          <h2 className="text-2xl font-extrabold text-gray-900">
            Welcome back
          </h2>
          <p className="text-sm text-gray-500">Login to your account</p>
        </div>
        {/* email */}
        <div className="mb-4">
          <label className="text-sm font-semibold text-gray-700">Email</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            disabled={loading}
            className="w-full mt-1 px-4 py-3 border rounded-lg text-sm focus:ring-2 focus:ring-red-200 outline-none disabled:bg-gray-50 disabled:text-gray-400"
          />
          {errors.email && (
            <p className="text-xs text-red-500 mt-1">⚠ {errors.email[0]}</p>
          )}
        </div>
        {/* password */}
        <div className="mb-4">
          <label className="text-sm font-semibold text-gray-700">
            Password
          </label>

          <div className="relative">
            <input
              type={show ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              disabled={loading}
              className="w-full mt-1 px-4 py-3 border rounded-lg text-sm focus:ring-2 focus:ring-red-200 outline-none disabled:bg-gray-50 disabled:text-gray-400"
            />

            <button
              type="button"
              onClick={() => setShow(!show)}
              aria-label={show ? "Hide password" : "Show password"}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 p-1"
            >
              {show ? (
                <EyeSlashIcon className="w-5 h-5" />
              ) : (
                <EyeIcon className="w-5 h-5" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-xs text-red-500 mt-1">⚠ {errors.password[0]}</p>
          )}
        </div>
        {/* forgot */}
        <div className="text-right mb-4">
          <button
            className="text-sm text-red-800 font-semibold cursor-pointer"
            onClick={() => navigate("/request-otp")}
          >
            Forgot password
          </button>
        </div>
        {/* api error */}
        {errors.submit && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700">
            ⚠ {errors.submit[0]}
          </div>
        )}

        {/* login btn */}
        <button
          onClick={handleLogin}
          disabled={!canSubmit || loading}
          className={`w-full py-3 rounded-lg font-bold transition flex items-center justify-center gap-2
            ${
              canSubmit && !loading
                ? "bg-red-800 text-white hover:bg-red-900"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
        >
          {loading && (
            <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          )}
          {loading ? "Logging in..." : "Login"}
        </button>
        {/* divider */}
        <div className="flex items-center gap-2 my-5">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs text-gray-400">OR</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* google */}
        <GoogleLogin
          onSuccess={async (credentialResponse) => {
            setLoading(true);
            try {
              const res = await api.post("/auth/google", {
                token: credentialResponse.credential,
              });

              const { token, user } = res.data;
              localStorage.setItem("token", token);
              localStorage.setItem("user", JSON.stringify(user));
              useUserStore.setState({ token: token, user: user });
              alert("Login with Google Successful!");
              navigate("/");
            } catch (error) {
              const message =
                error.response?.data?.message || "Google Login failed";
              console.error("Google Login Error:", message);
              alert(message);
            } finally {
              setLoading(false);
            }
          }}
          onError={() => {
            alert("Google Login Failed");
          }}
        />

        {/* register */}
        <p className="text-sm text-center mt-6 text-gray-500">
          Don't have an account?{" "}
          <span
            className="text-red-800 font-semibold cursor-pointer"
            onClick={() => navigate("/register")}
          >
            Register
          </span>
        </p>
      </div>
    </div>
  );
}
