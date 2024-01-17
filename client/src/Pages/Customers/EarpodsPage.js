import React from "react";
import CustomersSidebar from "../../Components/Customers/CustomersSidebar";
import EarpodsContent from "../../Components/Customers/EarpodsContent";

const EarpodsPage = () => {
  return (
    <div>
      <CustomersSidebar component={<EarpodsContent />} />
    </div>
  );
};

export default EarpodsPage;
