import React from "react";
import { Link } from "react-router-dom";

const ProductCard = (props) => {
  return (
    <>
      <div className="card mx-auto my-3 rounded-4 " style={{ height: "50%" }}>
        <img
          src={props.img}
          className="img-fluid object-fit-contain"
          alt=""
          style={{ height: "100%" }}
        />
        <div className="card-body">
          <h5 className="card-title">{props.title}</h5>
          <p>MRP : &#8377; {props.price}.00</p>
          {/* <p className="card-text">{props.desc}</p> */}
          <Link to={`/`}>
            <button className="btn btn-dark">View Details</button>
          </Link>
        </div>
      </div>
    </>
  );
};

export default ProductCard;

ProductCard.defaultProps = {
  title: "Nike",
  desc: "lorem fdknd ddvd",
  price: "9999",
};
