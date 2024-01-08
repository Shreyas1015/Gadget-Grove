import { useNavigate } from "react-router-dom";
import CustomersSidebar from "../../Components/Customers/CustomersSidebar";
import PrdouctDetailsContent from "../../Components/Customers/PrdouctDetailsContent";

const ProductDetailsPage = () => {
  const navigate = useNavigate();
  const uid = localStorage.getItem("@secure.n.uid");

  const BackToLogin = () => {
    navigate("/");
  };

  if (!uid) {
    return (
      <>
        <div className="container text-center fw-bold">
          <h2>INVALID URL. Please provide a valid UID.</h2>
          <button onClick={BackToLogin} className="btn blue-buttons">
            Back to Login
          </button>
        </div>
      </>
    );
  }
  return (
    <>
      <CustomersSidebar component={<PrdouctDetailsContent />} />
    </>
  );
};

export default ProductDetailsPage;
