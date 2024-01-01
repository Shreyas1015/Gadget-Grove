import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./Pages/LoginPage";
import SignUpPage from "./Pages/SignUpPage";
import ForgetPass from "./Pages/ForgetPass";
import ResetPass from "./Pages/ResetPass";


const App = () => {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />

          {
            // eslint-disable-next-line eqeqeq
            localStorage.getItem("user_type") == 1 ? (
              ""
            ) : // eslint-disable-next-line eqeqeq
            localStorage.getItem("user_type") == 2 ? (
              <>
               
              </>
            ) : // eslint-disable-next-line eqeqeq
            localStorage.getItem("user_type") == 3 ? (
              ""
            ) : // eslint-disable-next-line eqeqeq
            localStorage.getItem("user_type") == 4 ? (
              ""
            ) : (
              <>Please Login</>
            )
          }
          <Route path="/forgetPass" element={<ForgetPass />} />
          <Route path="/resetPass" element={<ResetPass />} />
        </Routes>
      </Router>
    </>
  );
};

export default App;
