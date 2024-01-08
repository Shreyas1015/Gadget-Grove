import React from "react";
import axiosInstance from "../../API/axiosInstance";
import secureLocalStorage from "react-secure-storage";
import { useNavigate } from "react-router-dom";

const CustomerHeader = (props) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await axiosInstance.post(
        `${process.env.REACT_APP_BASE_URL}/auth/logout`
      );

      if (response.status === 200) {
        secureLocalStorage.clear();
        localStorage.clear();
        navigate("/");
        alert("Logged Out Successfully");
      } else {
        console.error("Logout failed:", response.error);
      }
    } catch (error) {
      console.error("Error during logout:", error.message);
    }
  };

  return (
    <>
      <div className="row">
        <div className="col-lg-9">
          <h2>{props.pageName}</h2>
        </div>
        <div className="col-lg-3">
          <div className="row">
            <div className="col-lg-3 p-0">
              {/* <div className="my-2 text-center">
                <i
                  className="py-2 px-2 fa-sharp fa-solid fa-recycle fa-xl"
                  style={{ color: "#2b2b2b" }}
                ></i>
              </div> */}
              <button
                type="button"
                class="btn btn-secondary"
                data-bs-toggle="tooltip"
                data-bs-placement="bottom"
                data-bs-title="Tooltip on bottom"
              >
                Tooltip on bottom
              </button>
            </div>
            <div className="col-lg-3 p-0">
              <div className="my-2 text-center">
                <i
                  className="py-2 px-2 fa-sharp fa-solid fa-recycle fa-xl"
                  style={{ color: "#2b2b2b" }}
                ></i>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="btn btn-outline-dark mt-1" onClick={handleLogout}>
                <i className="fa-solid fa-arrow-right-from-bracket" />
                <span> Logout</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <hr />
    </>
  );
};

export default CustomerHeader;
