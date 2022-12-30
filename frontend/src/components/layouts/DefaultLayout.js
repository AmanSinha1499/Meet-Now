import React from "react";
import { useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../css/layout.css";
import NavBar from "../common/navbar";
const DefaultLayout = ({ children }) => {
  const isLoggedIn = useSelector((state) => state.userReducer.isLoggedIn);
  return (
    <div>
      <main
        style={{
          height: "100vh",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {isLoggedIn && <NavBar />}
        <div className="w-100 fg-100 overflow-auto position-relative">
          {children}
        </div>
        <ToastContainer
          newestOnTop={false}
          closeOnClick
          draggable
          limit={3}
          position="bottom-left"
          autoClose={2000}
          hideProgressBar
          progress={undefined}
        />
      </main>
    </div>
  );
};

export default DefaultLayout;
