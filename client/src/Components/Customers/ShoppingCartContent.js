import React, { useEffect, useState } from "react";
import CustomerHeader from "./CustomerHeader";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../../API/axiosInstance";
import secureLocalStorage from "react-secure-storage";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  "pk_test_51NR99USFBsMizJtqkTEVzg5NH5krlCPORUl2YLORi7ZfwmINPiYXFE33nHAoDMymOE5XByoIchUj7GnsrG7J1ZNB00Bv8WPufs"
);

const ShoppingCartContent = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [paymentError, setPaymentError] = useState(null);
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
        const discountedPrice =
          item.price - (item.price * dealOfTheDay.percentage) / 100;
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

  const calculateTotalPrice = () => {
    let totalPrice = 0;

    cartItems.forEach((item) => {
      totalPrice +=
        calculateDiscountedPrice(item) * item.quantity + item.shipping.cost;
    });

    return totalPrice;
  };

  const handleCheckout = async () => {
    const stripe = await stripePromise;

    const totalShippingCost = cartItems.reduce(
      (total, item) => total + item.shipping.cost,
      0
    );

    const lineItems = cartItems.map((item) => ({
      price_data: {
        currency: "inr",
        product_data: {
          name: item.title,
        },
        unit_amount: parseInt(calculateDiscountedPrice(item) * 100),
      },
      quantity: item.quantity,
    }));

    lineItems.push({
      price_data: {
        currency: "inr",
        product_data: {
          name: "Shipping Cost",
        },
        unit_amount: parseInt(totalShippingCost * 100),
      },
      quantity: 1,
    });

    try {
      const response = await axiosInstance.post(
        `${process.env.REACT_APP_BASE_URL}/customers/create-checkout-session`,
        {
          lineItems,
          decryptedUID,
        }
      );

      const session = response.data;

      const result = await stripe.redirectToCheckout({
        sessionId: session.id,
      });

      if (result.error) {
        setPaymentError(result.error.message);
      }
    } catch (error) {
      console.log(error);
      setPaymentError("An error occurred. Please try again later.");
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
                            Total Amount:
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
            <div>
              <h3>Total Price: &#8377; {calculateTotalPrice()}</h3>
              <button className="btn btn-success mt-3" onClick={handleCheckout}>
                Proceed to Checkout
              </button>
              {paymentError && (
                <p className="text-danger mt-3 mx-2">{paymentError}</p>
              )}
              <Link to="/headphones" className="btn btn-dark mt-3 mx-2">
                Continue Shopping
              </Link>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default ShoppingCartContent;
