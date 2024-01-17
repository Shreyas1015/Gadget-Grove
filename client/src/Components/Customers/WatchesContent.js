import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../../API/axiosInstance";
import secureLocalStorage from "react-secure-storage";
import CustomerHeader from "./CustomerHeader";
import ProductCard2 from "./ProductCard2";

const WatchesContent = () => {
  const [watchesData, setWatchesData] = useState([]);
  const [wishlistedProducts, setWishlistedProducts] = useState([]);
  const navigate = useNavigate();
  const uid = localStorage.getItem("@secure.n.uid");
  const decryptedUID = secureLocalStorage.getItem("uid");

  useEffect(() => {
    const fetchWatchesData = async () => {
      try {
        const res = await axiosInstance.post(
          `${process.env.REACT_APP_BASE_URL}/customers/fetchWatchesData`,
          { decryptedUID }
        );
        if (res.status === 200) {
          setWatchesData(res.data);
          console.log(res.data);
        } else {
          alert("Error Fetching Earpods Data !");
        }
      } catch (error) {
        console.log(error);
      }
    };

    const fetchWishlistedProducts = async () => {
      try {
        const res = await axiosInstance.post(
          `${process.env.REACT_APP_BASE_URL}/customers/fetchWishlistedProducts`,
          {
            decryptedUID,
          }
        );

        if (res.status === 200) {
          setWishlistedProducts(res.data);
          console.log("Wishlisted Products", res.data);
        } else {
          alert("Error Fetching Wishlisted Products!");
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchWishlistedProducts();
    fetchWatchesData();
  }, [decryptedUID]);

  const handleToggleWishlist = async (ap_id) => {
    try {
      const res = await axiosInstance.post(
        `${process.env.REACT_APP_BASE_URL}/customers/toggleWishlist`,
        {
          decryptedUID,
          ap_id,
        }
      );

      if (res.status === 200) {
        window.location.reload();
      } else {
        alert("Error Toggling Wishlist!");
      }
    } catch (error) {
      console.log(error);
    }
  };

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
      <div className="container-fluid">
        <CustomerHeader pageName="Watches" />
        <div className="row">
          {watchesData.map((watches) => (
            <ProductCard2
              key={watches.ap_id}
              product={watches}
              uid={uid}
              handleToggleWishlist={handleToggleWishlist}
              wishlistedProducts={wishlistedProducts}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default WatchesContent;
