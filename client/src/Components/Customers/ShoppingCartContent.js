import React, { useEffect, useState } from "react";
import CustomerHeader from "./CustomerHeader";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../API/axiosInstance";
import secureLocalStorage from "react-secure-storage";

const ShoppingCartContent = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const uid = localStorage.getItem("@secure.n.uid");
  const decryptedUID = secureLocalStorage.getItem("uid");

  useEffect(() => {
    const fetchAllProductsInCart = async () => {
      try {
        const res = await axiosInstance.post(
          `${process.env.REACT_APP_BASE_URL}/customers/fetchAllProductsInCart`,
          { decryptedUID }
        );

        if (res.status === 200) {
          console.log("Data", res.data);
          setCartItems(res.data);
        } else {
          alert("Error Fetching Cart Items!");
        }
      } catch (error) {
        console.log(`Error: ${error}`);
        alert(`Error Fetching Cart Items!`);
      }
    };

    fetchAllProductsInCart();
  }, [decryptedUID]);

  const calculateDiscountedPrice = (item) => {
    const dealOfTheDay = item.discounts;
    if (dealOfTheDay && dealOfTheDay.validUntil) {
      const validUntilDate = new Date(dealOfTheDay.validUntil);
      const currentDate = new Date();

      if (currentDate <= validUntilDate) {
        const discountedPrice = (
          item.price -
          (item.price * dealOfTheDay.percentage) / 100
        ).toFixed(2);
        return discountedPrice;
      }
    }

    return item.price;
  };

  const calculateEstimatedDeliveryDate = (item) => {
    const currentDate = new Date();
    const estimatedDelivery = item.shipping.estimatedDelivery;

    if (estimatedDelivery) {
      const [minDays, maxDays] = estimatedDelivery
        .split("-")
        .map((day) => parseInt(day, 10));

      const averageDays = (minDays + maxDays) / 2;

      const estimatedDeliveryDate = new Date(
        currentDate.getTime() + averageDays * 24 * 60 * 60 * 1000
      );

      // Format the date as "day/month/year"
      const day = estimatedDeliveryDate.getDate();
      const month = estimatedDeliveryDate.getMonth() + 1;
      const year = estimatedDeliveryDate.getFullYear();

      const formattedDate = `${day}/${month}/${year}`;

      return formattedDate;
    }

    return "N/A";
  };

  const cancelProduct = async (cart_ap_id) => {
    try {
      const res = await axiosInstance.delete(
        `${process.env.REACT_APP_BASE_URL}/customers/cancelProduct`,
        {
          params: {
            decryptedUID,
            cart_ap_id,
          },
        }
      );

      if (res.status === 204) {
        alert("Deleted");
        window.location.reload();
      }
    } catch (error) {
      console.log("Error in Cancel Product", error);
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
        <CustomerHeader pageName="Shopping Cart" />
        {cartItems.length === 0 ? (
          <div className="container text-center fw-bold">
            <h2>Your shopping cart is empty.</h2>
            {/* You can provide a link or button to redirect the user to the shopping page */}
            <button
              onClick={() => navigate(`/headphones?uid=${uid}`)}
              className="btn blue-buttons"
            >
              Explore Products
            </button>
          </div>
        ) : (
          <>
            {cartItems.map((cartItem) => (
              <div className="row" key={cartItem.cart_ap_id}>
                <div className="col-lg-12">
                  <div className="card mb-3 overflow-hidden rounded-4 my-4">
                    <div className="row">
                      <div className="col-lg-4">
                        <div
                          id={`carousel-${cartItem.cart_ap_id}`}
                          className="carousel slide"
                          data-bs-ride="carousel"
                        >
                          <div className="carousel-inner">
                            {cartItem.cover_img &&
                              Object.entries(cartItem.cover_img).map(
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
                                      className="img-fluid"
                                      style={{ height: "100%" }}
                                    />
                                  </div>
                                )
                              )}
                          </div>
                          <button
                            className="carousel-control-prev"
                            type="button"
                            data-bs-target={`#carousel-${cartItem.cart_ap_id}`}
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
                            data-bs-target={`#carousel-${cartItem.cart_ap_id}`}
                            data-bs-slide="next"
                          >
                            <span
                              className="carousel-control-next-icon"
                              aria-hidden="true"
                            ></span>
                            <span className="visually-hidden">Next</span>
                          </button>
                        </div>
                      </div>
                      <div className="col-lg-8">
                        <div className="card-body">
                          <button
                            className="btn-close float-end"
                            aria-label="Close"
                            onClick={() => cancelProduct(cartItem.cart_ap_id)}
                          ></button>
                          <h4 className="card-title">{cartItem.title}</h4>
                          <p className="card-text text-secondary">
                            Sold By: {cartItem.brand}
                          </p>
                          <p className="card-text mb-1">
                            Quantity: {cartItem.quantity}
                          </p>
                          <span className="card-text fs-6 me-2">
                            M.R.P: ${calculateDiscountedPrice(cartItem)}
                          </span>
                          <span className="card-text fs-6 mx-2 text-decoration-line-through">
                            ${cartItem.price}
                          </span>
                          <span className="card-text ms-2 badge text-bg-dark px-2 py-2">
                            Discount: {cartItem.discounts.percentage}%
                          </span>
                          <p className="card-text fs-6 mb-1">
                            Shipping: ${cartItem.shipping.cost}
                          </p>
                          <p className="card-text fs-6">
                            Delivery by{" "}
                            {calculateEstimatedDeliveryDate(cartItem)}
                          </p>
                          <h5>
                            Total Amount:{" "}
                            {calculateDiscountedPrice(cartItem) *
                              cartItem.quantity +
                              cartItem.shipping.cost}
                          </h5>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </>
  );
};

export default ShoppingCartContent;
