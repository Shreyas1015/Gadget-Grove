import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../../API/axiosInstance";
import secureLocalStorage from "react-secure-storage";
import CustomerHeader from "./CustomerHeader";

const HeadphonesContent = () => {
  const [headphonesData, setHeadphonesData] = useState([]);
  const [wishlistedProducts, setWishlistedProducts] = useState([]);
  const navigate = useNavigate();
  const uid = localStorage.getItem("@secure.n.uid");
  const decryptedUID = secureLocalStorage.getItem("uid");

  useEffect(() => {
    const fetchHeadphonesData = async () => {
      try {
        const res = await axiosInstance.post(
          `${process.env.REACT_APP_BASE_URL}/customers/fetchHeadphonesData`,
          { decryptedUID }
        );
        if (res.status === 200) {
          setHeadphonesData(res.data);
          console.log(res.data);
        } else {
          alert("Error Fetching Headphones Data !");
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
    fetchHeadphonesData();
  }, [decryptedUID]);

  const handleToggleWishlist = async (ap_id) => {
    try {
      const isProductWishlisted = wishlistedProducts.some(
        (product) => product.ap_id === ap_id
      );

      const res = await axiosInstance.post(
        `${process.env.REACT_APP_BASE_URL}/customers/toggleWishlist`,
        {
          decryptedUID,
          ap_id,
          isWishlisted: isProductWishlisted ? 0 : 1,
        }
      );

      if (res.status === 200) {
        window.location.reload();
        const updatedWishlistedProducts = await axiosInstance.post(
          `${process.env.REACT_APP_BASE_URL}/customers/fetchWishlistedProducts`,
          {
            decryptedUID,
          }
        );

        setWishlistedProducts(updatedWishlistedProducts.data);
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
        <CustomerHeader pageName="Headphones" />
        <div className="row">
          {headphonesData.map((headphone) => (
            <div className="col-lg-4" key={headphone.ap_id}>
              <div
                className="card mx-auto my-3 rounded-4 overflow-hidden"
                style={{ width: "20rem" }}
              >
                <div
                  id={`carousel-${headphone.ap_id}`}
                  className="carousel slide"
                  data-bs-ride="carousel"
                >
                  <div className="carousel-inner">
                    {Object.entries(headphone.cover_img).map(
                      ([id, img], index) => (
                        <div
                          key={id}
                          className={`carousel-item${
                            index === 0 ? " active" : ""
                          }`}
                        >
                          <img
                            src={img}
                            alt={`${id}`}
                            className="img-fluid object-fit-contain"
                            style={{ height: "100%" }}
                          />
                        </div>
                      )
                    )}
                  </div>
                  <button
                    className="carousel-control-prev"
                    type="button"
                    data-bs-target={`#carousel-${headphone.ap_id}`}
                    data-bs-slide="prev"
                  >
                    <span
                      className="carousel-control-prev-icon"
                      aria-hidden="true"
                    ></span>
                    <span className="visually-hidden">Previous</span>
                  </button>
                  <button
                    className="carousel-control-next"
                    type="button"
                    data-bs-target={`#carousel-${headphone.ap_id}`}
                    data-bs-slide="next"
                  >
                    <span
                      className="carousel-control-next-icon"
                      aria-hidden="true"
                    ></span>
                    <span className="visually-hidden">Next</span>
                  </button>
                </div>
                <div className="card-body">
                  <h5 className="card-title">{headphone.title}</h5>
                  <p className="card-text text-secondary">{headphone.brand}</p>
                  <p
                    className="card-text mb-2"
                    style={{
                      overflow: "hidden",
                      whiteSpace: "nowrap",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {headphone.description}
                  </p>
                  <p className="card-text mb-2">Price: ${headphone.price}</p>

                  <Link
                    to={`/productdetails?uid=${uid}&ap_id=${headphone.ap_id}`}
                    className="post-link text-decoration-none"
                  >
                    <button className="btn blue-buttons me-4">Buy Now</button>
                  </Link>
                  <button
                    className="btn blue-buttons me-4"
                    onClick={() => handleToggleWishlist(headphone.ap_id)}
                  >
                    {wishlistedProducts.some(
                      (product) => product.ap_id === headphone.ap_id
                    ) ? (
                      <i
                        className="fas fa-heart"
                        style={{
                          fontSize: "1.5rem",
                          color: "red",
                          cursor: "pointer",
                        }}
                      />
                    ) : (
                      <i
                        className="far fa-heart"
                        style={{
                          fontSize: "1.5rem",
                          color: "gray",
                          cursor: "pointer",
                        }}
                      />
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default HeadphonesContent;
