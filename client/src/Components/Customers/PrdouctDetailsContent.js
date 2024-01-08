import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import secureLocalStorage from "react-secure-storage";
import axiosInstance from "../../API/axiosInstance";

const PrdouctDetailsContent = () => {
  const [headphonesData, setHeadphonesData] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  const uid = localStorage.getItem("@secure.n.uid");
  const decryptedUID = secureLocalStorage.getItem("uid");
  const apID = new URLSearchParams(location.search).get("ap_id");

  useEffect(() => {
    const fetchHeadphonesData = async () => {
      try {
        const res = await axiosInstance.post(
          `${process.env.REACT_APP_BASE_URL}/customers/fetchParticularHeadphoneData/${apID}`,
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

    fetchHeadphonesData();
  }, [decryptedUID, apID]);

  const renderStars = () => {
    const filledStars = parseFloat(headphonesData.ratings);
    const stars = [];
    const totalStars = 5;

    for (let i = 0; i < Math.floor(filledStars); i++) {
      stars.push(
        <i key={i} className="fa fa-star" style={{ color: "yellow" }}></i>
      );
    }

    if (filledStars % 1 !== 0) {
      stars.push(
        <i
          key={totalStars}
          className="fa fa-star-half"
          style={{ color: "yellow" }}
        ></i>
      );
    }

    for (let i = stars.length; i < totalStars; i++) {
      stars.push(<i key={i} className="fa fa-star"></i>);
    }

    return stars;
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

  const calculateDiscountedPrice = () => {
    const dealOfTheDay = headphonesData.discounts;
    if (dealOfTheDay && dealOfTheDay.validUntil) {
      const validUntilDate = new Date(dealOfTheDay.validUntil);
      const currentDate = new Date();

      if (currentDate <= validUntilDate) {
        const discountedPrice = (
          headphonesData.price -
          (headphonesData.price * dealOfTheDay.percentage) / 100
        ).toFixed(2);
        return discountedPrice;
      }
    }

    return headphonesData.price;
  };

  return (
    <>
      <div className="container-fluid">
        {headphonesData.availability > 0 ? (
          <div className="container my-3 p-4 rounded-5 glassomorphic-effect">
            <div className="row">
              <div className="col-lg-6 p-3">
                <div
                  id={`carousel-${headphonesData.ap_id}`}
                  className="carousel slide"
                  data-bs-ride="carousel"
                >
                  <div className="carousel-inner">
                    {headphonesData.cover_img &&
                      Object.entries(headphonesData.cover_img).map(
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
                    data-bs-target={`#carousel-${headphonesData.ap_id}`}
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
                    data-bs-target={`#carousel-${headphonesData.ap_id}`}
                    data-bs-slide="next"
                  >
                    <span
                      className="carousel-control-next-icon"
                      aria-hidden="true"
                    ></span>
                    <span className="visually-hidden">Next</span>
                  </button>
                </div>
                <div className="row mt-3">{/* Color Options */}</div>
              </div>
              <div className="col-lg-6 productDetails">
                <h3 className="mb-3 fw-bolder">{headphonesData.title}</h3>
                <div className="my-3">{renderStars()}</div>
                <p className="my-3 fw-semibold text-decoration-line-through">
                  M.R.P : &#8377; {headphonesData.price}
                </p>
                <p className="my-3 fw-semibold" style={{ color: "purple" }}>
                  Deal Of The Day : &#8377; {calculateDiscountedPrice()}
                </p>
                <p className="my-3 text-secondary">
                  {headphonesData.description}
                </p>
                <div className="my-3 d-flex justfiy-content-around">
                  <div className="mx-2 text-center">
                    <i
                      className="py-4 px-2 fa-solid fa-truck fa-xl"
                      style={{ color: "#2b2b2b" }}
                    ></i>
                    <span>
                      {headphonesData.shipping.cost <= 0 ? (
                        "Free Delivery"
                      ) : (
                        <>
                          <span>Shipping </span>
                          <br />
                          &#8377; {headphonesData.shipping.cost}
                        </>
                      )}
                    </span>
                  </div>
                  <div className="mx-2 text-center">
                    <i
                      className="py-4 px-2 fa-sharp fa-solid fa-recycle fa-xl"
                      style={{ color: "#2b2b2b" }}
                    ></i>
                    <br />
                    <span>15 Days replacement</span>
                  </div>
                  <div className="mx-2 text-center">
                    <i
                      className="py-4 px-2 fa-sharp fa-solid fa-shield fa-xl"
                      style={{ color: "#2b2b2b" }}
                    ></i>
                    <br />
                    <span>2 Years Warranty</span>
                  </div>
                  <div className="mx-2 text-center">
                    <i
                      className="fa-solid fa-money-bill fa-xl py-4 px-2"
                      style={{ color: "#2b2b2b" }}
                    ></i>
                    <br />
                    <span>Cash on delivery</span>
                  </div>
                </div>
                <hr />
                <p>
                  Available :
                  {headphonesData.availability > 0
                    ? " In Stock"
                    : " Unavailable"}
                </p>
                <p>
                  Estimated Delivery Date :{" "}
                  {headphonesData.shipping.estimatedDelivery}
                </p>
                <p>Brand : {headphonesData.brand}</p>
                <hr style={{ border: "2px solid black" }} />
                <div className="my-3">
                  <button className=" btn btn-dark">-</button>
                  <span className="p-3"></span>
                  <button className=" btn btn-dark">+</button>
                </div>
                <div>
                  <Link to={`/headphones?uid=${uid}`} className="btn btn-dark ">
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div
            className="container glassomorphic-effect my-5 p-4 rounded-5"
            style={{ pointerEvents: "none", opacity: 0.5 }}
          >
            <div className="row">
              <div className="col-lg-6 p-3">
                <div
                  id={`carousel-${headphonesData.ap_id}`}
                  className="carousel slide"
                  data-bs-ride="carousel"
                >
                  <div className="carousel-inner">
                    {headphonesData.cover_img &&
                      Object.entries(headphonesData.cover_img).map(
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
                    data-bs-target={`#carousel-${headphonesData.ap_id}`}
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
                    data-bs-target={`#carousel-${headphonesData.ap_id}`}
                    data-bs-slide="next"
                  >
                    <span
                      className="carousel-control-next-icon"
                      aria-hidden="true"
                    ></span>
                    <span className="visually-hidden">Next</span>
                  </button>
                </div>
                <div className="row mt-3">{/* Color Options */}</div>
              </div>
              <div className="col-lg-6 productDetails">
                <h3 className="mb-3 fw-bolder">{headphonesData.title}</h3>
                <div className="my-3">{renderStars()}</div>
                <p className="my-3 fw-semibold text-decoration-line-through">
                  M.R.P : &#8377; {headphonesData.price}
                </p>
                <p className="my-3 fw-semibold" style={{ color: "purple" }}>
                  Deal Of The Day : &#8377; {calculateDiscountedPrice()}
                </p>
                <p className="my-3 text-secondary">
                  {headphonesData.description}
                </p>
                <div className="my-3 d-flex justfiy-content-around">
                  <div className="mx-2 text-center">
                    <i
                      className="py-4 px-2 fa-solid fa-truck fa-xl"
                      style={{ color: "#2b2b2b" }}
                    ></i>
                    <br />
                    <span>Free Delivery</span>
                  </div>
                  <div className="mx-2 text-center">
                    <i
                      className="py-4 px-2 fa-sharp fa-solid fa-recycle fa-xl"
                      style={{ color: "#2b2b2b" }}
                    ></i>
                    <br />
                    <span>15 Days replacement</span>
                  </div>
                  <div className="mx-2 text-center">
                    <i
                      className="py-4 px-2 fa-sharp fa-solid fa-shield fa-xl"
                      style={{ color: "#2b2b2b" }}
                    ></i>
                    <br />
                    <span>2 Years Warranty</span>
                  </div>
                  <div className="mx-2 text-center">
                    <i
                      className="fa-solid fa-money-bill fa-xl py-4 px-2"
                      style={{ color: "#2b2b2b" }}
                    ></i>
                    <br />
                    <span>Cash on delivery</span>
                  </div>
                </div>
                <hr />
                <p>
                  Available :{" "}
                  {headphonesData.availability > 0 ? "In Stock" : "Unavailable"}
                </p>
                <p>Brand : {headphonesData.brand}</p>
                <hr style={{ border: "2px solid black" }} />
                <div className="my-3">
                  <button className=" btn btn-dark">-</button>
                  <span className="p-3"></span>
                  <button className=" btn btn-dark">+</button>
                </div>
                <div>
                  <Link to={`/headphones?uid=${uid}`} className="btn btn-dark ">
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default PrdouctDetailsContent;
