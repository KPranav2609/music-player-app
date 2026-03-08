import {
  clearError,
  setError,
  setLoading,
  setUser,
} from "../../redux/slices/authSlice";
import Input from "../common/Input";
import { useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { closeAuthModal, switchAuthMode } from "../../redux/slices/uiSlice";
import { CiUser } from "react-icons/ci";
import "../../css/auth/Signup.css";

const SignUp = () => {
  const dispatch = useDispatch();
  const { isLoading, error } = useSelector((state) => state.auth);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  //avatar states

  const [previewImage, setPreviewImage] = useState("");
  const [base64Image, setBase64Image] = useState("");

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setPreviewImage(reader.result);
      setBase64Image(reader.result);
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearError());

    if (!fullName || !email || !password) {
      dispatch(setError("All fields are required"));
      return;
    }

    dispatch(setLoading(true));

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/auth/signup`,
        {
          name: fullName,
          email,
          password,
          avatar: base64Image ? base64Image : undefined,
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
      console.log("SignUp Successful");
    } catch (error) {
      const serverMessage =
        error?.data?.message || error?.response?.data?.error;
      dispatch(setError(serverMessage || "SignUp Failed. Please Try Again"));
    }
  };

  return (
    <div className="signup-wrapper">
      <h3 className="signup-title">Create an Account</h3>
      <p className="signup-subtitle">Join us today by enter the details</p>
      <form onSubmit={handleSubmit} className="signup-form">
        <div>
          <div className="profile-image-container">
            {previewImage ? (
              <img src={previewImage} className="profile-image" alt="avatar" />
            ) : (
              <div className="profile-placeholder">
                <CiUser size={40} />
              </div>
            )}
            <label htmlFor="" className="image-upload-icon">
              📸
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={handleImageChange}
              />
            </label>
          </div>
          <Input
            type={"text"}
            label={"name"}
            placeholder={"Enter your name"}
            value={fullName}
            onChange={(e) => {
              setFullName(e.target.value);
            }}
          />

          <Input
            type={"email"}
            label={"email"}
            placeholder={"Enter your email"}
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />

          <Input
            type={"password"}
            label={"password"}
            placeholder={"Enter your password"}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
        </div>

        <span
          className="forgot-link"
          onClick={() => {
            dispatch(clearError());
            dispatch(switchAuthMode("login"));
          }}
        >
          Already have an account?
        </span>

        {error && <div className="signup-error">{error}</div>}

        <div className="signup-actions">
          <button
            className="signup-btn-submit"
            disabled={isLoading}
            type="submit"
          >
            <span>{isLoading ? "signing in" : "sign up"}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default SignUp;
