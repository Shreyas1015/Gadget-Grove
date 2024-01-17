import React from "react";
import { Link } from "react-router-dom";

const ProductCard2 = ({
  product,
  uid,
  handleToggleWishlist,
  wishlistedProducts,
}) => {
  const calculateDiscountedPrice = () => {
    const dealOfTheDay = product.discounts;
    if (dealOfTheDay && dealOfTheDay.validUntil) {
      const validUntilDate = new Date(dealOfTheDay.validUntil);
      const currentDate = new Date();

      if (currentDate <= validUntilDate) {
        const discountedPrice = (
          product.price -
          (product.price * dealOfTheDay.percentage) / 100
        ).toFixed(2);
        return discountedPrice;
      }
    }

    return product.price;
  };

  return (
    <div className="col-lg-3" key={product.ap_id}>
      <div
        className="card mx-auto my-3 rounded-4 overflow-hidden"
        style={{ width: "auto" }}
      >
        <div
          id={`carousel-${product.ap_id}`}
          className="carousel slide"
          data-bs-ride="carousel"
        >
          <div className="carousel-inner">
            {Object.entries(product.cover_img).map(([id, img], index) => (
              <div
                key={id}
                className={`carousel-item${index === 0 ? " active" : ""}`}
              >
                <img
                  src={img}
                  alt={`${id}`}
                  className="img-fluid object-fit-contain"
                  style={{ height: "100%" }}
                />
              </div>
            ))}
          </div>
          <button
            className="carousel-control-prev"
            type="button"
            data-bs-target={`#carousel-${product.ap_id}`}
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
            data-bs-target={`#carousel-${product.ap_id}`}
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
          <h5 className="card-title">{product.title}</h5>
          <p className="card-text mb-2 text-secondary">{product.brand}</p>
          <p
            className="card-text mb-2"
            style={{
              overflow: "hidden",
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
            }}
          >
            {product.description}
          </p>
          {product.price == calculateDiscountedPrice() ? (
            <>
              <p className="card-text mb-2">Price: ${product.price}</p>
            </>
          ) : (
            <>
              <div className="row">
                <div className="col-lg-6">
                  <p className="card-text mb-2 text-decoration-line-through">
                    M.R.P : &#8377;{product.price}
                  </p>
                </div>
                <div className="col-lg-6">
                  <p className="fw-semibold" style={{ color: "purple" }}>
                    Sale : &#8377;{calculateDiscountedPrice()}
                  </p>
                </div>
              </div>
            </>
          )}

          <div className="row">
            <div className="col-lg-6">
              <Link
                to={`/productdetails?uid=${uid}&ap_id=${product.ap_id}`}
                className="post-link text-decoration-none"
              >
                <button className="btn btn-outline-dark">Buy Now</button>
              </Link>
            </div>
            <div className="col-lg-6 text-end">
              <button
                className="btn"
                onClick={() => handleToggleWishlist(product.ap_id)}
              >
                {wishlistedProducts.some(
                  (item) =>
                    item.ap_id === product.ap_id && item.iswishlisted === 1
                ) ? (
                  <i
                    className="fa-solid fa-heart fa-2xl"
                    style={{ color: "#ee2b2b" }}
                  />
                ) : (
                  <i className="fa-regular fa-heart fa-2xl" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard2;
