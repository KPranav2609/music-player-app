import React, { use } from "react";
import "../../css/auth/Auth.css";
import { clearError, logout } from "../../redux/slices/authSlice";
import { openAuthModal , closeAuthModal} from "../../redux/slices/uiSlice";
import { useDispatch , useSelector } from "react-redux";
import SignUp from "./Signup.jsx";
import Login from "./login.jsx";
import Modal from "../common/Modal";

const Auth = () => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);

  const { authModalOpen, authMode } = useSelector((state) => state.ui);
  return (
    <>
      <div className="auth-container">
        {!isAuthenticated ? (
          <>
            <button
              className="auth-btn signup"
              onClick={() => {
                dispatch(clearError());
                dispatch(openAuthModal("signup"));
              }}
            >
              Signup
            </button>
            <button
              className="auth-btn login"
              onClick={() => {
                dispatch(clearError());
                dispatch(openAuthModal("login"));
              }}
            >
              Login
            </button>
          </>
        ) : (
          <button
            className="auth-btn logout"
            onClick={() => {
              dispatch(logout());
            }}
          >
            Logout
          </button>
        )}
      </div>

      {authModalOpen && (
        <Modal 
          onClose={() => {
            dispatch(closeAuthModal());
            dispatch(clearError());
          }}
        >
          {authMode === "signup" && <SignUp /> }
          {(authMode === "login" || authMode === "forgot") && <Login />}
        </Modal>
      )}
    </>
  );
};

export default Auth;