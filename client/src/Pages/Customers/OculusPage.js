import React from "react";
import CustomersSidebar from "../../Components/Customers/CustomersSidebar";
import OculusContent from "../../Components/Customers/OculusContent";

const OculusPage = () => {
  return (
    <div>
      <CustomersSidebar component={<OculusContent />} />
    </div>
  );
};

export default OculusPage;
