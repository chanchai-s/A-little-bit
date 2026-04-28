import { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { mainApi as api } from "../api/apiMain.js";
import useUserStore from "../stores/user.store.js";

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const login = useUserStore((state) => state.login);
  const navigate = useNavigate();
  const token = useUserStore((state) => state.token);

  const canSubmit = validateEmail(email) && password.length >= 8;

  async function handleLogin() {
    if (!canSubmit) return;
    setLoading(true);

    try {
      await login({ email, password });

      console.log("Login Success");
      alert("Login Successful!");
      navigate("/");
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Login failedInvalid credentials";
      console.error("Login Error:", message);
      alert(message);
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
            className="w-full mt-1 px-4 py-3 border rounded-lg text-sm focus:ring-2 focus:ring-red-200 outline-none"
          />
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
              className="w-full mt-1 px-4 py-3 border rounded-lg text-sm focus:ring-2 focus:ring-red-200 outline-none"
            />

            <button
              type="button"
              onClick={() => setShow(!show)}
              className="absolute right-3 top-3 text-xs text-gray-500"
            >
              {show ? "Hide" : "Show"}
            </button>
          </div>
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
        {/* login btn */}
        <button
          onClick={handleLogin}
          disabled={!canSubmit || loading}
          className={`w-full py-3 rounded-lg font-bold transition
            ${
              canSubmit
                ? "bg-red-800 text-white hover:bg-red-900"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
        >
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
