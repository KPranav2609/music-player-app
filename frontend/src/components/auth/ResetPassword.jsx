import React, { use, useState } from "react";
import axios from "axios";
import "../../css/auth/ResetPassword.css";
import Input from "../common/Input";
import { useParams, useNavigate } from "react-router-dom";


const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    if (!password || password.length < 6) {
      setStatus("error");
      setMessage("Password must be at least 6 characters long");
      return;
    }

    try {
      setLoading(true);
      setStatus("info");
      setMessage("Reseting password...");

      await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/auth/reset-password/${token}`,
        {
          password: password,
        },
      );

      setStatus("success");
      setMessage("Password reset successfully ..... Redirecting!!");

      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      setStatus("error");
      setMessage(
        error?.response?.data?.message || "Error in resetting password",
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="reset-wrapper">
      <h3 className="reset-title">Reset Password</h3>
      <p className="reset-subtitle">
        Enter your New Password to regain the access
      </p>
      <div className="reset-form">
        <Input
          label="New Password"
          type="password"
          placeholder="Enter new Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {status === "error" && <div className="reset-error">{message}</div>}
        {status === "success" && <div className="reset-success">{message}</div>}
        <button
          className="reset-submit-btn"
          onClick={handleReset}
          disabled={loading}
        >
          <span>{loading ? "Reseting..." : "Reset Password"}</span>
        </button>
      </div>
    </div>
  );
};

export default ResetPassword;