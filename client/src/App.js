import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./Pages/LoginPage";
import SignUpPage from "./Pages/SignUpPage";
import ForgetPass from "./Pages/ForgetPass";
import ResetPass from "./Pages/ResetPass";
import LandingPage from "./Pages/LandingPage";
import HeadphonesPage from "./Pages/Customers/HeadphonesPage";
import secureLocalStorage from "react-secure-storage";
import ProductDetailsPage from "./Pages/Customers/ProductDetailsPage";
import ShoppingCartPage from "./Pages/Customers/ShoppingCartPage";
import WishlistPage from "./Pages/Customers/WishlistPage";
import EarpodsPage from "./Pages/Customers/EarpodsPage";
import WatchesPage from "./Pages/Customers/WatchesPage";
import LaptopsPage from "./Pages/Customers/LaptopsPage";
import GamingConsolePage from "./Pages/Customers/GamingConsolePage";
import OculusPage from "./Pages/Customers/OculusPage";
import SpeakersPage from "./Pages/Customers/SpeakersPage";
import SuccessPage from "./Pages/Customers/SuccessPage";
import RefreshTokenModal from "./Components/RefreshTokenModal";

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
              {/* Product pages */}
              <Route path="/headphones" element={<HeadphonesPage />} />
              <Route path="/earpods" element={<EarpodsPage />} />
              <Route path="/watches" element={<WatchesPage />} />
              <Route path="/laptops" element={<LaptopsPage />} />
              <Route path="/gamingconsole" element={<GamingConsolePage />} />
              <Route path="/oculus" element={<OculusPage />} />
              <Route path="/speakers" element={<SpeakersPage />} />
              {/* Extra Pages */}
              <Route path="/wishlist" element={<WishlistPage />} />
              <Route path="/productdetails" element={<ProductDetailsPage />} />
              <Route path="/shoppingcart" element={<ShoppingCartPage />} />
              <Route path="/success" element={<SuccessPage />} />
            </>
          ) : (
            <>Please Login</>
          )}
          <Route path="/forgetPass" element={<ForgetPass />} />
          <Route path="/resetPass" element={<ResetPass />} />
          <Route path="/refreshToken" element={<RefreshTokenModal />} />
        </Routes>
      </Router>
    </>
  );
};

export default App;
