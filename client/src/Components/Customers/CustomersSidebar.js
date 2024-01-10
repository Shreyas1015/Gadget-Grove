import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const CustomersSidebar = (props) => {
  const navigate = useNavigate();
  const uid = localStorage.getItem("@secure.n.uid");
  const [isOpen, setIsOpen] = useState(true);

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

  const handleTrigger = () => setIsOpen(!isOpen);

  return (
    <>
      <div className="page">
        <div className="row container-fluid ">
          <div className={`col-lg-${isOpen ? "2" : "0"} transition-col`}></div>
          <div className={`col-lg-${isOpen ? "10" : "12"} transition-col`}>
            <div className="content">{props.component}</div>
          </div>
        </div>

        <div className={`sidebar ${isOpen ? "sidebar--open" : ""}`}>
          <div
            style={{ color: "#0bbfe0" }}
            className="trigger"
            onClick={handleTrigger}
          >
            <i className={`fas ${isOpen ? "fa-times" : "fa-bars"}`}></i>
          </div>

          <Link className="text-decoration-none" to={`/earpods?uid=${uid}`}>
            <div className="sidebar-position">
              <i style={{ color: "#0bbfe0" }} className="fa-solid fa-user "></i>
              <span> Earpods</span>
            </div>
          </Link>
          <Link
            className="text-decoration-none"
            to={`/gamingconsole?uid=${uid}`}
          >
            <div className="sidebar-position">
              <i
                style={{ color: "#0bbfe0" }}
                className="fa-brands fa-windows"
              ></i>
              <span> Gaming Console</span>
            </div>
          </Link>
          <Link className="text-decoration-none" to={`/headphones?uid=${uid}`}>
            <div className="sidebar-position">
              <i
                style={{ color: "#0bbfe0" }}
                className="fa-brands fa-windows"
              ></i>
              <span> Headphones</span>
            </div>
          </Link>
          <Link className="text-decoration-none" to={`/laptops?uid=${uid}`}>
            <div className="sidebar-position">
              <i
                style={{ color: "#0bbfe0" }}
                className="fa-brands fa-windows"
              ></i>
              <span> Laptops</span>
            </div>
          </Link>
          <Link className="text-decoration-none" to={`/oculus?uid=${uid}`}>
            <div className="sidebar-position">
              <i
                style={{ color: "#0bbfe0" }}
                className="fa-brands fa-windows"
              ></i>
              <span> Oculus</span>
            </div>
          </Link>
          <Link className="text-decoration-none" to={`/speakers?uid=${uid}`}>
            <div className="sidebar-position">
              <i
                style={{ color: "#0bbfe0" }}
                className="fa-brands fa-windows"
              ></i>
              <span> Speakers</span>
            </div>
          </Link>
          <Link className="text-decoration-none" to={`/watches?uid=${uid}`}>
            <div className="sidebar-position">
              <i
                style={{ color: "#0bbfe0" }}
                className="fa-brands fa-windows"
              ></i>
              <span> Watches</span>
            </div>
          </Link>
        </div>
      </div>
    </>
  );
};

export default CustomersSidebar;
