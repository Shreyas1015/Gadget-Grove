import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./Pages/LoginPage";
import SignUpPage from "./Pages/SignUpPage";
import ForgetPass from "./Pages/ForgetPass";
import ResetPass from "./Pages/ResetPass";
import LandingPage from "./Pages/LandingPage";
import HeadphonesPage from "./Pages/Customers/HeadphonesPage";
import secureLocalStorage from "react-secure-storage";
import ProductDetailsPage from "./Pages/Customers/ProductDetailsPage";

const App = () => {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />

          {secureLocalStorage.getItem("user_type") === 1 ? (
            ""
          ) : secureLocalStorage.getItem("user_type") === 2 ? (
            <>
              <Route path="/headphones" element={<HeadphonesPage />} />
              <Route path="/productdetails" element={<ProductDetailsPage />} />
            </>
          ) : (
            <>Please Login</>
          )}
          <Route path="/forgetPass" element={<ForgetPass />} />
          <Route path="/resetPass" element={<ResetPass />} />
        </Routes>
      </Router>
    </>
  );
};

export default App;
