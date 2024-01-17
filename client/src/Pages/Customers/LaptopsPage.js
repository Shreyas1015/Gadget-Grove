import React from "react";
import CustomersSidebar from "../../Components/Customers/CustomersSidebar";
import LaptopsContent from "../../Components/Customers/LaptopsContent";

const LaptopsPage = () => {
  return (
    <div>
      <CustomersSidebar component={<LaptopsContent />} />
    </div>
  );
};

export default LaptopsPage;
