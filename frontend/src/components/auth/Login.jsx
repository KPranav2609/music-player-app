import Input from "../common/Input";
import { useDispatch, useSelector } from "react-redux";
import {
  clearError,
  setError,
  setLoading,
  setUser,
} from "../../redux/slices/authSlice";
import validator from "validator";
import { closeAuthModal, switchAuthMode } from "../../redux/slices/uiSlice";
import { useState } from "react";
import axios from "axios";
import "../../css/auth/Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotMsg, setForgotMsg] = useState("");

  const dispatch = useDispatch();

  const { isLoading, error } = useSelector((state) => state.auth);

  const { authMode } = useSelector((state) => state.ui);
  const isForgot = authMode === "forgot";

  const handleLogin = async (e) => {
    e.preventDefault();
    dispatch(clearError());

    if (!validator.isEmail(email)) {
      dispatch(setError("Please enter a valid email"));
      return;
    }

    if (!password) {
      dispatch(setError("Password is required"));
      return;
    }
    dispatch(setLoading(true));

    try {
      console.log("EMAIL:", email);
      console.log("PASSWORD:", password);

      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/auth/login`,
        {
          email,
          password,
        },
      );

      const data = res.data || {};

      dispatch(
        setUser({
          user: data.user,
          token: data.token,
        }),
      );

      localStorage.setItem("token", data.token);
      dispatch(closeAuthModal());
      console.log("logged in Successfully");
    } catch (error) {
      const serverMessage =
        error?.response?.data?.message || error?.response?.data?.error;
      dispatch(setError(serverMessage || "Login Failed"));
    }
  };

  const handleForgetPassword = async (e) => {
    if (!forgotEmail) {
      setForgotMsg("Email is required");
      return;
    }

    try {
      setForgotMsg("Sending the Reset link to your email");
      await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/auth/forgotpassword   `,
        {
          email: forgotEmail,
        },
      );
      setForgotMsg("Sent the Reset link to your email 📩");
    } catch (error) {
      setForgotMsg(
        error?.response?.data?.message || "Error in sending the reset link",
      );
    }
  };

  return (
    <div className="login-wrapper">
      <h3 className="login-title">Welcome Back</h3>
      <p className="login-subtitle">Enter your details to login</p>
      <form onSubmit={handleLogin} className="login-form">
        {!isForgot && (
          <>
            <Input
              label="Email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              label="Password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </>
        )}

        <div className="forgot-wrapper">
          {!isForgot ? (
            <>
              <span
                className="forgot-link"
                onClick={() => {
                  dispatch(clearError());
                  dispatch(switchAuthMode("forgot"));
                }}
              >
                Forgot Password
              </span>
              <span
                className="forgot-link"
                onClick={() => {
                  dispatch(clearError());
                  dispatch(switchAuthMode("signup"));
                }}
              >
                Don't have an account? SignUp
              </span>
            </>
          ) : (
            <div className="forgot-box">
              <Input
                label="Email"
                type="email"
                placeholder="Enter your Regestered Email"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
              />
              {forgotMsg && <p className="forgot-msg">{forgotMsg}</p>}
              <button
                type="button"
                className="forgot-btn"
                onClick={handleForgetPassword}
              >
                <span>Send Reset Link</span>
              </button>
            </div>
          )}
        </div>

        {error && <div className="login-error">{error}</div>}

        {!isForgot && (
          <button
            type="submit"
            className="login-submit-btn"
            disabled={isLoading}
          >
            <span>{isLoading ? " Logging in ...." : "Login"}</span>
          </button>
        )}
      </form>
    </div>
  );
};

export default Login;