import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
// import Login from "./components/auth/Login";
import Homepage from "./pages/Homepage";
// import Login from "./pages/Login";
// import Register from "./pages/Register";
import axios from "axios";
import { logout, setUser } from "./redux/slices/authSlice";
import { setError } from "./redux/slices/authSlice";
import { useDispatch, useSelector } from "react-redux";
import "./App.css";
// import SignUp from "./components/auth/SignUp";
import { clearError, setLoading } from "./redux/slices/authSlice";
// import Auth from "./components/auth/Auth";
import ResetPassword from "./components/auth/ResetPassword";
function App() {
  const dispatch = useDispatch();
  const { token, user } = useSelector((state) => state.auth);

  useEffect(() => {
    const storedToken = token || localStorage.getItem("token");
    if (!storedToken || user) return;

    const fetchUser = async () => {
      try {
        dispatch(setLoading(true));
        dispatch(clearError());
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/auth/me`,
          {
            headers: {
              Authorization: `Bearer ${storedToken}`,
            },
          },
        );

        dispatch(setUser({ user: res.data, token: storedToken }));
      } catch (err) {
        console.log(err);
        dispatch(logout());
        dispatch(
          setError(
            err?.res?.data?.message || "Session Expired . Please Login Again",
          ),
        );
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchUser();
  }, [dispatch, token, user]);

  return (
    <BrowserRouter>
      <Routes>
        {/* Home */}
        <Route path="/" element={<Homepage />} />
        <Route path='/reset-password/:token' element={<ResetPassword/>} />
        {/* <Route path="/" element={<SignUp />} /> */}
        {/* <Route path="/login" element={<Login />} /> */}
        {/* <Route path="/register" element={<Register />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;